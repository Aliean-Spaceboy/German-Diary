const fs = require('fs');

let js = fs.readFileSync('script.js', 'utf-8');

const oldLogic = `function loadDailyInspiration() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const w = DAILY_WORDS[dayOfYear % DAILY_WORDS.length];
  const s = DAILY_SENTENCES[dayOfYear % DAILY_SENTENCES.length];`;

const newLogic = `function loadDailyInspiration() {
  const w = DAILY_WORDS[Math.floor(Math.random() * DAILY_WORDS.length)];
  const s = DAILY_SENTENCES[Math.floor(Math.random() * DAILY_SENTENCES.length)];`;

js = js.replace(oldLogic, newLogic);
fs.writeFileSync('script.js', js, 'utf-8');

console.log("Random refresh applied!");
