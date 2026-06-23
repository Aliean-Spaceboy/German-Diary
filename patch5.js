const fs = require('fs');

let js = fs.readFileSync('script.js', 'utf-8');

const oldToggle = `function toggleDropdown(e) {
  e.stopPropagation();
  document.getElementById('moreDropdown').classList.toggle('show');
}`;

const newToggle = `function toggleDropdown(e) {
  e.stopPropagation();
  const dropdown = document.getElementById('moreDropdown');
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  
  // Use fixed positioning to escape overflow:auto clipping
  dropdown.style.position = 'fixed';
  dropdown.style.top = (rect.bottom + 4) + 'px';
  dropdown.style.right = (window.innerWidth - rect.right) + 'px';
  dropdown.style.left = 'auto';
  
  dropdown.classList.toggle('show');
}`;

js = js.replace(oldToggle, newToggle);

// Also we must hide the dropdown when scrolling the nav, otherwise it will float weirdly
const hideLogic = `
document.querySelector('nav').addEventListener('scroll', () => {
  const dropdown = document.getElementById('moreDropdown');
  if (dropdown && dropdown.classList.contains('show')) {
    dropdown.classList.remove('show');
  }
});
`;

if (!js.includes('addEventListener(\'scroll\'')) {
  js += '\n' + hideLogic;
}

fs.writeFileSync('script.js', js, 'utf-8');

let css = fs.readFileSync('style.css', 'utf-8');
// remove position:absolute, let JS handle it as fixed
css = css.replace('.dropdown-content { display: none; position: absolute; right: 0; left: auto;', '.dropdown-content { display: none; ');
fs.writeFileSync('style.css', css, 'utf-8');

console.log("Dropdown overflow fix applied!");
