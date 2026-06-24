const fs = require('fs');
let js = fs.readFileSync('script.js', 'utf8');

const oldRegex = /function renderHeatmap\(\) \{[\s\S]*?hm\.appendChild\(cell\);\s*\n\s*\}/;

const newLogic = `function renderHeatmap() {
  const hm = document.getElementById('heatmap');
  hm.innerHTML = '';
  
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const todayDateNum = today.getDate();
  
  // Update subtitle
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const subEl = document.getElementById('heatmapSubtitle');
  if (subEl) subEl.textContent = \`\${monthNames[month]} \${year}\`;
  
  // Find the day of the week the 1st of the month falls on
  const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
  
  // Find the number of days in the current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // 1. Generate invisible placeholder cells for the days before the 1st
  for (let i = 0; i < firstDay; i++) {
    const cell = document.createElement('div');
    cell.className = 'heat-cell heat-future';
    hm.appendChild(cell);
  }
  
  // 2. Generate the actual days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    const cell = document.createElement('div');
    cell.textContent = i;
    
    // Safely generate YYYY-MM-DD for the local timezone
    const ds = year + '-' + String(month+1).padStart(2,'0') + '-' + String(i).padStart(2,'0');
    
    if (i > todayDateNum) {
      // Future days
      cell.className = 'heat-cell';
      cell.style.opacity = '0.3';
      cell.title = "Future";
    } else {
      const count = load('dt_time_' + ds, 0);
      cell.className = 'heat-cell' + (count >= 30 ? ' heat-3' : count >= 15 ? ' heat-2' : count > 0 ? ' heat-1' : '');
      cell.title = ds + (count > 0 ? \` (\${count} mins)\` : ' (0 mins)');
    }
    hm.appendChild(cell);
  }
}`;

if (js.match(oldRegex)) {
  js = js.replace(oldRegex, newLogic);
  fs.writeFileSync('script.js', js, 'utf8');
  console.log("script.js patched for Monthly Calendar!");
} else {
  console.log("Could not find renderHeatmap to patch!");
}
