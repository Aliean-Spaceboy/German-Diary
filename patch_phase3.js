const fs = require('fs');
let js = fs.readFileSync('script.js', 'utf8');

const regex = /<button class="btn btn-primary" onclick="window\.open\('https:\/\/translate\.google\.com.*?Search on Google Translate<\/button>/;

if (js.match(regex)) {
  js = js.replace(regex, `<button id="liveTranslateBtn" class="btn btn-primary" onclick="liveTranslateFallback('\${term.replace(/'/g,"\\\\'")}')">&#10024; Fetch Translation from Cloud</button>`);
}

const fallbackLogic = `
// PHASE 3: LIVE DICTIONARY FALLBACK
async function liveTranslateFallback(term) {
  const btn = document.getElementById('liveTranslateBtn');
  if(!btn) return;
  
  btn.innerHTML = '&#8987; Fetching from MyMemory API...';
  btn.disabled = true;
  
  try {
    // Detect if they typed english by checking if it contains english characters mostly?
    // Actually MyMemory auto-detects pretty well if we do de|en but sometimes we need autodetect.
    // Let's just do autodetect|en for now, or assume German->English.
    const res = await fetch(\`https://api.mymemory.translated.net/get?q=\${encodeURIComponent(term)}&langpair=de|en\`);
    const data = await res.json();
    
    if (data && data.responseData && data.responseData.translatedText) {
      let translatedText = data.responseData.translatedText;
      
      // If the API couldn't translate it, it just returns the same string.
      if (translatedText.toLowerCase() === term.toLowerCase()) {
         btn.innerHTML = '&#10060; Word not found in API. Try Google.';
         btn.onclick = () => window.open('https://translate.google.com/?sl=auto&tl=en&text=' + encodeURIComponent(term));
         btn.disabled = false;
         return;
      }
      
      // We don't know for sure if they typed DE or EN. 
      // If we assume they typed DE, then 'translatedText' is EN.
      vocab_pool.unshift({
        de: term,
        en: translatedText,
        level: 0,
        nextReview: Date.now()
      });
      save('dt_vocab_pool', vocab_pool);
      
      showToast('&#10024; Translated & saved to Flashcards!', 'var(--success)');
      searchDictionary(); // Re-render instantly
    } else {
      btn.innerHTML = '&#10060; Translation failed. Try Google.';
      btn.onclick = () => window.open('https://translate.google.com/?sl=auto&tl=en&text=' + encodeURIComponent(term));
      btn.disabled = false;
    }
  } catch(e) {
    btn.innerHTML = '&#10060; Offline. Try Google.';
    btn.onclick = () => window.open('https://translate.google.com/?sl=auto&tl=en&text=' + encodeURIComponent(term));
    btn.disabled = false;
  }
}
`;

if (!js.includes('function liveTranslateFallback')) {
  js += '\n' + fallbackLogic;
  fs.writeFileSync('script.js', js, 'utf8');
}

console.log("Phase 3: Live Dictionary Fallback Implemented!");

