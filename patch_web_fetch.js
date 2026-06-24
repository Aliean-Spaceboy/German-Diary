const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf-8');

// Add "Fetch from Web URL" button to Vocabulary Tab
const vocabUploadsHtmlRegex = /<button class="btn btn-outline btn-sm" style="border-color:var\(--gold\); color:var\(--gold\)">Upload Sentences \(CSV\)<\/button>[\s\S]*?<\/div>\s*<\/div>/;

const newUploads = `<button class="btn btn-outline btn-sm" style="border-color:var(--gold); color:var(--gold)">Upload Sentences (CSV)</button>
          <input type="file" accept=".csv" onchange="importSentenceCsv(event)" style="position:absolute; left:0; top:0; opacity:0; cursor:pointer; height:100%">
        </div>
        
        <div style="position:relative; overflow:hidden; display:inline-block">
          <button class="btn btn-outline btn-sm" style="border-color:#10b981; color:#10b981" onclick="fetchCsvFromWeb()">&#127183; Fetch from Web URL</button>
        </div>
      </div>`;

if (html.includes('Upload Sentences (CSV)') && !html.includes('Fetch from Web URL')) {
  html = html.replace(vocabUploadsHtmlRegex, newUploads);
  fs.writeFileSync('index.html', html, 'utf-8');
}


let js = fs.readFileSync('script.js', 'utf-8');

const fetchLogic = `
async function fetchCsvFromWeb() {
  const url = prompt("Enter the raw CSV URL (e.g., a Raw GitHub link or public CSV):\\n\\nNote: The file must be in 'German,English' format.", "https://raw.githubusercontent.com/.../words.csv");
  if (!url || url.trim() === "" || url.includes('...')) return;

  try {
    showToast('? Downloading from Web...', 'var(--gold)');
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network response was not ok');
    
    const text = await res.text();
    const lines = text.split('\\n');
    let added = 0;
    
    lines.forEach(line => {
      const parts = line.split(',');
      if (parts.length >= 2) {
        const de = parts[0].trim();
        const en = parts[1].trim();
        if (de && en && !vocab.find(v => v.de === de)) {
          vocab.push({ de, en, level: 0, nextReview: Date.now() });
          added++;
        }
      }
    });
    
    if (added > 0) {
      save('dt_vocab', vocab);
      renderVocab();
      showToast('?? Successfully imported ' + added + ' words from the Web!');
    } else {
      showToast('?? No new valid words found in that URL.');
    }
  } catch (error) {
    console.error("Fetch error: ", error);
    showToast('? Failed to fetch. Make sure it is a valid raw URL and allows CORS.', 'var(--danger)');
  }
}
`;

if (!js.includes('function fetchCsvFromWeb')) {
  js += '\n' + fetchLogic;
  fs.writeFileSync('script.js', js, 'utf-8');
}

console.log("Web Fetcher button injected!");
