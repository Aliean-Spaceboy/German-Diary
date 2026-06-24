const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// F3: Add Grammar item to quiz menu
const quizRegex = /<div class="roadmap-item" style="display:block" onclick="startQuiz\('sentence'\)">[\s\S]*?<\/div>/;
if (html.match(quizRegex) && !html.includes('startQuiz(\'grammar\')')) {
  html = html.replace(quizRegex, html.match(quizRegex)[0] + `
        <div class="roadmap-item" style="display:block" onclick="startQuiz('grammar')">
          <div class="roadmap-label">&#10024; Grammar (Lückentext)</div>
          <div class="roadmap-sub">Fill-in-the-blank practice</div>
        </div>`);
}

// F4: Dynamic Story Buttons
const storyBtnRegex = /<div style="margin-bottom: 20px; display:flex; gap:10px">[\s\S]*?<\/div>\s*<\/div>/;
if (html.match(storyBtnRegex)) {
  html = html.replace(storyBtnRegex, `<div id="storyBtnContainer" style="margin-bottom: 20px; display:flex; gap:10px; flex-wrap:wrap"></div>`);
  // Add a nice styling block to the story text
  html = html.replace('id="storyText" style="margin-bottom:20px"', 'id="storyText" style="margin-bottom:20px; line-height:1.8; font-size:1.1rem; color:var(--text); max-width:800px; margin-left:auto; margin-right:auto; text-align:left;"');
}

fs.writeFileSync('index.html', html, 'utf8');


let js = fs.readFileSync('script.js', 'utf8');

const f3f4JS = `
// F3: Grammar Logic
const DEFAULT_GRAMMAR = [
  { text: "Ich spreche mit d___ Mann.", answer: "em", hint: "Dativ, maskulin" },
  { text: "Wir fahren in d___ Stadt.", answer: "ie", hint: "Akkusativ, feminin (movement)" },
  { text: "Das ist d___ Haus meiner Eltern.", answer: "as", hint: "Nominativ, neutrum" }
];
let grammar_pool = load('dt_grammar_pool', DEFAULT_GRAMMAR);
let active_grammar = load('dt_grammar', []);

const oldStartQuizF3 = typeof startQuiz !== 'undefined' ? startQuiz : function(){};
startQuiz = function(type) {
  if (type === 'grammar') {
    const pool = [...active_grammar, ...grammar_pool];
    if (pool.length < 1) { showToast('No grammar rules found!'); return; }
    
    quizState.type = 'grammar';
    quizState.score = 0;
    quizState.idx = 0;
    quizState.questions = pool.sort(()=>0.5-Math.random()).slice(0, 10);
    
    document.getElementById('quizMenu').style.display = 'none';
    document.getElementById('quizActive').style.display = 'block';
    document.getElementById('quizTypeLabel').innerHTML = '&#10024; Grammar (Lückentext)';
    renderQuestion();
  } else {
    oldStartQuizF3(type);
  }
};

const oldRenderQuestionF3 = typeof renderQuestion !== 'undefined' ? renderQuestion : function(){};
renderQuestion = function() {
  if (quizState.type === 'grammar') {
    const q = quizState.questions[quizState.idx];
    document.getElementById('quizProgress').textContent = (quizState.idx + 1) + ' / ' + quizState.questions.length;
    
    document.getElementById('quizQuestion').innerHTML = \`
      <div style="font-size:1.3rem; margin-bottom:10px;">
        \${q.text.replace('___', '<input type="text" id="grammarAns" style="width:60px; text-align:center; font-size:1.2rem; padding:4px; border:2px solid var(--accent); border-radius:4px; background:var(--surface); color:var(--text);" autocomplete="off">')}
      </div>
      <div style="font-size:0.9rem; color:var(--text-muted);">\${q.hint || ''}</div>
    \`;
    
    document.getElementById('quizOptions').innerHTML = \`<button class="btn btn-primary" onclick="checkAnswer(document.getElementById('grammarAns').value.trim(), 0, '\${q.answer.replace(/'/g,"\\\\'")}')" style="width:100%">Check Answer</button>\`;
    document.getElementById('quizNextBtn').style.display = 'none';
    
    setTimeout(() => {
      const inp = document.getElementById('grammarAns');
      if(inp) inp.focus();
    }, 100);
  } else {
    oldRenderQuestionF3();
  }
};

const oldCheckAnswerF3 = typeof checkAnswer !== 'undefined' ? checkAnswer : function(){};
checkAnswer = function(ans, btnIdx, correctAns) {
  if (quizState.type === 'grammar') {
    const input = document.getElementById('grammarAns');
    if (ans.toLowerCase() === correctAns.toLowerCase()) {
      input.style.borderColor = 'var(--success)';
      input.style.color = 'var(--success)';
      quizState.score++;
      showToast('Correct!', 'var(--success)');
    } else {
      input.style.borderColor = 'var(--danger)';
      input.style.color = 'var(--danger)';
      input.value = correctAns;
      showToast('Wrong!', 'var(--danger)');
    }
    input.disabled = true;
    document.querySelector('#quizOptions button').style.display = 'none';
    document.getElementById('quizNextBtn').style.display = 'block';
  } else {
    oldCheckAnswerF3(ans, btnIdx, correctAns);
  }
};

// F4: Dynamic Reading Menu
function renderReadingMenu() {
  const container = document.getElementById('storyBtnContainer');
  if(!container) return;
  container.innerHTML = STORIES.map((s, i) => \`<button class="btn btn-outline" onclick="loadStory(\${i})">\${s.title}</button>\`).join('') + \`
    <div style="position:relative; overflow:hidden; display:inline-block; margin-left:auto">
      <button class="btn btn-outline btn-sm" style="border-color:var(--accent); color:var(--accent)">Upload Stories (JSON)</button>
      <input type="file" accept=".json" onchange="importStoryJson(event)" style="position:absolute; left:0; top:0; opacity:0; cursor:pointer; height:100%">
    </div>
  \`;
}
`;

if (!js.includes('renderReadingMenu()')) {
  js += '\n' + f3f4JS;
  
  // Hook renderReadingMenu into load
  const initRegex = /renderDashboard\(\);/;
  if (js.match(initRegex)) {
    js = js.replace(initRegex, 'renderDashboard();\n  renderReadingMenu();');
  }
}

fs.writeFileSync('script.js', js, 'utf8');
console.log("F3 & F4 Injected successfully!");

