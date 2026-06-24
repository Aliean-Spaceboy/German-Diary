const fs = require('fs');

// 1. Update CSS in index.html
let html = fs.readFileSync('index.html', 'utf8');

// Replace the old heatmap CSS block
const oldCssRegex = /\.heatmap\s*\{[\s\S]*?\.heat-3\s*\{.*?\}/;
const newCss = `
    .heatmap-wrapper { display: flex; gap: 6px; margin-top: 10px; overflow-x: auto; padding-bottom: 5px; }
    .heatmap-labels { display: grid; grid-template-rows: repeat(7, 14px); gap: 4px; font-size: 0.65rem; color: var(--text-muted); text-align: right; line-height: 14px; padding-right: 2px;}
    .heatmap {
      display: grid;
      grid-template-rows: repeat(7, 14px);
      grid-auto-flow: column;
      gap: 4px;
    }
    .heat-cell {
      width: 14px;
      height: 14px;
      border-radius: 3px;
      background: var(--surface2);
      transition: transform 0.2s;
    }
    .heat-cell:hover { transform: scale(1.2); }
    .heat-1 { background: #10b981; opacity: 0.5; }
    .heat-2 { background: #10b981; opacity: 0.8; }
    .heat-3 { background: #10b981; opacity: 1.0; }
    .heat-future { background: transparent; pointer-events: none; }`;

if (html.match(oldCssRegex)) {
  html = html.replace(oldCssRegex, newCss.trim());
} else {
  html = html.replace('</style>', newCss + '\n  </style>');
}

// 2. Update HTML Structure in index.html
const oldHtmlRegex = /<div class="heatmap" id="heatmap"><\/div>/;
const newHtml = `
        <div class="heatmap-wrapper">
          <div class="heatmap-labels">
            <div></div>
            <div>Mon</div>
            <div></div>
            <div>Wed</div>
            <div></div>
            <div>Fri</div>
            <div></div>
          </div>
          <div class="heatmap" id="heatmap"></div>
        </div>`;

if (html.match(oldHtmlRegex)) {
  html = html.replace(oldHtmlRegex, newHtml.trim());
}

fs.writeFileSync('index.html', html, 'utf8');
console.log("HTML and CSS patched!");

// 3. Update renderHeatmap() in script.js
let js = fs.readFileSync('script.js', 'utf8');
const oldJsRegex = /function renderHeatmap\(\) \{[\s\S]*?hm\.appendChild\(cell\);\s*\}\s*\}/;
const newJs = `
function renderHeatmap() {
  const hm = document.getElementById('heatmap');
  hm.innerHTML = '';
  
  const today = new Date();
  const todayStrStr = today.toISOString().split('T')[0];
  
  // Find the upcoming/current Saturday to align columns perfectly
  const endOfWeek = new Date(today);
  const dayOfWeek = endOfWeek.getDay(); // 0 is Sunday, 6 is Saturday
  endOfWeek.setDate(endOfWeek.getDate() + (6 - dayOfWeek));
  
  // Go back exactly 12 weeks (84 days) from Saturday, meaning start on a Sunday
  const startDate = new Date(endOfWeek);
  startDate.setDate(startDate.getDate() - 83);
  
  for (let i = 0; i < 84; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const ds = d.toISOString().split('T')[0];
    
    const cell = document.createElement('div');
    
    // If the date is strictly in the future relative to today, make it invisible
    if (d > today && ds !== todayStrStr) {
      cell.className = 'heat-cell heat-future';
    } else {
      const count = diaryEntries.filter(e => e.date === ds).length;
      cell.className = 'heat-cell' + (count >= 3 ? ' heat-3' : count === 2 ? ' heat-2' : count === 1 ? ' heat-1' : '');
      cell.title = ds + (count ? \` (\${count} entries)\` : ' (0 entries)');
    }
    hm.appendChild(cell);
  }
}`;

if (js.match(oldJsRegex)) {
  js = js.replace(oldJsRegex, newJs.trim());
  fs.writeFileSync('script.js', js, 'utf8');
  console.log("script.js renderHeatmap patched!");
} else {
  console.log("Regex for renderHeatmap did not match!");
}
