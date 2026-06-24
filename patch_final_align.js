const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Heatmap responsive CSS
const oldCssRegex = /\.heatmap-calendar\s*\{\s*display:\s*grid;\s*grid-template-columns:\s*repeat\(7,\s*1fr\);\s*gap:\s*6px;\s*\}/;
const newCss = `.heatmap-wrapper { display: flex; flex-direction: column; gap: 6px; margin-top: 10px; align-items: center; }
    .heatmap-calendar-header { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-size: 0.7rem; font-weight: 700; color: var(--text-muted); width: 100%; max-width: 350px; }
    .heatmap-calendar {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 4px;
      width: 100%;
      max-width: 350px;
    }`;

html = html.replace('.heatmap-wrapper { display: flex; flex-direction: column; gap: 6px; margin-top: 10px; }', '');
html = html.replace('.heatmap-calendar-header { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-size: 0.7rem; font-weight: 700; color: var(--text-muted); }', '');

if (html.match(oldCssRegex)) {
  html = html.replace(oldCssRegex, newCss.trim());
}

// 2. Remove Sentence Uploader from Vocab Section
const sentenceBtnRegex = /<div style="position:relative; overflow:hidden; display:inline-block">\s*<button class="btn btn-outline btn-sm" style="border-color:var\(--gold\); color:var\(--gold\)">Upload\s*Sentences \(CSV\)<\/button>\s*<input type="file" accept="\.csv" onchange="importSentenceCsv\(event\)" style="position:absolute; left:0;\s*top:0; opacity:0; cursor:pointer; height:100%">\s*<\/div>/;
html = html.replace(sentenceBtnRegex, '');

// 3. Inject it into Diary Section
const diaryPastRegex = /<div class="card-title">.*?Past Diary Entries<\/div>/;
const newDiaryCard = `
    <div class="card" style="margin-bottom:24px;background:var(--surface2)">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
        <div>
          <div style="font-weight:700">&#128218; Sentence Packs</div>
          <div style="font-size:0.8rem;color:var(--text-muted)">Upload .csv files to expand your daily sentence builder.</div>
        </div>
        <div style="position:relative; overflow:hidden; display:inline-block">
          <button class="btn btn-outline btn-sm" style="border-color:var(--gold); color:var(--gold)">Upload Sentences (CSV)</button>
          <input type="file" accept=".csv" onchange="importSentenceCsv(event)" style="position:absolute; left:0; top:0; opacity:0; cursor:pointer; height:100%">
        </div>
      </div>
    </div>
    <div class="card-title">&#128214; Past Diary Entries</div>`;

if (html.match(diaryPastRegex)) {
  html = html.replace(diaryPastRegex, newDiaryCard);
}

fs.writeFileSync('index.html', html, 'utf8');
console.log("HTML Layout successfully patched!");
