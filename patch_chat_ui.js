const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. FIX FLICKER
// Remove "active" from dashboard
html = html.replace('<div id="section-dashboard" class="section active">', '<div id="section-dashboard" class="section">');

// Add inline synchronous script at the very end of body to set active class instantly before paint
if (!html.includes("dt_current_section")) {
  const syncScript = `
  <script>
    const initialSec = localStorage.getItem('dt_current_section') || 'dashboard';
    const secEl = document.getElementById('section-' + initialSec);
    if(secEl) secEl.classList.add('active');
  </script>
  `;
  html = html.replace('</body>', syncScript + '\n</body>');
}

// 2. MAKE CHAT A FLOATING WIDGET
// Remove Nav Button
const navRegex = /<button class="nav-btn" onclick="showSection\('chat'\)".*?AI Chat<\/button>/;
if (html.match(navRegex)) {
  html = html.replace(navRegex, "");
}

// Transform section-chat into aiChatWidget
const chatRegex = /<!-- AI CHAT -->[\s\S]*?<div id="section-chat" class="section" style="display:none;">/;
if (html.match(chatRegex)) {
  const replacement = `<!-- AI CHAT WIDGET -->
  <div id="aiChatWidget" style="display:none; position:fixed; bottom:80px; right:20px; width:350px; height:500px; background:var(--surface); border:1px solid var(--border); border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,0.3); z-index:9999; flex-direction:column; overflow:hidden;">
    <div style="background:var(--accent); color:white; padding:15px; font-weight:bold; display:flex; justify-content:space-between; align-items:center;">
      <span>&#129302; AI Partner</span>
      <div>
        <button onclick="toggleChatSettings()" style="background:transparent; border:none; color:white; cursor:pointer; font-size:1.2rem; margin-right:10px;">&#9881;&#65039;</button>
        <button onclick="toggleAiChat()" style="background:transparent; border:none; color:white; cursor:pointer; font-size:1.2rem;">&#10006;</button>
      </div>
    </div>`;
  html = html.replace(chatRegex, replacement);
  
  // Also we need to strip the wrapping .card styles that were originally there
  // The original chat had: <div class="card" style="margin-bottom:20px;">
  html = html.replace('<div class="card" style="margin-bottom:20px;">', '<div style="padding:15px;">');
  // And the second card wrapper: <div class="card" style="display:flex; flex-direction:column; height:500px; padding:0; overflow:hidden;">
  html = html.replace('<div class="card" style="display:flex; flex-direction:column; height:500px; padding:0; overflow:hidden;">', '<div style="display:flex; flex-direction:column; flex:1; overflow:hidden;">');
}

// Add the FAB button
if (!html.includes('id="aiChatFab"')) {
  const fab = `
  <button id="aiChatFab" onclick="toggleAiChat()" style="position:fixed; bottom:20px; right:20px; width:55px; height:55px; border-radius:50%; background:var(--accent); color:white; border:none; box-shadow:0 4px 15px rgba(0,0,0,0.4); font-size:1.8rem; cursor:pointer; z-index:9999; display:flex; align-items:center; justify-content:center; transition:0.2s;">
    &#129302;
  </button>
  `;
  html = html.replace('</body>', fab + '\n</body>');
}

fs.writeFileSync('index.html', html, 'utf8');


let js = fs.readFileSync('script.js', 'utf8');

// Add toggleAiChat function
if (!js.includes('function toggleAiChat')) {
  js += `
function toggleAiChat() {
  const widget = document.getElementById('aiChatWidget');
  if (widget.style.display === 'none' || widget.style.display === '') {
    widget.style.display = 'flex';
  } else {
    widget.style.display = 'none';
  }
}
  `;
  fs.writeFileSync('script.js', js, 'utf8');
}

console.log("Flicker fixed and Chat made floating!");

