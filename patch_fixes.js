const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Fix AI Chatbot Nav Button visibility
const chatNavRegex = /<button class="nav-btn" onclick="showSection\('chat'\)">.*?AI Chat<\/button>/;
if (html.match(chatNavRegex)) {
  // Remove it from wherever it currently is
  html = html.replace(chatNavRegex, "");
}
// Add it directly to the main visible nav menu
const vocabNav = /<button class="nav-btn" onclick="showSection\('dictionary'\)">.*?Dictionary<\/button>/;
if (html.match(vocabNav)) {
  html = html.replace(vocabNav, html.match(vocabNav)[0] + `\n    <button class="nav-btn" onclick="showSection('chat')" style="color:var(--accent); font-weight:800;">&#128172; AI Chat</button>`);
}

// 2. Remove standalone Check Grammar button
const grammarBtnRegex = /\s*<button class="btn btn-primary" onclick="checkDiaryGrammar\(\)">.*?Check Grammar \(AI\)<\/button>/;
if (html.match(grammarBtnRegex)) {
  html = html.replace(grammarBtnRegex, "");
}

fs.writeFileSync('index.html', html, 'utf8');


// 3. Automate Dictionary Fallback
let js = fs.readFileSync('script.js', 'utf8');

const dictFallbackRegex = /if \(wordMatches\.length === 0 && sentMatches\.length === 0\) \{[\s\S]*?return;\n  \}/;

const automatedFallback = `if (wordMatches.length === 0 && sentMatches.length === 0) {
    resEl.innerHTML = '<div style="text-align:center; padding:30px; font-weight:bold; color:var(--accent)">&#8987; Not in offline database. Fetching from Cloud AI...</div>';
    
    // Automatically trigger the cloud fallback!
    liveTranslateFallback(term);
    return;
  }`;

if (js.match(dictFallbackRegex)) {
  js = js.replace(dictFallbackRegex, automatedFallback);
}

fs.writeFileSync('script.js', js, 'utf8');
console.log("Fixes applied!");

