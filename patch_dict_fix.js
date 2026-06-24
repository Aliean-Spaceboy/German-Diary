const fs = require('fs');
let js = fs.readFileSync('script.js', 'utf8');

const regex = /const allWords = new Map\(\);\s*vocab\.forEach\(v => allWords\.set\(v\.de, v\)\);\s*vocab_pool\.forEach\(v => \{ if\(\!allWords\.has\(v\.de\)\) allWords\.set\(v\.de, v\); \}\);/;

const newLogic = `const allWords = new Map();
  vocab.forEach(v => allWords.set(v.de, v));
  vocab_pool.forEach(v => { if(!allWords.has(v.de)) allWords.set(v.de, v); });
  if (typeof DAILY_WORDS !== 'undefined') {
    DAILY_WORDS.forEach(v => { if(!allWords.has(v.de)) allWords.set(v.de, v); });
  }`;

if(js.match(regex)) {
  js = js.replace(regex, newLogic);
  fs.writeFileSync('script.js', js, 'utf8');
  console.log("Dictionary patched to include DAILY_WORDS!");
} else {
  console.log("Could not find Dictionary logic to patch.");
}
