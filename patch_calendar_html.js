const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Update CSS
const oldCssRegex = /\.heatmap-wrapper\s*\{[\s\S]*?\.heat-future\s*\{.*?\}/;
const newCss = `
    .heatmap-wrapper { display: flex; flex-direction: column; gap: 6px; margin-top: 10px; }
    .heatmap-calendar-header { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-size: 0.7rem; font-weight: 700; color: var(--text-muted); }
    .heatmap-calendar {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 6px;
    }
    .heat-cell {
      aspect-ratio: 1;
      border-radius: 4px;
      background: var(--surface2);
      transition: transform 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-muted);
      cursor: pointer;
    }
    .heat-cell:hover { transform: scale(1.1); }
    .heat-1 { background: #10b981; color: #fff; opacity: 0.7; }
    .heat-2 { background: #10b981; color: #fff; opacity: 0.9; }
    .heat-3 { background: #10b981; color: #fff; opacity: 1.0; }
    .heat-future { background: transparent; pointer-events: none; color: transparent; }`;

if (html.match(oldCssRegex)) {
  html = html.replace(oldCssRegex, newCss.trim());
}

// Update HTML Structure
const oldHtmlRegex = /<div class="card-sub">Last 12 weeks of practice<\/div>[\s\S]*?<div class="heatmap" id="heatmap"><\/div>\s*<\/div>/;
const newHtml = `
        <div class="card-sub" id="heatmapSubtitle">Current Month</div>
        <div class="heatmap-wrapper">
          <div class="heatmap-calendar-header">
            <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
          </div>
          <div class="heatmap-calendar" id="heatmap"></div>
        </div>`;

if (html.match(oldHtmlRegex)) {
  html = html.replace(oldHtmlRegex, newHtml.trim());
}

fs.writeFileSync('index.html', html, 'utf8');
console.log("HTML and CSS patched for Monthly Calendar!");
