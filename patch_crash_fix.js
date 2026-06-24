const fs = require('fs');
let js = fs.readFileSync('script.js', 'utf8');

const oldInspirationRegex = /function loadDailyInspiration\(\)\s*\{\s*const w = DAILY_WORDS\[Math\.floor\(Math\.random\(\) \* DAILY_WORDS\.length\)\];\s*const s = DAILY_SENTENCES\[Math\.floor\(Math\.random\(\) \* DAILY_SENTENCES\.length\)\];/;

const newInspiration = `function loadDailyInspiration() {
    const w = DAILY_WORDS[Math.floor(Math.random() * DAILY_WORDS.length)];
    const s = DAILY_SENTENCES.length > 0 ? DAILY_SENTENCES[Math.floor(Math.random() * DAILY_SENTENCES.length)] : {de: 'Lerne jeden Tag!', en: 'Learn every day!'};`;

if (js.match(oldInspirationRegex)) {
  js = js.replace(oldInspirationRegex, newInspiration);
  fs.writeFileSync('script.js', js, 'utf8');
  console.log("Crash fix applied!");
} else {
  console.log("Could not match loadDailyInspiration!");
}

