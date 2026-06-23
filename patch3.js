const fs = require('fs');
let js = fs.readFileSync('script.js', 'utf-8');

const quizLogic = `
// --- ADVANCED QUIZZES (MCQ & LISTENING) ---
const oldStartQuiz = startQuiz;
startQuiz = function(type) {
  if (type === 'listening' || type === 'mcq') {
    if (vocab.length < 4) { showToast('?? Add at least 4 vocabulary words first!'); return; }
    quizState.type = type;
    quizState.score = 0;
    quizState.idx = 0;
    
    // Generate 10 random questions
    quizState.questions = [];
    for(let i=0; i<10; i++) {
      let target = vocab[Math.floor(Math.random() * vocab.length)];
      // Get 3 random wrong options
      let wrongs = vocab.filter(v => v.de !== target.de).sort(()=>0.5-Math.random()).slice(0, 3);
      let options = [target.en, ...wrongs.map(w => w.en)].sort(()=>0.5-Math.random());
      
      quizState.questions.push({
        de: target.de,
        options: options,
        answer: target.en
      });
    }
    
    document.getElementById('quizMenu').style.display = 'none';
    document.getElementById('quizActive').style.display = 'block';
    renderQuestion();
  } else {
    // fallback to original if exists
    if(typeof oldStartQuiz === 'function') oldStartQuiz(type);
  }
};

const oldRenderQuestion = renderQuestion;
renderQuestion = function() {
  if (quizState.type === 'listening' || quizState.type === 'mcq') {
    const q = quizState.questions[quizState.idx];
    document.getElementById('quizProgress').textContent = (quizState.idx + 1) + ' / ' + quizState.questions.length;
    document.getElementById('quizTypeLabel').textContent = quizState.type === 'listening' ? '?? Listening' : '?? MCQ';
    
    if (quizState.type === 'listening') {
      document.getElementById('quizQuestion').innerHTML = '<button class="btn btn-primary" onclick="speakWord(\\'' + q.de.replace(/'/g,"\\\\'") + '\\')">?? Play Audio</button>';
      speakWord(q.de); // auto play
    } else {
      document.getElementById('quizQuestion').textContent = q.de;
    }
    
    document.getElementById('quizOptions').innerHTML = q.options.map((opt, i) => \`
      <button class="quiz-opt" id="opt\${i}" onclick="checkAnswer('\${opt.replace(/'/g,"\\\\'")}', \${i}, '\${q.answer.replace(/'/g,"\\\\'")}')">\${opt}</button>
    \`).join('');
    
    document.getElementById('quizNextBtn').style.display = 'none';
  } else {
    if(typeof oldRenderQuestion === 'function') oldRenderQuestion();
  }
};

const oldCheckAnswer = checkAnswer;
checkAnswer = function(ans, btnIdx, correctAns) {
  if (quizState.type === 'listening' || quizState.type === 'mcq') {
    document.querySelectorAll('.quiz-opt').forEach(b => b.disabled = true);
    if (ans === correctAns) {
      document.getElementById('opt'+btnIdx).classList.add('correct');
      quizState.score++;
      showToast('? Correct!');
    } else {
      document.getElementById('opt'+btnIdx).classList.add('wrong');
      // Highlight correct answer
      let opts = document.querySelectorAll('.quiz-opt');
      opts.forEach(b => { if(b.innerText === correctAns) b.classList.add('correct'); });
      showToast('? Wrong!');
    }
    document.getElementById('quizNextBtn').style.display = 'block';
  } else {
    if(typeof oldCheckAnswer === 'function') oldCheckAnswer(ans, btnIdx, correctAns);
  }
};
`;

if(!js.includes('ADVANCED QUIZZES (MCQ & LISTENING)')) {
  js += '\n' + quizLogic + '\n';
  fs.writeFileSync('script.js', js, 'utf-8');
}
console.log("Patch 3 Complete!");
