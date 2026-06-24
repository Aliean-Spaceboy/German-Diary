const fs = require('fs');
let js = fs.readFileSync('script.js', 'utf8');

const srsRegex = /function getSRS\(\)\{return JSON\.parse\(localStorage\.getItem\('dt_srs'\)\|\|'\[\]'\);\}[\s\S]*?renderSRS\(\);\s*\}/;

const newSrsLogic = `function renderSRS() {
  const el = document.getElementById('srsDueList');
  if(!el) return;

  const now = Date.now();
  const due = vocab.filter(v => !v.nextReview || v.nextReview <= now);
  
  if(due.length === 0) {
    el.innerHTML = '<div style="padding:20px;text-align:center;color:var(--success)">&#127881; You have caught up on all your reviews!</div>';
    return;
  }
  
  const w = due[0];
  const vIdx = vocab.findIndex(v => v.de === w.de);
  
  el.innerHTML = \`
    <div style="font-size:1.5rem;font-weight:700;text-align:center;margin-bottom:10px">\${w.de}</div>
    <div style="text-align:center;margin-bottom:20px"><button class="btn btn-outline btn-sm" onclick="this.style.display='none'; document.getElementById('srsAns').style.display='block'">Show Answer</button></div>
    <div id="srsAns" style="display:none; text-align:center">
      <div style="font-size:1.1rem;color:var(--text-muted);margin-bottom:20px">\${w.en}</div>
      <div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap">
        <button class="btn btn-outline" style="border-color:var(--danger);color:var(--danger)" onclick="rateSRS(\${vIdx}, 1)">Again (1 min)</button>
        <button class="btn btn-outline" style="border-color:var(--gold);color:var(--gold)" onclick="rateSRS(\${vIdx}, 2)">Hard (1 day)</button>
        <button class="btn btn-outline" style="border-color:var(--success);color:var(--success)" onclick="rateSRS(\${vIdx}, 3)">Good (3 days)</button>
        <button class="btn btn-outline" style="border-color:var(--accent);color:var(--accent)" onclick="rateSRS(\${vIdx}, 4)">Easy (7 days)</button>
      </div>
    </div>
  \`;
}

function rateSRS(idx, rating) {
  const w = vocab[idx];
  if(!w) return;
  
  const now = Date.now();
  let daysToAdd = 0;
  if(rating === 1) daysToAdd = 0.001; // 1.4 minutes
  else if(rating === 2) daysToAdd = 1;
  else if(rating === 3) daysToAdd = 3;
  else if(rating === 4) daysToAdd = 7;
  
  w.nextReview = now + (daysToAdd * 86400000);
  save('dt_vocab', vocab);
  renderSRS();
}`;

if(js.match(srsRegex)) {
  js = js.replace(srsRegex, newSrsLogic);
  fs.writeFileSync('script.js', js, 'utf8');
  console.log("SRS engine patched!");
} else {
  console.log("Could not find the SRS logic to patch.");
}
