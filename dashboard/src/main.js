/**
 * VerifyAgent Dashboard — Main Application
 * 
 * Renders all dashboard sections from embedded results data.
 * No framework — pure vanilla JS with DOM manipulation.
 */

import { agentResults, baselineResults, scores, caseMetadata } from './data.js';

// ============================================================
//  INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  renderHeroStats();
  renderPipeline();
  renderMetrics();
  renderBarChart();
  renderResultsTable();
  renderCasesGrid();
  renderTrajectory();
  initScrollAnimations();
});

// Make closeModal globally available
window.closeModal = closeModal;

// ============================================================
//  HERO STATS
// ============================================================

function renderHeroStats() {
  const container = document.getElementById('heroStats');
  const totalBugs = scores.agent?.true_positives || 0;
  const f1 = scores.agent?.f1_score || 0;
  const fixRate = scores.agent?.fix_success_rate || 0;

  container.innerHTML = `
    <div class="stat-card animate-in">
      <div class="stat-card__value stat-card__value--indigo">10</div>
      <div class="stat-card__label">Real-World Cases</div>
    </div>
    <div class="stat-card animate-in">
      <div class="stat-card__value stat-card__value--emerald">${totalBugs || '—'}</div>
      <div class="stat-card__label">Bugs Caught & Verified</div>
    </div>
    <div class="stat-card animate-in">
      <div class="stat-card__value stat-card__value--cyan">${f1 ? (f1 * 100).toFixed(0) + '%' : '—'}</div>
      <div class="stat-card__label">F1 Score</div>
    </div>
  `;
}

// ============================================================
//  PIPELINE VISUALIZER
// ============================================================

function renderPipeline() {
  const container = document.getElementById('pipelineFlow');
  const phases = [
    { num: 1, title: 'Understand', desc: 'Read the code and specification. Identify inputs, outputs, edge cases.' },
    { num: 2, title: 'Generate Tests', desc: 'Create 12 adversarial test cases targeting common AI hallucination patterns.' },
    { num: 3, title: 'Execute', desc: 'Run every test in a sandboxed subprocess. Capture stdout, stderr, timing.' },
    { num: 4, title: 'Diagnose', desc: 'Analyze failures. Classify root cause, severity, and affected functions.' },
    { num: 5, title: 'Fix & Re-verify', desc: 'Apply a targeted patch. Re-run all tests. Retry up to 2 times.' },
    { num: 6, title: 'Report', desc: 'Output structured proof: bugs, evidence, fix diffs, trajectory.' },
  ];

  container.innerHTML = phases.map((p, i) => `
    ${i > 0 ? '<div class="pipeline__arrow">&#x2192;</div>' : ''}
    <div class="pipeline__phase animate-in">
      <div class="pipeline__phase-num">${p.num}</div>
      <div class="pipeline__phase-title">${p.title}</div>
      <div class="pipeline__phase-desc">${p.desc}</div>
    </div>
  `).join('');
}

// ============================================================
//  METRICS CARDS
// ============================================================

function renderMetrics() {
  const container = document.getElementById('metricsCards');
  const ba = scores.baseline || {};
  const aa = scores.agent || {};

  const cards = [
    { label: 'Agent Precision', value: aa.precision ? (aa.precision * 100).toFixed(0) + '%' : '—', sub: `Baseline: ${ba.precision ? (ba.precision * 100).toFixed(0) + '%' : '—'}`, color: 'var(--accent-indigo)' },
    { label: 'Agent Recall', value: aa.recall ? (aa.recall * 100).toFixed(0) + '%' : '—', sub: `Baseline: ${ba.recall ? (ba.recall * 100).toFixed(0) + '%' : '—'}`, color: 'var(--accent-emerald)' },
    { label: 'Agent F1 Score', value: aa.f1_score ? aa.f1_score.toFixed(3) : '—', sub: `Baseline: ${ba.f1_score ? ba.f1_score.toFixed(3) : '—'}`, color: 'var(--accent-cyan)' },
    { label: 'Fix Success Rate', value: aa.fix_success_rate ? (aa.fix_success_rate * 100).toFixed(0) + '%' : '—', sub: 'Bugs fixed & re-verified', color: 'var(--accent-amber)' },
  ];

  container.innerHTML = cards.map(c => `
    <div class="metric-card animate-in">
      <div class="metric-card__label">${c.label}</div>
      <div class="metric-card__value" style="color: ${c.color}">${c.value}</div>
      <div class="metric-card__sub">${c.sub}</div>
    </div>
  `).join('');
}

// ============================================================
//  BAR CHART (Pure Canvas)
// ============================================================

function renderBarChart() {
  const canvas = document.getElementById('bugsChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // Get data
  const cases = caseMetadata;
  const baselineData = {};
  const agentData = {};
  
  baselineResults.forEach(r => { baselineData[r.case_id] = r.bug_count || (r.bugs_found ? r.bugs_found.length : 0); });
  agentResults.forEach(r => { agentData[r.case_id] = r.bug_count || 0; });
  
  // Draw
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  
  const W = rect.width;
  const H = rect.height;
  const padding = { top: 40, right: 20, bottom: 80, left: 50 };
  const chartW = W - padding.left - padding.right;
  const chartH = H - padding.top - padding.bottom;
  
  // No data yet? Show placeholder
  if (cases.length === 0 || (Object.keys(baselineData).length === 0 && Object.keys(agentData).length === 0)) {
    ctx.fillStyle = '#5a6577';
    ctx.font = '14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Chart will populate when results are available', W / 2, H / 2);
    return;
  }
  
  const maxVal = Math.max(
    ...Object.values(baselineData),
    ...Object.values(agentData),
    4
  );
  
  const groupWidth = chartW / cases.length;
  const barWidth = groupWidth * 0.3;
  const gap = groupWidth * 0.1;
  
  // Y axis
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= maxVal; i++) {
    const y = padding.top + chartH - (i / maxVal) * chartH;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(W - padding.right, y);
    ctx.stroke();
    
    ctx.fillStyle = '#5a6577';
    ctx.font = '11px Inter';
    ctx.textAlign = 'right';
    ctx.fillText(i.toString(), padding.left - 8, y + 4);
  }
  
  // Bars
  cases.forEach((c, i) => {
    const x = padding.left + i * groupWidth + gap;
    const bVal = baselineData[c.id] || 0;
    const aVal = agentData[c.id] || 0;
    
    // Baseline bar
    const bH = (bVal / maxVal) * chartH;
    ctx.fillStyle = 'rgba(251, 113, 133, 0.6)';
    ctx.fillRect(x, padding.top + chartH - bH, barWidth, bH);
    
    // Agent bar
    const aH = (aVal / maxVal) * chartH;
    ctx.fillStyle = 'rgba(52, 211, 153, 0.8)';
    ctx.fillRect(x + barWidth + 2, padding.top + chartH - aH, barWidth, aH);
    
    // Label
    ctx.fillStyle = '#5a6577';
    ctx.font = '10px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.save();
    ctx.translate(x + groupWidth / 2 - gap / 2, padding.top + chartH + 14);
    ctx.rotate(-0.5);
    const label = c.name.length > 12 ? c.name.substring(0, 12) + '...' : c.name;
    ctx.fillText(label, 0, 0);
    ctx.restore();
  });
  
  // Legend
  ctx.fillStyle = 'rgba(251, 113, 133, 0.6)';
  ctx.fillRect(W / 2 - 120, 12, 12, 12);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px Inter';
  ctx.textAlign = 'left';
  ctx.fillText('Baseline', W / 2 - 104, 22);
  
  ctx.fillStyle = 'rgba(52, 211, 153, 0.8)';
  ctx.fillRect(W / 2 + 10, 12, 12, 12);
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('VerifyAgent', W / 2 + 26, 22);
}

// ============================================================
//  RESULTS TABLE
// ============================================================

function renderResultsTable() {
  const table = document.getElementById('resultsTable');
  
  const baselineMap = {};
  baselineResults.forEach(r => { baselineMap[r.case_id] = r; });
  const agentMap = {};
  agentResults.forEach(r => { agentMap[r.case_id] = r; });
  
  let html = `
    <thead>
      <tr>
        <th>Case</th>
        <th>Bug Type</th>
        <th>Baseline Found</th>
        <th>Agent Found</th>
        <th>Tests</th>
        <th>Fixed?</th>
        <th>Time</th>
      </tr>
    </thead>
    <tbody>
  `;
  
  caseMetadata.forEach(c => {
    const b = baselineMap[c.id] || {};
    const a = agentMap[c.id] || {};
    const bBugs = b.bug_count || (b.bugs_found ? b.bugs_found.length : 0);
    const aBugs = a.bug_count || 0;
    const tests = a.total_tests || 0;
    const passed = a.tests_passed || 0;
    const fixed = a.fix_improved ? '<span class="cell-pass">Yes</span>' : (a.case_id ? '<span class="cell-fail">No</span>' : '—');
    const time = a.total_time_seconds ? a.total_time_seconds.toFixed(1) + 's' : '—';
    
    html += `
      <tr>
        <td class="cell-case">${c.id}</td>
        <td><span class="badge badge--neutral">${c.bugType}</span></td>
        <td>${bBugs}</td>
        <td><strong>${aBugs}</strong></td>
        <td>${tests > 0 ? `${passed}/${tests}` : '—'}</td>
        <td>${fixed}</td>
        <td>${time}</td>
      </tr>
    `;
  });
  
  html += '</tbody>';
  table.innerHTML = html;
}

// ============================================================
//  CASES GRID
// ============================================================

function renderCasesGrid() {
  const container = document.getElementById('casesGrid');
  
  const baselineMap = {};
  baselineResults.forEach(r => { baselineMap[r.case_id] = r; });
  const agentMap = {};
  agentResults.forEach(r => { agentMap[r.case_id] = r; });
  
  container.innerHTML = caseMetadata.map(c => {
    const b = baselineMap[c.id] || {};
    const a = agentMap[c.id] || {};
    const bBugs = b.bug_count || (b.bugs_found ? b.bugs_found.length : 0);
    const aBugs = a.bug_count || 0;
    const severityClass = c.severity === 'critical' ? 'danger' : c.severity === 'high' ? 'warning' : 'info';
    
    return `
      <div class="case-card animate-in" onclick="openCaseModal('${c.id}')">
        <div class="case-card__header">
          <div class="case-card__title">${c.name}</div>
          <span class="badge badge--${severityClass}">${c.severity}</span>
          <span class="badge badge--neutral">${c.bugType}</span>
        </div>
        <div class="case-card__results">
          <div class="case-card__result case-card__result--baseline">
            <div class="case-card__result-label">Baseline</div>
            <div class="case-card__result-value">${bBugs} bugs (unverified)</div>
          </div>
          <div class="case-card__result case-card__result--agent">
            <div class="case-card__result-label">VerifyAgent</div>
            <div class="case-card__result-value">${aBugs ? `${aBugs} bugs (${a.fix_improved ? 'fixed' : 'found'})` : 'Pending...'}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ============================================================
//  MODAL
// ============================================================

window.openCaseModal = function(caseId) {
  const modal = document.getElementById('caseModal');
  const header = document.getElementById('modalHeader');
  const tabs = document.getElementById('modalTabs');
  const body = document.getElementById('modalBody');
  
  const meta = caseMetadata.find(c => c.id === caseId);
  const agentResult = agentResults.find(r => r.case_id === caseId);
  const baselineResult = baselineResults.find(r => r.case_id === caseId);
  
  header.innerHTML = `
    <h2>${meta?.name || caseId}</h2>
    <p style="color: var(--text-secondary); margin-top: var(--space-sm);">
      <span class="badge badge--neutral">${meta?.bugType || 'unknown'}</span>
      <span class="badge badge--${meta?.severity === 'critical' ? 'danger' : 'warning'}">${meta?.severity || 'medium'}</span>
    </p>
  `;
  
  const tabList = ['Code', 'Tests', 'Diagnosis', 'Fix Diff', 'Trajectory'];
  tabs.innerHTML = tabList.map((t, i) => `
    <button class="modal__tab ${i === 0 ? 'modal__tab--active' : ''}" onclick="switchTab(this, '${caseId}', '${t.toLowerCase().replace(' ', '_')}')">${t}</button>
  `).join('');
  
  // Show code tab by default
  renderModalTab(body, caseId, 'code', agentResult, baselineResult);
  
  modal.classList.add('modal--open');
  document.body.style.overflow = 'hidden';
};

window.switchTab = function(btn, caseId, tabName) {
  document.querySelectorAll('.modal__tab').forEach(t => t.classList.remove('modal__tab--active'));
  btn.classList.add('modal__tab--active');
  
  const body = document.getElementById('modalBody');
  const agentResult = agentResults.find(r => r.case_id === caseId);
  const baselineResult = baselineResults.find(r => r.case_id === caseId);
  renderModalTab(body, caseId, tabName, agentResult, baselineResult);
};

function renderModalTab(container, caseId, tabName, agentResult, baselineResult) {
  if (!agentResult && !baselineResult) {
    container.innerHTML = '<p style="color: var(--text-muted);">No results available for this case yet.</p>';
    return;
  }
  
  switch (tabName) {
    case 'code':
      const code = agentResult?.original_code || baselineResult?.review_text || 'No code available';
      container.innerHTML = `<div class="code-block"><pre><code class="language-python">${escapeHtml(code)}</code></pre></div>`;
      hljs.highlightAll();
      break;
      
    case 'tests':
      if (agentResult?.test_results) {
        container.innerHTML = agentResult.test_results.map(t => `
          <div style="padding: var(--space-md); border-bottom: 1px solid var(--border-glass);">
            <span class="badge badge--${t.passed ? 'success' : 'danger'}">${t.passed ? 'PASS' : 'FAIL'}</span>
            <strong style="margin-left: var(--space-sm);">${t.test_name}</strong>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: var(--space-xs); font-family: var(--font-code);">
              Input: ${escapeHtml(t.input_data || 'N/A')}<br/>
              Expected: ${escapeHtml(t.expected_output || 'N/A')}<br/>
              Actual: ${escapeHtml(t.actual_output || 'N/A')}
            </div>
          </div>
        `).join('');
      } else {
        container.innerHTML = '<p style="color: var(--text-muted);">No test results available.</p>';
      }
      break;
      
    case 'diagnosis':
      const bugs = agentResult?.bugs_found || [];
      if (bugs.length > 0) {
        container.innerHTML = bugs.map((b, i) => `
          <div style="background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: var(--space-lg); margin-bottom: var(--space-md);">
            <div style="display: flex; gap: var(--space-sm); align-items: center; margin-bottom: var(--space-sm);">
              <span class="badge badge--danger">${b.severity || 'unknown'}</span>
              <span class="badge badge--neutral">${b.category || 'unknown'}</span>
              <strong>${b.bug_id || `BUG-${i+1}`}</strong>
            </div>
            <p style="color: var(--text-secondary); font-size: 0.9rem;">${escapeHtml(b.root_cause || b.description || 'No description')}</p>
            ${b.evidence ? `<div class="code-block" style="margin-top: var(--space-sm);"><pre>${escapeHtml(b.evidence)}</pre></div>` : ''}
          </div>
        `).join('');
      } else {
        container.innerHTML = '<p style="color: var(--text-muted);">No diagnosis available.</p>';
      }
      break;
      
    case 'fix_diff':
      if (agentResult?.original_code && agentResult?.fixed_code) {
        container.innerHTML = `
          <h3 style="margin-bottom: var(--space-md); color: var(--accent-rose);">Original (Buggy)</h3>
          <div class="code-block"><pre><code class="language-python">${escapeHtml(agentResult.original_code)}</code></pre></div>
          <h3 style="margin: var(--space-xl) 0 var(--space-md); color: var(--accent-emerald);">Fixed (By Agent)</h3>
          <div class="code-block"><pre><code class="language-python">${escapeHtml(agentResult.fixed_code)}</code></pre></div>
        `;
        hljs.highlightAll();
      } else {
        container.innerHTML = '<p style="color: var(--text-muted);">No fix diff available.</p>';
      }
      break;
      
    case 'trajectory':
      if (agentResult?.trajectory) {
        container.innerHTML = agentResult.trajectory.map((t, i) => `
          <div class="traj-step">
            <div class="traj-step__header" onclick="this.parentElement.classList.toggle('traj-step--open')">
              <span class="traj-step__phase">Step ${i + 1}</span>
              <span class="traj-step__meta">${t.prompt_length} chars prompt → ${t.response_length} chars response</span>
              <span class="traj-step__latency">${t.latency_seconds}s</span>
              <span class="traj-step__toggle">&#x25BC;</span>
            </div>
            <div class="traj-step__body">
              <div class="traj-step__label">Prompt Preview</div>
              <div class="code-block"><pre>${escapeHtml(t.prompt_preview || '')}</pre></div>
              <div class="traj-step__label">Response Preview</div>
              <div class="code-block"><pre>${escapeHtml(t.response_preview || '')}</pre></div>
            </div>
          </div>
        `).join('');
      } else {
        container.innerHTML = '<p style="color: var(--text-muted);">No trajectory available.</p>';
      }
      break;
  }
}

function closeModal() {
  document.getElementById('caseModal').classList.remove('modal--open');
  document.body.style.overflow = '';
}

// ============================================================
//  TRAJECTORY VIEWER (Main page)
// ============================================================

function renderTrajectory() {
  const container = document.getElementById('trajectoryViewer');
  
  // Show trajectory from first available case
  const firstResult = agentResults[0];
  if (!firstResult || !firstResult.trajectory) {
    container.innerHTML = '<p style="text-align: center; color: var(--text-muted);">Trajectory data will appear here once the agent has run.</p>';
    return;
  }
  
  container.innerHTML = `
    <p style="color: var(--text-secondary); margin-bottom: var(--space-lg);">
      Showing trajectory for <strong>${firstResult.case_id}</strong> — 
      ${firstResult.trajectory.length} LLM calls, 
      ${firstResult.total_time_seconds}s total
    </p>
    ${firstResult.trajectory.map((t, i) => `
      <div class="traj-step">
        <div class="traj-step__header" onclick="this.parentElement.classList.toggle('traj-step--open')">
          <span class="traj-step__phase">Call ${i + 1}</span>
          <span class="traj-step__meta">${t.model} | ${t.prompt_length} chars → ${t.response_length} chars</span>
          <span class="traj-step__latency">${t.latency_seconds}s</span>
          <span class="traj-step__toggle">&#x25BC;</span>
        </div>
        <div class="traj-step__body">
          ${t.system_instruction ? `<div class="traj-step__label">System Instruction</div><div class="code-block"><pre>${escapeHtml(t.system_instruction)}</pre></div>` : ''}
          <div class="traj-step__label">Prompt</div>
          <div class="code-block"><pre>${escapeHtml(t.prompt_preview || '')}</pre></div>
          <div class="traj-step__label">Response</div>
          <div class="code-block"><pre>${escapeHtml(t.response_preview || '')}</pre></div>
        </div>
      </div>
    `).join('')}
  `;
}

// ============================================================
//  UTILITIES
// ============================================================

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-in').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
}
