const fs = require('fs');
let js = fs.readFileSync('script.js', 'utf8');

const regex = /if \(vocab\.length < 4\) \{ showToast\('.*? Add at least 4 vocabulary words first!'\); return; \}\s*quizState\.type = type;\s*quizState\.score = 0;\s*quizState\.idx = 0;\s*\/\/ Generate 10 random questions\s*quizState\.questions = \[\];\s*for\(let i=0; i<10; i\+\+\) \{\s*let target = vocab\[Math\.floor\(Math\.random\(\) \* vocab\.length\)\];\s*\/\/ Get 3 random wrong options\s*let wrongs = vocab\.filter\(v => v\.de !== target\.de\)\.sort\(\(\)=>0\.5-Math\.random\(\)\)\.slice\(0, 3\);/;

const newLogic = `
      const allItems = [...vocab, ...DAILY_SENTENCES];
      if (allItems.length < 4) { showToast('?? Add at least 4 items (words or sentences) first!'); return; }
      quizState.type = type;
      quizState.score = 0;
      quizState.idx = 0;
      
      // Generate 10 random questions
      quizState.questions = [];
      for(let i=0; i<10; i++) {
        let target = allItems[Math.floor(Math.random() * allItems.length)];
        // Get 3 random wrong options
        let wrongs = allItems.filter(v => v.de !== target.de).sort(()=>0.5-Math.random()).slice(0, 3);`;

if(js.match(regex)) {
  js = js.replace(regex, newLogic);
  fs.writeFileSync('script.js', js, 'utf8');
  console.log("Quiz patched to include Sentences!");
} else {
  console.log("Could not find the quiz logic to patch.");
}
