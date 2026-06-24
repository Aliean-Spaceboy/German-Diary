const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const warmupModal = `
<div id="warmupModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9999; align-items:center; justify-content:center; padding:20px;">
  <div class="card" style="max-width:500px; width:100%; text-align:center;">
    <div style="font-size:2.5rem; margin-bottom:10px;">&#9749;</div>
    <div style="font-size:1.5rem; font-weight:800; margin-bottom:5px;">Daily Warm-up</div>
    <div style="color:var(--text-muted); margin-bottom:20px;">Answer the question to unlock the app for today!</div>
    <div id="warmupQuestion" style="font-size:1.2rem; font-weight:600; margin-bottom:20px; padding:15px; background:var(--surface2); border-radius:8px;"></div>
    <div id="warmupOptions" style="display:flex; flex-direction:column; gap:10px;"></div>
  </div>
</div>
`;

if (!html.includes('id="warmupModal"')) {
  html = html.replace('</body>', warmupModal + '\n</body>');
}

const diaryBtnRegex = /<button class="btn btn-outline" onclick="clearDiary\(\)">.*?Clear<\/button>[\s\S]*?<div style="position:relative; overflow:hidden; display:inline-block">[\s\S]*?<\/div>/;

if (html.match(diaryBtnRegex) && !html.includes('checkDiaryGrammar()')) {
  const replacement = html.match(diaryBtnRegex)[0] + `
        <button class="btn btn-primary" onclick="checkDiaryGrammar()">&#10024; Check Grammar (AI)</button>
      </div>
      <div id="grammarFeedback" style="margin-top:20px; display:none; padding:15px; border-radius:8px; background:rgba(239,68,68,0.1); border:1px solid var(--danger);"></div>
      <div><!-- closing tag balancer -->`;
  html = html.replace(diaryBtnRegex, replacement);
}

fs.writeFileSync('index.html', html, 'utf8');

let js = fs.readFileSync('script.js', 'utf8');

const newFunctions = `
function checkDailyWarmup() {
  if (localStorage.getItem('dt_last_warmup') === todayStr()) return;
  const pool = [...vocab, ...DAILY_SENTENCES];
  if (pool.length < 4) {
    localStorage.setItem('dt_last_warmup', todayStr());
    return;
  }
  
  document.getElementById('warmupModal').style.display = 'flex';
  
  const target = pool[Math.floor(Math.random() * pool.length)];
  const wrongs = pool.filter(x => x.de !== target.de).sort(()=>0.5-Math.random()).slice(0, 3);
  
  const isEnToDe = Math.random() > 0.5;
  const qText = isEnToDe ? target.en : target.de;
  const correctAns = isEnToDe ? target.de : target.en;
  let options = [correctAns, ...wrongs.map(w => isEnToDe ? w.de : w.en)].sort(()=>0.5-Math.random());
  
  document.getElementById('warmupQuestion').innerText = (isEnToDe ? "Translate to German: " : "What does this mean: ") + qText;
  
  document.getElementById('warmupOptions').innerHTML = options.map(opt => \`
    <button class="btn btn-outline" style="width:100%; text-align:left; font-size:1.1rem; padding:12px;" onclick="submitWarmup('\${opt.replace(/'/g,"\\\\'")}', '\${correctAns.replace(/'/g,"\\\\'")}')">\${opt}</button>
  \`).join('');
}

function submitWarmup(ans, correct) {
  if (ans === correct) {
    showToast('&#127881; Correct! App unlocked.');
    document.getElementById('warmupModal').style.display = 'none';
    localStorage.setItem('dt_last_warmup', todayStr());
  } else {
    showToast('&#10060; Incorrect. Try again!', 'var(--danger)');
  }
}

async function checkDiaryGrammar() {
  const p1 = document.getElementById('prompt1').value.trim();
  const p2 = document.getElementById('prompt2').value.trim();
  const p3 = document.getElementById('prompt3').value.trim();
  let fullText = [p1, p2, p3].filter(x => x).join('. ');
  if (fullText.length > 0 && !fullText.endsWith('.')) fullText += '.';
  
  if(!fullText) { showToast('Please write something in the diary prompts first!'); return; }
  
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
    }
  } catch(e) {
    fbDiv.innerHTML = '<div style="text-align:center;color:var(--danger);">&#10060; Error reaching LanguageTool API. Are you connected to the internet?</div>';
  }
}
`;

if (!js.includes('function checkDailyWarmup()')) {
  js += '\n' + newFunctions;
  
  // Hook warmup into initialization loop!
  const initRegex = /renderDashboard\(\);/;
  if (js.match(initRegex)) {
    js = js.replace(initRegex, 'renderDashboard();\n  checkDailyWarmup();');
  }
}

fs.writeFileSync('script.js', js, 'utf8');
console.log("F1 & F2 Injected successfully!");

