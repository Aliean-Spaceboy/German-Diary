const fs = require('fs');
let js = fs.readFileSync('script.js', 'utf8');

const regex = /const wordMatches = Array\.from\(allWords\.values\(\)\)\.filter\(v => v\.de\.toLowerCase\(\)\.includes\(term\) \|\| v\.en\.toLowerCase\(\)\.includes\(term\)\)\.slice\(0, 20\);/;

const newLogic = `const wordMatches = Array.from(allWords.values()).filter(v => {
    const deLow = v.de.toLowerCase();
    const enLow = v.en.toLowerCase();
    const strippedDe = deLow.replace(/^(der|die|das)\\s+/, '');
    
    // 1. Exact Matches always win
    if (deLow === term || enLow === term || strippedDe === term) return true;
    
    // 2. Stop articles from flooding partial matches
    if (term === 'der' || term === 'die' || term === 'das') return false;
    
    // 3. Normal live-filtering for everything else (case-insensitive partial match)
    return deLow.includes(term) || enLow.includes(term);
  }).slice(0, 20);`;

if(js.match(regex)) {
  js = js.replace(regex, newLogic);
  fs.writeFileSync('script.js', js, 'utf8');
  console.log("Dictionary patched to fix article flooding!");
} else {
  console.log("Could not find Dictionary logic to patch.");
}
