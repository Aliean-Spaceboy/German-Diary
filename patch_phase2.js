const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Inject microphone buttons into Diary fields (prompt1, 2, 3, 4, 5)
const targetIds = ['prompt1', 'prompt2', 'prompt3', 'prompt4', 'prompt5'];
targetIds.forEach(id => {
  const regex = new RegExp(`(<textarea id="${id}"[^>]*>[\\s\\S]*?</textarea>)`);
  if (html.match(regex)) {
    // Wrap textarea and append button
    const replacement = `<div style="position:relative;">
        $1
        <button class="btn btn-outline" style="position:absolute; bottom:10px; right:10px; border-radius:50%; width:35px; height:35px; padding:0; display:flex; align-items:center; justify-content:center; background:var(--surface);" onclick="startVoiceTyping('${id}', this)">&#127897;</button>
      </div>`;
    html = html.replace(regex, replacement);
  }
});

fs.writeFileSync('index.html', html, 'utf8');


let js = fs.readFileSync('script.js', 'utf8');

const voiceTypingCode = `
// PHASE 2: VOICE TYPING (Speech-To-Text)
let currentSpeechRec = null;

function startVoiceTyping(inputId, btnElement) {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    showToast('Your browser does not support Voice Typing. Please use Chrome.', 'var(--danger)');
    return;
  }
  
  if (currentSpeechRec) {
    currentSpeechRec.stop();
  }
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  currentSpeechRec = new SpeechRecognition();
  
  currentSpeechRec.lang = 'de-DE'; // Force German recognition
  currentSpeechRec.interimResults = true;
  currentSpeechRec.continuous = false; // Stop when they stop speaking
  
  const inputEl = document.getElementById(inputId);
  const originalText = inputEl.value;
  const originalIcon = btnElement.innerHTML;
  
  btnElement.innerHTML = '&#128308;'; // Red circle recording icon
  btnElement.style.borderColor = 'var(--danger)';
  btnElement.style.color = 'var(--danger)';
  
  currentSpeechRec.onresult = (event) => {
    let interimTranscript = '';
    let finalTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }
    
    // We append the final transcript if they stopped, else show interim
    const spacer = originalText.length > 0 && !originalText.endsWith(' ') ? ' ' : '';
    inputEl.value = originalText + spacer + finalTranscript + interimTranscript;
    
    // trigger word count update manually
    const evt = new Event('input', { bubbles: true });
    inputEl.dispatchEvent(evt);
  };
  
  currentSpeechRec.onerror = (event) => {
    console.error('Speech recognition error', event.error);
    showToast('Speech Recognition Error: ' + event.error, 'var(--danger)');
    resetMicBtn(btnElement, originalIcon);
  };
  
  currentSpeechRec.onend = () => {
    resetMicBtn(btnElement, originalIcon);
    currentSpeechRec = null;
  };
  
  currentSpeechRec.start();
  showToast('Listening... Speak in German!', 'var(--success)');
}

function resetMicBtn(btnElement, originalIcon) {
  btnElement.innerHTML = originalIcon;
  btnElement.style.borderColor = '';
  btnElement.style.color = '';
}
`;

if (!js.includes('function startVoiceTyping')) {
  js += '\n' + voiceTypingCode;
  fs.writeFileSync('script.js', js, 'utf8');
}

console.log("Phase 2: Voice Typing Implemented!");

