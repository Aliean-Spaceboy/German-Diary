const fs = require('fs');
let js = fs.readFileSync('script.js', 'utf-8');

// Fix oldStartQuiz
js = js.replace('const oldStartQuiz = startQuiz;', 'const oldStartQuiz = typeof startQuiz !== "undefined" ? startQuiz : function(){};');

// Fix oldRenderQuestion
js = js.replace('const oldRenderQuestion = renderQuestion;', 'const oldRenderQuestion = typeof renderQuestion !== "undefined" ? renderQuestion : function(){};');

// Fix oldCheckAnswer
js = js.replace('const oldCheckAnswer = checkAnswer;', 'const oldCheckAnswer = typeof checkAnswer !== "undefined" ? checkAnswer : function(){};');

// Fix originalShowSectionReading
js = js.replace('const originalShowSectionReading = showSection;', 'const originalShowSectionReading = typeof showSection !== "undefined" ? showSection : function(){};');

// Fix oldShowSectionNav
js = js.replace('const oldShowSectionNav = showSection;', 'const oldShowSectionNav = typeof showSection !== "undefined" ? showSection : function(){};');

// Fix oldInitDiary
js = js.replace('const oldInitDiary = initDiary;', 'const oldInitDiary = typeof initDiary !== "undefined" ? initDiary : function(){};');

// Fix oldSaveDiary
js = js.replace('const oldSaveDiary = saveDiaryEntry;', 'const oldSaveDiary = typeof saveDiaryEntry !== "undefined" ? saveDiaryEntry : function(){};');

// Fix b2SaveDiary
js = js.replace('const b2SaveDiary = saveDiaryEntry;', 'const b2SaveDiary = typeof saveDiaryEntry !== "undefined" ? saveDiaryEntry : function(){};');

// Fix b2StartQuiz
js = js.replace('const b2StartQuiz = startQuiz;', 'const b2StartQuiz = typeof startQuiz !== "undefined" ? startQuiz : function(){};');

// Fix b2RenderQuestion
js = js.replace('const b2RenderQuestion = renderQuestion;', 'const b2RenderQuestion = typeof renderQuestion !== "undefined" ? renderQuestion : function(){};');

fs.writeFileSync('script.js', js, 'utf-8');
console.log("Crash patches applied!");
