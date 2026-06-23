const fs = require('fs');

// --- HTML PATCH ---
let html = fs.readFileSync('index.html', 'utf-8');

const csvHtml = `
  <div class="card" style="margin-bottom:20px;background:var(--surface2)">
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
      <div>
        <div style="font-weight:700">?? Bulk CSV Importer</div>
        <div style="font-size:0.8rem;color:var(--text-muted)">Upload a .csv file (Format: German,English) to load thousands of words instantly!</div>
      </div>
      <div style="position:relative; overflow:hidden; display:inline-block">
        <button class="btn btn-outline btn-sm">Upload CSV</button>
        <input type="file" accept=".csv" onchange="importCsv(event)" style="position:absolute; left:0; top:0; opacity:0; cursor:pointer; height:100%">
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-title">&#129300; Quick Test (Flashcard)</div>
`;

if (!html.includes('Bulk CSV Importer')) {
  // Replace the quick test card start to inject just above it
  html = html.replace('<div class="card">\n    <div class="card-title">&#129300; Quick Test (Flashcard)</div>', csvHtml);
  fs.writeFileSync('index.html', html, 'utf-8');
}

// --- JS PATCH ---
let js = fs.readFileSync('script.js', 'utf-8');

const csvJs = `
// --- CSV BULK IMPORT ---
function importCsv(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    const lines = text.split('\\n');
    let added = 0;
    
    lines.forEach(line => {
      const parts = line.split(',');
      if (parts.length >= 2) {
        const de = parts[0].trim();
        const en = parts[1].trim();
        if (de && en && !vocab.find(v => v.de === de)) {
          vocab.unshift({ de, en, cat: 'General', ts: Date.now() });
          added++;
        }
      }
    });
    
    if (added > 0) {
      save('dt_vocab', vocab);
      renderVocab('All');
      showToast('?? Successfully imported ' + added + ' new words!');
    } else {
      showToast('?? No valid new words found in CSV.');
    }
    event.target.value = ''; // reset file input
  };
  reader.readAsText(file);
}
`;

if (!js.includes('function importCsv(event)')) {
  js += '\n' + csvJs;
  fs.writeFileSync('script.js', js, 'utf-8');
}

console.log('Task 2 Complete: Bulk CSV Import Added');
