const fs = require('fs');
const js = fs.readFileSync('script.js', 'utf8');

const html = fs.readFileSync('index.html', 'utf8');

// Use JSDOM to test!
const { JSDOM } = require('jsdom');
const dom = new JSDOM(html, { runScripts: "dangerously" });

try {
  dom.window.eval(js);
  dom.window.eval("showSection('reading')");
  console.log("Success! Display:", dom.window.document.getElementById('readingContent').style.display);
} catch(e) {
  console.log("ERROR!", e.message);
}
