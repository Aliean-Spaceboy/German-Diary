const fs = require('fs');
let js = fs.readFileSync('script.js', 'utf8');

js = js.replace('renderVocab(); renderDashboard(); renderReading();', 'renderVocab(); renderDashboard();');

fs.writeFileSync('script.js', js, 'utf8');
console.log("Removed non-existent renderReading() call.");
