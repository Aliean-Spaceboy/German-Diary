const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const sentencePacksHtml = `
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
    </div>`;

const injectRegex = /<div id="section-diary" class="section">\s*<div class="card">/;
if(html.match(injectRegex)) {
  html = html.replace(injectRegex, `<div id="section-diary" class="section">\n${sentencePacksHtml}\n    <div class="card">`);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log("Sentence Packs injected perfectly!");
} else {
  console.log("Failed to inject Sentence Packs card.");
}

let js = fs.readFileSync('script.js', 'utf8');

const oldSentencesRegex = /const DEFAULT_SENTENCES = \[[\s\S]*?\];/;
const newSentences = `const DEFAULT_SENTENCES = [
  { de: 'Hallo, wie geht es dir?', en: 'Hello, how are you?' },
  { de: 'Mir geht es gut, danke.', en: 'I am doing well, thank you.' },
  { de: 'Ich bin mit dem aktuellen Stand sehr zufrieden.', en: 'I am very satisfied with the current status.' }
];`;

if(js.match(oldSentencesRegex)) {
  js = js.replace(oldSentencesRegex, newSentences);
  
  // Wipe dt_sentences so it re-pulls the corrected DEFAULT_SENTENCES instead of holding onto the mangled ones.
  // And force a wipe of DAILY_SENTENCES and sentences_pool if they are corrupted.
  const wipeLogic = `
  // FIX CORRUPTED SENTENCES
  if(DAILY_SENTENCES.length > 0 && DAILY_SENTENCES[0].de === 'Hallo') {
    console.log("Wiping corrupted sentences array...");
    DAILY_SENTENCES = [];
    sentences_pool = [];
    localStorage.removeItem('dt_sentences');
    localStorage.removeItem('dt_sentences_pool');
  }
  `;
  js = js.replace(/function loadDailyInspiration\(\) \{/, wipeLogic + '\nfunction loadDailyInspiration() {');
  
  fs.writeFileSync('script.js', js, 'utf8');
  console.log("DEFAULT_SENTENCES patched!");
}

