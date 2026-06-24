const fs = require('fs');

let js = fs.readFileSync('script.js', 'utf8');

js = js.replace(/localStorage\.setItem\('dt_warmup_count', wCount \+ 1\); \/\/ Increase difficulty for tomorrow!\n   else \{/, "localStorage.setItem('dt_warmup_count', wCount + 1); // Increase difficulty for tomorrow!\n  } else {");

fs.writeFileSync('script.js', js, 'utf8');
console.log("Brace fixed!");
