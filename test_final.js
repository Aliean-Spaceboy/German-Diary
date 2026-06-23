const fs = require('fs');
const js = fs.readFileSync('script.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');

const { JSDOM } = require('jsdom');
const dom = new JSDOM(html, { runScripts: "dangerously" });

try {
  dom.window.eval(js);
  dom.window.eval("showSection('reading')");
  console.log("Success! readingContent display:", dom.window.document.getElementById('readingContent').style.display);
} catch(e) {
  console.log("ERROR CAUGHT!");
  console.log(e);
}
