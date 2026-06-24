const fs = require('fs');
let js = fs.readFileSync('script.js', 'utf8');

const warmupRegex = /function checkDailyWarmup\(\) \{[\s\S]*?\}\n\nfunction submitWarmup\(ans, correct\) \{[\s\S]*?\}/;

const newWarmup = `function checkDailyWarmup() {
  if (localStorage.getItem('dt_last_warmup') === todayStr()) return;
  const pool = [...vocab, ...DAILY_SENTENCES];
  if (pool.length < 4) {
    localStorage.setItem('dt_last_warmup', todayStr());
    return;
  }
  
  let wCount = parseInt(localStorage.getItem('dt_warmup_count') || '0');
  document.getElementById('warmupModal').style.display = 'flex';
  
  // PROGRESSIVE DIFFICULTY ALGORITHM
  let isEnToDe = false;
  let useSentence = false;
  let useGrammar = false;
  
  if (wCount < 3) {
    // Days 1-3: Easy Mode (Vocab only, DE->EN)
    isEnToDe = false; 
    useSentence = false;
  } else if (wCount < 7) {
    // Days 4-7: Medium Mode (Vocab/Sentences, DE->EN)
    isEnToDe = false;
    useSentence = Math.random() > 0.5;
  } else if (wCount < 14) {
    // Days 8-14: Hard Mode (50% chance of EN->DE)
    isEnToDe = Math.random() > 0.5;
    useSentence = Math.random() > 0.5;
  } else {
    // Days 15+: Expert Mode (High chance of EN->DE, Sentences, and Grammar)
    isEnToDe = Math.random() > 0.3; // 70% chance of hard EN->DE
    useSentence = Math.random() > 0.4;
    useGrammar = Math.random() > 0.7 && active_grammar && active_grammar.length > 0;
  }
  
  let target, wrongs, qText, correctAns;
  
  if (useGrammar) {
    target = active_grammar[Math.floor(Math.random() * active_grammar.length)];
    wrongs = ["er", "sie", "es", "dem", "den", "der", "das", "die", "em", "en"].filter(x => x !== target.answer).sort(()=>0.5-Math.random()).slice(0,3);
    qText = target.text.replace('___', ' [...] ');
    correctAns = target.answer;
    document.getElementById('warmupQuestion').innerHTML = "Fill in the blank:<br><br><span style='font-size:1.4rem'>" + qText + "</span>";
  } else {
    const subPool = useSentence ? DAILY_SENTENCES : vocab;
    if(subPool.length < 4) { checkDailyWarmup(); return; } // fallback
    
    target = subPool[Math.floor(Math.random() * subPool.length)];
    wrongs = subPool.filter(x => x.de !== target.de).sort(()=>0.5-Math.random()).slice(0, 3);
    qText = isEnToDe ? target.en : target.de;
    correctAns = isEnToDe ? target.de : target.en;
    document.getElementById('warmupQuestion').innerText = (isEnToDe ? "Translate to German: " : "What does this mean: ") + qText;
  }
  
  let options = [correctAns, ...wrongs.map(w => useGrammar ? w : (isEnToDe ? w.de : w.en))].sort(()=>0.5-Math.random());
  
  document.getElementById('warmupOptions').innerHTML = options.map(opt => \`
    <button class="btn btn-outline" style="width:100%; text-align:left; font-size:1.1rem; padding:12px;" onclick="submitWarmup('\${opt.replace(/'/g,"\\\\'")}', '\${correctAns.replace(/'/g,"\\\\'")}')">\${opt}</button>
  \`).join('');
}

function submitWarmup(ans, correct) {
  if (ans === correct) {
    showToast('&#127881; Correct! App unlocked.');
    document.getElementById('warmupModal').style.display = 'none';
    localStorage.setItem('dt_last_warmup', todayStr());
    
    let wCount = parseInt(localStorage.getItem('dt_warmup_count') || '0');
    localStorage.setItem('dt_warmup_count', wCount + 1); // Increase difficulty for tomorrow!
  } else {
    showToast('&#10060; Incorrect. Try again!', 'var(--danger)');
  }
}`;

if (js.match(warmupRegex)) {
  js = js.replace(warmupRegex, newWarmup);
  fs.writeFileSync('script.js', js, 'utf8');
  console.log("Progressive difficulty Warmup patched!");
} else {
  console.log("Regex not matched!");
}
