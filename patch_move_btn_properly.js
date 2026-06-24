const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetCardRegex = /<div class="card" style="margin-bottom:24px;background:var\(--surface2\)">[\s\S]*?<div style="font-weight:700">&#128218; Sentence Packs<\/div>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

const match = html.match(targetCardRegex);
if(match) {
  const cardHtml = match[0];
  // Remove from old location
  html = html.replace(cardHtml, '');
  
  // Inject into Diary section properly
  const injectRegex = /<div id="section-diary" class="section">\s*<div class="card">/;
  html = html.replace(injectRegex, `<div id="section-diary" class="section">\n${cardHtml}\n    <div class="card">`);
  
  fs.writeFileSync('index.html', html, 'utf8');
  console.log("Sentence Packs card moved to Diary Section properly!");
} else {
  console.log("Could not find the Sentence Packs card to move. It might already be moved?");
  
  // Let's check if it IS in section-diary but hidden
  if(html.indexOf('Sentence Packs') > html.indexOf('section-diary') && html.indexOf('Sentence Packs') < html.indexOf('section-entries')) {
      console.log("Wait, it IS in the diary section already!");
  }
}
