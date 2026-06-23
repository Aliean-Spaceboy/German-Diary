const fs = require('fs');

let js = fs.readFileSync('script.js', 'utf-8');

// 1. Change DAILY_SENTENCES to let and load from localStorage
const defaultSentencesRegex = /const DAILY_SENTENCES = \[([\s\S]*?)\];/;
const defaultSentencesMatch = js.match(defaultSentencesRegex);

if (defaultSentencesMatch) {
  const defaultSentencesStr = `[\n${defaultSentencesMatch[1]}\n]`;
  js = js.replace(defaultSentencesRegex, `const DEFAULT_SENTENCES = ${defaultSentencesStr};\nlet DAILY_SENTENCES = load('dt_sentences', DEFAULT_SENTENCES);`);
}

// 2. Change STORIES to let and load from localStorage
const defaultStoriesRegex = /const STORIES = \[([\s\S]*?)\];/;
const defaultStoriesMatch = js.match(defaultStoriesRegex);

if (defaultStoriesMatch) {
  const defaultStoriesStr = `[\n${defaultStoriesMatch[1]}\n]`;
  js = js.replace(defaultStoriesRegex, `const DEFAULT_STORIES = ${defaultStoriesStr};\nlet STORIES = load('dt_stories', DEFAULT_STORIES);`);
}

// 3. Update exportData
const exportRegex = /const data = {\s*dt_entries: load\('dt_entries', \[\]\),\s*dt_vocab: load\('dt_vocab', \[\]\),\s*dt_speak: load\('dt_speak', \[\]\)\s*};/;
const newExport = `const data = {
    dt_entries: load('dt_entries', []),
    dt_vocab: load('dt_vocab', []),
    dt_speak: load('dt_speak', []),
    dt_sentences: load('dt_sentences', DEFAULT_SENTENCES),
    dt_stories: load('dt_stories', DEFAULT_STORIES)
  };`;
js = js.replace(exportRegex, newExport);

// 4. Update importData
const importRegex = /if \(data\.dt_vocab\) save\('dt_vocab', data\.dt_vocab\);\s*if \(data\.dt_speak\) save\('dt_speak', data\.dt_speak\);/;
const newImport = `if (data.dt_vocab) save('dt_vocab', data.dt_vocab);
      if (data.dt_speak) save('dt_speak', data.dt_speak);
      if (data.dt_sentences) save('dt_sentences', data.dt_sentences);
      if (data.dt_stories) save('dt_stories', data.dt_stories);`;
js = js.replace(importRegex, newImport);

fs.writeFileSync('script.js', js, 'utf-8');
console.log('Dynamic Data and Backup System Updated!');
