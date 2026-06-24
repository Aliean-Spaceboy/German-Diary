const fs = require('fs');
let js = fs.readFileSync('script.js', 'utf-8');

js = js.replace("|| url.includes('...')", "");
fs.writeFileSync('script.js', js, 'utf-8');
console.log("Feedback patch applied.");
