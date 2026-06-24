const fs = require('fs');

// --- HTML Patch ---
let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove the entire "Sentence Packs" card from the top of section-diary
const sentencePacksCardRegex = /<div class="card" style="margin-bottom:24px;background:var\(--surface2\)">[\s\S]*?<div style="font-weight:700">&#128218; Sentence Packs<\/div>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
html = html.replace(sentencePacksCardRegex, '');

// 2. Inject the button next to Save Entry and Clear
const saveEntryRegex = /<button class="btn btn-success" onclick="saveDiaryEntry\(\)">.*?Save Entry<\/button>\s*<button class="btn btn-outline" onclick="clearDiary\(\)">.*?Clear<\/button>/;

const newButtons = `<button class="btn btn-success" onclick="saveDiaryEntry()">&#128190; Save Entry</button>
        <button class="btn btn-outline" onclick="clearDiary()">&#128465; Clear</button>
        <div style="position:relative; overflow:hidden; display:inline-block">
          <button class="btn btn-outline" style="border-color:var(--gold); color:var(--gold)">&#128193; Upload Sentences (CSV)</button>
          <input type="file" accept=".csv" onchange="importSentenceCsv(event)" style="position:absolute; left:0; top:0; opacity:0; cursor:pointer; height:100%">
        </div>`;

if(html.match(saveEntryRegex)) {
  html = html.replace(saveEntryRegex, newButtons);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log("Button moved successfully to Save/Clear area!");
} else {
  console.log("Could not find the Save/Clear buttons.");
}

// --- JS Patch ---
let js = fs.readFileSync('script.js', 'utf8');

const oldSotdRegex = /const s = DAILY_SENTENCES\.length > 0 \? DAILY_SENTENCES\[Math\.floor\(Math\.random\(\) \* DAILY_SENTENCES\.length\)\] : \{de: 'Lerne jeden Tag!', en: 'Learn every day!'\};/;

const newSotdLogic = `const allSents = [...DAILY_SENTENCES, ...sentences_pool];
  const s = allSents.length > 0 ? allSents[Math.floor(Math.random() * allSents.length)] : {de: 'Lerne jeden Tag!', en: 'Learn every day!'};`;

if(js.match(oldSotdRegex)) {
  js = js.replace(oldSotdRegex, newSotdLogic);
  fs.writeFileSync('script.js', js, 'utf8');
  console.log("SOTD logic updated to be fully random!");
} else {
  console.log("Could not find SOTD logic.");
}

