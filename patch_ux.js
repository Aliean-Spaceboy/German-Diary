const fs = require('fs');

let js = fs.readFileSync('script.js', 'utf8');

// 1. Fix SPA Navigation State
const navRegex = /function showSection\(id\) \{[\s\S]*?document\.getElementById\('section-' \+ id\)\.classList\.add\('active'\);/;
if (js.match(navRegex)) {
  js = js.replace(navRegex, js.match(navRegex)[0] + "\n    localStorage.setItem('dt_current_section', id); // Save state");
}

// Inject state restorer into the DOMContentLoaded block at the bottom
const initRegex = /if \(typeof syncCloudData === 'function'\) syncCloudData\(\);/;
if (js.match(initRegex)) {
  js = js.replace(initRegex, `const lastSec = localStorage.getItem('dt_current_section');
    if (lastSec) showSection(lastSec);
    if (typeof syncCloudData === 'function') syncCloudData();`);
}


// 2. Fix Live News Refresh logic
const fetchNewsRegex = /async function fetchLiveNews\(\) \{[\s\S]*?const data = await res\.json\(\);[\s\S]*?if \(data && data\.items\) \{[\s\S]*?STORIES = data\.items\.map\(item => \(\{/;

if (js.match(fetchNewsRegex)) {
  const newFetchNews = `async function fetchLiveNews() {
  const container = document.getElementById('storyBtnContainer');
  const ogHtml = container.innerHTML;
  container.innerHTML = '&#8987; Fetching live news from Deutsche Welle...';
  
  try {
    // Add a cache buster so the browser doesn't cache the old RSS feed
    const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://rss.dw.com/xml/rss-de-all&api_key=&_=' + new Date().getTime());
    const data = await res.json();
    
    if (data && data.items) {
      // Randomize items so they feel fresh!
      const randomItems = data.items.sort(() => 0.5 - Math.random());
      
      STORIES = randomItems.map(item => ({`;
      
  js = js.replace(fetchNewsRegex, newFetchNews);
}

// Also save STORIES to local storage so they survive a page refresh
const saveStoriesRegex = /renderReadingMenu\(\);\n    \}\n  \} catch\(e\)/;
if (js.match(saveStoriesRegex)) {
  js = js.replace(saveStoriesRegex, `save('dt_saved_stories', STORIES);\n      renderReadingMenu();\n    }\n  } catch(e)`);
}

// And load STORIES from storage inside renderReadingMenu if empty
const renderReadingRegex = /renderReadingMenu = function\(\) \{/;
if (js.match(renderReadingRegex)) {
  js = js.replace(renderReadingRegex, `renderReadingMenu = function() {\n  if (STORIES.length === 0) STORIES = load('dt_saved_stories', []);`);
}

fs.writeFileSync('script.js', js, 'utf8');
console.log("UX Fixes Implemented!");

