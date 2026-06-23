const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf-8');

// The exact stray HTML snippet
const straySnippet = `        </div>
        <div class="roadmap-sub">Test words added in the last 7 days</div>`;

// We just replace the stray occurrence. 
// Let's replace the broader block to be safe.
const badBlock = `<div class="roadmap-sub">Train your ear! Type or select what you hear</div>
      </div>
      <div class="roadmap-sub">Test words added in the last 7 days</div>`;

const goodBlock = `<div class="roadmap-sub">Train your ear! Type or select what you hear</div>
      </div>`;

if (html.includes(badBlock)) {
  html = html.replace(badBlock, goodBlock);
  fs.writeFileSync('index.html', html, 'utf-8');
  console.log("Stray line removed!");
} else {
  // Try fallback replacement
  const fallbackBad = `Train your ear! Type or select what you hear</div>\r\n        </div>\r\n        <div class="roadmap-sub">Test words added in the last 7 days</div>`;
  const fallbackGood = `Train your ear! Type or select what you hear</div>\n        </div>`;
  if (html.includes(fallbackBad)) {
     html = html.replace(fallbackBad, fallbackGood);
     fs.writeFileSync('index.html', html, 'utf-8');
     console.log("Stray line removed (fallback 1)!");
  } else {
     // Regex fallback
     html = html.replace(/Train your ear! Type or select what you hear<\/div>\s*<\/div>\s*<div class="roadmap-sub">Test words added in the last 7 days<\/div>/, 'Train your ear! Type or select what you hear</div>\n      </div>');
     fs.writeFileSync('index.html', html, 'utf-8');
     console.log("Stray line removed (regex)!");
  }
}
