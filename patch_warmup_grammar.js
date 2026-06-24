const fs = require('fs');
let js = fs.readFileSync('script.js', 'utf8');

// 1. Remove the wrongly injected hooks inside saveDiaryEntry
const saveDiaryRegex = /function saveDiaryEntry\(\) \{[\s\S]*?showToast\('.*?Gut gemacht!'\);\s*\}/;

const newSaveDiary = `async function saveDiaryEntry() {
  const p1 = document.getElementById('prompt1').value.trim();
  const p2 = document.getElementById('prompt2').value.trim();
  const p3 = document.getElementById('prompt3').value.trim();
  const p4 = document.getElementById('prompt4').value.trim();
  if (!p1 && !p2 && !p3) { showToast('Please fill at least one prompt!'); return; }
  
  const passedGrammar = await checkDiaryGrammar(true);
  if (!passedGrammar) {
    showToast('Please fix your grammar mistakes before saving!', 'var(--danger)');
    // ensure feedback is visible
    document.getElementById('grammarFeedback').scrollIntoView({behavior: "smooth", block: "center"});
    return;
  }
  
  const entry = { date: todayStr(), ts: Date.now(), p1, p2, p3, p4 };
  diaryEntries.unshift(entry);
  save('dt_entries', diaryEntries);
  clearDiary();
  renderDashboard();
  document.getElementById('grammarFeedback').style.display = 'none';
  showToast('Diary entry saved! Gut gemacht!');
}`;

if (js.match(saveDiaryRegex)) {
  js = js.replace(saveDiaryRegex, newSaveDiary);
}

// 2. Modify checkDiaryGrammar to support autoSave boolean return
const grammarRegex = /async function checkDiaryGrammar\(\) \{[\s\S]*?\} catch\(e\) \{[\s\S]*?\}\n\}/;

const newGrammarCheck = `async function checkDiaryGrammar(autoSave = false) {
  const p1 = document.getElementById('prompt1').value.trim();
  const p2 = document.getElementById('prompt2').value.trim();
  const p3 = document.getElementById('prompt3').value.trim();
  let fullText = [p1, p2, p3].filter(x => x).join('. ');
  if (fullText.length > 0 && !fullText.endsWith('.')) fullText += '.';
  
  if(!fullText) { 
    if(!autoSave) showToast('Please write something in the diary prompts first!'); 
    return false; 
  }
  
  const fbDiv = document.getElementById('grammarFeedback');
  fbDiv.style.display = 'block';
  fbDiv.style.background = 'rgba(239,68,68,0.1)';
  fbDiv.style.borderColor = 'var(--danger)';
  fbDiv.innerHTML = '<div style="text-align:center;color:var(--text);">&#8987; Checking grammar using LanguageTool AI...</div>';
  
  try {
    const res = await fetch('https://api.languagetool.org/v2/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ text: fullText, language: 'de-DE' })
    });
    const data = await res.json();
    
    if (data.matches.length === 0) {
      fbDiv.style.background = 'rgba(16,185,129,0.1)';
      fbDiv.style.borderColor = 'var(--success)';
      fbDiv.innerHTML = '<span style="color:var(--success); font-weight:800;">&#10004;&#65039; No grammar mistakes found! Perfect!</span>';
      return true;
    } else {
      let html = '<div style="color:var(--danger); font-weight:800; margin-bottom:15px;">&#9888;&#65039; Found ' + data.matches.length + ' potential mistakes:</div>';
      data.matches.forEach(m => {
        const errorText = fullText.substring(m.offset, m.offset + m.length);
        const suggestions = m.replacements.map(r => r.value).slice(0,3).join(', ');
        html += \`
          <div style="margin-bottom:15px; font-size:0.95rem; background:var(--surface); padding:10px; border-radius:5px;">
            <div style="margin-bottom:5px"><b>Issue:</b> \${m.message}</div>
            <div style="margin-bottom:5px"><b>Text:</b> <span style="background:var(--danger); color:white; padding:2px 4px; border-radius:3px;">\${errorText}</span></div>
            <div><b>Suggestions:</b> <span style="color:var(--success); font-weight:600;">\${suggestions || 'None'}</span></div>
          </div>
        \`;
      });
      fbDiv.innerHTML = html;
      return false;
    }
  } catch(e) {
    fbDiv.innerHTML = '<div style="text-align:center;color:var(--danger);">&#10060; Error reaching LanguageTool API. Are you connected to the internet?</div>';
    return true; // allow save if offline
  }
}`;

if (js.match(grammarRegex)) {
  js = js.replace(grammarRegex, newGrammarCheck);
}


// 3. Inject global startup hooks correctly
// We need to find the bottom of the script where initializers are called.
// Usually I look for `renderDashboard();` at the root level, but let's just append it to the file.
js += `
// GLOBAL STARTUP HOOKS
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (typeof renderReadingMenu === 'function') renderReadingMenu();
    if (typeof checkDailyWarmup === 'function') checkDailyWarmup();
  }, 500);
});
`;

fs.writeFileSync('script.js', js, 'utf8');
console.log("Warmup and Grammar block injected!");

