const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf-8');

// 1. Remove button from nav
html = html.replace(/<button class="nav-btn" onclick="showSection\('guide'\)">.*?Study Guide<\/button>/g, '');

// 2. Extract the Study Guide content
const guideSectionRegex = /<!-- STUDY GUIDE -->[\s\S]*?<div id="section-guide" class="section">([\s\S]*?)<\/div>\s*<\/div>\s*<!-- RESTORED SECTIONS -->/;
// Wait, the regex might be tricky if div tags are nested.
// The guide section looks like:
/*
<!-- STUDY GUIDE -->
<div id="section-guide" class="section">
  <div class="card">
    <div class="card-title" ...>&#127465;&#127466; The Ultimate German Study Guide</div>
    ...
  </div>
</div>
*/

// Instead of regex extraction which is risky with nested divs, we can just replace the whole section out, and append the card to the dashboard.
const oldGuideSection = `<!-- STUDY GUIDE -->
<div id="section-guide" class="section">
  <div class="card">
    <div class="card-title" style="font-size:1.8rem; margin-bottom:20px; color:var(--accent)">&#127465;&#127466; The Ultimate German Study Guide</div>
    <div style="font-size:1.1rem; line-height:1.6; color:var(--text)">
      
      <p style="margin-bottom:30px; font-weight:500; color:var(--text-muted)">This application is designed to take you from a complete beginner (A1) to professional fluency (B2). To get the fastest results, follow this daily routine.</p>

      <h3 style="color:var(--accent); border-bottom:2px solid var(--border); padding-bottom:8px; margin-bottom:15px">&#9201;&#65039; The Optimal Daily Routine (20-30 Minutes)</h3>
      <ol style="margin-bottom:30px; padding-left:20px; display:flex; flex-direction:column; gap:10px">
        <li><b>Check the Dashboard (2 mins):</b> Read the Word and Sentence of the Day. Click the "Listen" button and repeat the pronunciation out loud.</li>
        <li><b>Review Vocabulary & SRS (5 mins):</b> Open <i>More ? SRS Review</i>. Review flashcards due today. Add 5 to 10 new words you encountered at work to the Vocabulary tab.</li>
        <li><b>Write Your Diary (10 mins):</b> Open the Diary tab. Do the Sentence Builder prompt first. Answer the 3 standard prompts. When saving, strictly follow the Grammar Checklist.</li>
        <li><b>Take a Quick Quiz (5 mins):</b> Alternate daily: MCQ (Mon/Wed), Listening (Tue/Thu), Grammar & Verbs (Fri).</li>
      </ol>

      <div style="background:var(--surface2); border-left:4px solid var(--gold); padding:15px; margin-bottom:40px; border-radius:8px">
        <b>&#128161; Weekly Habit:</b> Every Sunday, open the <i>Weekly Reflection</i> tab to review your progress, and export a <b>Data Backup</b> from your Dashboard to keep your words safe!
      </div>

      <h3 style="color:var(--accent); border-bottom:2px solid var(--border); padding-bottom:8px; margin-bottom:20px">&#128200; How to Adapt Your Routine for Each Level</h3>
      
      <div style="margin-bottom:25px; padding:15px; border:1px solid var(--border); border-radius:10px">
        <h4 style="margin-top:0; color:#34d399">&#128994; A1 Level (Beginner)</h4>
        <p style="margin:8px 0"><b>Goal:</b> Build basic vocabulary and get used to sounds.</p>
        <ul style="padding-left:20px; margin:0">
          <li><b>Vocab:</b> Add everyday words (Haus, essen). Pay attention to Gender Colors (Blue = der, Red = die, Green = das).</li>
          <li><b>Diary:</b> Just write 1 simple sentence per prompt (e.g., <i>Ich lerne Deutsch</i>).</li>
          <li><b>Tools:</b> Use the Sentence Builder manually and test the Pronunciation Checker.</li>
        </ul>
      </div>

      <div style="margin-bottom:25px; padding:15px; border:1px solid var(--border); border-radius:10px">
        <h4 style="margin-top:0; color:#fbbf24">&#128993; A2 Level (Elementary)</h4>
        <p style="margin:8px 0"><b>Goal:</b> Connect sentences and understand spoken German.</p>
        <ul style="padding-left:20px; margin:0">
          <li><b>Vocab:</b> Group words into categories (Verbs, Daily Life).</li>
          <li><b>Diary:</b> Write 2 sentences per prompt. Combine them using <i>und, aber, weil</i>.</li>
          <li><b>Tools:</b> Focus heavily on the Dictation Quiz to train your ear.</li>
        </ul>
      </div>

      <div style="margin-bottom:25px; padding:15px; border:1px solid var(--border); border-radius:10px">
        <h4 style="margin-top:0; color:#f97316">&#128992; B1 Level (Intermediate)</h4>
        <p style="margin:8px 0"><b>Goal:</b> Professional vocabulary and holding conversations.</p>
        <ul style="padding-left:20px; margin:0">
          <li><b>Vocab:</b> Import the IT Job Dataset. Focus on Tech/Software vocabulary.</li>
          <li><b>Diary:</b> Write in the past tense (Perfekt/Präteritum). Write 3+ sentences per prompt.</li>
          <li><b>Tools:</b> Start doing the Monthly Speaking Challenge (talk for 1 minute).</li>
        </ul>
      </div>

      <div style="margin-bottom:20px; padding:15px; border:1px solid var(--border); border-radius:10px">
        <h4 style="margin-top:0; color:#ef4444">&#128308; B2 Level (Fluent)</h4>
        <p style="margin:8px 0"><b>Goal:</b> Complex grammar and spontaneous speaking.</p>
        <ul style="padding-left:20px; margin:0">
          <li><b>Reading:</b> Read the Reading Practice stories daily to master tech context.</li>
          <li><b>Tools:</b> Grind the Irregular Verbs trainer and Grammar Quiz.</li>
          <li><b>Diary:</b> Write full paragraphs. The Grammar Checklist is critical here.</li>
        </ul>
      </div>

    </div>
  </div>
</div>`;

// Remove the standalone section entirely
html = html.replace(oldGuideSection, '');

const wikiCard = `
  <!-- WIKI -->
  <div class="card" style="margin-top:24px; border-color:var(--accent)">
    <div class="card-title" style="font-size:1.8rem; margin-bottom:20px; color:var(--accent)">&#128214; Wiki (Study Guide)</div>
    <div style="font-size:1.1rem; line-height:1.6; color:var(--text)">
      
      <p style="margin-bottom:30px; font-weight:500; color:var(--text-muted)">This application is designed to take you from a complete beginner (A1) to professional fluency (B2). To get the fastest results, follow this daily routine.</p>

      <h3 style="color:var(--accent); border-bottom:2px solid var(--border); padding-bottom:8px; margin-bottom:15px">&#9201;&#65039; The Optimal Daily Routine (20-30 Minutes)</h3>
      <ol style="margin-bottom:30px; padding-left:20px; display:flex; flex-direction:column; gap:10px">
        <li><b>Check the Dashboard (2 mins):</b> Read the Word and Sentence of the Day. Click the "Listen" button and repeat the pronunciation out loud.</li>
        <li><b>Review Vocabulary & SRS (5 mins):</b> Open <i>More ? SRS Review</i>. Review flashcards due today. Add 5 to 10 new words you encountered at work to the Vocabulary tab.</li>
        <li><b>Write Your Diary (10 mins):</b> Open the Diary tab. Do the Sentence Builder prompt first. Answer the 3 standard prompts. When saving, strictly follow the Grammar Checklist.</li>
        <li><b>Take a Quick Quiz (5 mins):</b> Alternate daily: MCQ (Mon/Wed), Listening (Tue/Thu), Grammar & Verbs (Fri).</li>
      </ol>

      <div style="background:var(--surface2); border-left:4px solid var(--gold); padding:15px; margin-bottom:40px; border-radius:8px">
        <b>&#128161; Weekly Habit:</b> Every Sunday, open the <i>Weekly Reflection</i> tab to review your progress, and export a <b>Data Backup</b> from your Dashboard to keep your words safe!
      </div>

      <h3 style="color:var(--accent); border-bottom:2px solid var(--border); padding-bottom:8px; margin-bottom:20px">&#128200; How to Adapt Your Routine for Each Level</h3>
      
      <div style="margin-bottom:25px; padding:15px; border:1px solid var(--border); border-radius:10px">
        <h4 style="margin-top:0; color:#34d399">&#128994; A1 Level (Beginner)</h4>
        <p style="margin:8px 0"><b>Goal:</b> Build basic vocabulary and get used to sounds.</p>
        <ul style="padding-left:20px; margin:0">
          <li><b>Vocab:</b> Add everyday words (Haus, essen). Pay attention to Gender Colors (Blue = der, Red = die, Green = das).</li>
          <li><b>Diary:</b> Just write 1 simple sentence per prompt (e.g., <i>Ich lerne Deutsch</i>).</li>
          <li><b>Tools:</b> Use the Sentence Builder manually and test the Pronunciation Checker.</li>
        </ul>
      </div>

      <div style="margin-bottom:25px; padding:15px; border:1px solid var(--border); border-radius:10px">
        <h4 style="margin-top:0; color:#fbbf24">&#128993; A2 Level (Elementary)</h4>
        <p style="margin:8px 0"><b>Goal:</b> Connect sentences and understand spoken German.</p>
        <ul style="padding-left:20px; margin:0">
          <li><b>Vocab:</b> Group words into categories (Verbs, Daily Life).</li>
          <li><b>Diary:</b> Write 2 sentences per prompt. Combine them using <i>und, aber, weil</i>.</li>
          <li><b>Tools:</b> Focus heavily on the Dictation Quiz to train your ear.</li>
        </ul>
      </div>

      <div style="margin-bottom:25px; padding:15px; border:1px solid var(--border); border-radius:10px">
        <h4 style="margin-top:0; color:#f97316">&#128992; B1 Level (Intermediate)</h4>
        <p style="margin:8px 0"><b>Goal:</b> Professional vocabulary and holding conversations.</p>
        <ul style="padding-left:20px; margin:0">
          <li><b>Vocab:</b> Import the IT Job Dataset. Focus on Tech/Software vocabulary.</li>
          <li><b>Diary:</b> Write in the past tense (Perfekt/Präteritum). Write 3+ sentences per prompt.</li>
          <li><b>Tools:</b> Start doing the Monthly Speaking Challenge (talk for 1 minute).</li>
        </ul>
      </div>

      <div style="margin-bottom:20px; padding:15px; border:1px solid var(--border); border-radius:10px">
        <h4 style="margin-top:0; color:#ef4444">&#128308; B2 Level (Fluent)</h4>
        <p style="margin:8px 0"><b>Goal:</b> Complex grammar and spontaneous speaking.</p>
        <ul style="padding-left:20px; margin:0">
          <li><b>Reading:</b> Read the Reading Practice stories daily to master tech context.</li>
          <li><b>Tools:</b> Grind the Irregular Verbs trainer and Grammar Quiz.</li>
          <li><b>Diary:</b> Write full paragraphs. The Grammar Checklist is critical here.</li>
        </ul>
      </div>

    </div>
  </div>
`;

// Find where section-dashboard ends and inject the wikiCard before its closing div.
// The backup card looks like:
const backupHtml = `        <input type="file" accept=".json" onchange="importData(event)" style="position:absolute; left:0; top:0; opacity:0; cursor:pointer; height:100%">
      </div>
    </div>
  </div>`;

if (html.includes(backupHtml) && !html.includes('Wiki (Study Guide)')) {
  html = html.replace(backupHtml, backupHtml + '\n' + wikiCard);
  fs.writeFileSync('index.html', html, 'utf-8');
  console.log("Wiki injected into dashboard successfully!");
} else {
  console.log("Could not find insertion point!");
}

