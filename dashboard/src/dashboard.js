import { agentResults, baselineResults, scores, caseMetadata } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
  renderKPICards();
  renderCasesTable();
});

// Make functions globally available for inline onclick handlers
window.openDetail = openDetail;
window.closeDetail = closeDetail;
window.switchTab = switchTab;

let currentCaseId = null;
let currentTab = 'diff';

function renderKPICards() {
  const container = document.getElementById('kpiCards');
  const ba = scores.baseline || {};
  const aa = scores.agent || {};

  const cards = [
    { label: 'Precision', value: aa.precision ? (aa.precision * 100).toFixed(0) + '%' : '—', color: 'text-blue-500' },
    { label: 'Recall', value: aa.recall ? (aa.recall * 100).toFixed(0) + '%' : '—', color: 'text-purple-500' },
    { label: 'F1 Score', value: aa.f1_score ? aa.f1_score.toFixed(3) : '—', color: 'text-cyan-400' },
    { label: 'Fix Success Rate', value: aa.fix_success_rate ? (aa.fix_success_rate * 100).toFixed(0) + '%' : '—', color: 'text-emerald-500' },
  ];

  container.innerHTML = cards.map(c => `
    <div class="glass-panel rounded-2xl p-5 flex flex-col justify-between">
      <div class="flex justify-between items-center mb-4">
        <span class="text-xs text-strix-muted font-medium">${c.label}</span>
      </div>
      <div>
        <div class="text-3xl font-semibold text-white mb-1">${c.value}</div>
        <div class="text-[10px] text-strix-muted flex items-center gap-1">
          <svg class="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
          <span class="text-emerald-500">Verified</span>
        </div>
      </div>
    </div>
  `).join('');
}

function renderCasesTable() {
  const tbody = document.getElementById('casesTableBody');
  const agentMap = {};
  agentResults.forEach(r => { agentMap[r.case_id] = r; });

  tbody.innerHTML = caseMetadata.map(c => {
    const a = agentMap[c.id] || {};
    const aBugs = a.bug_count || 0;
    const tests = a.total_tests || 0;
    const passed = a.tests_passed || 0;
    
    let statusHTML = '<span class="px-2 py-0.5 rounded text-[10px] font-medium bg-strix-border text-strix-muted">Pending</span>';
    if (a.fix_improved) {
      statusHTML = '<span class="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Verified & Fixed</span>';
    } else if (a.case_id) {
      statusHTML = '<span class="px-2 py-0.5 rounded text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/20">Failed Fix</span>';
    }

    return `
      <tr class="border-b border-strix-border/50 hover:bg-white/[0.02] cursor-pointer transition-colors" onclick="openDetail('${c.id}')">
        <td class="px-4 py-3">
          <div class="flex items-center gap-2">
            <svg class="w-3.5 h-3.5 text-strix-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            <span class="text-white font-mono text-[11px]">${c.id}</span>
          </div>
        </td>
        <td class="px-4 py-3 text-white">${aBugs}</td>
        <td class="px-4 py-3 text-strix-muted">${tests > 0 ? `${passed} / ${tests}` : '—'}</td>
        <td class="px-4 py-3">${statusHTML}</td>
      </tr>
    `;
  }).join('');
}

function openDetail(caseId) {
  currentCaseId = caseId;
  document.getElementById('emptyPane').classList.add('hidden');
  document.getElementById('detailPane').classList.remove('hidden');
  
  const meta = caseMetadata.find(c => c.id === caseId);
  const a = agentResults.find(r => r.case_id === caseId) || {};
  
  document.getElementById('detailTitle').textContent = meta?.name || caseId;
  document.getElementById('detailDesc').textContent = meta?.description || '';
  
  const statusEl = document.getElementById('detailStatus');
  if (a.fix_improved) {
    statusEl.className = 'px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    statusEl.textContent = 'Verified & Fixed';
  } else {
    statusEl.className = 'px-2 py-0.5 rounded text-[10px] font-medium bg-strix-border text-strix-muted border border-strix-border';
    statusEl.textContent = 'Pending / Failed';
  }

  renderTabContent();
}

function closeDetail() {
  currentCaseId = null;
  document.getElementById('emptyPane').classList.remove('hidden');
  document.getElementById('detailPane').classList.add('hidden');
}

function switchTab(tab) {
  currentTab = tab;
  
  const btns = document.getElementById('detailTabs').querySelectorAll('button');
  btns[0].className = tab === 'diff' ? 'py-3 border-b-2 border-blue-500 text-white' : 'py-3 border-b-2 border-transparent text-strix-muted hover:text-white transition-colors';
  btns[1].className = tab === 'trajectory' ? 'py-3 border-b-2 border-blue-500 text-white' : 'py-3 border-b-2 border-transparent text-strix-muted hover:text-white transition-colors';
  
  renderTabContent();
}

function renderTabContent() {
  const container = document.getElementById('detailContent');
  if (!currentCaseId) return;
  
  const a = agentResults.find(r => r.case_id === currentCaseId);
  if (!a) {
    container.innerHTML = '<p class="text-strix-muted">No results found for this case.</p>';
    return;
  }

  if (currentTab === 'diff') {
    if (a.original_code && a.fixed_code) {
      container.innerHTML = `
        <div class="mb-4">
          <div class="text-[10px] uppercase tracking-wider text-red-400 mb-2 flex items-center gap-2">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            Original (Buggy)
          </div>
          <div class="bg-[#0d1117] border border-strix-border rounded-lg overflow-hidden">
            <pre class="text-[11px] p-4 m-0 font-mono text-strix-muted"><code>${escapeHtml(a.original_code)}</code></pre>
          </div>
        </div>
        <div>
          <div class="text-[10px] uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-2">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            Fixed (Agent Patch)
          </div>
          <div class="bg-[#0d1117] border border-strix-border rounded-lg overflow-hidden">
            <pre class="text-[11px] p-4 m-0 font-mono text-strix-muted"><code>${escapeHtml(a.fixed_code)}</code></pre>
          </div>
        </div>
      `;
      // Apply simplistic red/green to diffs if possible, or rely on highlight.js
      setTimeout(() => hljs.highlightAll(), 10);
    } else {
      container.innerHTML = '<p class="text-strix-muted">No fix diff available.</p>';
    }
  } else if (currentTab === 'trajectory') {
    if (a.trajectory) {
      container.innerHTML = `
        <div class="relative border-l border-strix-border ml-3 pl-6 space-y-8 py-2">
          ${a.trajectory.map((t, i) => `
            <div class="relative">
              <div class="absolute -left-[31px] bg-blue-600 w-4 h-4 rounded-full border-4 border-strix-black"></div>
              <div class="text-[10px] text-strix-muted mb-1 flex justify-between">
                <span>Phase ${i+1}</span>
                <span>${t.latency_seconds}s</span>
              </div>
              <div class="bg-black border border-strix-border rounded-lg p-3 text-[11px] font-mono text-strix-muted">
                <div class="mb-2 text-white border-b border-strix-border/50 pb-2">Prompt Sent (${t.prompt_length} chars)</div>
                <div class="line-clamp-3 mb-4 opacity-50">${escapeHtml(t.prompt_preview)}</div>
                
                <div class="mb-2 text-emerald-400 border-b border-strix-border/50 pb-2">Response Received (${t.response_length} chars)</div>
                <div class="line-clamp-3">${escapeHtml(t.response_preview)}</div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      container.innerHTML = '<p class="text-strix-muted">No trajectory available.</p>';
    }
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
