const fs = require('fs');
let js = fs.readFileSync('script.js', 'utf8');

// Note: Because I am running node locally, I can just use JSON.stringify on the arrays directly here.
const DEFAULT_VOCAB = [
    { de: 'wie', en: 'as', level: 0, nextReview: Date.now() },
    { de: 'ich', en: 'I', level: 0, nextReview: Date.now() },
    { de: 'seine', en: 'his', level: 0, nextReview: Date.now() },
    { de: 'dass', en: 'that', level: 0, nextReview: Date.now() },
    { de: 'er', en: 'he', level: 0, nextReview: Date.now() },
    { de: 'war', en: 'was', level: 0, nextReview: Date.now() },
    { de: 'für', en: 'for', level: 0, nextReview: Date.now() },
    { de: 'auf', en: 'on', level: 0, nextReview: Date.now() },
    { de: 'sind', en: 'are', level: 0, nextReview: Date.now() },
    { de: 'mit', en: 'with', level: 0, nextReview: Date.now() },
    { de: 'sie', en: 'they', level: 0, nextReview: Date.now() },
    { de: 'sein', en: 'be', level: 0, nextReview: Date.now() },
    { de: 'bei', en: 'at', level: 0, nextReview: Date.now() },
    { de: 'ein', en: 'one', level: 0, nextReview: Date.now() },
    { de: 'haben', en: 'have', level: 0, nextReview: Date.now() },
    { de: 'dies', en: 'this', level: 0, nextReview: Date.now() }
];

const DEFAULT_SENTENCES = [
  { de: "Hallo, wie geht es dir?", en: "Hello, how are you?" },
  { de: "Ich lerne jeden Tag Deutsch.", en: "I learn German every day." },
  { de: "Wo ist der nächste Bahnhof?", en: "Where is the nearest train station?" },
  { de: "Ein Kaffee bitte.", en: "A coffee please." },
  { de: "Das Wetter ist heute sehr schön.", en: "The weather is very nice today." },
  { de: "Ich habe eine Reservierung auf den Namen Müller.", en: "I have a reservation under the name Müller." },
  { de: "Können Sie das bitte wiederholen?", en: "Can you please repeat that?" },
  { de: "Wie viel kostet das?", en: "How much does that cost?" }
];

const DEFAULT_GRAMMAR = [
  { text: "Ich spreche mit d___ Mann.", answer: "em", hint: "Dativ, maskulin" },
  { text: "Wir fahren in d___ Stadt.", answer: "ie", hint: "Akkusativ, feminin (movement)" },
  { text: "Das ist d___ Haus meiner Eltern.", answer: "as", hint: "Nominativ, neutrum" }
];

fs.writeFileSync('data/vocab-api.json', JSON.stringify(DEFAULT_VOCAB, null, 2), 'utf8');
fs.writeFileSync('data/sentences-api.json', JSON.stringify(DEFAULT_SENTENCES, null, 2), 'utf8');
fs.writeFileSync('data/grammar-api.json', JSON.stringify(DEFAULT_GRAMMAR, null, 2), 'utf8');

// Now we wipe the hardcoded arrays from script.js
const regexVocab = /const DEFAULT_VOCAB = \[[\s\S]*?\];\nlet vocab_pool = load\('dt_vocab_pool', DEFAULT_VOCAB\);/;
const regexSents = /const DEFAULT_SENTENCES = \[[\s\S]*?\];\nlet sentences_pool = load\('dt_sentences_pool', DEFAULT_SENTENCES\);/;
const regexGramm = /const DEFAULT_GRAMMAR = \[[\s\S]*?\];\nlet grammar_pool = load\('dt_grammar_pool', DEFAULT_GRAMMAR\);/;

if (js.match(regexVocab)) js = js.replace(regexVocab, "let vocab_pool = load('dt_vocab_pool', []);");
if (js.match(regexSents)) js = js.replace(regexSents, "let sentences_pool = load('dt_sentences_pool', []);");
if (js.match(regexGramm)) js = js.replace(regexGramm, "let grammar_pool = load('dt_grammar_pool', []);");

const cloudSyncCode = `
// PHASE 1: CLOUD SYNC ENGINE
async function syncCloudData() {
  // If vocab_pool is empty, it means this is a fresh install or a new browser!
  // We fetch our starter databases directly from the GitHub Cloud (data folder).
  if (vocab_pool.length === 0) {
    console.log("Cloud Sync: Initiating massive data fetch...");
    try {
      const vRes = await fetch('data/vocab-api.json');
      const sRes = await fetch('data/sentences-api.json');
      const gRes = await fetch('data/grammar-api.json');
      
      const vData = await vRes.json();
      const sData = await sRes.json();
      const gData = await gRes.json();
      
      // Seed the pools
      vocab_pool = vData;
      sentences_pool = sData;
      grammar_pool = gData;
      
      // Save them locally permanently
      save('dt_vocab_pool', vocab_pool);
      save('dt_sentences_pool', sentences_pool);
      save('dt_grammar_pool', grammar_pool);
      
      console.log("Cloud Sync Complete!");
      
      // Since it's a fresh sync, trigger unlock
      checkDailyUnlock();
      renderDashboard();
    } catch(e) {
      console.error("Cloud Sync Failed: Check internet connection or CORS rules.", e);
    }
  }
}
`;

if (!js.includes('async function syncCloudData()')) {
  js += '\n' + cloudSyncCode;
  
  // Hook it into the DOMContentLoaded right before checkDailyWarmup
  js = js.replace('if (typeof checkDailyWarmup === \'function\') checkDailyWarmup();', 'if (typeof syncCloudData === \'function\') syncCloudData();\n    if (typeof checkDailyWarmup === \'function\') checkDailyWarmup();');
}

fs.writeFileSync('script.js', js, 'utf8');
console.log("Phase 1: Cloud Sync Architecture Implemented!");

