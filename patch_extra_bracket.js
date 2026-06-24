const fs = require('fs');
let js = fs.readFileSync('script.js', 'utf8');

js = js.replace("    hm.appendChild(cell);\n  }\n}\n}", "    hm.appendChild(cell);\n  }\n}");

fs.writeFileSync('script.js', js, 'utf8');
console.log("Extra bracket removed!");
