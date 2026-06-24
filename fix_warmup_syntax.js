const fs = require('fs');

let js = fs.readFileSync('script.js', 'utf8');

const danglingRegex = /\} else \{\s*showToast\('&#10060; Incorrect\. Try again!', 'var\(--danger\)'\);\s*\}\s*\}/;

if (js.match(danglingRegex)) {
  js = js.replace(danglingRegex, '');
  fs.writeFileSync('script.js', js, 'utf8');
  console.log("Syntax error fixed!");
} else {
  console.log("Could not find dangling regex.");
}
