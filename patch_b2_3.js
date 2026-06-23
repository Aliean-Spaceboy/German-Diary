const fs = require('fs');

// --- HTML PATCH ---
let html = fs.readFileSync('index.html', 'utf-8');

const navRegex = /<button class="nav-btn" onclick="showSection\('dictation'\)">.*?Dictation<\/button>/;
const readingNav = `<button class="nav-btn" onclick="showSection('dictation')">&#127911; Dictation</button>
        <button class="nav-btn" onclick="showSection('reading')">&#128214; Reading Practice</button>`;

if (!html.includes('showSection(\'reading\')')) {
  html = html.replace(navRegex, readingNav);
}

const readingSection = `
<div id="section-reading" class="section">
  <div class="card">
    <div class="card-title">&#128214; B2 Reading Practice (Leseverstehen)</div>
    <div class="card-sub">Read the text and answer the True/False questions.</div>
    
    <div style="margin-bottom: 20px; display:flex; gap:10px">
      <button class="btn btn-outline" onclick="loadStory(0)">Story 1</button>
      <button class="btn btn-outline" onclick="loadStory(1)">Story 2</button>
      <button class="btn btn-outline" onclick="loadStory(2)">Story 3</button>
    </div>

    <div id="readingContent" style="display:none; background:var(--surface2); padding:20px; border-radius:12px; margin-bottom:20px; font-size:1.1rem; line-height:1.6">
      <h3 id="storyTitle" style="margin-top:0; color:var(--accent)"></h3>
      <div id="storyText" style="color:var(--text)"></div>
    </div>

    <div id="readingQuestions" style="display:none">
      <h4 style="margin-bottom:10px">Fragen zum Text (Questions)</h4>
      <div id="q1Box" style="margin-bottom:14px; padding:12px; border:1px solid var(--border); border-radius:8px">
        <div id="q1Text" style="font-weight:600; margin-bottom:8px"></div>
        <button class="btn btn-outline btn-sm" onclick="checkReading(1, true)">Richtig (True)</button>
        <button class="btn btn-outline btn-sm" onclick="checkReading(1, false)">Falsch (False)</button>
        <span id="q1Res" style="margin-left:10px; font-weight:bold"></span>
      </div>
      <div id="q2Box" style="margin-bottom:14px; padding:12px; border:1px solid var(--border); border-radius:8px">
        <div id="q2Text" style="font-weight:600; margin-bottom:8px"></div>
        <button class="btn btn-outline btn-sm" onclick="checkReading(2, true)">Richtig (True)</button>
        <button class="btn btn-outline btn-sm" onclick="checkReading(2, false)">Falsch (False)</button>
        <span id="q2Res" style="margin-left:10px; font-weight:bold"></span>
      </div>
      <div id="q3Box" style="margin-bottom:14px; padding:12px; border:1px solid var(--border); border-radius:8px">
        <div id="q3Text" style="font-weight:600; margin-bottom:8px"></div>
        <button class="btn btn-outline btn-sm" onclick="checkReading(3, true)">Richtig (True)</button>
        <button class="btn btn-outline btn-sm" onclick="checkReading(3, false)">Falsch (False)</button>
        <span id="q3Res" style="margin-left:10px; font-weight:bold"></span>
      </div>
    </div>
  </div>
</div>
`;

if (!html.includes('section-reading')) {
  html = html.replace('<!-- RESTORED SECTIONS -->', '<!-- RESTORED SECTIONS -->\n' + readingSection);
  fs.writeFileSync('index.html', html, 'utf-8');
}

// --- JS PATCH ---
let js = fs.readFileSync('script.js', 'utf-8');

const readingJs = `
// --- READING COMPREHENSION ---
const STORIES = [
  {
    title: "Ein Tag im Leben eines Softwareentwicklers",
    text: "Hallo! Ich heiße Markus und arbeite als Backend-Entwickler in Berlin. Jeden Morgen fange ich um 9 Uhr an. Zuerst haben wir ein kurzes Daily-Standup-Meeting mit dem gesamten Team. Dort besprechen wir, was wir gestern gemacht haben und was heute auf dem Plan steht. Danach programmiere ich meistens in Java und Spring Boot. Gegen Mittag esse ich oft mit meinen Kollegen in der Kantine. Nachmittags kümmere ich mich um Fehlerbehebungen (Bugfixes) und Code-Reviews. Ich finde meinen Job sehr spannend, auch wenn es manchmal stressig sein kann, besonders kurz vor einem Release.",
    questions: [
      { text: "1. Markus arbeitet als Frontend-Entwickler.", answer: false },
      { text: "2. Das Team hat jeden Morgen ein kurzes Meeting.", answer: true },
      { text: "3. Markus arbeitet nie mit Java.", answer: false }
    ]
  },
  {
    title: "Eine E-Mail an den Projektmanager",
    text: "Sehr geehrter Herr Müller,<br><br>ich schreibe Ihnen wegen des neuen Projekts 'Cloud-Migration'. Wir haben gestern die erste Phase erfolgreich abgeschlossen. Die Datenbank ist jetzt auf den neuen AWS-Servern verfügbar. Leider gibt es noch ein kleines Problem mit der Sicherheitsschnittstelle. Wir brauchen voraussichtlich noch zwei weitere Tage, um diesen Fehler zu beheben. Können wir unser Meeting auf Donnerstag verschieben?<br><br>Mit freundlichen Grüßen,<br>Anna Schmidt",
    questions: [
      { text: "1. Das Projekt heißt 'Cloud-Migration'.", answer: true },
      { text: "2. Die erste Phase war nicht erfolgreich.", answer: false },
      { text: "3. Anna braucht mehr Zeit für die Sicherheitsschnittstelle.", answer: true }
    ]
  },
  {
    title: "Sicherheit im Internet",
    text: "Die Sicherheit im Internet wird immer wichtiger. Viele Unternehmen investieren Millionen in den Schutz ihrer Daten. Hacker versuchen täglich, an sensible Informationen wie Passwörter und Kreditkartendaten zu gelangen. Eine gute Maßnahme ist die Verwendung von Zwei-Faktor-Authentifizierung (2FA). Damit braucht der Benutzer nicht nur ein Passwort, sondern auch einen Code auf seinem Smartphone. Außerdem ist es wichtig, Software-Updates sofort zu installieren, da diese oft Sicherheitslücken schließen.",
    questions: [
      { text: "1. Datensicherheit kostet Unternehmen sehr viel Geld.", answer: true },
      { text: "2. Die Zwei-Faktor-Authentifizierung ist unsicher.", answer: false },
      { text: "3. Man sollte mit Software-Updates lange warten.", answer: false }
    ]
  }
];

let currentStory = null;

function loadStory(index) {
  currentStory = STORIES[index];
  document.getElementById('readingContent').style.display = 'block';
  document.getElementById('readingQuestions').style.display = 'block';
  
  document.getElementById('storyTitle').innerText = currentStory.title;
  document.getElementById('storyText').innerHTML = currentStory.text;
  
  for(let i=1; i<=3; i++) {
    document.getElementById('q'+i+'Text').innerText = currentStory.questions[i-1].text;
    document.getElementById('q'+i+'Res').innerText = '';
  }
}

function checkReading(qNum, userAnswer) {
  if (!currentStory) return;
  const correct = currentStory.questions[qNum-1].answer;
  const resEl = document.getElementById('q'+qNum+'Res');
  if (userAnswer === correct) {
    resEl.innerText = '? Richtig!';
    resEl.style.color = 'var(--success)';
  } else {
    resEl.innerText = '? Falsch!';
    resEl.style.color = 'var(--danger)';
  }
}
`;

if (!js.includes('const STORIES = [')) {
  js += '\n' + readingJs;
  fs.writeFileSync('script.js', js, 'utf-8');
}

console.log('Task 3 Complete: Reading Added');
