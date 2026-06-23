const fs = require('fs');
let js = fs.readFileSync('script.js', 'utf-8');

const fixJs = `
// Hook reading section to auto-load Story 1
const originalShowSectionReading = showSection;
showSection = function(id) {
  originalShowSectionReading(id);
  if (id === 'reading' && document.getElementById('readingContent').style.display === 'none') {
    loadStory(0); // Auto-load the first story
  }
};
`;

if (!js.includes('loadStory(0); // Auto-load')) {
  js += '\n' + fixJs;
  fs.writeFileSync('script.js', js, 'utf-8');
  console.log("Reading auto-load applied!");
} else {
  console.log("Already applied!");
}
