const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf-8');
let js = fs.readFileSync('script.js', 'utf-8');

// --- 1. CLEAN UP HTML ---
// Remove the ugly standalone sections
html = html.replace(/<div id="section-sentencebuilder"[\s\S]*?<\/div>\s*<\/div>/g, '');
html = html.replace(/<div id="section-srs"[\s\S]*?<\/div>\s*<\/div>/g, '');
html = html.replace(/<div id="section-dictation"[\s\S]*?<\/div>\s*<\/div>/g, '');

// --- 2. DASHBOARD: Add Word/Sentence of the Day ---
const dashStatsRegex = /<div class="grid-3" style="margin-bottom:20px">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
const newDashStats = `<div class="grid-3" style="margin-bottom:20px">
    <div class="stat-card">
      <div class="stat-num" id="statEntries" style="color:var(--accent)">0</div>
      <div class="stat-label">?? Total Diary Entries</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" id="statWords" style="color:var(--accent2)">0</div>
      <div class="stat-label">?? Words Learned</div>
    </div>
    <div class="stat-card">
      <div class="stat-num" id="statStreak" style="color:var(--gold)">0</div>
      <div class="stat-label">?? Day Streak</div>
    </div>
  </div>

  <div class="grid-2" style="margin-bottom:20px">
    <div class="card" style="margin-bottom:0;background:linear-gradient(135deg,rgba(91,141,238,0.1),transparent);border-color:var(--accent)">
      <div class="card-title">?? Word of the Day</div>
      <div style="font-size:1.8rem;font-weight:800;color:var(--accent);margin-top:10px" id="wotdDe">Laden...</div>
      <div style="font-size:1rem;color:var(--text-muted);margin-bottom:10px" id="wotdEn">Loading...</div>
      <button class="btn btn-outline btn-sm" onclick="speakWord(document.getElementById('wotdDe').innerText)">?? Listen</button>
    </div>
    <div class="card" style="margin-bottom:0;background:linear-gradient(135deg,rgba(167,139,250,0.1),transparent);border-color:var(--accent2)">
      <div class="card-title">?? Sentence of the Day</div>
      <div style="font-size:1.2rem;font-weight:700;color:var(--text);margin-top:10px" id="sotdDe">Laden...</div>
      <div style="font-size:0.9rem;color:var(--text-muted);margin-bottom:10px;margin-top:6px" id="sotdEn">Loading...</div>
      <button class="btn btn-outline btn-sm" onclick="speakWord(document.getElementById('sotdDe').innerText)">?? Listen</button>
    </div>
  </div>`;
if(!html.includes('Word of the Day')) {
  html = html.replace(dashStatsRegex, newDashStats);
}

// --- 3. DIARY: Add Daily Sentence Builder ---
const diaryRegex = /<div class="field">\s*<label>.*?Free Writing.*?<\/label>\s*<textarea id="prompt4"[\s\S]*?<\/textarea>\s*<\/div>/;
const newDiary = `<div class="prompt-box" style="border-color:var(--accent3);background:rgba(52,211,153,0.05)">
      <div class="prompt-label" style="color:var(--accent3)">?? Daily Sentence Builder</div>
      <div class="prompt-de">Build a sentence using: <span id="builderWord" style="font-weight:800;color:var(--accent3);font-size:1.1rem;text-decoration:underline">...</span></div>
      <div class="prompt-en">Practice your vocabulary!</div>
    </div>
    <div class="field">
      <textarea id="prompt4" rows="2" placeholder="Ich lerne..."></textarea>
    </div>
    
    <div class="field">
      <label>?? Free Writing (Optional)</label>
      <textarea id="prompt5" rows="3" placeholder="Ich bin sehr müde heute..."></textarea>
    </div>`;
if(!html.includes('Daily Sentence Builder')) {
  html = html.replace(diaryRegex, newDiary);
}

// --- 4. VOCAB: Add SRS Buttons to Flashcards ---
const flashcardRegex = /<button class="btn btn-primary btn-sm" onclick="nextFlash\(\)">.*?Next<\/button>/;
const newFlashcard = `<div id="srsButtons" style="display:none;width:100%;gap:10px;justify-content:center;margin-top:8px">
          <button class="btn btn-danger btn-sm" style="flex:1" onclick="submitSrs('hard')">Hard (1d)</button>
          <button class="btn btn-primary btn-sm" style="flex:1" onclick="submitSrs('good')">Good (3d)</button>
          <button class="btn btn-success btn-sm" style="flex:1" onclick="submitSrs('easy')">Easy (7d)</button>
        </div>
        <button id="nextFlashBtn" class="btn btn-primary btn-sm" onclick="nextFlash()" style="display:none">Skip ?</button>`;
if(!html.includes('srsButtons')) {
  html = html.replace(flashcardRegex, newFlashcard);
}

// --- 5. QUIZ: Add Dictation & Refine ---
const quizMenuRegex = /<div class="roadmap-item" style="display:block" onclick="startQuiz\('weekly'\)">[\s\S]*?<\/div>/;
const newQuizMenu = `<div class="roadmap-item" style="display:block" onclick="startQuiz('weekly')">
        <div class="roadmap-label">?? Weekly Review</div>
        <div class="roadmap-sub">Test words added in the last 7 days</div>
      </div>
      <div class="roadmap-item" style="display:block;border-color:var(--accent);background:rgba(91,141,238,0.1)" onclick="startQuiz('listening')">
        <div class="roadmap-label">?? Listening Quiz</div>
        <div class="roadmap-sub">Train your ear! Type or select what you hear</div>
      </div>`;
if(!html.includes('Listening Quiz')) {
  html = html.replace(quizMenuRegex, newQuizMenu);
}

fs.writeFileSync('index.html', html, 'utf-8');

// --- 6. JAVASCRIPT INJECTIONS ---

const newJsCode = `
// --- DAILY WORD & SENTENCE (OFFLINE DATABASE) ---
const DAILY_WORDS = [
  {de: "entwickeln", en: "to develop"}, {de: "die Herausforderung", en: "challenge"},
  {de: "erfolgreich", en: "successful"}, {de: "das Ziel", en: "goal"},
  {de: "verbessern", en: "to improve"}, {de: "die Entscheidung", en: "decision"},
  {de: "die Zukunft", en: "future"}, {de: "die Lösung", en: "solution"},
  {de: "die Erfahrung", en: "experience"}, {de: "versuchen", en: "to try"}
];
const DAILY_SENTENCES = [
  {de: "Ich versuche jeden Tag mein Deutsch zu verbessern.", en: "I try to improve my German every day."},
  {de: "Programmieren macht mir viel Spaß.", en: "Programming is a lot of fun for me."},
  {de: "Mein Ziel ist es, in Deutschland zu arbeiten.", en: "My goal is to work in Germany."},
  {de: "Aller Anfang ist schwer.", en: "Every beginning is difficult."},
  {de: "Übung macht den Meister.", en: "Practice makes perfect."}
];

function loadDailyInspiration() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const w = DAILY_WORDS[dayOfYear % DAILY_WORDS.length];
  const s = DAILY_SENTENCES[dayOfYear % DAILY_SENTENCES.length];
  
  const wdEl = document.getElementById('wotdDe');
  if(wdEl) { wdEl.innerText = w.de; document.getElementById('wotdEn').innerText = w.en; }
  const sdEl = document.getElementById('sotdDe');
  if(sdEl) { sdEl.innerText = s.de; document.getElementById('sotdEn').innerText = s.en; }
}

// --- SENTENCE BUILDER IN DIARY ---
function setupSentenceBuilder() {
  const wordEl = document.getElementById('builderWord');
  if(!wordEl) return;
  if(vocab.length > 0) {
    const randomVocab = vocab[Math.floor(Math.random() * vocab.length)];
    wordEl.innerText = randomVocab.de;
  } else {
    wordEl.innerText = "lernen"; // fallback
  }
}

// Override diary init
const oldInitDiary = initDiary;
initDiary = function() {
  oldInitDiary();
  setupSentenceBuilder();
};

// Override save diary
const oldSaveDiary = saveDiaryEntry;
saveDiaryEntry = function() {
  const p1 = document.getElementById('prompt1').value.trim();
  const p2 = document.getElementById('prompt2').value.trim();
  const p3 = document.getElementById('prompt3').value.trim();
  const p4 = document.getElementById('prompt4').value.trim(); // sentence builder
  const p5 = document.getElementById('prompt5')?.value.trim() || ''; // free writing
  
  if (!p1 && !p2 && !p3 && !p4) { showToast('?? Please fill at least one prompt!'); return; }
  const entry = { date: todayStr(), ts: Date.now(), p1, p2, p3, p4, p5 };
  diaryEntries.unshift(entry);
  save('dt_entries', diaryEntries);
  clearDiary();
  renderDashboard();
  setupSentenceBuilder();
  showToast('? Diary & Sentence saved!');
};

const oldClearDiary = clearDiary;
clearDiary = function() {
  oldClearDiary();
  if(document.getElementById('prompt4')) document.getElementById('prompt4').value = '';
  if(document.getElementById('prompt5')) document.getElementById('prompt5').value = '';
};

// --- SRS LOGIC ---
// Override reveal flash
const oldRevealFlash = revealFlash;
revealFlash = function() {
  if (!vocab.length) return;
  document.getElementById('flashBack').textContent = vocab[flashIndex]?.en ?? '';
  document.getElementById('srsButtons').style.display = 'flex';
  document.getElementById('nextFlashBtn').style.display = 'none';
};

function submitSrs(difficulty) {
  if(!vocab.length) return;
  let word = vocab[flashIndex];
  let days = 1;
  if(difficulty === 'good') days = 3;
  if(difficulty === 'easy') days = 7;
  
  let nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + days);
  word.dueDate = nextDate.toISOString().split('T')[0];
  
  save('dt_vocab', vocab);
  showToast('Next review: ' + days + ' days');
  nextFlash();
}

// Override next flash
const oldNextFlash = nextFlash;
nextFlash = function() {
  document.getElementById('srsButtons').style.display = 'none';
  document.getElementById('nextFlashBtn').style.display = 'inline-flex';
  
  // Prioritize due words
  const today = todayStr();
  let dueWords = vocab.filter(v => !v.dueDate || v.dueDate <= today);
  
  if(dueWords.length === 0) {
    document.getElementById('flashFront').textContent = '?? All caught up!';
    document.getElementById('flashBack').textContent = 'No words due today.';
    document.getElementById('nextFlashBtn').style.display = 'none';
    return;
  }
  
  flashIndex = vocab.indexOf(dueWords[Math.floor(Math.random() * dueWords.length)]);
  document.getElementById('flashFront').textContent = vocab[flashIndex].de;
  document.getElementById('flashBack').textContent = '';
};

// Hook initialization
document.addEventListener('DOMContentLoaded', () => {
  loadDailyInspiration();
  setTimeout(setupSentenceBuilder, 500); // ensure elements exist
});

`;

if(!js.includes('loadDailyInspiration')) {
  js += newJsCode;
  fs.writeFileSync('script.js', js, 'utf-8');
}

console.log("Patch 2 Complete!");
