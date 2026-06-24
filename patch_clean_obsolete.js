const fs = require('fs');

let js = fs.readFileSync('script.js', 'utf8');

// 1. Remove DAILY_WORDS
const dailyWordsRegex = /\/\/ --- DAILY WORD & SENTENCE \(OFFLINE DATABASE\) ---[\s\S]*?const DAILY_WORDS = \[[\s\S]*?\];/;
if (js.match(dailyWordsRegex)) {
  js = js.replace(dailyWordsRegex, "// --- OFFLINE DATABASE ENGINE ---");
}

const inspirationRegex = /const w = DAILY_WORDS\[Math\.floor\(Math\.random\(\) \* DAILY_WORDS\.length\)\];/;
if (js.match(inspirationRegex)) {
  js = js.replace(inspirationRegex, `const allWords = [...vocab, ...vocab_pool];\n    const w = allWords.length > 0 ? allWords[Math.floor(Math.random() * allWords.length)] : {de: 'Lerne!', en: 'Learn!'};`);
}

const dailyWordsFallbackRegex = /if \(typeof DAILY_WORDS !== 'undefined'\) \{[\s\S]*?DAILY_WORDS\.forEach\(v => \{ if\(\!allWords\.has\(v\.de\)\) allWords\.set\(v\.de, v\); \}\);[\s\S]*?\}/;
if (js.match(dailyWordsFallbackRegex)) {
  js = js.replace(dailyWordsFallbackRegex, "");
}

// 2. Remove DEFAULT_STORIES
const storiesRegex = /\/\/ --- READING COMPREHENSION ---[\s\S]*?const DEFAULT_STORIES = \[[\s\S]*?\];/;
if (js.match(storiesRegex)) {
  js = js.replace(storiesRegex, "// --- READING COMPREHENSION ---");
}

const storiesPoolRegex = /let stories_pool = load\('dt_stories_pool', DEFAULT_STORIES\);/;
if (js.match(storiesPoolRegex)) {
  js = js.replace(storiesPoolRegex, "let stories_pool = load('dt_stories_pool', []);");
}

fs.writeFileSync('script.js', js, 'utf8');
console.log("Obsolete hardcoded arrays removed!");

