const fs = require('fs');
let js = fs.readFileSync('script.js', 'utf8');

const importCsvRegex = /function importCsv\(event\) \{[\s\S]*?reader\.readAsText\(file\);\s*\}/;

const newImportCsv = `function importCsv(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    let userLvl = window.prompt("What level are the contents of this file? (Type A1, A2, B1, B2, C1, or MIXED)", "MIXED");
    if (!userLvl) return;
    userLvl = userLvl.trim().toUpperCase();
    if (!['A1','A2','B1','B2','C1','MIXED'].includes(userLvl)) userLvl = 'MIXED';

    const reader = new FileReader();
    reader.onload = function(e) {
      const text = e.target.result;
      const lines = text.split('\\n').filter(l => l.trim().length > 0);
      let added = 0;
      
      lines.forEach((line, i) => {
        const parts = line.split(',');
        if (parts.length >= 2) {
          const de = parts[0].trim();
          const en = parts[1].trim();
          let explicitLvl = parts.length > 2 ? parts[2].trim().toUpperCase() : null;
          
          let itemLvl = userLvl;
          if (explicitLvl && ['A1','A2','B1','B2','C1'].includes(explicitLvl)) itemLvl = explicitLvl;
          else if (userLvl === 'MIXED') {
            const pct = i / lines.length;
            if (pct < 0.25) itemLvl = 'A1';
            else if (pct < 0.5) itemLvl = 'A2';
            else if (pct < 0.75) itemLvl = 'B1';
            else itemLvl = 'B2';
          }
          
          if (de && en && !vocab_pool.find(v => v.de === de) && !vocab.find(v => v.de === de)) {
            vocab_pool.push({ de, en, cat: 'CSV', ts: Date.now(), lvl: itemLvl });
            added++;
          }
        }
      });
      save('dt_vocab_pool', vocab_pool);
      showToast(\`Added \${added} new words to the hidden pool!\`, 'var(--success)');
      localStorage.removeItem('dt_last_unlock');
      checkDailyUnlock();
    };
    reader.readAsText(file);
}`;

const importSentenceRegex = /function importSentenceCsv\(event\) \{[\s\S]*?reader\.readAsText\(file\);\s*\}/;

const newImportSentenceCsv = `function importSentenceCsv(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    let userLvl = window.prompt("What level are the contents of this file? (Type A1, A2, B1, B2, C1, or MIXED)", "MIXED");
    if (!userLvl) return;
    userLvl = userLvl.trim().toUpperCase();
    if (!['A1','A2','B1','B2','C1','MIXED'].includes(userLvl)) userLvl = 'MIXED';

    const reader = new FileReader();
    reader.onload = function(e) {
      const text = e.target.result;
      const lines = text.split('\\n').filter(l => l.trim().length > 0);
      let added = 0;
      
      lines.forEach((line, i) => {
        const parts = line.split(',');
        if (parts.length >= 2) {
          const de = parts[0].trim();
          const en = parts[1].trim();
          let explicitLvl = parts.length > 2 ? parts[2].trim().toUpperCase() : null;
          
          let itemLvl = userLvl;
          if (explicitLvl && ['A1','A2','B1','B2','C1'].includes(explicitLvl)) itemLvl = explicitLvl;
          else if (userLvl === 'MIXED') {
            const pct = i / lines.length;
            if (pct < 0.25) itemLvl = 'A1';
            else if (pct < 0.5) itemLvl = 'A2';
            else if (pct < 0.75) itemLvl = 'B1';
            else itemLvl = 'B2';
          }
          
          if (de && en && !sentences_pool.find(s => s.de === de) && !DAILY_SENTENCES.find(s => s.de === de)) {
            sentences_pool.push({ de, en, lvl: itemLvl });
            added++;
          }
        }
      });
      save('dt_sentences_pool', sentences_pool);
      showToast(\`Added \${added} new sentences to the hidden pool!\`, 'var(--success)');
      localStorage.removeItem('dt_last_unlock');
      checkDailyUnlock();
    };
    reader.readAsText(file);
}`;

if(js.match(importCsvRegex) && js.match(importSentenceRegex)) {
  js = js.replace(importCsvRegex, newImportCsv);
  js = js.replace(importSentenceRegex, newImportSentenceCsv);
  fs.writeFileSync('script.js', js, 'utf8');
  console.log("CSV Importers successfully patched to use Smart Level Prompting!");
} else {
  console.log("Could not find the importer functions to patch.");
}
