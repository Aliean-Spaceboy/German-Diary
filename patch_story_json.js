const fs = require('fs');
let js = fs.readFileSync('script.js', 'utf8');

const importStoryRegex = /function importStoryJson\(event\) \{[\s\S]*?reader\.readAsText\(file\);\s*\}/;

const newImportStory = `function importStoryJson(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    let userLvl = window.prompt("What level are the stories in this file? (Type A1, A2, B1, B2, C1, or MIXED)", "MIXED");
    if (!userLvl) return;
    userLvl = userLvl.trim().toUpperCase();
    if (!['A1','A2','B1','B2','C1','MIXED'].includes(userLvl)) userLvl = 'MIXED';

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const data = JSON.parse(e.target.result);
        if (!Array.isArray(data)) throw new Error('JSON must be an array of stories.');
        
        let added = 0;
        data.forEach((story, i) => {
          if (story.title && story.text && story.questions && story.questions.length === 3) {
            let explicitLvl = story.lvl ? story.lvl.toUpperCase() : null;
            let itemLvl = userLvl;
            
            if (explicitLvl && ['A1','A2','B1','B2','C1'].includes(explicitLvl)) itemLvl = explicitLvl;
            else if (userLvl === 'MIXED') {
              const pct = i / data.length;
              if (pct < 0.25) itemLvl = 'A1';
              else if (pct < 0.5) itemLvl = 'A2';
              else if (pct < 0.75) itemLvl = 'B1';
              else itemLvl = 'B2';
            }
            
            story.lvl = itemLvl;
            if (!stories_pool.find(s => s.title === story.title) && !STORIES.find(s => s.title === story.title)) {
              stories_pool.push(story);
              added++;
            }
          }
        });
        save('dt_stories_pool', stories_pool);
        showToast(\`Added \${added} new stories to the hidden pool!\`, 'var(--success)');
        localStorage.removeItem('dt_last_unlock');
        checkDailyUnlock();
      } catch(err) {
        showToast('? Error: Invalid Story JSON format', 'var(--danger)');
      }
    };
    reader.readAsText(file);
}`;

if(js.match(importStoryRegex)) {
  js = js.replace(importStoryRegex, newImportStory);
  fs.writeFileSync('script.js', js, 'utf8');
  console.log("Story Importer successfully patched to use Smart Level Prompting!");
} else {
  console.log("Could not find the story importer function to patch.");
}
