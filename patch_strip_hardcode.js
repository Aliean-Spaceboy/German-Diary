const fs = require('fs');
let js = fs.readFileSync('script.js', 'utf8');

const vocabRegex = /const DEFAULT_VOCAB = \[[\s\S]*?\];/;
const sentsRegex = /const DEFAULT_SENTENCES = \[[\s\S]*?\];/;
const grammRegex = /const DEFAULT_GRAMMAR = \[[\s\S]*?\];/;

if (js.match(vocabRegex)) js = js.replace(vocabRegex, "");
if (js.match(sentsRegex)) js = js.replace(sentsRegex, "");
if (js.match(grammRegex)) js = js.replace(grammRegex, "");

// Replace the pool loader defaults
js = js.replace(/let vocab_pool = load\('dt_vocab_pool', DEFAULT_VOCAB\);/, "let vocab_pool = load('dt_vocab_pool', []);");
js = js.replace(/let sentences_pool = load\('dt_sentences_pool', DEFAULT_SENTENCES\);/, "let sentences_pool = load('dt_sentences_pool', []);");
js = js.replace(/let grammar_pool = load\('dt_grammar_pool', DEFAULT_GRAMMAR\);/, "let grammar_pool = load('dt_grammar_pool', []);");

fs.writeFileSync('script.js', js, 'utf8');
console.log("Hardcoded arrays stripped!");

