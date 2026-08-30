"""Gemini LLM client wrapper for VerifyAgent.

Features:
- Automatic rate limiting (respects RPM limits)
- Exponential backoff retry on 429/503 errors
- Full trajectory logging for reproducibility
- Request counting and timing
"""

import os
import sys
import json
import time
import logging
import warnings
import contextlib
from pathlib import Path
from google import genai
from google.genai import types
from dotenv import load_dotenv

@contextlib.contextmanager
def suppress_output():
    """A context manager that redirects stdout and stderr to devnull"""
    with open(os.devnull, "w") as devnull:
        old_stdout = sys.stdout
        old_stderr = sys.stderr
        sys.stdout = devnull
        sys.stderr = devnull
        try:  
            yield
        finally:
            sys.stdout = old_stdout
            sys.stderr = old_stderr

# Suppress messy warnings from google-genai SDK to keep CLI output clean for the demo
warnings.filterwarnings("ignore", message=".*automatic function calling.*")
logging.getLogger("google.genai").setLevel(logging.ERROR)

load_dotenv()


class GeminiClient:
    """Wrapper around the Gemini API for VerifyAgent operations.
    
    Handles API key rotation, rate limiting, retries, and trajectory logging automatically.
    """

    def __init__(self, model: str = "gemini-3.6-flash"):
        api_keys_str = os.getenv("GEMINI_API_KEY")
        if not api_keys_str:
            raise ValueError(
                "GEMINI_API_KEY not set. Copy .env.example to .env and add your key(s)."
            )
        # Support comma-separated keys for rotation
        self.api_keys = [k.strip() for k in api_keys_str.split(",") if k.strip()]
        self.current_key_idx = 0
        
        self.client = genai.Client(api_key=self.api_keys[self.current_key_idx])
        self.model = model
        self.trajectory: list[dict] = []
        self.request_count = 0
        
        # Rate limiting: 15 RPM = 1 request every 4 seconds minimum
        self._last_request_time = 0.0
        self._min_request_interval = 4.5  # seconds between requests (safe margin)

    def _rotate_api_key(self) -> bool:
        """Switch to the next API key. Returns True if successfully rotated, False if all keys exhausted."""
        if len(self.api_keys) <= 1:
            return False
            
        self.current_key_idx = (self.current_key_idx + 1) % len(self.api_keys)
        print(f"    [key-rotation] Switching to API Key #{self.current_key_idx + 1}/{len(self.api_keys)}...")
        self.client = genai.Client(api_key=self.api_keys[self.current_key_idx])
        return True

    def _wait_for_rate_limit(self):
        """Ensure we don't exceed the API rate limit."""
        elapsed = time.time() - self._last_request_time
        if elapsed < self._min_request_interval:
            wait_time = self._min_request_interval - elapsed
            print(f"    [rate-limit] Waiting {wait_time:.1f}s before next API call...")
            time.sleep(wait_time)

    def generate(
        self,
        prompt: str,
        system_instruction: str | None = None,
        temperature: float = 0.2,
        response_mime_type: str | None = None,
    ) -> str:
        """Send a prompt to Gemini and return the text response.
        
        Includes automatic rate limiting and retry logic.
        """
        start_time = time.time()

        config = types.GenerateContentConfig(
            temperature=temperature,
        )
        if system_instruction:
            config.system_instruction = system_instruction
        if response_mime_type:
            config.response_mime_type = response_mime_type

        max_retries = 8
        base_delay = 5.0
        
        for attempt in range(max_retries):
            self._wait_for_rate_limit()
            
            try:
                self._last_request_time = time.time()
                with suppress_output():
                    response = self.client.models.generate_content(
                        model=self.model,
                        contents=prompt,
                        config=config,
                    )
                self.request_count += 1
                break
            except Exception as e:
                error_str = str(e)
                if attempt == max_retries - 1:
                    print(f"    [ERROR] API call failed after {max_retries} retries: {error_str[:200]}")
                    raise
                    
                if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
                    # If we hit quota and have multiple keys, rotate and retry quickly
                    if "Quota exceeded" in error_str and self._rotate_api_key():
                        # We rotated to a new key, let's retry immediately
                        continue
                        
                    # Extract retry delay if available
                    wait = base_delay * (2 ** attempt)
                    # Check if the error message contains a suggested retry delay
                    if "retryDelay" in error_str:
                        try:
                            import re
                            match = re.search(r'retryDelay.*?(\d+)', error_str)
                            if match:
                                wait = max(wait, int(match.group(1)) + 2)
                        except Exception:
                            pass
                    print(f"    [retry] Rate limited (429). Waiting {wait:.0f}s... (attempt {attempt+1}/{max_retries})")
                    time.sleep(wait)
                elif "503" in error_str or "UNAVAILABLE" in error_str:
                    wait = base_delay * (2 ** attempt)
                    print(f"    [retry] Service unavailable (503). Waiting {wait:.0f}s... (attempt {attempt+1}/{max_retries})")
                    time.sleep(wait)
                else:
                    print(f"    [ERROR] Unexpected API error: {error_str[:200]}")
                    raise

        elapsed = time.time() - start_time
        result_text = response.text or ""

        # Log trajectory
        self.trajectory.append({
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "model": self.model,
            "system_instruction": system_instruction[:200] + "..." if system_instruction and len(system_instruction) > 200 else system_instruction,
            "prompt_preview": prompt[:300] + "..." if len(prompt) > 300 else prompt,
            "prompt_length": len(prompt),
            "response_preview": result_text[:300] + "..." if len(result_text) > 300 else result_text,
            "response_length": len(result_text),
            "latency_seconds": round(elapsed, 2),
            "temperature": temperature,
            "request_number": self.request_count,
        })

        return result_text

    def generate_json(
        self,
        prompt: str,
        system_instruction: str | None = None,
        temperature: float = 0.1,
    ) -> dict | list:
        """Send a prompt and parse the response as JSON."""
        result = self.generate(
            prompt=prompt,
            system_instruction=system_instruction,
            temperature=temperature,
            response_mime_type="application/json",
        )
        return json.loads(result)

    def save_trajectory(self, path: Path) -> None:
        """Save the full conversation trajectory to a JSON file."""
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(self.trajectory, f, indent=2, ensure_ascii=False)

    def reset_trajectory(self) -> None:
        """Clear the trajectory log."""
        self.trajectory = []
