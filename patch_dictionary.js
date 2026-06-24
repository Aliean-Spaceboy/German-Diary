const fs = require('fs');

// --- HTML PATCH ---
let html = fs.readFileSync('index.html', 'utf8');

// 1. Add Nav Button
const navRegex = /<button class="nav-btn" onclick="showSection\('vocab'\)">.*?Vocabulary<\/button>/;
if (html.match(navRegex)) {
  html = html.replace(navRegex, `<button class="nav-btn" onclick="showSection('vocab')">&#128218; Vocabulary</button>\n        <button class="nav-btn" onclick="showSection('dictionary')">&#128214; Dictionary</button>`);
}

// 2. Add Dictionary Section
const dictionarySection = `
  <!-- DICTIONARY -->
  <div id="section-dictionary" class="section">
    <div class="card" style="margin-bottom:24px;background:var(--surface2)">
      <div style="font-weight:800;font-size:1.5rem;margin-bottom:10px;display:flex;align-items:center;gap:10px">
        <span>&#128269;</span>
        <input type="text" id="dictSearch" oninput="searchDictionary()" placeholder="Search in German or English..." style="width:100%;padding:12px;font-size:1.1rem;border:2px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text);outline:none;">
      </div>
      <div style="font-size:0.85rem;color:var(--text-muted);text-align:center">Omni-Search: Automatically filters Active & Hidden Words + Sentences.</div>
    </div>
    <div id="dictResults">
       <div style="text-align:center;padding:40px;color:var(--text-muted)">Type a word to begin searching...</div>
    </div>
  </div>
`;

// Inject before section-srs just as a safe place
const injectRegex = /<div id="section-srs" class="section">/;
if (html.match(injectRegex)) {
  html = html.replace(injectRegex, dictionarySection + '\n  <div id="section-srs" class="section">');
}

fs.writeFileSync('index.html', html, 'utf8');


// --- JS PATCH ---
let js = fs.readFileSync('script.js', 'utf8');

const dictFunction = `
function searchDictionary() {
  const term = document.getElementById('dictSearch').value.trim().toLowerCase();
  const resEl = document.getElementById('dictResults');
  
  if (!term) {
    resEl.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted)">Type a word to begin searching...</div>';
    return;
  }
  
  // Combine databases
  // Use Map or Set to prevent exact duplicates (same DE text)
  const allWords = new Map();
  vocab.forEach(v => allWords.set(v.de, v));
  vocab_pool.forEach(v => { if(!allWords.has(v.de)) allWords.set(v.de, v); });
  
  const allSents = new Map();
  DAILY_SENTENCES.forEach(s => allSents.set(s.de, s));
  sentences_pool.forEach(s => { if(!allSents.has(s.de)) allSents.set(s.de, s); });
  
  // Filter matches
  const wordMatches = Array.from(allWords.values()).filter(v => v.de.toLowerCase().includes(term) || v.en.toLowerCase().includes(term)).slice(0, 20);
  const sentMatches = Array.from(allSents.values()).filter(s => s.de.toLowerCase().includes(term) || s.en.toLowerCase().includes(term)).slice(0, 20);
  
  if (wordMatches.length === 0 && sentMatches.length === 0) {
    resEl.innerHTML = \`
      <div class="card" style="text-align:center;padding:30px">
        <div style="font-size:3rem;margin-bottom:10px">&#129335;</div>
        <div style="font-size:1.2rem;font-weight:700;margin-bottom:5px">Word not found in database.</div>
        <div style="color:var(--text-muted);margin-bottom:20px">Your offline dictionary only knows what you've uploaded or unlocked!</div>
        <button class="btn btn-primary" onclick="window.open('https://translate.google.com/?sl=auto&tl=en&text=' + encodeURIComponent('\${term.replace(/'/g,"\\\\'")}') )">Search on Google Translate</button>
      </div>
    \`;
    return;
  }
  
  let html = '';
  
  if (wordMatches.length > 0) {
    html += '<div class="card-title" style="margin-top:10px">&#128218; Vocabulary Matches</div><div style="display:flex;flex-direction:column;gap:10px;margin-bottom:24px">';
    html += wordMatches.map(w => \`
      <div class="card" style="display:flex;align-items:center;justify-content:space-between;padding:12px;margin:0">
        <div>
          <div style="font-weight:800;font-size:1.1rem;color:var(--accent)">\${w.de}</div>
          <div style="color:var(--text-muted);font-size:0.95rem">\${w.en}</div>
        </div>
        <button class="btn btn-outline btn-sm" onclick="speakWord('\${w.de.replace(/'/g,"\\\\'")}')" style="border-radius:50%;width:35px;height:35px;padding:0;display:flex;align-items:center;justify-content:center">&#128266;</button>
      </div>
    \`).join('');
    html += '</div>';
  }
  
  if (sentMatches.length > 0) {
    html += '<div class="card-title">&#128172; Contextual Sentences</div><div style="display:flex;flex-direction:column;gap:10px">';
    html += sentMatches.map(s => \`
      <div class="card" style="padding:12px;margin:0">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px">
           <div style="font-weight:600;font-size:1rem;color:var(--text);margin-bottom:4px">\${s.de}</div>
           <button class="btn btn-outline btn-sm" onclick="speakWord('\${s.de.replace(/'/g,"\\\\'")}')" style="border-radius:50%;min-width:35px;height:35px;padding:0;display:flex;align-items:center;justify-content:center">&#128266;</button>
        </div>
        <div style="color:var(--text-muted);font-size:0.9rem;border-left:3px solid var(--border);padding-left:10px;margin-top:5px">\${s.en}</div>
      </div>
    \`).join('');
    html += '</div>';
  }
  
  resEl.innerHTML = html;
}
`;

js += '\n' + dictFunction;

fs.writeFileSync('script.js', js, 'utf8');

console.log("Dictionary UI and JS Engine injected successfully!");
