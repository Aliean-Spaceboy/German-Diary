const fs = require('fs');
let js = fs.readFileSync('script.js', 'utf8');

const regex = /const wordMatches = Array\.from\(allWords\.values\(\)\)\.filter\(v => \{[\s\S]*?\}\)\.slice\(0, 20\);/;

const newLogic = `const wordMatches = Array.from(allWords.values()).filter(v => {
    const deLow = v.de.toLowerCase();
    const enLow = v.en.toLowerCase();
    const strippedDe = deLow.replace(/^(der|die|das)\\s+/, '');
    
    // 1. Exact Matches always win
    if (deLow === term || enLow === term || strippedDe === term) return true;
    
    // 2. Stop articles from flooding partial matches
    if (term === 'der' || term === 'die' || term === 'das') return false;
    
    // 3. Word-Boundary Partial Match (Prevents "ich" from matching "nicht")
    // It only matches if a word *starts* with the term
    // Escape special regex chars from term just in case
    const safeTerm = term.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\\\$&');
    const boundaryRegex = new RegExp(\`(?:^|\\\\s|-)\${safeTerm}\`, 'i');
    
    return boundaryRegex.test(deLow) || boundaryRegex.test(enLow);
  }).slice(0, 20);`;

if(js.match(regex)) {
  js = js.replace(regex, newLogic);
  
  // We should also apply this to sentMatches!
  const sentRegex = /const sentMatches = Array\.from\(allSents\.values\(\)\)\.filter\(s => s\.de\.toLowerCase\(\)\.includes\(term\) \|\| s\.en\.toLowerCase\(\)\.includes\(term\)\)\.slice\(0, 20\);/;
  
  const newSentLogic = `const sentMatches = Array.from(allSents.values()).filter(s => {
    const deLow = s.de.toLowerCase();
    const enLow = s.en.toLowerCase();
    const safeTerm = term.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\\\$&');
    const boundaryRegex = new RegExp(\`(?:^|\\\\s|-)\${safeTerm}\`, 'i');
    return boundaryRegex.test(deLow) || boundaryRegex.test(enLow);
  }).slice(0, 20);`;
  
  js = js.replace(sentRegex, newSentLogic);
  
  fs.writeFileSync('script.js', js, 'utf8');
  console.log("Dictionary patched with Word-Boundary Regex!");
} else {
  console.log("Could not find Dictionary logic to patch.");
}
