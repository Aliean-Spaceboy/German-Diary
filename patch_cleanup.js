const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove redundant chat header
const redundantHeaderRegex = /<div style="padding:15px;">\s*<div style="display:flex; justify-content:space-between; align-items:center;">[\s\S]*?<button class="btn btn-outline btn-sm" onclick="toggleChatSettings\(\)">&#9881;&#65039; API Settings<\/button>\s*<\/div>/;

if (html.match(redundantHeaderRegex)) {
  html = html.replace(redundantHeaderRegex, '<div style="padding:0px 15px;">'); // Keep the padding div but remove the inner header
}

// 2. Add Favicon and Application Title
const headRegex = /<title>.*?<\/title>/;
if (html.match(headRegex)) {
  html = html.replace(headRegex, `<title>German Diary | Fluent</title>\n    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>&#127465;&#127466;</text></svg>">`);
}

// 3. Improve Sidebar Logo
const logoRegex = /<div class="logo">\s*&#128214; Deutsches<br>Tagebuch\s*<\/div>/;
if (html.match(logoRegex)) {
  html = html.replace(logoRegex, `<div class="logo" style="display:flex; align-items:center; gap:10px; font-size:1.3rem;">\n      <div style="font-size:2rem; background:var(--surface); padding:5px; border-radius:10px; box-shadow:0 2px 5px rgba(0,0,0,0.1);">&#127465;&#127466;</div>\n      <div>German<br><span style="color:var(--text-muted);font-size:1rem;">Diary</span></div>\n    </div>`);
}

fs.writeFileSync('index.html', html, 'utf8');
console.log("Cleanup applied!");

