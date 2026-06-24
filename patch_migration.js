const fs = require('fs');
let js = fs.readFileSync('script.js', 'utf8');

const migrationLogic = `
// ONE-TIME MIGRATION: If the user already has 1000 words in active vocab, reset it!
if (vocab.length > 200 && vocab_pool.length === 0) {
  console.log("Migrating massive active lists back to pools...");
  vocab_pool = [...vocab];
  vocab = [];
  sentences_pool = [...DAILY_SENTENCES];
  DAILY_SENTENCES = [];
  stories_pool = [...STORIES];
  STORIES = [];
  
  save('dt_vocab_pool', vocab_pool);
  save('dt_vocab', vocab);
  save('dt_sentences_pool', sentences_pool);
  save('dt_sentences', DAILY_SENTENCES);
  save('dt_stories_pool', stories_pool);
  save('dt_stories', STORIES);
  
  // Clear last unlock so it unlocks today instantly
  localStorage.removeItem('dt_last_unlock');
}
`;

if (!js.includes('ONE-TIME MIGRATION')) {
  js = js.replace('document.addEventListener(\'DOMContentLoaded\'', migrationLogic + '\n\ndocument.addEventListener(\'DOMContentLoaded\'');
  fs.writeFileSync('script.js', js, 'utf8');
  console.log("Migration logic injected!");
}
