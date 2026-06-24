const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove separate header div from HTML
const headerRegex = /<div class="heatmap-calendar-header">[\s\S]*?<\/div>/;
html = html.replace(headerRegex, '');

fs.writeFileSync('index.html', html, 'utf8');

// 2. Inject headers directly into renderHeatmap in script.js
let js = fs.readFileSync('script.js', 'utf8');
const renderRegex = /hm\.innerHTML = '';/;
const newInit = `hm.innerHTML = \`<div class="heatmap-day-label">Su</div><div class="heatmap-day-label">Mo</div><div class="heatmap-day-label">Tu</div><div class="heatmap-day-label">We</div><div class="heatmap-day-label">Th</div><div class="heatmap-day-label">Fr</div><div class="heatmap-day-label">Sa</div>\`;`;

if(js.match(renderRegex)) {
  js = js.replace(renderRegex, newInit);
}

// 3. One-time fix to clear vocab and make it exactly 10 if they are confused
const vocabFixRegex = /const roadmap = load\('dt_roadmap', \{\}\);/;
const vocabFixLogic = `
    // ONE-TIME FIX: If the user is confused by having 25 words, wipe active vocab to let it cleanly pull exactly 10 today.
    if(vocab.length === 25) {
      console.log("Resetting 25 words back to 0 so we can pull exactly 10...");
      vocab_pool = [...vocab, ...vocab_pool];
      vocab = [];
    }
    const roadmap = load('dt_roadmap', {});`;

js = js.replace(vocabFixRegex, vocabFixLogic.trim());

fs.writeFileSync('script.js', js, 'utf8');
console.log("Heatmap alignment fixed and Vocab logic updated!");
