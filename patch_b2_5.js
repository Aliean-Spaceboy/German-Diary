const fs = require('fs');

// --- HTML PATCH ---
let html = fs.readFileSync('index.html', 'utf-8');

const checklistHtml = `
<!-- DIARY CHECKLIST MODAL -->
<div id="diaryChecklistModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1000; align-items:center; justify-content:center">
  <div style="background:var(--surface); padding:24px; border-radius:12px; max-width:400px; width:90%; box-shadow:0 10px 25px rgba(0,0,0,0.2)">
    <h3 style="margin-top:0; color:var(--accent)">?? B2 Grammar Check</h3>
    <p style="color:var(--text-muted); font-size:0.9rem">Before you save, please review your German sentences to prevent bad habits!</p>
    
    <label style="display:flex; align-items:flex-start; gap:10px; margin-bottom:12px; cursor:pointer">
      <input type="checkbox" id="chk1" style="margin-top:4px">
      <span><b>Nouns:</b> Did you capitalize ALL nouns? (e.g. das <b>A</b>uto, die <b>Z</b>eit)</span>
    </label>
    
    <label style="display:flex; align-items:flex-start; gap:10px; margin-bottom:12px; cursor:pointer">
      <input type="checkbox" id="chk2" style="margin-top:4px">
      <span><b>Verb Position:</b> Is the main verb in the 2nd position? (e.g. Heute <b>gehe</b> ich...)</span>
    </label>
    
    <label style="display:flex; align-items:flex-start; gap:10px; margin-bottom:16px; cursor:pointer">
      <input type="checkbox" id="chk3" style="margin-top:4px">
      <span><b>Subordinate Clauses:</b> If you used <i>weil, dass, wenn</i>, is the verb at the very end?</span>
    </label>
    
    <div style="display:flex; justify-content:flex-end; gap:10px">
      <button class="btn btn-outline" onclick="document.getElementById('diaryChecklistModal').style.display='none'">Back to Edit</button>
      <button class="btn btn-success" onclick="confirmDiarySave()">Save Entry</button>
    </div>
  </div>
</div>
`;

if (!html.includes('diaryChecklistModal')) {
  html = html.replace('</body>', checklistHtml + '\n</body>');
  fs.writeFileSync('index.html', html, 'utf-8');
}

// --- JS PATCH ---
let js = fs.readFileSync('script.js', 'utf-8');

const checklistJs = `
// --- DIARY SELF-CORRECTION ---
const b2SaveDiary = saveDiaryEntry;
saveDiaryEntry = function() {
  const p1 = document.getElementById('prompt1').value.trim();
  const p2 = document.getElementById('prompt2').value.trim();
  const p3 = document.getElementById('prompt3').value.trim();
  const p4 = document.getElementById('prompt4').value.trim();
  
  if (!p1 && !p2 && !p3 && !p4) { showToast('?? Please write something first!'); return; }
  
  // Show Checklist
  document.getElementById('chk1').checked = false;
  document.getElementById('chk2').checked = false;
  document.getElementById('chk3').checked = false;
  
  document.getElementById('diaryChecklistModal').style.display = 'flex';
};

function confirmDiarySave() {
  if (!document.getElementById('chk1').checked || !document.getElementById('chk2').checked || !document.getElementById('chk3').checked) {
    showToast('?? Please check all boxes to confirm your grammar is correct!');
    return;
  }
  document.getElementById('diaryChecklistModal').style.display = 'none';
  b2SaveDiary(); // Call the original save logic
}
`;

if (!js.includes('confirmDiarySave')) {
  js += '\n' + checklistJs;
  fs.writeFileSync('script.js', js, 'utf-8');
}

console.log('Task 6 Complete: Checklist Added');
