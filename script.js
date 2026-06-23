
// ─── DATA ─────────────────────────────────────────────────────────────────────
const GRAMMAR_TIPS = [
  { rule: "Articles: der / die / das", example: "der Mann (the man), die Frau (the woman), das Kind (the child)" },
  { rule: "Verb conjugation: sein (to be)", example: "Ich bin, Du bist, Er/Sie ist, Wir sind, Sie sind" },
  { rule: "Present tense: regular verbs", example: "lernen → ich lerne, du lernst, er lernt (I learn, you learn, he learns)" },
  { rule: "Negation with 'nicht'", example: "Ich arbeite nicht. (I don't work.) Sie kommt nicht. (She doesn't come.)" },
  { rule: "Perfect tense with 'haben'", example: "Ich habe gelernt. (I have learned.) Er hat gearbeitet. (He has worked.)" },
  { rule: "Perfect tense with 'sein'", example: "Ich bin gegangen. (I have gone.) Sie ist gefahren. (She has driven.)" },
  { rule: "Modal verbs: können / müssen / wollen", example: "Ich kann Deutsch sprechen. (I can speak German.)" },
  { rule: "Future tense with 'werden'", example: "Ich werde morgen lernen. (I will learn tomorrow.)" },
  { rule: "Accusative case: den/einen", example: "Ich sehe den Mann. (I see the man.) — Mann becomes den in accusative." },
  { rule: "Dative case: dem/einem", example: "Ich helfe dem Mann. (I help the man.) — Mann takes dem in dative." },
  { rule: "Word order: verb always second", example: "Heute lerne ich Deutsch. (Today I learn German.) — verb stays 2nd." },
  { rule: "Separable verbs: anfangen, aufhören", example: "Ich fange an. (I begin.) Er hört auf. (He stops.)" },
  { rule: "Conjunction: weil (because) — verb last", example: "Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte." },
  { rule: "Possessive pronouns: mein/meine", example: "mein Laptop (my laptop), meine Arbeit (my work)" },
  { rule: "Comparative: schneller, besser", example: "Ich spreche schneller als vorher. (I speak faster than before.)" },
  { rule: "Reflexive verbs: sich freuen, sich vorstellen", example: "Ich freue mich. (I am happy.) Ich stelle mich vor. (I introduce myself.)" },
  { rule: "Subordinate clauses with 'dass'", example: "Ich weiß, dass du Deutsch lernst. (I know that you learn German.)" },
  { rule: "Passive voice: werden + Partizip II", example: "Die App wird entwickelt. (The app is being developed.)" },
  { rule: "Konjunktiv II: würde + Infinitiv", example: "Ich würde gerne in Deutschland arbeiten. (I would like to work in Germany.)" },
  { rule: "Two-way prepositions: in, auf, an, etc.", example: "in + Dative (location): Ich bin in der Schule. / in + Accusative (movement): Ich gehe in die Schule." }
];

const SPEAKING_TOPICS = [
  { title: "Mein Beruf (My Job)", icon: "💼", hints: ["Ich bin Softwareentwickler", "Ich arbeite mit Java", "Meine Aufgaben sind...", "Ich arbeite von zu Hause"] },
  { title: "Mein Alltag (My Daily Routine)", icon: "🌅", hints: ["Ich stehe um ... Uhr auf", "Ich frühstücke um...", "Am Abend lerne ich..."] },
  { title: "Warum Deutschland? (Why Germany?)", icon: "🇩🇪", hints: ["Ich möchte in Deutschland arbeiten, weil...", "Die Technologiebranche in Deutschland...", "Mein Ziel ist..."] },
  { title: "Meine Familie (My Family)", icon: "👨‍👩‍👧", hints: ["Ich habe...", "Meine Mutter ist...", "Wir wohnen in..."] },
  { title: "Meine Hobbys (My Hobbies)", icon: "🎮", hints: ["In meiner Freizeit...", "Ich lese gerne...", "Ich lerne gerne..."] },
  { title: "Technologie (Technology)", icon: "💻", hints: ["Ich arbeite mit Spring Boot", "Docker hilft bei der Bereitstellung", "Kubernetes orchestriert Container"] },
];

const STARTER_PHRASES = [
  "Heute habe ich ", "Ich habe gelernt, dass ", "Ich bin müde, aber ", "Morgen werde ich ",
  "Ich arbeite an ", "Es war interessant, weil ", "Ich bin froh, dass ", "Ich habe Probleme mit "
];

// ─── STORAGE ──────────────────────────────────────────────────────────────────
function load(key, def) { try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch { return def; } }
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

let diaryEntries = load('dt_entries', []);
let vocab = load('dt_vocab', []);
let speakNotesList = load('dt_speak', []);

// ─── UTILITIES ────────────────────────────────────────────────────────────────
function todayStr() { return new Date().toISOString().split('T')[0]; }
function formatDate(d) { return new Date(d).toLocaleDateString('en-GB', { weekday:'long', year:'numeric', month:'long', day:'numeric' }); }
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('section-' + id).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => {
    if (b.getAttribute('onclick') && b.getAttribute('onclick').includes("'" + id + "'")) {
      b.classList.add('active');
    }
  });
  if (id === 'entries') renderEntries();
  if (id === 'vocab') { renderVocab('All'); document.querySelectorAll('.tab')[0]?.classList.add('active'); }
  if (id === 'grammar') renderGrammar();
  if (id === 'speaking') renderSpeaking();
  if (id === 'reflection') renderReflections();
  if (id === 'quiz') quitQuiz();
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function calcStreak() {
  const dates = [...new Set(diaryEntries.map(e => e.date))].sort();
  if (!dates.length) return 0;
  let streak = 0, day = new Date(todayStr());
  for (let i = dates.length - 1; i >= 0; i--) {
    const d = new Date(dates[i]);
    const diff = Math.round((day - d) / 86400000);
    if (diff === 0 || diff === 1) { streak++; day = d; } else break;
  }
  return streak;
}

function getLevel(entries, words) {
  const score = entries * 5 + words;
  if (score >= 600) return { label: "B2 🎉", pct: 100, class: "badge-b2" };
  if (score >= 350) return { label: "B1 ⭐", pct: 75 + Math.round((score-350)/10), class: "badge-b1" };
  if (score >= 150) return { label: "A2", pct: 40 + Math.round((score-150)/4.25), class: "badge-a2" };
  if (score >= 50)  return { label: "A1", pct: 10 + Math.round((score-50)/2), class: "badge-a1" };
  return { label: "Starter", pct: Math.round(score/5*10), class: "badge-a1" };
}

function renderDashboard() {
  const streak = calcStreak();
  document.getElementById('statEntries').textContent = diaryEntries.length;
  document.getElementById('statWords').textContent = vocab.length;
  document.getElementById('statStreak').textContent = streak;
  document.getElementById('streakBadge').textContent = `🔥 ${streak} Day Streak`;
  document.getElementById('todayDate').textContent = formatDate(todayStr());

  const lv = getLevel(diaryEntries.length, vocab.length);
  document.getElementById('currentLevel').textContent = lv.label;
  document.getElementById('currentLevel').className = 'level-badge ' + lv.class;
  document.getElementById('progressBar').style.width = Math.min(lv.pct, 100) + '%';

  const needed = 50 - (diaryEntries.length * 5 + vocab.length);
  document.getElementById('progressHint').textContent =
    needed > 0 ? `Add ${Math.ceil(needed/5)} entries or ${needed} vocab words to reach A1!`
               : `Great progress! Keep going daily 💪`;

  // Grammar tip
  const tip = GRAMMAR_TIPS[new Date().getDate() % GRAMMAR_TIPS.length];
  document.getElementById('dashTipRule').textContent = tip.rule;
  document.getElementById('dashTipExample').textContent = tip.example;

  // Roadmap
  renderRoadmap();

  // Heatmap
  renderHeatmap();
}

// ─── LEVEL ROADMAP ────────────────────────────────────────────────────────────
const LEVELS = [
  { id:'A1', label:'A1', sub:'~6 months', badge:'badge-a1' },
  { id:'A2', label:'A2', sub:'~12 months', badge:'badge-a2' },
  { id:'B1', label:'B1', sub:'~18 months', badge:'badge-b1' },
  { id:'B2', label:'B2', sub:'~24 months', badge:'badge-b2' },
];

function renderRoadmap() {
  const done = load('dt_roadmap', {});
  const el = document.getElementById('roadmap');
  el.innerHTML = LEVELS.map(lv => `
    <div class="roadmap-item ${done[lv.id] ? 'done' : ''}" onclick="toggleLevel('${lv.id}')">
      <div class="roadmap-check">${done[lv.id] ? '✓' : ''}</div>
      <div>
        <div class="roadmap-label">${lv.label}</div>
        <div class="roadmap-sub">${lv.sub}</div>
      </div>
    </div>
  `).join('');
}

function toggleLevel(id) {
  const done = load('dt_roadmap', {});
  done[id] = !done[id];
  save('dt_roadmap', done);
  renderRoadmap();
  showToast(done[id] ? `🎉 ${id} marked complete! Glückwunsch!` : `${id} unmarked.`);
}

function renderHeatmap() {
  const hm = document.getElementById('heatmap');
  hm.innerHTML = '';
  const dates = new Set(diaryEntries.map(e => e.date));
  const today = new Date();
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const ds = d.toISOString().split('T')[0];
    const count = diaryEntries.filter(e => e.date === ds).length;
    const cell = document.createElement('div');
    cell.className = 'heat-cell' + (count >= 3 ? ' heat-3' : count === 2 ? ' heat-2' : count === 1 ? ' heat-1' : '');
    cell.title = ds + (count ? ` (${count} entries)` : '');
    hm.appendChild(cell);
  }
}

// ─── DIARY ────────────────────────────────────────────────────────────────────
function initDiary() {
  document.getElementById('diaryDate').textContent = '— ' + formatDate(todayStr());

  // Phrases
  const pl = document.getElementById('phraseList');
  pl.innerHTML = '';
  STARTER_PHRASES.forEach(p => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-outline btn-sm';
    btn.textContent = p;
    btn.onclick = () => { navigator.clipboard?.writeText(p); showToast(`Copied: "${p}"`); };
    pl.appendChild(btn);
  });

  // Word count listeners
  ['prompt1','prompt2','prompt3'].forEach((id,i) => {
    const el = document.getElementById(id);
    const wc = document.getElementById('wc'+(i+1));
    el.addEventListener('input', () => {
      const words = el.value.trim().split(/\s+/).filter(Boolean).length;
      wc.textContent = words + ' words';
    });
  });
}

function saveDiaryEntry() {
  const p1 = document.getElementById('prompt1').value.trim();
  const p2 = document.getElementById('prompt2').value.trim();
  const p3 = document.getElementById('prompt3').value.trim();
  const p4 = document.getElementById('prompt4').value.trim();
  if (!p1 && !p2 && !p3) { showToast('⚠️ Please fill at least one prompt!'); return; }
  const entry = { date: todayStr(), ts: Date.now(), p1, p2, p3, p4 };
  diaryEntries.unshift(entry);
  save('dt_entries', diaryEntries);
  clearDiary();
  renderDashboard();
  showToast('✅ Diary entry saved! Gut gemacht!');
}

function clearDiary() {
  ['prompt1','prompt2','prompt3','prompt4'].forEach(id => document.getElementById(id).value = '');
  ['wc1','wc2','wc3'].forEach(id => document.getElementById(id).textContent = '0 words');
}

// ─── PAST ENTRIES ─────────────────────────────────────────────────────────────
function renderEntries() {
  const el = document.getElementById('entriesList');
  if (!diaryEntries.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">📓</div><div>No entries yet. Write your first diary entry!</div></div>';
    return;
  }
  el.innerHTML = diaryEntries.map((e, i) => `
    <div class="entry-card">
      <div class="entry-date"><span>📅 ${formatDate(e.date)}</span></div>
      ${e.p1 ? `<div class="entry-block"><div class="entry-block-label">Was habe ich gemacht?</div><div class="entry-text">${escHtml(e.p1)}</div></div>` : ''}
      ${e.p2 ? `<div class="entry-block"><div class="entry-block-label">Was habe ich gelernt?</div><div class="entry-text">${escHtml(e.p2)}</div></div>` : ''}
      ${e.p3 ? `<div class="entry-block"><div class="entry-block-label">Was werde ich morgen machen?</div><div class="entry-text">${escHtml(e.p3)}</div></div>` : ''}
      ${e.p4 ? `<div class="entry-block"><div class="entry-block-label">Freitext</div><div class="entry-text">${escHtml(e.p4)}</div></div>` : ''}
      <div class="entry-actions"><button class="btn btn-danger btn-sm" onclick="deleteEntry(${i})">🗑 Delete</button></div>
    </div>
  `).join('');
}

function deleteEntry(i) {
  if (!confirm('Delete this entry?')) return;
  diaryEntries.splice(i, 1);
  save('dt_entries', diaryEntries);
  renderEntries(); renderDashboard();
  showToast('Entry deleted.');
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
}

// ─── VOCABULARY ───────────────────────────────────────────────────────────────
let currentFilter = 'All';
let flashIndex = 0;

function addVocab() {
  const de = document.getElementById('vocabDe').value.trim();
  const en = document.getElementById('vocabEn').value.trim();
  const cat = document.getElementById('vocabCat').value;
  if (!de || !en) { showToast('⚠️ Enter both German and English!'); return; }
  vocab.unshift({ de, en, cat, date: todayStr() });
  save('dt_vocab', vocab);
  document.getElementById('vocabDe').value = '';
  document.getElementById('vocabEn').value = '';
  updateTodayWordCount();
  renderVocab(currentFilter);
  updateFlashcard();
  renderDashboard();
  showToast(`✅ Added: ${de} = ${en}`);
}

function updateTodayWordCount() {
  const count = vocab.filter(v => v.date === todayStr()).length;
  document.getElementById('todayWordCount').textContent = count;
}

function renderVocab(filter) {
  currentFilter = filter;
  const list = filter === 'All' ? vocab : vocab.filter(v => v.cat === filter);
  document.getElementById('vocabCount').textContent = `(${list.length} words)`;
  const el = document.getElementById('vocabList');
  if (!list.length) {
    el.innerHTML = '<li style="text-align:center;padding:24px;color:var(--text-muted)">No words in this category yet.</li>';
    return;
  }
  el.innerHTML = list.map((v, i) => `
    <li class="vocab-item">
      <div>
        <span class="vocab-de ${getNounClass(v.de)}">${escHtml(v.de)}</span>
        <button onclick="speakWord('${v.de.replace(/'/g,"\\'")}')" style="background:none;border:none;cursor:pointer;font-size:1rem;margin-left:4px">🔊</button>
        <span class="vocab-cat">${v.cat}</span>
        <br><span class="vocab-en">${escHtml(v.en)}</span>
      </div>
      <button class="delete-btn" onclick="deleteVocab('${v.de.replace(/'/g,"\\'")}')">✕</button>
    </li>
  `).join('');
  updateTodayWordCount();
}

function deleteVocab(de) {
  vocab = vocab.filter(v => v.de !== de);
  save('dt_vocab', vocab);
  renderVocab(currentFilter);
  renderDashboard();
  showToast('Word removed.');
}

function getNounClass(word) {
  const w = word.toLowerCase();
  if(w.startsWith('der ')) return 'noun-der';
  if(w.startsWith('die ')) return 'noun-die';
  if(w.startsWith('das ')) return 'noun-das';
  return '';
}

function importItVocab() {
  const itWords = [
    { de: "die Anwendung", en: "application", cat: "Work", date: todayStr() },
    { de: "die Schnittstelle", en: "interface / API", cat: "Java", date: todayStr() },
    { de: "die Datenbank", en: "database", cat: "Database", date: todayStr() },
    { de: "die Cloud", en: "cloud", cat: "Cloud", date: todayStr() },
    { de: "die Infrastruktur", en: "infrastructure", cat: "Cloud", date: todayStr() },
    { de: "die Bereitstellung", en: "deployment", cat: "Kubernetes", date: todayStr() },
    { de: "die Erfahrung", en: "experience", cat: "Work", date: todayStr() },
    { de: "das Projekt", en: "project", cat: "Work", date: todayStr() },
    { de: "die Entwicklung", en: "development", cat: "Work", date: todayStr() },
    { de: "der Entwickler", en: "developer", cat: "Work", date: todayStr() },
    { de: "der Fehler", en: "bug / error", cat: "Java", date: todayStr() },
    { de: "die Anforderung", en: "requirement", cat: "Work", date: todayStr() },
    { de: "die Sicherheit", en: "security", cat: "Cloud", date: todayStr() },
    { de: "die Skalierbarkeit", en: "scalability", cat: "Cloud", date: todayStr() },
    { de: "das Vorstellungsgespräch", en: "job interview", cat: "Work", date: todayStr() }
  ];
  let imported = 0;
  itWords.forEach(w => {
    if (!vocab.some(v => v.de.toLowerCase() === w.de.toLowerCase())) { vocab.unshift(w); imported++; }
  });
  if (imported > 0) { 
    save('dt_vocab', vocab); 
    showToast('✅ ' + imported + ' IT words imported!'); 
    renderVocab(currentFilter); 
    updateTodayWordCount(); 
    renderDashboard(); 
  } else { 
    showToast('⚠️ Words are already in your list!'); 
  }
}

function filterVocab(filter, el) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderVocab(filter);
}

function updateFlashcard() {
  if (!vocab.length) { document.getElementById('flashFront').textContent = '—'; document.getElementById('flashBack').textContent = 'Add some words first!'; return; }
  flashIndex = Math.floor(Math.random() * vocab.length);
  document.getElementById('flashFront').textContent = vocab[flashIndex].de;
  document.getElementById('flashBack').textContent = '';
}

function revealFlash() {
  if (!vocab.length) return;
  document.getElementById('flashBack').textContent = vocab[flashIndex]?.en ?? '';
}

function nextFlash() { updateFlashcard(); }

// ─── SPEAKING ─────────────────────────────────────────────────────────────────
function renderSpeaking() {
  let dynamicHtml = '';
  if (vocab.length >= 4) {
    const randomWords = [...vocab].sort(()=>0.5-Math.random()).slice(0, 4).map(v => v.de);
    dynamicHtml = `
      <div class="speaking-topic" style="border-color:var(--accent);background:linear-gradient(135deg,rgba(91,141,238,0.1),transparent)">
        <div class="topic-title">✨ Dynamic Story (Auto-Updated)</div>
        <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:6px">Try to talk for 1 minute using these 4 random words from your list:</div>
        <ul class="topic-hints">${randomWords.map(h => `<li>${escHtml(h)}</li>`).join('')}</ul>
      </div>
    `;
  } else {
    dynamicHtml = `
      <div class="speaking-topic" style="border-color:var(--accent);background:linear-gradient(135deg,rgba(91,141,238,0.1),transparent)">
        <div class="topic-title">✨ Dynamic Story (Auto-Updated)</div>
        <div style="font-size:0.8rem;color:var(--text-muted)">Add at least 4 vocabulary words to unlock the dynamic story generator!</div>
      </div>
    `;
  }

  document.getElementById('speakingTopics').innerHTML = dynamicHtml + SPEAKING_TOPICS.map(t => `
    <div class="speaking-topic">
      <div class="topic-title">${t.icon} ${t.title}</div>
      <ul class="topic-hints">${t.hints.map(h => `<li>${escHtml(h)}</li>`).join('')}</ul>
    </div>
  `).join('');

  const notes = load('dt_speak', []);
  const el = document.getElementById('savedSpeakNotes');
  if (notes.length) {
    el.innerHTML = '<div style="font-size:.85rem;color:var(--text-muted);margin-bottom:8px">📋 Saved Notes</div>' +
      notes.map(n => `<div class="entry-card"><div class="entry-date"><span>📅 ${formatDate(n.date)}</span></div><div class="entry-text">${escHtml(n.text)}</div></div>`).join('');
  }
}

function saveSpeakNotes() {
  const text = document.getElementById('speakNotes').value.trim();
  if (!text) { showToast('⚠️ Write your notes first!'); return; }
  speakNotesList.unshift({ date: todayStr(), text });
  save('dt_speak', speakNotesList);
  document.getElementById('speakNotes').value = '';
  renderSpeaking();
  showToast('✅ Speaking notes saved!');
}

// ─── WEEKLY REFLECTION ────────────────────────────────────────────────────────
let reflections = load('dt_reflect', []);

function saveReflection() {
  const r1 = document.getElementById('ref1').value.trim();
  const r2 = document.getElementById('ref2').value.trim();
  const r3 = document.getElementById('ref3').value.trim();
  if (!r1 && !r2 && !r3) { showToast('⚠️ Fill at least one reflection prompt!'); return; }
  const weekLabel = getWeekLabel();
  reflections.unshift({ date: todayStr(), week: weekLabel, r1, r2, r3 });
  save('dt_reflect', reflections);
  document.getElementById('ref1').value = '';
  document.getElementById('ref2').value = '';
  document.getElementById('ref3').value = '';
  renderReflections();
  showToast('✅ Reflection saved! Sehr gut!');
}

function getWeekLabel() {
  const d = new Date();
  const start = new Date(d); start.setDate(d.getDate() - d.getDay() + 1);
  const end = new Date(start); end.setDate(start.getDate() + 6);
  const fmt = dt => dt.toLocaleDateString('en-GB', { day:'numeric', month:'short' });
  return `Week of ${fmt(start)} – ${fmt(end)}`;
}

function renderReflections() {
  const el = document.getElementById('reflectionList');
  if (!reflections.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">🪞</div><div>No reflections yet. Do your first one this Sunday!</div></div>';
    return;
  }
  el.innerHTML = reflections.map((r, i) => `
    <div class="reflect-entry">
      <div class="reflect-week">📅 ${r.week || formatDate(r.date)}</div>
      ${r.r1 ? `<div class="reflect-block"><div class="reflect-block-label">Was hat sich verbessert?</div><div class="reflect-text">${escHtml(r.r1)}</div></div>` : ''}
      ${r.r2 ? `<div class="reflect-block"><div class="reflect-block-label">Was war schwierig?</div><div class="reflect-text">${escHtml(r.r2)}</div></div>` : ''}
      ${r.r3 ? `<div class="reflect-block"><div class="reflect-block-label">Ziel für nächste Woche</div><div class="reflect-text">${escHtml(r.r3)}</div></div>` : ''}
      <button class="btn btn-danger btn-sm" style="margin-top:10px" onclick="deleteReflection(${i})">🗑 Delete</button>
    </div>
  `).join('');
}

function deleteReflection(i) {
  if (!confirm('Delete this reflection?')) return;
  reflections.splice(i, 1);
  save('dt_reflect', reflections);
  renderReflections();
  showToast('Reflection deleted.');
}

// ─── GRAMMAR ──────────────────────────────────────────────────────────────────
function renderGrammar() {
  document.getElementById('allTips').innerHTML = GRAMMAR_TIPS.map((t,i) => `
    <div class="tip-card" style="margin-bottom:14px">
      <div class="tip-num">Tip ${i+1}</div>
      <div class="tip-rule">${t.rule}</div>
      <div class="tip-example">${escHtml(t.example)}</div>
    </div>
  `).join('');
}

// ─── QUIZ ─────────────────────────────────────────────────────────────────────
const QUIZ_BANKS = {
  article: [
    { q: "___ Mann", options: ["der", "die", "das"], a: "der" },
    { q: "___ Frau", options: ["der", "die", "das"], a: "die" },
    { q: "___ Kind", options: ["der", "die", "das"], a: "das" },
    { q: "___ Auto", options: ["der", "die", "das"], a: "das" },
    { q: "___ Hund", options: ["der", "die", "das"], a: "der" },
    { q: "___ Katze", options: ["der", "die", "das"], a: "die" },
    { q: "___ Haus", options: ["der", "die", "das"], a: "das" },
    { q: "___ Apfel", options: ["der", "die", "das"], a: "der" },
    { q: "___ Sonne", options: ["der", "die", "das"], a: "die" },
    { q: "___ Buch", options: ["der", "die", "das"], a: "das" },
    { q: "___ Computer", options: ["der", "die", "das"], a: "der" },
    { q: "___ Datenbank", options: ["der", "die", "das"], a: "die" }
  ],
  sentence: [
    { q: "ich / Java / lerne", options: ["Ich lerne Java.", "Java ich lerne.", "Ich Java lerne.", "Lerne ich Java."], a: "Ich lerne Java." },
    { q: "Entwickler / bin / ich", options: ["Ich bin Entwickler.", "Entwickler ich bin.", "Bin ich Entwickler.", "Ich Entwickler bin."], a: "Ich bin Entwickler." },
    { q: "müde / bin / ich", options: ["Ich bin müde.", "Müde ich bin.", "Bin müde ich.", "Ich müde bin."], a: "Ich bin müde." },
    { q: "wohnen / in / Berlin / wir", options: ["Wir wohnen in Berlin.", "In Berlin wir wohnen.", "Wohnen in Berlin wir.", "Wir in Berlin wohnen."], a: "Wir wohnen in Berlin." },
    { q: "nicht / gut / schlafe / ich", options: ["Ich schlafe nicht gut.", "Ich nicht schlafe gut.", "Gut ich schlafe nicht.", "Schlafe ich nicht gut."], a: "Ich schlafe nicht gut." },
    { q: "arbeiten / heute / wir", options: ["Wir arbeiten heute.", "Heute wir arbeiten.", "Wir heute arbeiten.", "Arbeiten wir heute."], a: "Wir arbeiten heute." }
  ]
};

let quizState = { questions: [], idx: 0, score: 0 };

function startQuiz(type) {
  let questions = [];
  if (type === 'vocab' || type === 'weekly') {
    let source = vocab;
    if (type === 'weekly') {
      const wkTs = Date.now() - 7*86400000;
      source = vocab.filter(v => new Date(v.date).getTime() > wkTs);
      if (source.length < 4) source = vocab; // fallback if list too short
    }
    if (source.length < 4) {
      showToast('⚠️ You need at least 4 vocabulary words to play this quiz!');
      return;
    }
    source = [...source].sort(()=>0.5-Math.random());
    const subset = source.slice(0, 10);
    questions = subset.map(v => {
      const isDeToEn = Math.random() > 0.5;
      const q = isDeToEn ? v.de + " = ?" : v.en + " = ?";
      const a = isDeToEn ? v.en : v.de;
      
      const distractors = [...vocab]
        .filter(x => x.de !== v.de)
        .sort(()=>0.5-Math.random())
        .slice(0, 3)
        .map(x => isDeToEn ? x.en : x.de);
      
      const opts = [a, ...distractors].sort(()=>0.5-Math.random());
      return { q, options: opts, a };
    });
  } else {
    questions = [...QUIZ_BANKS[type]].sort(()=>0.5-Math.random()).slice(0, 10);
  }

  quizState = { questions, idx: 0, score: 0 };
  document.getElementById('quizMenu').style.display = 'none';
  document.getElementById('quizResult').style.display = 'none';
  document.getElementById('quizActive').style.display = 'block';
  
  const labels = { vocab: 'Vocabulary Quiz', article: 'Article Quiz', sentence: 'Sentence Order', weekly: 'Weekly Review' };
  document.getElementById('quizTypeLabel').textContent = labels[type];
  
  renderQuestion();
}

function renderQuestion() {
  const c = quizState;
  const q = c.questions[c.idx];
  document.getElementById('quizProgress').textContent = `${c.idx + 1} / ${c.questions.length}`;
  document.getElementById('quizQuestion').textContent = q.q;
  
  const optsEl = document.getElementById('quizOptions');
  optsEl.innerHTML = q.options.map((opt) => `
    <button class="quiz-opt" onclick="selectAnswer('${opt.replace(/'/g,"\\'")}', this)">${escHtml(opt)}</button>
  `).join('');
  document.getElementById('quizNextBtn').style.display = 'none';
}

function selectAnswer(ans, btn) {
  if (document.querySelector('.quiz-opt.correct') || document.querySelector('.quiz-opt.wrong')) return;
  
  const c = quizState;
  const correctAns = c.questions[c.idx].a;
  
  document.querySelectorAll('.quiz-opt').forEach(b => {
    if (b.textContent === correctAns) b.classList.add('correct');
    else if (b === btn) b.classList.add('wrong');
    b.disabled = true;
  });
  
  if (ans === correctAns) {
    c.score++;
    showToast('✅ Richtig!');
  } else {
    showToast('❌ Falsch!');
  }
  
  document.getElementById('quizNextBtn').style.display = 'block';
}

function nextQuestion() {
  quizState.idx++;
  if (quizState.idx >= quizState.questions.length) {
    endQuiz();
  } else {
    renderQuestion();
  }
}

function endQuiz() {
  document.getElementById('quizActive').style.display = 'none';
  document.getElementById('quizResult').style.display = 'block';
  document.getElementById('quizScore').textContent = `${quizState.score} / ${quizState.questions.length}`;
}

function quitQuiz() {
  document.getElementById('quizActive').style.display = 'none';
  document.getElementById('quizResult').style.display = 'none';
  document.getElementById('quizMenu').style.display = 'block';
}

// ─── AUDIO & SPEECH (No Backend) ──────────────────────────────────────────────
function speakWord(word) {
  const synth = window.speechSynthesis;
  if (!synth) { showToast('⚠️ Your browser does not support text-to-speech.'); return; }
  const utterThis = new SpeechSynthesisUtterance(word);
  utterThis.lang = 'de-DE';
  synth.speak(utterThis);
}

function checkPronunciation() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) { showToast('⚠️ Browser unsupported. Use Google Chrome!'); return; }
  
  const target = document.getElementById('targetPronunciation').value.trim();
  if(!target) { showToast('⚠️ Type a word or sentence to practice first!'); return; }
  
  const recognition = new SpeechRecognition();
  recognition.lang = 'de-DE';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  
  const resEl = document.getElementById('pronunciationResult');
  resEl.textContent = 'Listening... Speak now!';
  resEl.style.color = 'var(--text)';
  
  recognition.start();
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if(transcript.toLowerCase() === target.toLowerCase()) {
      resEl.textContent = `✅ Perfect! You said: "${transcript}"`;
      resEl.style.color = 'var(--accent3)';
    } else {
      resEl.textContent = `❌ Heard: "${transcript}" (Try again!)`;
      resEl.style.color = 'var(--danger)';
    }
  };
  recognition.onerror = () => { resEl.textContent = '⚠️ Mic Error or No Speech Detected'; resEl.style.color = 'var(--danger)'; };
}

let mediaRecorder;
let audioChunks = [];
let audioDb = load('dt_audio', []);

function toggleRecording() {
  const btn = document.getElementById('btnRecord');
  const status = document.getElementById('recordingStatus');
  
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    btn.textContent = '🔴 Start Recording';
    btn.classList.replace('btn-outline', 'btn-danger');
    status.style.display = 'none';
    return;
  }

  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
    btn.textContent = '⏹ Stop Recording';
    btn.classList.replace('btn-danger', 'btn-outline');
    status.style.display = 'block';

    mediaRecorder.addEventListener("dataavailable", event => { audioChunks.push(event.data); });

    mediaRecorder.addEventListener("stop", () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = () => {
        const base64Audio = reader.result;
        audioDb.unshift({ date: todayStr(), id: Date.now(), base64: base64Audio });
        if(audioDb.length > 3) audioDb.pop(); // Keep max 3 locally to avoid blowing up Quota
        save('dt_audio', audioDb);
        audioChunks = [];
        renderAudio();
        showToast('🎙️ Audio saved safely in your browser!');
      };
      // Stop mic tracks
      stream.getTracks().forEach(track => track.stop());
    });
  }).catch(e => {
    showToast('⚠️ Microphone access denied or not available.');
  });
}

function renderAudio() {
  const el = document.getElementById('audioList');
  if(!el) return;
  if (!audioDb.length) { el.innerHTML='<div class="empty-state">No recordings yet. Do your first one!</div>'; return; }
  el.innerHTML = audioDb.map(a => `
    <div style="background:var(--surface2);padding:14px;border-radius:10px;border:1px solid var(--border)">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <span style="font-size:0.8rem;color:var(--text-muted);font-weight:600">📅 ${formatDate(a.date)}</span>
      </div>
      <audio controls src="${a.base64}" style="width:100%;height:40px"></audio>
      <button class="btn btn-outline btn-sm" onclick="deleteAudio(${a.id})" style="margin-top:10px;font-size:0.75rem">🗑 Delete</button>
    </div>
  `).join('');
}

function deleteAudio(id) {
  if(!confirm('Delete this recording?')) return;
  audioDb = audioDb.filter(a => a.id !== id);
  save('dt_audio', audioDb);
  renderAudio();
  showToast('Recording deleted.');
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderDashboard();
  initDiary();
  updateFlashcard();
  updateTodayWordCount();
  renderAudio();
});

// Added Features
let dictationWord='';
function buildSentence(){
 document.getElementById('sbResult').innerText=
 `${document.getElementById('sbSub').value} ${document.getElementById('sbVerb').value} ${document.getElementById('sbObj').value}.`;
}
function getSRS(){return JSON.parse(localStorage.getItem('dt_srs')||'[]');}
function saveSRS(v){localStorage.setItem('dt_srs',JSON.stringify(v));}
function renderSRS(){
 const due=getSRS();
 const el=document.getElementById('srsDue');
 if(el) el.innerHTML=due.map((w,i)=>`<div>${w.word||w.de}
 <button onclick="rateSRS(${i},1)">Again</button>
 <button onclick="rateSRS(${i},2)">Hard</button>
 <button onclick="rateSRS(${i},3)">Good</button>
 <button onclick="rateSRS(${i},4)">Easy</button></div>`).join('');
}
function rateSRS(i,r){
 let s=getSRS();
 if(!s[i]) return;
 s[i].review=r;
 saveSRS(s);
 renderSRS();
}
function startDictation(){
 const v=JSON.parse(localStorage.getItem('dt_vocab')||'[]');
 if(!v.length){alert('Add vocab first');return;}
 dictationWord=v[Math.floor(Math.random()*v.length)].de;
 speechSynthesis.speak(new SpeechSynthesisUtterance(dictationWord));
}
function checkDictation(){
 const a=document.getElementById('dictationAnswer').value.trim();
 document.getElementById('dictationResult').innerText=a.toLowerCase()==dictationWord.toLowerCase()?'Correct':'Wrong: '+dictationWord;
}
document.addEventListener('DOMContentLoaded',renderSRS);
