const fs = require('fs');
let js = fs.readFileSync('script.js', 'utf8');

const regex = /const sentMatches = Array\.from\(allSents\.values\(\)\)\.filter\(s => \{[\s\S]*?\}\)\.slice\(0, 20\);/;

const newLogic = `const sentMatches = Array.from(allSents.values()).filter(s => {
    if (term === 'der' || term === 'die' || term === 'das') return false;
    
    const deLow = s.de.toLowerCase();
    const enLow = s.en.toLowerCase();
    return boundaryRegex.test(deLow) || boundaryRegex.test(enLow);
  }).slice(0, 20);`;

if(js.match(regex)) {
  js = js.replace(regex, newLogic);
  fs.writeFileSync('script.js', js, 'utf8');
  console.log("Sentences patched to block articles!");
} else {
  console.log("Could not find Sentences logic to patch.");
}
