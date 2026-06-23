const fs = require('fs');

// --- HTML PATCH ---
let html = fs.readFileSync('index.html', 'utf-8');

const newQuizOptions = `
      <div class="roadmap-item" style="display:block;border-color:var(--success);background:rgba(52,211,153,0.1)" onclick="startQuiz('grammar')">
        <div class="roadmap-label">&#129513; Grammar Quiz (B2)</div>
        <div class="roadmap-sub">Test cases (Dativ/Akkusativ) and prepositions.</div>
      </div>
      <div class="roadmap-item" style="display:block;border-color:var(--gold);background:rgba(251,191,36,0.1)" onclick="startQuiz('verbs')">
        <div class="roadmap-label">&#9881;&#65039; Irregular Verbs</div>
        <div class="roadmap-sub">Master the past tenses of strong verbs!</div>
      </div>
`;

if (!html.includes('Grammar Quiz (B2)')) {
  // Insert inside quizMenu grid-2
  html = html.replace('</div>\n    </div>\n  </div>\n\n  <div class="card" id="quizActive"', newQuizOptions + '</div>\n    </div>\n  </div>\n\n  <div class="card" id="quizActive"');
  fs.writeFileSync('index.html', html, 'utf-8');
}

// --- JS PATCH ---
let js = fs.readFileSync('script.js', 'utf-8');

const newQuizzesJs = `
// --- B2 GRAMMAR & VERB QUIZZES ---
const GRAMMAR_QUESTIONS = [
  { text: "Ich fahre mit ___ Auto zur Arbeit.", options: ["dem", "das", "den", "der"], answer: "dem" },
  { text: "Wir danken ___ für die Hilfe.", options: ["Sie", "Ihre", "Ihnen", "Ihr"], answer: "Ihnen" },
  { text: "Er legt das Buch auf ___ Tisch.", options: ["den", "dem", "der", "das"], answer: "den" },
  { text: "Das Buch liegt auf ___ Tisch.", options: ["den", "dem", "der", "das"], answer: "dem" },
  { text: "Ich erinnere mich nicht ___ seinen Namen.", options: ["an", "auf", "über", "für"], answer: "an" },
  { text: "Trotz ___ Regens gehen wir spazieren.", options: ["den", "dem", "des", "der"], answer: "des" }
];

const IRREGULAR_VERBS = [
  { inf: "gehen", praet: "ging", perf: "gegangen" },
  { inf: "sehen", praet: "sah", perf: "gesehen" },
  { inf: "schreiben", praet: "schrieb", perf: "geschrieben" },
  { inf: "bleiben", praet: "blieb", perf: "geblieben" },
  { inf: "sprechen", praet: "sprach", perf: "gesprochen" },
  { inf: "nehmen", praet: "nahm", perf: "genommen" }
];

const b2StartQuiz = startQuiz;
startQuiz = function(type) {
  if (type === 'grammar') {
    quizState.type = 'grammar';
    quizState.score = 0; quizState.idx = 0;
    quizState.questions = [...GRAMMAR_QUESTIONS].sort(()=>0.5-Math.random()).slice(0, 5);
    document.getElementById('quizMenu').style.display = 'none';
    document.getElementById('quizActive').style.display = 'block';
    renderQuestion();
  } else if (type === 'verbs') {
    quizState.type = 'verbs';
    quizState.score = 0; quizState.idx = 0;
    let selectedVerbs = [...IRREGULAR_VERBS].sort(()=>0.5-Math.random()).slice(0, 5);
    quizState.questions = selectedVerbs.map(v => ({
      de: "Infinitive: <b>" + v.inf + "</b>",
      verb: v,
      options: [], answer: '' // manual input mode
    }));
    document.getElementById('quizMenu').style.display = 'none';
    document.getElementById('quizActive').style.display = 'block';
    renderQuestion();
  } else {
    b2StartQuiz(type);
  }
};

const b2RenderQuestion = renderQuestion;
renderQuestion = function() {
  if (quizState.type === 'grammar') {
    const q = quizState.questions[quizState.idx];
    document.getElementById('quizProgress').textContent = (quizState.idx + 1) + ' / ' + quizState.questions.length;
    document.getElementById('quizTypeLabel').textContent = '?? Grammar B2';
    document.getElementById('quizQuestion').textContent = q.text;
    document.getElementById('quizOptions').innerHTML = q.options.map((opt, i) => \`
      <button class="quiz-opt" id="opt\${i}" onclick="checkAnswer('\${opt}', \${i}, '\${q.answer}')">\${opt}</button>
    \`).join('');
    document.getElementById('quizNextBtn').style.display = 'none';
  } else if (quizState.type === 'verbs') {
    const q = quizState.questions[quizState.idx];
    document.getElementById('quizProgress').textContent = (quizState.idx + 1) + ' / ' + quizState.questions.length;
    document.getElementById('quizTypeLabel').textContent = '?? Irregular Verbs';
    document.getElementById('quizQuestion').innerHTML = q.de;
    
    // Custom Input UI for Verbs
    document.getElementById('quizOptions').innerHTML = \`
      <div style="display:flex; flex-direction:column; gap:10px; align-items:center; width:100%">
        <input id="verbPraet" placeholder="Präteritum (e.g. ging)" style="width:80%; padding:10px; text-align:center">
        <input id="verbPerf" placeholder="Partizip II (e.g. gegangen)" style="width:80%; padding:10px; text-align:center">
        <button class="btn btn-primary" onclick="checkVerbAnswer()">Check</button>
        <div id="verbResult" style="font-weight:bold; margin-top:10px"></div>
      </div>
    \`;
    document.getElementById('quizNextBtn').style.display = 'none';
  } else {
    b2RenderQuestion();
  }
};

function checkVerbAnswer() {
  const p1 = document.getElementById('verbPraet').value.trim().toLowerCase();
  const p2 = document.getElementById('verbPerf').value.trim().toLowerCase();
  const verb = quizState.questions[quizState.idx].verb;
  
  const resEl = document.getElementById('verbResult');
  if (p1 === verb.praet && p2 === verb.perf) {
    resEl.innerHTML = '? Correct!';
    resEl.style.color = 'var(--success)';
    quizState.score++;
  } else {
    resEl.innerHTML = '? Wrong! It is: <b>' + verb.praet + '</b> / <b>' + verb.perf + '</b>';
    resEl.style.color = 'var(--danger)';
  }
  document.getElementById('quizNextBtn').style.display = 'block';
}

`;

if (!js.includes('GRAMMAR_QUESTIONS')) {
  js += '\n' + newQuizzesJs;
  fs.writeFileSync('script.js', js, 'utf-8');
}

console.log('Task 4 & 5 Complete: Grammar and Verbs Added');
