const fs = require('fs');
let js = fs.readFileSync('script.js', 'utf8');

// 1. Refactor initializers
js = js.replace("let vocab = load('dt_vocab', DEFAULT_VOCAB);", `
let vocab = load('dt_vocab', []);
let vocab_pool = load('dt_vocab_pool', DEFAULT_VOCAB);
`.trim());

js = js.replace("let DAILY_SENTENCES = load('dt_sentences', DEFAULT_SENTENCES);", `
let DAILY_SENTENCES = load('dt_sentences', []);
let sentences_pool = load('dt_sentences_pool', DEFAULT_SENTENCES);
`.trim());

js = js.replace("let STORIES = load('dt_stories', DEFAULT_STORIES);", `
let STORIES = load('dt_stories', []);
let stories_pool = load('dt_stories_pool', DEFAULT_STORIES);
`.trim());

// 2. Inject checkDailyUnlock()
const unlockLogic = `
function checkDailyUnlock() {
  const lastUnlock = load('dt_last_unlock', '');
  const today = todayStr();
  
  if (lastUnlock !== today) {
    let unlocked = 0;
    
    // Unlock 10 words
    for(let i=0; i<10; i++) {
      if(vocab_pool.length > 0) {
        const w = vocab_pool.shift();
        if(!vocab.find(x => x.de === w.de)) {
          vocab.push(w);
          unlocked++;
        }
      }
    }
    
    // Unlock 1 sentence
    if(sentences_pool.length > 0) {
      const s = sentences_pool.shift();
      if(!DAILY_SENTENCES.find(x => x.de === s.de)) {
        DAILY_SENTENCES.push(s);
        unlocked++;
      }
    }
    
    // Unlock 1 story
    if(stories_pool.length > 0) {
      const st = stories_pool.shift();
      if(!STORIES.find(x => x.title === st.title)) {
        STORIES.push(st);
        unlocked++;
      }
    }
    
    if (unlocked > 0) {
      save('dt_vocab', vocab);
      save('dt_vocab_pool', vocab_pool);
      save('dt_sentences', DAILY_SENTENCES);
      save('dt_sentences_pool', sentences_pool);
      save('dt_stories', STORIES);
      save('dt_stories_pool', stories_pool);
      save('dt_last_unlock', today);
      
      // Give UI time to load, then show toast
      setTimeout(() => {
        showToast('?? Daily Unlock! 10 Words, 1 Sentence, 1 Story added!', 'var(--gold)');
        renderVocab();
        renderDashboard();
        renderReading();
      }, 1500);
    }
  }
}

// Call checkDailyUnlock after everything is initialized
document.addEventListener('DOMContentLoaded', () => {
  checkDailyUnlock();
});
`;

if (!js.includes('checkDailyUnlock')) {
  js += '\n' + unlockLogic;
  fs.writeFileSync('script.js', js, 'utf8');
  console.log("checkDailyUnlock logic injected!");
} else {
  console.log("checkDailyUnlock already exists.");
}
