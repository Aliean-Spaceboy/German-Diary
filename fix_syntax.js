const fs = require('fs');

let js = fs.readFileSync('script.js', 'utf8');

// Find the broken section
// The broken section starts with `const safeTerm = term.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\const wordMatches`
// I will just replace the entire searchDictionary function since I broke it.

const brokenFunctionRegex = /function searchDictionary\(\) \{[\s\S]*?resEl\.innerHTML = html;\n\}/;

const fixedFunction = `
function searchDictionary() {
  const term = document.getElementById('dictSearch').value.trim().toLowerCase();
  const resEl = document.getElementById('dictResults');
  
  if (!term) {
    resEl.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted)">Type a word to begin searching...</div>';
    return;
  }
  
  const allWords = new Map();
  vocab.forEach(v => allWords.set(v.de, v));
  vocab_pool.forEach(v => { if(!allWords.has(v.de)) allWords.set(v.de, v); });
  if (typeof DAILY_WORDS !== 'undefined') {
    DAILY_WORDS.forEach(v => { if(!allWords.has(v.de)) allWords.set(v.de, v); });
  }
  
  const allSents = new Map();
  DAILY_SENTENCES.forEach(s => allSents.set(s.de, s));
  sentences_pool.forEach(s => { if(!allSents.has(s.de)) allSents.set(s.de, s); });
  
  // Safe term for regex
  let safeTerm = term;
  try { safeTerm = term.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\\\$&'); } catch(e) {}
  const boundaryRegex = new RegExp('(?:^|\\\\s|-)' + safeTerm, 'i');
  
  const wordMatches = Array.from(allWords.values()).filter(v => {
    const deLow = v.de.toLowerCase();
    const enLow = v.en.toLowerCase();
    const strippedDe = deLow.replace(/^(der|die|das)\\s+/, '');
    
    if (deLow === term || enLow === term || strippedDe === term) return true;
    if (term === 'der' || term === 'die' || term === 'das') return false;
    
    return boundaryRegex.test(deLow) || boundaryRegex.test(enLow);
  }).slice(0, 20);
  
  const sentMatches = Array.from(allSents.values()).filter(s => {
    const deLow = s.de.toLowerCase();
    const enLow = s.en.toLowerCase();
    return boundaryRegex.test(deLow) || boundaryRegex.test(enLow);
  }).slice(0, 20);
  
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

js = js.replace(brokenFunctionRegex, fixedFunction.replace(/\$/g, '$$$$')); // use function replacement to avoid $& injection issues just in case, but string literal works if we don't use it inside another replace!
// Wait! `fixedFunction` is just a string, we insert it via function to be safe:
js = js.replace(brokenFunctionRegex, () => fixedFunction);

fs.writeFileSync('script.js', js, 'utf8');
console.log("Syntax fixed!");

