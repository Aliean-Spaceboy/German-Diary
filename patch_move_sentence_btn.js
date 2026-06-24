const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetCardRegex = /<div class="card" style="margin-bottom:24px;background:var\(--surface2\)">[\s\S]*?<div style="font-weight:700">&#128218; Sentence Packs<\/div>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

const match = html.match(targetCardRegex);
if(match) {
  const cardHtml = match[0];
  html = html.replace(cardHtml, '');
  
  html = html.replace('<div id="section-diary" class="section">\n    <div class="card">', '<div id="section-diary" class="section">\n' + cardHtml + '\n    <div class="card">');
  
  fs.writeFileSync('index.html', html, 'utf8');
  console.log("Sentence Packs card moved to Diary Section!");
} else {
  console.log("Could not find the Sentence Packs card to move.");
}

