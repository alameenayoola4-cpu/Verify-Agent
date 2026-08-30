import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uuid
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent))

from src.agent.orchestrator import VerifyAgentOrchestrator

app = FastAPI(
    title="VerifyAgent API",
    description="Agent-to-Agent Verification API. Submit code and specs to get verified, bug-free code back.",
    version="1.0.0"
)

# Global orchestrator instance
agent = VerifyAgentOrchestrator(max_fix_attempts=2)

class VerifyRequest(BaseModel):
    code: str
    spec: str
    case_id: str | None = None

class VerifyResponse(BaseModel):
    status: str
    case_id: str
    bugs_found: int
    tests_passed: int
    total_tests: int
    fixed: bool
    original_code: str
    fixed_code: str | None
    total_time_seconds: float

@app.post("/verify", response_model=VerifyResponse)
async def verify_code(req: VerifyRequest):
    try:
        case_id = req.case_id or f"api_case_{uuid.uuid4().hex[:8]}"
        
        # Run the full pipeline
        report = agent.verify(
            case_id=case_id,
            code=req.code,
            spec=req.spec
        )
        
        return VerifyResponse(
            status="success",
            case_id=case_id,
            bugs_found=report.bug_count,
            tests_passed=report.post_fix_passed if report.fix_applied else report.tests_passed,
            total_tests=report.total_tests,
            fixed=report.post_fix_passed == report.total_tests if report.fix_applied else report.tests_passed == report.total_tests,
            original_code=report.original_code,
            fixed_code=report.fixed_code,
            total_time_seconds=report.total_time_seconds
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    print("\n" + "="*60)
    print("  [API] Starting VerifyAgent API Server on port 8000")
    print("  Endpoints:")
    print("    POST /verify   - Send code and spec to verify")
    print("    GET  /docs     - View interactive API documentation")
    print("="*60 + "\n")
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
