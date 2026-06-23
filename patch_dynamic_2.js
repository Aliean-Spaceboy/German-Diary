const fs = require('fs');

// --- HTML PATCH ---
let html = fs.readFileSync('index.html', 'utf-8');

// A. Vocabulary Tab: Add "Upload Sentences" button next to "Upload CSV"
const vocabUploadHtml = `
      <div style="position:relative; overflow:hidden; display:inline-block; margin-right:8px">
        <button class="btn btn-outline btn-sm">Upload Vocab (CSV)</button>
        <input type="file" accept=".csv" onchange="importCsv(event)" style="position:absolute; left:0; top:0; opacity:0; cursor:pointer; height:100%">
      </div>
      <div style="position:relative; overflow:hidden; display:inline-block">
        <button class="btn btn-outline btn-sm" style="border-color:var(--gold); color:var(--gold)">Upload Sentences (CSV)</button>
        <input type="file" accept=".csv" onchange="importSentenceCsv(event)" style="position:absolute; left:0; top:0; opacity:0; cursor:pointer; height:100%">
      </div>
`;

const oldVocabUpload = `<div style="position:relative; overflow:hidden; display:inline-block">
        <button class="btn btn-outline btn-sm">Upload CSV</button>
        <input type="file" accept=".csv" onchange="importCsv(event)" style="position:absolute; left:0; top:0; opacity:0; cursor:pointer; height:100%">
      </div>`;

if (html.includes('Upload CSV') && !html.includes('Upload Sentences')) {
  html = html.replace(oldVocabUpload, vocabUploadHtml);
}

// B. Reading Practice Tab: Add "Upload Stories (JSON)" button
const storiesUploadHtml = `
      <div style="margin-bottom: 20px; display:flex; gap:10px; flex-wrap:wrap">
        <button class="btn btn-outline" onclick="loadStory(0)">Story 1</button>
        <button class="btn btn-outline" onclick="loadStory(1)">Story 2</button>
        <button class="btn btn-outline" onclick="loadStory(2)">Story 3</button>
        <button class="btn btn-outline" id="storyBtn3" onclick="loadStory(3)" style="display:none">Story 4</button>
        <button class="btn btn-outline" id="storyBtn4" onclick="loadStory(4)" style="display:none">Story 5</button>
        
        <div style="position:relative; overflow:hidden; display:inline-block; margin-left:auto">
          <button class="btn btn-outline btn-sm" style="border-color:var(--accent); color:var(--accent)">Upload Stories (JSON)</button>
          <input type="file" accept=".json" onchange="importStoryJson(event)" style="position:absolute; left:0; top:0; opacity:0; cursor:pointer; height:100%">
        </div>
      </div>
`;

const oldStoriesHeader = `<div style="margin-bottom: 20px; display:flex; gap:10px">
        <button class="btn btn-outline" onclick="loadStory(0)">Story 1</button>
        <button class="btn btn-outline" onclick="loadStory(1)">Story 2</button>
        <button class="btn btn-outline" onclick="loadStory(2)">Story 3</button>
      </div>`;

if (html.includes(oldStoriesHeader) && !html.includes('Upload Stories')) {
  html = html.replace(oldStoriesHeader, storiesUploadHtml);
}

fs.writeFileSync('index.html', html, 'utf-8');

// --- JS PATCH ---
let js = fs.readFileSync('script.js', 'utf-8');

const importLogicJs = `
// --- DYNAMIC IMPORTERS ---
function importSentenceCsv(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    const lines = text.split('\\n');
    let added = 0;
    
    lines.forEach(line => {
      const parts = line.split(',');
      if (parts.length >= 2) {
        const de = parts[0].trim();
        const en = parts[1].trim();
        if (de && en && !DAILY_SENTENCES.find(s => s.de === de)) {
          DAILY_SENTENCES.push({ de, en });
          added++;
        }
      }
    });
    
    if (added > 0) {
      save('dt_sentences', DAILY_SENTENCES);
      showToast('?? Successfully imported ' + added + ' new sentences!');
    } else {
      showToast('?? No valid new sentences found in CSV.');
    }
    event.target.value = '';
  };
  reader.readAsText(file);
}

function importStoryJson(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (!Array.isArray(data)) { throw new Error('JSON must be an array of stories.'); }
      
      let added = 0;
      data.forEach(story => {
        if (story.title && story.text && story.questions && story.questions.length === 3) {
          STORIES.push(story);
          added++;
        }
      });
      
      if (added > 0) {
        save('dt_stories', STORIES);
        showToast('?? Successfully imported ' + added + ' new stories!');
        updateStoryButtons();
      } else {
        showToast('?? No valid stories found. Ensure format is correct.');
      }
    } catch (err) {
      showToast('? Error: Invalid JSON File');
    }
    event.target.value = '';
  };
  reader.readAsText(file);
}

function updateStoryButtons() {
  if (STORIES.length > 3) document.getElementById('storyBtn3').style.display = 'inline-block';
  if (STORIES.length > 4) document.getElementById('storyBtn4').style.display = 'inline-block';
}

// Hook showSection to update story buttons if needed
const originalShowSectionReadingDynamic = showSection;
showSection = function(id) {
  originalShowSectionReadingDynamic(id);
  if (id === 'reading') {
    updateStoryButtons();
  }
};
`;

if (!js.includes('function importSentenceCsv')) {
  js += '\n' + importLogicJs;
  fs.writeFileSync('script.js', js, 'utf-8');
}

console.log('Task 2 Complete: Upload logic added');
