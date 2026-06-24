const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const brokenRegex = /<div class="heatmap-wrapper">\s*<div>Mo<\/div><div>Tu<\/div><div>We<\/div><div>Th<\/div><div>Fr<\/div><div>Sa<\/div>\s*<\/div>\s*<div class="heatmap-calendar" id="heatmap"><\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;

const fixedHtml = `        <div class="heatmap-wrapper">
          <div class="heatmap-calendar" id="heatmap"></div>
        </div>
      </div>
    </div>`;

if (html.match(brokenRegex)) {
  html = html.replace(brokenRegex, fixedHtml);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log("HTML structure perfectly restored!");
} else {
  console.log("Could not find the broken HTML block. Attempting alternative regex...");
  
  // Alternative fallback if spacing is different
  const altRegex = /<div class="heatmap-wrapper">[\s\S]*?<div class="heatmap-calendar" id="heatmap"><\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;
  if(html.match(altRegex)) {
    html = html.replace(altRegex, fixedHtml);
    fs.writeFileSync('index.html', html, 'utf8');
    console.log("HTML structure restored via alternative regex!");
  } else {
    console.log("Failed to match entirely.");
  }
}
