const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Add Nav Button
const navRegex = /<button class="nav-btn" onclick="showSection\('reading'\)">.*?Reading<\/button>/;
if (html.match(navRegex) && !html.includes('showSection(\'chat\')')) {
  html = html.replace(navRegex, html.match(navRegex)[0] + `\n        <button class="nav-btn" onclick="showSection('chat')">&#128172; AI Chat</button>`);
}

// 2. Add Chat Section
const chatSection = `
  <!-- AI CHAT -->
  <div id="section-chat" class="section" style="display:none;">
    <div class="card" style="margin-bottom:20px;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div class="card-title" style="margin:0;">&#129302; AI Language Partner</div>
          <div class="card-sub" style="margin:0;">Practice live German conversation!</div>
        </div>
        <button class="btn btn-outline btn-sm" onclick="toggleChatSettings()">&#9881;&#65039; API Settings</button>
      </div>
      
      <div id="chatSettings" style="display:none; margin-top:15px; padding-top:15px; border-top:1px solid var(--border);">
        <div style="font-size:0.9rem; margin-bottom:10px;">To use the AI Chat, you need a free Google Gemini API Key. Since this app runs purely on your device, your key is stored locally and never sent to our servers!</div>
        <div style="display:flex; gap:10px;">
          <input type="password" id="geminiApiKey" placeholder="Paste your Gemini API Key here..." style="flex:1; padding:8px; border-radius:6px; border:1px solid var(--border); background:var(--surface);">
          <button class="btn btn-primary" onclick="saveApiKey()">Save Key</button>
        </div>
        <div style="font-size:0.8rem; margin-top:10px;"><a href="https://aistudio.google.com/app/apikey" target="_blank" style="color:var(--accent);">Get a free API key here</a></div>
      </div>
    </div>
    
    <div class="card" style="display:flex; flex-direction:column; height:500px; padding:0; overflow:hidden;">
      <div id="chatHistory" style="flex:1; overflow-y:auto; padding:20px; display:flex; flex-direction:column; gap:15px; background:var(--surface2);">
        <div style="text-align:center; color:var(--text-muted); margin-top:20px;">Provide your API key above to start chatting!</div>
      </div>
      <div style="padding:15px; background:var(--surface); border-top:1px solid var(--border); display:flex; gap:10px;">
        <input type="text" id="chatInput" placeholder="Type in German..." style="flex:1; padding:12px; border-radius:8px; border:1px solid var(--border); background:var(--surface2); color:var(--text); font-size:1rem;" onkeypress="if(event.key==='Enter') sendChatMessage()">
        <button class="btn btn-primary" onclick="sendChatMessage()">Send</button>
      </div>
    </div>
  </div>
`;

const injectRegex = /<div id="section-srs" class="section">/;
if (html.match(injectRegex) && !html.includes('id="section-chat"')) {
  html = html.replace(injectRegex, chatSection + '\n  <div id="section-srs" class="section">');
}

fs.writeFileSync('index.html', html, 'utf8');


let js = fs.readFileSync('script.js', 'utf8');

const phase5Logic = `
// PHASE 5: AI CHAT PARTNER
let chatMessages = []; // stores objects {role: 'user'|'model', parts: [{text: ''}]}

function toggleChatSettings() {
  const el = document.getElementById('chatSettings');
  el.style.display = el.style.display === 'none' ? 'block' : 'none';
  document.getElementById('geminiApiKey').value = localStorage.getItem('dt_gemini_key') || '';
}

function saveApiKey() {
  const key = document.getElementById('geminiApiKey').value.trim();
  localStorage.setItem('dt_gemini_key', key);
  showToast('API Key saved locally!', 'var(--success)');
  document.getElementById('chatSettings').style.display = 'none';
  
  if (chatMessages.length === 0) {
    document.getElementById('chatHistory').innerHTML = \`
      <div style="align-self:flex-start; background:var(--surface); padding:12px 18px; border-radius:18px; border-bottom-left-radius:4px; max-width:80%; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
        Hallo! Ich bin dein deutscher Sprachpartner. Worüber möchtest du heute sprechen?
      </div>
    \`;
  }
}

async function sendChatMessage() {
  const inputEl = document.getElementById('chatInput');
  const text = inputEl.value.trim();
  const apiKey = localStorage.getItem('dt_gemini_key');
  
  if (!text) return;
  if (!apiKey) {
    showToast('Please enter your Gemini API Key in Settings first!', 'var(--danger)');
    toggleChatSettings();
    return;
  }
  
  // Add user message to UI
  const historyEl = document.getElementById('chatHistory');
  if (chatMessages.length === 0) historyEl.innerHTML = ''; // clear placeholder
  
  historyEl.innerHTML += \`
    <div style="align-self:flex-end; background:var(--accent); color:white; padding:12px 18px; border-radius:18px; border-bottom-right-radius:4px; max-width:80%; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
      \${text}
    </div>
  \`;
  
  inputEl.value = '';
  historyEl.scrollTop = historyEl.scrollHeight;
  
  // Add to state
  chatMessages.push({ role: "user", parts: [{ text: text }] });
  
  // Add loading indicator
  const loadingId = 'loading-' + Date.now();
  historyEl.innerHTML += \`
    <div id="\${loadingId}" style="align-self:flex-start; background:var(--surface); padding:12px 18px; border-radius:18px; border-bottom-left-radius:4px; max-width:80%; color:var(--text-muted);">
      Typing...
    </div>
  \`;
  historyEl.scrollTop = historyEl.scrollHeight;
  
  try {
    const payload = {
      system_instruction: { parts: [{text: "You are a friendly German language tutor. Chat with the user in German. Keep your sentences simple enough for an A2/B1 student to understand. If they make a grammar mistake, gently correct them in English, then continue the conversation in German."}] },
      contents: chatMessages
    };
    
    const res = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=\${apiKey}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await res.json();
    document.getElementById(loadingId).remove();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const aiText = data.candidates[0].content.parts[0].text;
      
      chatMessages.push({ role: "model", parts: [{ text: aiText }] });
      
      historyEl.innerHTML += \`
        <div style="align-self:flex-start; background:var(--surface); padding:12px 18px; border-radius:18px; border-bottom-left-radius:4px; max-width:80%; box-shadow:0 2px 5px rgba(0,0,0,0.05); line-height:1.5;">
          \${aiText.replace(/\\n/g, '<br>')}
        </div>
      \`;
      historyEl.scrollTop = historyEl.scrollHeight;
    } else {
      throw new Error("Invalid API response");
    }
  } catch(e) {
    document.getElementById(loadingId).remove();
    showToast('Failed to connect to AI. Check your API Key or internet.', 'var(--danger)');
    chatMessages.pop(); // remove user message from memory so they can try again
  }
}
`;

if (!js.includes('function sendChatMessage')) {
  js += '\n' + phase5Logic;
  fs.writeFileSync('script.js', js, 'utf8');
}

console.log("Phase 5: AI Chat Implemented!");

