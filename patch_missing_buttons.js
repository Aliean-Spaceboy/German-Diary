const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');

// 1. Inject Vocab/Sentence Uploads into Vocabulary section
// Look for the "Quick Test (Flashcard)" card
const vocabRegex = /<div class="card">\s*<div class="card-title">.*?Quick Test \(Flashcard\)/;

const vocabUploadHtml = `
  <div class="card" style="margin-bottom:20px;background:var(--surface2)">
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
      <div>
        <div style="font-weight:700">?? Bulk CSV Importers</div>
        <div style="font-size:0.8rem;color:var(--text-muted)">Upload .csv files (Format: German,English) to load thousands of words/sentences!</div>
      </div>
      <div style="display:flex; gap:10px; flex-wrap:wrap">
        <div style="position:relative; overflow:hidden; display:inline-block">
          <button class="btn btn-outline btn-sm">Upload Vocab (CSV)</button>
          <input type="file" accept=".csv" onchange="importCsv(event)" style="position:absolute; left:0; top:0; opacity:0; cursor:pointer; height:100%">
        </div>
        <div style="position:relative; overflow:hidden; display:inline-block">
          <button class="btn btn-outline btn-sm" style="border-color:var(--gold); color:var(--gold)">Upload Sentences (CSV)</button>
          <input type="file" accept=".csv" onchange="importSentenceCsv(event)" style="position:absolute; left:0; top:0; opacity:0; cursor:pointer; height:100%">
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-title">&#129300; Quick Test (Flashcard)`;

if (!html.includes('Upload Sentences (CSV)')) {
  html = html.replace(vocabRegex, vocabUploadHtml);
  console.log("Vocab upload buttons injected.");
}

// 2. Inject Story Upload into Reading section
// Look for the "Story 3" button
const storiesRegex = /<button class="btn btn-outline" onclick="loadStory\(2\)">Story 3<\/button>[\s\S]*?<\/div>/;
const storiesUploadHtml = `<button class="btn btn-outline" onclick="loadStory(2)">Story 3</button>
        <button class="btn btn-outline" id="storyBtn3" onclick="loadStory(3)" style="display:none">Story 4</button>
        <button class="btn btn-outline" id="storyBtn4" onclick="loadStory(4)" style="display:none">Story 5</button>
        
        <div style="position:relative; overflow:hidden; display:inline-block; margin-left:auto">
          <button class="btn btn-outline btn-sm" style="border-color:var(--accent); color:var(--accent)">Upload Stories (JSON)</button>
          <input type="file" accept=".json" onchange="importStoryJson(event)" style="position:absolute; left:0; top:0; opacity:0; cursor:pointer; height:100%">
        </div>
      </div>`;

if (!html.includes('Upload Stories (JSON)')) {
  html = html.replace(storiesRegex, storiesUploadHtml);
  console.log("Stories upload button injected.");
}

fs.writeFileSync('index.html', html, 'utf-8');
