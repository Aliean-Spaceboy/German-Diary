const fs = require('fs');

// --- CSS Updates ---
let css = fs.readFileSync('style.css', 'utf-8');
if (css.includes('.nav-inner{max-width:1100px;margin:0 auto;display:flex;gap:4px}')) {
  css = css.replace('.nav-inner{max-width:1100px;margin:0 auto;display:flex;gap:4px}', 
                    '.nav-inner{max-width:1100px;margin:0 auto;display:flex;justify-content:center;gap:4px}');
} else if (css.includes('.nav-inner')) {
  // If slightly different
  css = css.replace(/.nav-inner\{.*?\}/, '.nav-inner{max-width:1100px;margin:0 auto;display:flex;justify-content:center;gap:4px}');
}
fs.writeFileSync('style.css', css, 'utf-8');

// --- HTML Updates ---
let html = fs.readFileSync('index.html', 'utf-8');

// Add buttons to Dropdown
const dropdownMenu = `<div class="dropdown-content" id="moreDropdown">
        <button class="nav-btn" onclick="showSection('reflection')">&#129694; Weekly Reflection</button>
        <button class="nav-btn" onclick="showSection('entries')">&#128450; Past Entries</button>
        <button class="nav-btn" onclick="showSection('grammar')">&#9999;&#65039; Grammar Tips</button>`;

const newDropdownMenu = `<div class="dropdown-content" id="moreDropdown">
        <button class="nav-btn" onclick="showSection('reflection')">&#129694; Weekly Reflection</button>
        <button class="nav-btn" onclick="showSection('entries')">&#128450; Past Entries</button>
        <button class="nav-btn" onclick="showSection('grammar')">&#9999;&#65039; Grammar Tips</button>
        <button class="nav-btn" onclick="showSection('sentencebuilder')">&#127959;&#65039; Sentence Builder</button>
        <button class="nav-btn" onclick="showSection('srs')">&#128259; SRS Review</button>
        <button class="nav-btn" onclick="showSection('dictation')">&#127911; Dictation</button>`;

html = html.replace(dropdownMenu, newDropdownMenu);

// Add Sections back
const sectionsToAdd = `
<!-- RESTORED SECTIONS -->
<div id="section-sentencebuilder" class="section">
  <div class="card">
    <div class="card-title">&#127959;&#65039; Sentence Builder</div>
    <div class="card-sub">Practice forming sentences manually.</div>
    <div class="field"><input id="sbSub" placeholder="Subject (e.g. Ich)"></div>
    <div class="field"><input id="sbVerb" placeholder="Verb (e.g. lerne)"></div>
    <div class="field"><input id="sbObj" placeholder="Object (e.g. Deutsch)"></div>
    <button class="btn btn-primary" onclick="buildSentence()">Build Sentence</button>
    <div id="sbResult" style="margin-top:14px; font-size:1.2rem; font-weight:700; color:var(--accent)"></div>
  </div>
</div>

<div id="section-srs" class="section">
  <div class="card">
    <div class="card-title">&#128259; SRS Due Today</div>
    <div class="card-sub">Words scheduled for review today.</div>
    <div id="srsDueList"></div>
  </div>
</div>

<div id="section-dictation" class="section">
  <div class="card">
    <div class="card-title">&#127911; Dictation Quiz</div>
    <div class="card-sub">Listen to the word and type it correctly.</div>
    <div style="margin-bottom:12px">
      <button class="btn btn-outline" onclick="startDictation()">?? Listen to Word</button>
    </div>
    <div class="field">
      <input id="dictationAnswer" placeholder="Type what you hear...">
    </div>
    <button class="btn btn-success" onclick="checkDictation()">Check Answer</button>
    <div id="dictationResult" style="margin-top:14px; font-weight:bold"></div>
  </div>
</div>
`;

if(!html.includes('id="section-sentencebuilder"')) {
  html = html.replace('</main>', sectionsToAdd + '\n</main>');
}

fs.writeFileSync('index.html', html, 'utf-8');

// --- JS Updates ---
let js = fs.readFileSync('script.js', 'utf-8');

const jsToAdd = `
// --- RESTORED TAB LOGIC ---
function buildSentence() {
  const sub = document.getElementById('sbSub').value.trim();
  const verb = document.getElementById('sbVerb').value.trim();
  const obj = document.getElementById('sbObj').value.trim();
  document.getElementById('sbResult').innerText = sub + ' ' + verb + ' ' + obj + '.';
}

let currentDictationWord = '';
function startDictation() {
  if (vocab.length === 0) { showToast('Add vocab first!'); return; }
  currentDictationWord = vocab[Math.floor(Math.random() * vocab.length)].de;
  speakWord(currentDictationWord);
  document.getElementById('dictationResult').innerText = '';
  document.getElementById('dictationAnswer').value = '';
}

function checkDictation() {
  const ans = document.getElementById('dictationAnswer').value.trim().toLowerCase();
  if (!ans) return;
  if (ans === currentDictationWord.toLowerCase()) {
    document.getElementById('dictationResult').innerHTML = '? Correct! <span style="color:var(--text-muted)">(' + currentDictationWord + ')</span>';
  } else {
    document.getElementById('dictationResult').innerHTML = '? Incorrect. The word was: <span style="color:var(--danger)">' + currentDictationWord + '</span>';
  }
}

function renderSrsDue() {
  const list = document.getElementById('srsDueList');
  if(!list) return;
  const today = todayStr();
  const due = vocab.filter(v => !v.dueDate || v.dueDate <= today);
  if (due.length === 0) {
    list.innerHTML = '<div style="color:var(--success)">?? No words due today!</div>';
  } else {
    list.innerHTML = '<div style="margin-bottom:10px">You have ' + due.length + ' words to review.</div>' +
      due.map(v => '<div style="padding:8px; border:1px solid var(--border); border-radius:8px; margin-bottom:4px; display:flex; justify-content:space-between"><span>' + v.de + '</span><span style="color:var(--text-muted)">' + v.en + '</span></div>').join('');
  }
}

// Hook into showSection to render SRS
const oldShowSectionNav = showSection;
showSection = function(id) {
  oldShowSectionNav(id);
  if (id === 'srs') renderSrsDue();
};
`;

if(!js.includes('function buildSentence()')) {
  js += '\n' + jsToAdd;
  fs.writeFileSync('script.js', js, 'utf-8');
}

console.log('Restored elements and centered navbar!');
