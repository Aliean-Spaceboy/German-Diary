const fs = require('fs');

// 1. Update HTML Title
let html = fs.readFileSync('index.html', 'utf8');
const oldTitleRegex = /<div class="card-title">.*?Activity Heatmap<\/div>/;
const newTitle = `<div class="card-title" style="display:flex; justify-content:space-between; align-items:center;">
          <div>&#128200; Activity Heatmap</div>
          <div style="font-size:0.8rem; color:var(--success); font-weight:700" id="timeTrackerDisplay">0 mins today</div>
        </div>`;
if (html.match(oldTitleRegex)) {
  html = html.replace(oldTitleRegex, newTitle);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log("HTML Title updated.");
}

// 2. Update script.js
let js = fs.readFileSync('script.js', 'utf8');

// Inject Time Tracker Logic
const timeLogic = `
let timeTrackerInterval;
function initTimeTracker() {
  let mins = load('dt_time_' + todayStr(), 0);
  const display = document.getElementById('timeTrackerDisplay');
  if (display) display.textContent = mins + ' mins today';
  
  // Update every 60 seconds
  timeTrackerInterval = setInterval(() => {
    mins++;
    save('dt_time_' + todayStr(), mins);
    if (display) display.textContent = mins + ' mins today';
    renderHeatmap(); // Live update the heatmap color!
  }, 60000);
}
`;

if (!js.includes('initTimeTracker()')) {
  js = js.replace("document.addEventListener('DOMContentLoaded', () => {", timeLogic + "\ndocument.addEventListener('DOMContentLoaded', () => {\n  initTimeTracker();");
}

// Replace renderHeatmap logic to read dt_time_ instead of diaryEntries
const oldHeatmapLogicRegex = /const count = diaryEntries.filter\(e => e.date === ds\).length;[\s\S]*?cell\.title = ds \+ \(count \? \` \(\\\$\\{count\\} entries\)\` : ' \(0 entries\)'\);/;
const newHeatmapLogic = `
      const count = load('dt_time_' + ds, 0);
      cell.className = 'heat-cell' + (count >= 30 ? ' heat-3' : count >= 15 ? ' heat-2' : count > 0 ? ' heat-1' : '');
      cell.title = ds + (count > 0 ? \` (\${count} mins)\` : ' (0 mins)');
`;

if (js.match(oldHeatmapLogicRegex)) {
  js = js.replace(oldHeatmapLogicRegex, newHeatmapLogic.trim());
}

fs.writeFileSync('script.js', js, 'utf8');
console.log("script.js patched with Time Tracker!");
