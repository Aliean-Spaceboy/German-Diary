const fs = require('fs');
let js = fs.readFileSync('script.js', 'utf8');

const regex = /\/\/ ONE-TIME MIGRATION:[\s\S]*?save\('dt_sentences_pool', sentences_pool\);\s*\}/;

const match = js.match(regex);
if (match) {
  const block = match[0];
  js = js.replace(block, '');
  
  // Put it right before checkDailyUnlock
  js = js.replace('function checkDailyUnlock() {', block + '\n\nfunction checkDailyUnlock() {');
  fs.writeFileSync('script.js', js, 'utf8');
  console.log("Migration logic moved below initializations!");
} else {
  console.log("Could not find the migration block!");
}
