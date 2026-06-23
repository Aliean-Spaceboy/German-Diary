const fs = require('fs');

// --- 1. PATCH INDEX.HTML ---
let html = fs.readFileSync('index.html', 'utf-8');

const oldNavRegex = /<nav>[\s\S]*?<\/nav>/;
const newNav = `<nav>
  <div class="nav-inner">
    <button class="nav-btn active" onclick="showSection('dashboard')">?? Dashboard</button>
    <button class="nav-btn" onclick="showSection('diary')">?? Diary</button>
    <button class="nav-btn" onclick="showSection('vocab')">?? Vocabulary</button>
    
    <div class="dropdown">
      <button class="nav-btn drop-btn" onclick="toggleDropdown(event)">? More <span style="font-size:0.7rem">?</span></button>
      <div class="dropdown-content" id="moreDropdown">
        <button class="nav-btn" onclick="showSection('speaking')">?? Speaking</button>
        <button class="nav-btn" onclick="showSection('reflection')">?? Weekly Reflection</button>
        <button class="nav-btn" onclick="showSection('quiz')">?? Quiz</button>
        <button class="nav-btn" onclick="showSection('entries')">?? Past Entries</button>
        <button class="nav-btn" onclick="showSection('grammar')">?? Grammar Tips</button>
        <button class="nav-btn" onclick="showSection('sentencebuilder')">?? Sentence Builder</button>
        <button class="nav-btn" onclick="showSection('srs')">?? SRS Review</button>
        <button class="nav-btn" onclick="showSection('dictation')">?? Dictation</button>
      </div>
    </div>
  </div>
</nav>`;
html = html.replace(oldNavRegex, newNav);
fs.writeFileSync('index.html', html, 'utf-8');

// --- 2. PATCH STYLE.CSS ---
let css = fs.readFileSync('style.css', 'utf-8');
if (!css.includes('DROPDOWN MENU')) {
  css += `\n/* DROPDOWN MENU */
.dropdown { position: relative; display: inline-block; }
.drop-btn { display:flex; align-items:center; gap:6px; }
.dropdown-content { display: none; position: absolute; left: 0; top: 100%; background: var(--surface); border: 1px solid var(--border); box-shadow: var(--shadow); z-index: 200; border-radius: 12px; flex-direction: column; min-width: 200px; padding: 6px; }
.dropdown-content .nav-btn { width: 100%; text-align: left; padding: 12px 16px; border: none; border-radius: 8px; }
.dropdown-content .nav-btn:hover { background: rgba(91,141,238,0.1); }
.dropdown-content.show { display: flex; animation: fadeIn 0.2s ease; }\n`;
  fs.writeFileSync('style.css', css, 'utf-8');
}

// --- 3. PATCH SCRIPT.JS ---
let js = fs.readFileSync('script.js', 'utf-8');

const toggleFunc = `function toggleDropdown(e) {
  e.stopPropagation();
  document.getElementById('moreDropdown').classList.toggle('show');
}

window.onclick = function(event) {
  if (!event.target.matches('.drop-btn') && !event.target.closest('.drop-btn')) {
    const dropdown = document.getElementById('moreDropdown');
    if (dropdown && dropdown.classList.contains('show')) {
      dropdown.classList.remove('show');
    }
  }
}`;

if (!js.includes('toggleDropdown')) {
  js += '\n' + toggleFunc + '\n';
  
  // also inject the logic to hide dropdown inside showSection
  js = js.replace("document.getElementById('section-' + id).classList.add('active');", 
  "document.getElementById('section-' + id).classList.add('active');\n  const dropdown = document.getElementById('moreDropdown');\n  if(dropdown && dropdown.classList.contains('show')) dropdown.classList.remove('show');");
  
  fs.writeFileSync('script.js', js, 'utf-8');
}

console.log("Fully Patched CSS, JS, and HTML!");
