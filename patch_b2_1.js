const fs = require('fs');

// --- HTML PATCH ---
let html = fs.readFileSync('index.html', 'utf-8');

const backupHtml = `
  <div class="card" style="margin-top:24px; border-color:var(--danger)">
    <div class="card-title">?? Data Backup & Restore</div>
    <div class="card-sub">Your data is stored locally in your browser. If you clear your history, it will be deleted! Export a backup regularly.</div>
    <div style="display:flex; gap:12px; margin-top:14px; align-items:center; flex-wrap:wrap">
      <button class="btn btn-outline" style="border-color:var(--success); color:var(--success)" onclick="exportData()">?? Export Backup (JSON)</button>
      <div style="position:relative; overflow:hidden; display:inline-block">
        <button class="btn btn-outline" style="border-color:var(--danger); color:var(--danger)">?? Import Backup</button>
        <input type="file" accept=".json" onchange="importData(event)" style="position:absolute; left:0; top:0; opacity:0; cursor:pointer; height:100%">
      </div>
    </div>
  </div>
</div>

<!-- DIARY -->
`;

if (!html.includes('?? Data Backup & Restore')) {
  html = html.replace('</div>\n\n<!-- DIARY -->', backupHtml);
  fs.writeFileSync('index.html', html, 'utf-8');
}

// --- JS PATCH ---
let js = fs.readFileSync('script.js', 'utf-8');

const backupJs = `
// --- DATA BACKUP & RESTORE ---
function exportData() {
  const data = {
    dt_entries: load('dt_entries', []),
    dt_vocab: load('dt_vocab', []),
    dt_speak: load('dt_speak', [])
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'deutsches_tagebuch_backup_' + todayStr() + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast('? Backup Downloaded!');
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data.dt_entries) save('dt_entries', data.dt_entries);
      if (data.dt_vocab) save('dt_vocab', data.dt_vocab);
      if (data.dt_speak) save('dt_speak', data.dt_speak);
      showToast('?? Backup Restored Successfully!');
      setTimeout(() => location.reload(), 1000);
    } catch (err) {
      showToast('? Error: Invalid Backup File');
    }
  };
  reader.readAsText(file);
}
`;

if (!js.includes('function exportData()')) {
  js += '\n' + backupJs;
  fs.writeFileSync('script.js', js, 'utf-8');
}

console.log('Task 1 Complete: Backup/Restore Added');
