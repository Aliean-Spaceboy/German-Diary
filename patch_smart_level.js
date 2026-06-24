const fs = require('fs');
let js = fs.readFileSync('script.js', 'utf8');

// 1. Inject migration logic right after checking ONE-TIME MIGRATION
const migrationRegex = /localStorage\.removeItem\('dt_last_unlock'\);\s*\}/;
const taggingMigration = `

// Tagging Migration
if (vocab_pool.length > 0 && !vocab_pool[0].lvl) {
  console.log("Tagging vocab pool with levels");
  const vLen = vocab_pool.length;
  vocab_pool.forEach((w, i) => {
    if (i < vLen * 0.25) w.lvl = 'A1';
    else if (i < vLen * 0.5) w.lvl = 'A2';
    else if (i < vLen * 0.75) w.lvl = 'B1';
    else w.lvl = 'B2';
  });
  save('dt_vocab_pool', vocab_pool);
  
  // also reset the last unlock to force an immediate demonstration of the new Smart Unlock today
  localStorage.removeItem('dt_last_unlock');
}

if (sentences_pool.length > 0 && !sentences_pool[0].lvl) {
  console.log("Tagging sentences pool with levels");
  const sLen = sentences_pool.length;
  sentences_pool.forEach((s, i) => {
    if (i < sLen * 0.25) s.lvl = 'A1';
    else if (i < sLen * 0.5) s.lvl = 'A2';
    else if (i < sLen * 0.75) s.lvl = 'B1';
    else s.lvl = 'B2';
  });
  save('dt_sentences_pool', sentences_pool);
}
`;

if (js.match(migrationRegex)) {
  js = js.replace(migrationRegex, "localStorage.removeItem('dt_last_unlock');\n}\n" + taggingMigration);
}

// 2. Rewrite checkDailyUnlock function
const oldUnlockRegex = /function checkDailyUnlock\(\) \{[\s\S]*?\}\s*\n\}\s*\n/m;
const newUnlockLogic = `function checkDailyUnlock() {
  const lastUnlock = load('dt_last_unlock', '');
  const today = todayStr();
  
  if (lastUnlock !== today) {
    let unlocked = 0;
    
    const roadmap = load('dt_roadmap', {});
    const activeLevel = ['A1', 'A2', 'B1', 'B2'].find(l => !roadmap[l]) || 'B2';
    
    // Unlock 10 words
    for(let i=0; i<10; i++) {
      const idx = vocab_pool.findIndex(w => w.lvl === activeLevel);
      if(idx > -1) {
        const w = vocab_pool.splice(idx, 1)[0];
        if(!vocab.find(x => x.de === w.de)) { vocab.push(w); unlocked++; }
      } else if(vocab_pool.length > 0) {
        const w = vocab_pool.shift();
        if(!vocab.find(x => x.de === w.de)) { vocab.push(w); unlocked++; }
      }
    }
    
    // Unlock 1 sentence
    const sIdx = sentences_pool.findIndex(s => s.lvl === activeLevel);
    if(sIdx > -1) {
      const s = sentences_pool.splice(sIdx, 1)[0];
      if(!DAILY_SENTENCES.find(x => x.de === s.de)) { DAILY_SENTENCES.push(s); unlocked++; }
    } else if(sentences_pool.length > 0) {
      const s = sentences_pool.shift();
      if(!DAILY_SENTENCES.find(x => x.de === s.de)) { DAILY_SENTENCES.push(s); unlocked++; }
    }
    
    // Unlock 1 story
    const stIdx = stories_pool.findIndex(st => st.title.includes('[' + activeLevel + ']'));
    if(stIdx > -1) {
      const st = stories_pool.splice(stIdx, 1)[0];
      if(!STORIES.find(x => x.title === st.title)) { STORIES.push(st); unlocked++; }
    } else if(stories_pool.length > 0) {
      const st = stories_pool.shift();
      if(!STORIES.find(x => x.title === st.title)) { STORIES.push(st); unlocked++; }
    }
    
    if (unlocked > 0) {
      save('dt_vocab', vocab); save('dt_vocab_pool', vocab_pool);
      save('dt_sentences', DAILY_SENTENCES); save('dt_sentences_pool', sentences_pool);
      save('dt_stories', STORIES); save('dt_stories_pool', stories_pool);
      save('dt_last_unlock', today);
      
      setTimeout(() => {
        showToast(\`?? Daily Unlock! Scaled for Level \${activeLevel}!\`, 'var(--gold)');
        renderVocab(); renderDashboard(); renderReading();
      }, 1500);
    }
  }
}

`;

if (js.match(oldUnlockRegex)) {
  js = js.replace(oldUnlockRegex, newUnlockLogic);
  fs.writeFileSync('script.js', js, 'utf8');
  console.log("Smart Level matcher logic injected successfully!");
} else {
  console.log("Could not find old checkDailyUnlock() to replace.");
}

