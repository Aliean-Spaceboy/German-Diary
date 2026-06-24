const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Inject LingQ styles into the head
if (!html.includes('.lingq-word')) {
  const styles = `
  <style>
    .lingq-word { cursor:pointer; padding:2px; border-radius:4px; transition:0.2s; display:inline-block; }
    .lingq-word:hover { background:var(--accent); color:white; }
    #lingqTooltip { position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:var(--surface); border:2px solid var(--accent); padding:15px; border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,0.3); z-index:9999; display:none; flex-direction:column; gap:10px; min-width:300px; text-align:center; }
  </style>
  `;
  html = html.replace('</head>', styles + '</head>');
}

// Inject tooltip div
if (!html.includes('id="lingqTooltip"')) {
  html = html.replace('</body>', `
  <div id="lingqTooltip">
    <div style="font-weight:800; font-size:1.2rem; color:var(--text)" id="lingqDe"></div>
    <div style="color:var(--text-muted); font-size:1rem" id="lingqEn"></div>
    <div style="display:flex; gap:10px; margin-top:10px">
      <button class="btn btn-outline" style="flex:1" onclick="document.getElementById('lingqTooltip').style.display='none'">Close</button>
      <button class="btn btn-primary" style="flex:2" id="lingqSaveBtn" onclick="saveLingqWord()">&#10024; Save to Flashcards</button>
    </div>
  </div>
  \n</body>`);
}

fs.writeFileSync('index.html', html, 'utf8');


let js = fs.readFileSync('script.js', 'utf8');

const phase4Logic = `
// PHASE 4: LIVE NEWS & LINGQ EXTRACTION
async function fetchLiveNews() {
  const container = document.getElementById('storyBtnContainer');
  const ogHtml = container.innerHTML;
  container.innerHTML = '&#8987; Fetching live news from Deutsche Welle...';
  
  try {
    const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://rss.dw.com/xml/rss-de-all');
    const data = await res.json();
    
    if (data && data.items) {
      // Repurpose STORIES array or just render them as buttons
      STORIES = data.items.map(item => ({
        title: item.title,
        text: item.description + '<br><br><a href="' + item.link + '" target="_blank" style="color:var(--accent)">Read full article on DW...</a>',
        questions: [
          { text: "Did you understand the main point of this article?", answer: true },
          { text: "Were there many new vocabulary words?", answer: true },
          { text: "Did you extract at least 1 new word?", answer: true }
        ]
      }));
      
      showToast('&#10024; Live news fetched!', 'var(--success)');
      renderReadingMenu();
    }
  } catch(e) {
    container.innerHTML = ogHtml;
    showToast('Failed to fetch live news. Are you offline?', 'var(--danger)');
  }
}

// Override renderReadingMenu to add the News button
const ogRenderReadingMenu = typeof renderReadingMenu !== 'undefined' ? renderReadingMenu : function(){};
renderReadingMenu = function() {
  const container = document.getElementById('storyBtnContainer');
  if(!container) return;
  container.innerHTML = \`<button class="btn btn-primary" onclick="fetchLiveNews()">&#128240; Fetch Live News (DW)</button>\` + 
  STORIES.map((s, i) => \`<button class="btn btn-outline" onclick="loadStory(\${i})">\${s.title}</button>\`).join('') + \`
    <div style="position:relative; overflow:hidden; display:inline-block; margin-left:auto">
      <button class="btn btn-outline btn-sm" style="border-color:var(--accent); color:var(--accent)">Upload Stories (JSON)</button>
      <input type="file" accept=".json" onchange="importStoryJson(event)" style="position:absolute; left:0; top:0; opacity:0; cursor:pointer; height:100%">
    </div>
  \`;
}

// Override loadStory to make text Interactive (LingQ Method)
const ogLoadStory = typeof loadStory !== 'undefined' ? loadStory : function(){};
loadStory = function(index) {
  ogLoadStory(index);
  // Now make the text interactive!
  const textEl = document.getElementById('storyText');
  let rawHtml = textEl.innerHTML;
  
  // A simple regex to wrap words in spans, ignoring HTML tags
  // We temporarily replace a tags to avoid wrapping their attributes
  const tempLinks = [];
  rawHtml = rawHtml.replace(/<a [^>]+>.*?<\\/a>/g, match => {
    tempLinks.push(match);
    return \`###LINK\${tempLinks.length-1}###\`;
  });
  
  // Wrap words
  rawHtml = rawHtml.replace(/([a-zA-Z‰ˆ¸ƒ÷‹ﬂ]+)/g, '<span class="lingq-word" onclick="translateLingqWord(this.innerText)">$1</span>');
  
  // Restore links
  rawHtml = rawHtml.replace(/###LINK(\\d+)###/g, (match, p1) => tempLinks[parseInt(p1)]);
  
  textEl.innerHTML = rawHtml;
};

// LingQ Translation Engine
let currentLingqWord = '';
let currentLingqTranslation = '';

async function translateLingqWord(word) {
  // strip punctuation from word just in case
  const cleanWord = word.replace(/[^a-zA-Z‰ˆ¸ƒ÷‹ﬂ]/g, '');
  if (!cleanWord) return;
  
  currentLingqWord = cleanWord;
  const tooltip = document.getElementById('lingqTooltip');
  const deEl = document.getElementById('lingqDe');
  const enEl = document.getElementById('lingqEn');
  const saveBtn = document.getElementById('lingqSaveBtn');
  
  deEl.innerText = cleanWord;
  enEl.innerHTML = '&#8987; Translating...';
  saveBtn.disabled = true;
  tooltip.style.display = 'flex';
  
  try {
    const res = await fetch(\`https://api.mymemory.translated.net/get?q=\${encodeURIComponent(cleanWord)}&langpair=de|en\`);
    const data = await res.json();
    if (data && data.responseData && data.responseData.translatedText) {
      currentLingqTranslation = data.responseData.translatedText;
      enEl.innerText = currentLingqTranslation;
      saveBtn.disabled = false;
    } else {
      enEl.innerText = 'Translation not found.';
    }
  } catch(e) {
    enEl.innerText = 'Offline. Cannot translate.';
  }
}

function saveLingqWord() {
  if(!currentLingqWord || !currentLingqTranslation) return;
  
  vocab_pool.unshift({
    de: currentLingqWord,
    en: currentLingqTranslation,
    level: currentLevelIndex || 0,
    nextReview: Date.now()
  });
  save('dt_vocab_pool', vocab_pool);
  
  showToast('&#10024; Saved to Flashcards!', 'var(--success)');
  document.getElementById('lingqTooltip').style.display = 'none';
}
`;

if (!js.includes('function fetchLiveNews')) {
  js += '\n' + phase4Logic;
  fs.writeFileSync('script.js', js, 'utf8');
}

console.log("Phase 4: Live News & LingQ Implemented!");

