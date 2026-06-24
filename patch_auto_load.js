const fs = require('fs');

// 1. Read the newly generated files
const vocabLines = fs.readFileSync('top_1000_german_words.csv', 'utf8').split('\n').filter(l => l.trim().length > 0);
let vocabArr = [];
vocabLines.forEach(line => {
  const parts = line.split(',');
  if(parts.length >= 2) {
    // Escape quotes
    const de = parts[0].trim().replace(/"/g, '\\"').replace(/'/g, "\\'");
    const en = parts[1].trim().replace(/"/g, '\\"').replace(/'/g, "\\'");
    vocabArr.push(`{ de: '${de}', en: '${en}', level: 0, nextReview: Date.now() }`);
  }
});
const defaultVocabStr = `const DEFAULT_VOCAB = [\n  ${vocabArr.join(',\n  ')}\n];`;


const sentenceLines = fs.readFileSync('sentences_pack_a1_b2.csv', 'utf8').split('\n').filter(l => l.trim().length > 0);
let sentenceArr = [];
sentenceLines.forEach(line => {
  const parts = line.split(',');
  if(parts.length >= 2) {
    const de = parts[0].trim().replace(/"/g, '\\"').replace(/'/g, "\\'");
    const en = parts[1].trim().replace(/"/g, '\\"').replace(/'/g, "\\'");
    sentenceArr.push(`{ de: '${de}', en: '${en}' }`);
  }
});
const defaultSentencesStr = `const DEFAULT_SENTENCES = [\n  ${sentenceArr.join(',\n  ')}\n];`;


const defaultStoriesJsonStr = fs.readFileSync('stories_pack_a1_b2.json', 'utf8');
const defaultStoriesStr = `const DEFAULT_STORIES = ${defaultStoriesJsonStr};`;

// 2. Patch script.js
let js = fs.readFileSync('script.js', 'utf8');

// Replace DEFAULT_SENTENCES block
const sentencesRegex = /const DEFAULT_SENTENCES = \[[\s\S]*?\];/;
if(js.match(sentencesRegex)) {
  js = js.replace(sentencesRegex, defaultSentencesStr);
} else {
  js = js.replace('let DAILY_SENTENCES', defaultSentencesStr + '\nlet DAILY_SENTENCES');
}

// Replace DEFAULT_STORIES block
const storiesRegex = /const DEFAULT_STORIES = \[[\s\S]*?\];/;
if(js.match(storiesRegex)) {
  js = js.replace(storiesRegex, defaultStoriesStr);
} else {
  js = js.replace('let STORIES', defaultStoriesStr + '\nlet STORIES');
}

// Inject DEFAULT_VOCAB before `let vocab = load('dt_vocab', []);`
const vocabRegex = /let vocab = load\('dt_vocab', \[\]\);/;
if(js.match(vocabRegex)) {
  js = js.replace(vocabRegex, defaultVocabStr + "\nlet vocab = load('dt_vocab', DEFAULT_VOCAB);");
}

fs.writeFileSync('script.js', js, 'utf8');
console.log("Auto-load defaults successfully injected into script.js!");

