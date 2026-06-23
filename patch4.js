const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf-8');

const navRegex = /<nav>[\s\S]*?<\/nav>/;
const newNav = `<nav>
  <div class="nav-inner">
    <button class="nav-btn active" onclick="showSection('dashboard')">&#128202; Dashboard</button>
    <button class="nav-btn" onclick="showSection('diary')">&#128211; Diary</button>
    <button class="nav-btn" onclick="showSection('vocab')">&#128218; Vocabulary</button>
    <button class="nav-btn" onclick="showSection('speaking')">&#127892; Speaking</button>
    <button class="nav-btn" onclick="showSection('quiz')">&#129504; Quiz</button>
    
    <div class="dropdown">
      <button class="nav-btn drop-btn" onclick="toggleDropdown(event)">&#9776; More <span style="font-size:0.7rem">&#9660;</span></button>
      <div class="dropdown-content" id="moreDropdown">
        <button class="nav-btn" onclick="showSection('reflection')">&#129694; Weekly Reflection</button>
        <button class="nav-btn" onclick="showSection('entries')">&#128450; Past Entries</button>
        <button class="nav-btn" onclick="showSection('grammar')">&#9999;&#65039; Grammar Tips</button>
      </div>
    </div>
  </div>
</nav>`;

html = html.replace(navRegex, newNav);
fs.writeFileSync('index.html', html, 'utf-8');

// Also fix the CSS left/right issue for dropdown
let css = fs.readFileSync('style.css', 'utf-8');
css = css.replace('.dropdown-content { display: none; position: absolute; left: 0;', '.dropdown-content { display: none; position: absolute; right: 0; left: auto;');
fs.writeFileSync('style.css', css, 'utf-8');

console.log("Navbar fixed");
