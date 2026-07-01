// ─── DATA ─────────────────────────────────────────────────────────────────────
const GRAMMAR_TIPS = [
  {
    rule: "Articles: der / die / das",
    example: "der Mann (the man), die Frau (the woman), das Kind (the child)",
  },
  {
    rule: "Verb conjugation: sein (to be)",
    example: "Ich bin, Du bist, Er/Sie ist, Wir sind, Sie sind",
  },
  {
    rule: "Present tense: regular verbs",
    example:
      "lernen → ich lerne, du lernst, er lernt (I learn, you learn, he learns)",
  },
  {
    rule: "Negation with 'nicht'",
    example:
      "Ich arbeite nicht. (I don't work.) Sie kommt nicht. (She doesn't come.)",
  },
  {
    rule: "Perfect tense with 'haben'",
    example:
      "Ich habe gelernt. (I have learned.) Er hat gearbeitet. (He has worked.)",
  },
  {
    rule: "Perfect tense with 'sein'",
    example:
      "Ich bin gegangen. (I have gone.) Sie ist gefahren. (She has driven.)",
  },
  {
    rule: "Modal verbs: können / müssen / wollen",
    example: "Ich kann Deutsch sprechen. (I can speak German.)",
  },
  {
    rule: "Future tense with 'werden'",
    example: "Ich werde morgen lernen. (I will learn tomorrow.)",
  },
  {
    rule: "Accusative case: den/einen",
    example:
      "Ich sehe den Mann. (I see the man.) — Mann becomes den in accusative.",
  },
  {
    rule: "Dative case: dem/einem",
    example:
      "Ich helfe dem Mann. (I help the man.) — Mann takes dem in dative.",
  },
  {
    rule: "Word order: verb always second",
    example:
      "Heute lerne ich Deutsch. (Today I learn German.) — verb stays 2nd.",
  },
  {
    rule: "Separable verbs: anfangen, aufhören",
    example: "Ich fange an. (I begin.) Er hört auf. (He stops.)",
  },
  {
    rule: "Conjunction: weil (because) — verb last",
    example: "Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte.",
  },
  {
    rule: "Possessive pronouns: mein/meine",
    example: "mein Laptop (my laptop), meine Arbeit (my work)",
  },
  {
    rule: "Comparative: schneller, besser",
    example: "Ich spreche schneller als vorher. (I speak faster than before.)",
  },
  {
    rule: "Reflexive verbs: sich freuen, sich vorstellen",
    example:
      "Ich freue mich. (I am happy.) Ich stelle mich vor. (I introduce myself.)",
  },
  {
    rule: "Subordinate clauses with 'dass'",
    example:
      "Ich weiß, dass du Deutsch lernst. (I know that you learn German.)",
  },
  {
    rule: "Passive voice: werden + Partizip II",
    example: "Die App wird entwickelt. (The app is being developed.)",
  },
  {
    rule: "Konjunktiv II: würde + Infinitiv",
    example:
      "Ich würde gerne in Deutschland arbeiten. (I would like to work in Germany.)",
  },
  {
    rule: "Two-way prepositions: in, auf, an, etc.",
    example:
      "in + Dative (location): Ich bin in der Schule. / in + Accusative (movement): Ich gehe in die Schule.",
  },
];

const SPEAKING_TOPICS = [
  {
    title: "Mein Beruf (My Job)",
    icon: "💼",
    hints: [
      "Ich bin Softwareentwickler",
      "Ich arbeite mit Java",
      "Meine Aufgaben sind...",
      "Ich arbeite von zu Hause",
    ],
  },
  {
    title: "Mein Alltag (My Daily Routine)",
    icon: "🌅",
    hints: [
      "Ich stehe um ... Uhr auf",
      "Ich frühstücke um...",
      "Am Abend lerne ich...",
    ],
  },
  {
    title: "Warum Deutschland? (Why Germany?)",
    icon: "🇩🇪",
    hints: [
      "Ich möchte in Deutschland arbeiten, weil...",
      "Die Technologiebranche in Deutschland...",
      "Mein Ziel ist...",
    ],
  },
  {
    title: "Meine Familie (My Family)",
    icon: "👨‍👩‍👧",
    hints: ["Ich habe...", "Meine Mutter ist...", "Wir wohnen in..."],
  },
  {
    title: "Meine Hobbys (My Hobbies)",
    icon: "🎮",
    hints: ["In meiner Freizeit...", "Ich lese gerne...", "Ich lerne gerne..."],
  },
  {
    title: "Technologie (Technology)",
    icon: "💻",
    hints: [
      "Ich arbeite mit Spring Boot",
      "Docker hilft bei der Bereitstellung",
      "Kubernetes orchestriert Container",
    ],
  },
];

const STARTER_PHRASES = [
  "Heute habe ich ",
  "Ich habe gelernt, dass ",
  "Ich bin müde, aber ",
  "Morgen werde ich ",
  "Ich arbeite an ",
  "Es war interessant, weil ",
  "Ich bin froh, dass ",
  "Ich habe Probleme mit ",
];

// ─── STORAGE ──────────────────────────────────────────────────────────────────
function load(key, def) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? def;
  } catch {
    return def;
  }
}
function save(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

let diaryEntries = load("dt_entries", []);

let vocab = load("dt_vocab", []);
let vocab_pool = load("dt_vocab_pool", []);
let speakNotesList = load("dt_speak", []);

// ==========================================
// 🛡️ ANTI-CHEAT: CLOCK PROTECTION
// ==========================================
(function () {
  // 🔒 Obfuscated keys — users will never find these
  const _K1 = "dt_app_meta_v2";
  const _K2 = "dt_session_cfg";
  const _SALT = 0x5a3f; // XOR salt — makes stored value unreadable

  // Encode/Decode so the value is never a plain readable timestamp
  function _encode(ts) {
    return (ts ^ _SALT).toString(36);
  }
  function _decode(val) {
    try {
      return parseInt(val, 36) ^ _SALT;
    } catch {
      return 0;
    }
  }

  function _showWarning() {
    window.__timeTravelDetected = true;

    const el = document.createElement("div");
    el.id = "ttWarning";
    el.style =
      "position:fixed;top:0;left:0;width:100%;background:var(--danger);color:#fff;text-align:center;padding:12px;font-weight:800;z-index:99999;font-size:0.9rem;transition:opacity 0.8s ease;";
    el.textContent =
      "⚠️ Security alert: Clock mismatch detected. Your progress is protected.";
    document.body.prepend(el);

    // ✅ Auto-dismiss after 5 seconds — no user action needed!
    setTimeout(() => {
      el.style.opacity = "0";
      setTimeout(() => {
        el.remove();
        window.__timeTravelDetected = false;
      }, 800);
    }, 5000);
  }

  const now = Date.now();
  const raw1 = localStorage.getItem(_K1);
  const raw2 = localStorage.getItem(_K2);

  // Always overwrite with encoded current time immediately
  // This means ANY tampering is auto-corrected on the next refresh
  localStorage.setItem(_K1, _encode(now));
  localStorage.setItem(_K2, _encode(now));

  if (raw1 && raw2) {
    const stored1 = _decode(raw1);
    const stored2 = _decode(raw2);

    // Cross-reference: if the two keys don't match, someone tampered with one of them
    if (Math.abs(stored1 - stored2) > 1000) {
      _showWarning();
      return;
    }

    // Clock-back check: if stored time is ahead of now, clock was moved back
    if (stored1 > now) {
      _showWarning();
      return;
    }
  }

  window.__timeTravelDetected = false;
})();
// ─── UTILITIES ────────────────────────────────────────────────────────────────
function todayStr() {
  return new Date().toISOString().split("T")[0];
}
function formatDate(d) {
  return new Date(d).toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2800);
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function showSection(id) {
  document
    .querySelectorAll(".section")
    .forEach((s) => s.classList.remove("active"));
  document
    .querySelectorAll(".nav-btn")
    .forEach((b) => b.classList.remove("active"));
  document.getElementById("section-" + id).classList.add("active");
  localStorage.setItem("dt_current_section", id); // Save state
  const dropdown = document.getElementById("moreDropdown");
  if (dropdown && dropdown.classList.contains("show"))
    dropdown.classList.remove("show");
  document.querySelectorAll(".nav-btn").forEach((b) => {
    if (
      b.getAttribute("onclick") &&
      b.getAttribute("onclick").includes("'" + id + "'")
    ) {
      b.classList.add("active");
    }
  });
  if (id === "entries") renderEntries();
  if (id === "vocab") {
    renderVocab("All");
    document.querySelectorAll(".tab")[0]?.classList.add("active");
  }
  if (id === "grammar") renderGrammar();
  if (id === "speaking") renderSpeaking();
  if (id === "reflection") renderReflections();
  if (id === "quiz") quitQuiz();
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
// ==========================================
// 🛡️ TRUE PROGRESS MATH (Never Resets)
// ==========================================
function getLevel(diaryEntriesCount, vocabCount) {
  // Total Max Points possible for B2 is 600
  const MAX_POINTS = 600;

  // Calculate true total points (Diary = 5pts, Vocab = 1pt)
  const totalPoints = diaryEntriesCount * 5 + vocabCount;

  // Calculate permanent climbing percentage (capped at 100%)
  const rawPct = (totalPoints / MAX_POINTS) * 100;
  const pct = Math.min(rawPct, 100);

  // Determine actual rank based on true points
  let label = "Starter";
  let badgeClass = "badge-starter";

  if (totalPoints >= 600) {
    label = "B2 Fluent";
    badgeClass = "badge-b2";
  } else if (totalPoints >= 300) {
    label = "B1 Intermed.";
    badgeClass = "badge-b1";
  } else if (totalPoints >= 150) {
    label = "A2 Elem.";
    badgeClass = "badge-a2";
  } else if (totalPoints >= 50) {
    label = "A1 Beginner";
    badgeClass = "badge-a1";
  }

  return { label, pct, class: badgeClass };
}
function calcStreak() {
  const dates = [...new Set(diaryEntries.map((e) => e.date))].sort();
  if (!dates.length) return 0;
  let streak = 0,
    day = new Date(todayStr());
  for (let i = dates.length - 1; i >= 0; i--) {
    const d = new Date(dates[i]);
    const diff = Math.round((day - d) / 86400000);
    if (diff === 0 || diff === 1) {
      streak++;
      day = d;
    } else break;
  }
  return streak;
}

function renderDashboard() {
  const streak = calcStreak();
  document.getElementById("statEntries").textContent = diaryEntries.length;
  document.getElementById("statWords").textContent = vocab.length;
  document.getElementById("statStreak").textContent = streak;

  const lv = getLevel(diaryEntries.length, vocab.length);
  document.getElementById("currentLevel").textContent = lv.label;
  document.getElementById("currentLevel").className = "level-badge " + lv.class;
  document.getElementById("progressBar").style.width =
    Math.min(lv.pct, 100) + "%";

  const needed = 50 - (diaryEntries.length * 5 + vocab.length);
  document.getElementById("progressHint").textContent =
    needed > 0
      ? `Add ${Math.ceil(
          needed / 5
        )} entries or ${needed} vocab words to reach A1!`
      : `Great progress! Keep going daily 💪`;

  // Grammar tip
  const tip = GRAMMAR_TIPS[new Date().getDate() % GRAMMAR_TIPS.length];
  document.getElementById("dashTipRule").textContent = tip.rule;
  document.getElementById("dashTipExample").textContent = tip.example;

  // Roadmap
  if (typeof renderRoadmap === "function") renderRoadmap();

  // Heatmap
  if (typeof renderHeatmap === "function") renderHeatmap();
}

// ─── LEVEL ROADMAP ────────────────────────────────────────────────────────────
const LEVELS = [
  { id: "A1", label: "A1", sub: "~6 months", badge: "badge-a1" },
  { id: "A2", label: "A2", sub: "~12 months", badge: "badge-a2" },
  { id: "B1", label: "B1", sub: "~18 months", badge: "badge-b1" },
  { id: "B2", label: "B2", sub: "~24 months", badge: "badge-b2" },
];

function renderRoadmap() {
  const done = load("dt_roadmap", {});
  const el = document.getElementById("roadmap");
  el.innerHTML = LEVELS.map(
    (lv) => `
    <div class="roadmap-item ${
      done[lv.id] ? "done" : ""
    }" onclick="toggleLevel('${lv.id}')">
      <div class="roadmap-check">${done[lv.id] ? "✓" : ""}</div>
      <div>
        <div class="roadmap-label">${lv.label}</div>
        <div class="roadmap-sub">${lv.sub}</div>
      </div>
    </div>
  `
  ).join("");
}

function toggleLevel(id) {
  const done = load("dt_roadmap", {});
  done[id] = !done[id];
  save("dt_roadmap", done);
  renderRoadmap();
  showToast(
    done[id] ? `🎉 ${id} marked complete! Glückwunsch!` : `${id} unmarked.`
  );
}

// ─── DIARY ────────────────────────────────────────────────────────────────────
function initDiary() {
  document.getElementById("diaryDate").textContent =
    "— " + formatDate(todayStr());

  // Phrases
  const pl = document.getElementById("phraseList");
  pl.innerHTML = "";
  STARTER_PHRASES.forEach((p) => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline btn-sm";
    btn.textContent = p;
    btn.onclick = () => {
      navigator.clipboard?.writeText(p);
      showToast(`Copied: "${p}"`);
    };
    pl.appendChild(btn);
  });

  // Word count listeners
  ["prompt1", "prompt2", "prompt3"].forEach((id, i) => {
    const el = document.getElementById(id);
    const wc = document.getElementById("wc" + (i + 1));
    el.addEventListener("input", () => {
      const words = el.value.trim().split(/\s+/).filter(Boolean).length;
      wc.textContent = words + " words";
    });
  });
}

async function saveDiaryEntry() {
  const p1 = document.getElementById("prompt1").value.trim();
  const p2 = document.getElementById("prompt2").value.trim();
  const p3 = document.getElementById("prompt3").value.trim();
  const p4 = document.getElementById("prompt4").value.trim();
  if (!p1 && !p2 && !p3) {
    showToast("Please fill at least one prompt!");
    return;
  }

  const passedGrammar = await checkDiaryGrammar(true);
  if (!passedGrammar) {
    showToast(
      "Please fix your grammar mistakes before saving!",
      "var(--danger)"
    );
    // ensure feedback is visible
    document
      .getElementById("grammarFeedback")
      .scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const entry = { date: todayStr(), ts: Date.now(), p1, p2, p3, p4 };
  diaryEntries.unshift(entry);
  save("dt_entries", diaryEntries);
  clearDiary();
  renderDashboard();
  document.getElementById("grammarFeedback").style.display = "none";
  showToast("Diary entry saved! Gut gemacht!");
}

function clearDiary() {
  ["prompt1", "prompt2", "prompt3", "prompt4"].forEach(
    (id) => (document.getElementById(id).value = "")
  );
  ["wc1", "wc2", "wc3"].forEach(
    (id) => (document.getElementById(id).textContent = "0 words")
  );
}

// ─── PAST ENTRIES ─────────────────────────────────────────────────────────────
function renderEntries() {
  const el = document.getElementById("entriesList");
  if (!diaryEntries.length) {
    el.innerHTML =
      '<div class="empty-state"><div class="empty-icon">📓</div><div>No entries yet. Write your first diary entry!</div></div>';
    return;
  }
  el.innerHTML = diaryEntries
    .map(
      (e, i) => `
    <div class="entry-card">
      <div class="entry-date"><span>📅 ${formatDate(e.date)}</span></div>
      ${
        e.p1
          ? `<div class="entry-block"><div class="entry-block-label">Was habe ich gemacht?</div><div class="entry-text">${escHtml(
              e.p1
            )}</div></div>`
          : ""
      }
      ${
        e.p2
          ? `<div class="entry-block"><div class="entry-block-label">Was habe ich gelernt?</div><div class="entry-text">${escHtml(
              e.p2
            )}</div></div>`
          : ""
      }
      ${
        e.p3
          ? `<div class="entry-block"><div class="entry-block-label">Was werde ich morgen machen?</div><div class="entry-text">${escHtml(
              e.p3
            )}</div></div>`
          : ""
      }
      ${
        e.p4
          ? `<div class="entry-block"><div class="entry-block-label">Freitext</div><div class="entry-text">${escHtml(
              e.p4
            )}</div></div>`
          : ""
      }
      <div class="entry-actions"><button class="btn btn-danger btn-sm" onclick="deleteEntry(${i})">🗑 Delete</button></div>
    </div>
  `
    )
    .join("");
}

function deleteEntry(i) {
  if (!confirm("Delete this entry?")) return;
  diaryEntries.splice(i, 1);
  save("dt_entries", diaryEntries);
  renderEntries();
  renderDashboard();
  showToast("Entry deleted.");
}

function escHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
}

// ─── VOCABULARY ───────────────────────────────────────────────────────────────
// ==========================================
// 🛡️ THE API GATEKEEPER
// ==========================================
async function validateGerman(germanText, userEnglish = null) {
  if (!navigator.onLine) {
    console.warn("Offline. Bypassing Gatekeeper.");
    return { isValid: true, reason: "offline" };
  }

  try {
    const cleaned = germanText.toLowerCase().trim();

    // ── Quick Local Checks (No API needed) ──────────────────
    if (cleaned.length < 2) {
      return {
        isValid: false,
        reason: "Input is too short to be a real word.",
      };
    }
    const vowels = (cleaned.match(/[aeiouäöüy]/g) || []).length;
    const letters = (cleaned.match(/[a-zäöü]/g) || []).length;
    if (letters > 3 && vowels / letters < 0.1) {
      return {
        isValid: false,
        reason: "Too many consonants! Doesn't look like a real German word.",
      };
    }
    if (/(.)\1{4,}/.test(cleaned)) {
      return {
        isValid: false,
        reason: "Doesn't look like a real word (too much repetition).",
      };
    }

    // ── API-Powered Check using your smartTranslate ──────────
    // Directly translate germanText from DE → EN using Google
    const safeWord = encodeURIComponent(germanText.trim());
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=de&tl=en&dt=t&q=${safeWord}`
    );
    const data = await res.json();
    const apiEnglish = (data[0] && data[0][0] ? data[0][0][0] : "")
      .toLowerCase()
      .trim();

    // Check 1: If DE→EN translation equals the input exactly, it's probably not a German word
    // (e.g., typing English "dog" → translates to "dog" → gibberish or English!)
    if (apiEnglish && apiEnglish === cleaned) {
      return {
        isValid: false,
        reason: `"${germanText}" doesn't appear to be a German word. Bitte auf Deutsch!`,
      };
    }

    // Check 2: If user provided an English translation, cross-check it with the API result!
    if (userEnglish && apiEnglish) {
      const userEn = userEnglish.toLowerCase().trim();
      // Allow partial matches (e.g. API says "the apple" user typed "apple" → OK!)
      const isMatch =
        apiEnglish.includes(userEn) || userEn.includes(apiEnglish);
      if (!isMatch) {
        return {
          isValid: false,
          reason: `Wrong translation! "${germanText}" means "${data[0][0][0]}", not "${userEnglish}". Please correct it!`,
        };
      }
    }

    // ✅ Passed all checks!
    return { isValid: true };
  } catch (error) {
    console.error("Gatekeeper Error:", error);
    // If API crashes, don't lock the user out
    return { isValid: true, reason: "error_bypass" };
  }
}
let currentFilter = "All";
let flashIndex = 0;

async function addVocab() {
  const de = document.getElementById("vocabDe").value.trim();
  const en = document.getElementById("vocabEn").value.trim();
  const cat = document.getElementById("vocabCat").value;

  if (!de || !en) {
    showToast("⚠️ Enter both German and English!");
    return;
  }

  // 🛡️ ANTI-CHEAT 1: Duplicate / Farming Check
  if (vocab.some((v) => v.de.toLowerCase() === de.toLowerCase())) {
    showToast("🚫 That word already exists in your list!", "var(--danger)");
    return;
  }

  // 🛡️ ANTI-CHEAT 2: AI Gatekeeper Validation
  const saveBtn = document.querySelector("button[onclick='addVocab()']");
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = "🛡️ Checking...";
  }

  const check = await validateGerman(de, en);

  if (saveBtn) {
    saveBtn.disabled = false;
    saveBtn.textContent = "➕ Add Word";
  }

  if (!check.isValid) {
    showToast(`🚫 Blocked: ${check.reason}`, "var(--danger)");
    return;
  }

  // ✅ Passed all checks — Safe to save!
  vocab.unshift({ de, en, cat, date: todayStr() });
  save("dt_vocab", vocab);
  document.getElementById("vocabDe").value = "";
  document.getElementById("vocabEn").value = "";
  updateTodayWordCount();
  renderVocab(currentFilter);
  updateFlashcard();
  renderDashboard();
  showToast(`✅ Added: ${de} = ${en}`);
}

function updateTodayWordCount() {
  const count = vocab.filter((v) => v.date === todayStr()).length;
  document.getElementById("todayWordCount").textContent = count;
}

function renderVocab(filter = "All") {
  const list = document.getElementById("vocabList");
  if (!list) return;
  list.innerHTML = "";

  let filtered =
    filter === "All" ? vocab : vocab.filter((v) => v.cat === filter);

  filtered.forEach((v, idx) => {
    // Find the real ID in the main array
    const realIdx = vocab.indexOf(v);

    // Check if we have context sentences
    let sentenceHtml = "";
    if (v.sentenceDe) {
      sentenceHtml = `
        <div style="margin-top:12px; padding:12px; background:rgba(91,141,238,0.08); border-left:3px solid var(--accent); border-radius:6px;">
          <div style="font-weight:600; color:var(--text); font-size:0.95rem;">📖 ${v.sentenceDe}</div>
          <div style="color:var(--text-muted); font-size:0.85rem; margin-top:4px;">${v.sentenceEn}</div>
        </div>
      `;
    } else {
      sentenceHtml = `
        <div style="margin-top:12px;">
          <button class="btn btn-outline" style="font-size:0.75rem; padding:6px 10px; border-color:var(--border);" onclick="generateContextForWord(${realIdx})">✨ Add AI Context Sentence</button>
        </div>
      `;
    }

    // Safely escape for the speaker button
    const safeWord = v.de.replace(/"/g, "&quot;").replace(/'/g, "\\'");

    list.innerHTML += `
      <div class="card" style="margin-bottom:15px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <div style="font-size:1.2rem; font-weight:bold; color:var(--text);">${v.de}</div>
            <div style="color:var(--text-muted);">${v.en}</div>
            <span class="badge" style="margin-top:8px;">${v.cat}</span>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn btn-outline" style="padding:6px 10px;" onclick="speakWord('${safeWord}')">🔊</button>
            <button class="btn btn-outline" style="padding:6px 10px; border-color:var(--danger); color:var(--danger);" onclick="deleteVocab(${realIdx})">🗑️</button>
          </div>
        </div>
        ${sentenceHtml}
      </div>
    `;
  });
}

function deleteVocab(index) {
  // 1. Delete the item using its exact index number
  vocab.splice(index, 1);
  save("dt_vocab", vocab);

  // 2. Figure out which tab you are currently on so we don't switch you to 'All'
  let currentFilter = "All";
  const activeTab = document.querySelector(".tab-row .tab.active");
  if (activeTab) {
    if (activeTab.textContent.includes("Mined")) {
      currentFilter = "Mined Sentences";
    } else {
      currentFilter = activeTab.textContent
        .trim()
        .replace(/^[^\w]+/, "")
        .trim();
    }
  }

  // 3. Refresh the UI
  renderVocab(currentFilter);
  if (typeof updateDashboardStats === "function") updateDashboardStats();
  if (typeof renderDashboard === "function") renderDashboard();

  showToast("🗑️ Card deleted.");
}

function getNounClass(word) {
  const w = word.toLowerCase();
  if (w.startsWith("der ")) return "noun-der";
  if (w.startsWith("die ")) return "noun-die";
  if (w.startsWith("das ")) return "noun-das";
  return "";
}

function importItVocab() {
  const itWords = [
    { de: "die Anwendung", en: "application", cat: "Work", date: todayStr() },
    {
      de: "die Schnittstelle",
      en: "interface / API",
      cat: "Java",
      date: todayStr(),
    },
    { de: "die Datenbank", en: "database", cat: "Database", date: todayStr() },
    { de: "die Cloud", en: "cloud", cat: "Cloud", date: todayStr() },
    {
      de: "die Infrastruktur",
      en: "infrastructure",
      cat: "Cloud",
      date: todayStr(),
    },
    {
      de: "die Bereitstellung",
      en: "deployment",
      cat: "Kubernetes",
      date: todayStr(),
    },
    { de: "die Erfahrung", en: "experience", cat: "Work", date: todayStr() },
    { de: "das Projekt", en: "project", cat: "Work", date: todayStr() },
    { de: "die Entwicklung", en: "development", cat: "Work", date: todayStr() },
    { de: "der Entwickler", en: "developer", cat: "Work", date: todayStr() },
    { de: "der Fehler", en: "bug / error", cat: "Java", date: todayStr() },
    { de: "die Anforderung", en: "requirement", cat: "Work", date: todayStr() },
    { de: "die Sicherheit", en: "security", cat: "Cloud", date: todayStr() },
    {
      de: "die Skalierbarkeit",
      en: "scalability",
      cat: "Cloud",
      date: todayStr(),
    },
    {
      de: "das Vorstellungsgespräch",
      en: "job interview",
      cat: "Work",
      date: todayStr(),
    },
  ];
  let imported = 0;
  itWords.forEach((w) => {
    if (!vocab.some((v) => v.de.toLowerCase() === w.de.toLowerCase())) {
      vocab.unshift(w);
      imported++;
    }
  });
  if (imported > 0) {
    save("dt_vocab", vocab);
    showToast("✅ " + imported + " IT words imported!");
    renderVocab(currentFilter);
    updateTodayWordCount();
    renderDashboard();
  } else {
    showToast("⚠️ Words are already in your list!");
  }
}

function filterVocab(filter, el) {
  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.remove("active"));
  el.classList.add("active");
  renderVocab(filter);
}

function updateFlashcard() {
  if (!vocab.length) {
    document.getElementById("flashFront").textContent = "—";
    document.getElementById("flashBack").textContent = "Add some words first!";
    return;
  }
  flashIndex = Math.floor(Math.random() * vocab.length);
  document.getElementById("flashFront").textContent = vocab[flashIndex].de;
  document.getElementById("flashBack").textContent = "";
}

function revealFlash() {
  if (!vocab.length) return;
  document.getElementById("flashBack").textContent =
    vocab[flashIndex]?.en ?? "";
}

function nextFlash() {
  updateFlashcard();
}

// ─── SPEAKING ─────────────────────────────────────────────────────────────────
function renderSpeaking() {
  let dynamicHtml = "";
  if (vocab.length >= 4) {
    const randomWords = [...vocab]
      .sort(() => 0.5 - Math.random())
      .slice(0, 4)
      .map((v) => v.de);
    dynamicHtml = `
      <div class="speaking-topic" style="border-color:var(--accent);background:linear-gradient(135deg,rgba(91,141,238,0.1),transparent)">
        <div class="topic-title">✨ Dynamic Story (Auto-Updated)</div>
        <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:6px">Try to talk for 1 minute using these 4 random words from your list:</div>
        <ul class="topic-hints">${randomWords
          .map((h) => `<li>${escHtml(h)}</li>`)
          .join("")}</ul>
      </div>
    `;
  } else {
    dynamicHtml = `
      <div class="speaking-topic" style="border-color:var(--accent);background:linear-gradient(135deg,rgba(91,141,238,0.1),transparent)">
        <div class="topic-title">✨ Dynamic Story (Auto-Updated)</div>
        <div style="font-size:0.8rem;color:var(--text-muted)">Add at least 4 vocabulary words to unlock the dynamic story generator!</div>
      </div>
    `;
  }

  document.getElementById("speakingTopics").innerHTML =
    dynamicHtml +
    SPEAKING_TOPICS.map(
      (t) => `
    <div class="speaking-topic">
      <div class="topic-title">${t.icon} ${t.title}</div>
      <ul class="topic-hints">${t.hints
        .map((h) => `<li>${escHtml(h)}</li>`)
        .join("")}</ul>
    </div>
  `
    ).join("");

  const notes = load("dt_speak", []);
  const el = document.getElementById("savedSpeakNotes");
  if (notes.length) {
    el.innerHTML =
      '<div style="font-size:.85rem;color:var(--text-muted);margin-bottom:8px">📋 Saved Notes</div>' +
      notes
        .map(
          (n) =>
            `<div class="entry-card"><div class="entry-date"><span>📅 ${formatDate(
              n.date
            )}</span></div><div class="entry-text">${escHtml(
              n.text
            )}</div></div>`
        )
        .join("");
  }
}

function saveSpeakNotes() {
  const text = document.getElementById("speakNotes").value.trim();
  if (!text) {
    showToast("⚠️ Write your notes first!");
    return;
  }
  speakNotesList.unshift({ date: todayStr(), text });
  save("dt_speak", speakNotesList);
  document.getElementById("speakNotes").value = "";
  renderSpeaking();
  showToast("✅ Speaking notes saved!");
}

// ─── WEEKLY REFLECTION ────────────────────────────────────────────────────────
let reflections = load("dt_reflect", []);

function saveReflection() {
  const r1 = document.getElementById("ref1").value.trim();
  const r2 = document.getElementById("ref2").value.trim();
  const r3 = document.getElementById("ref3").value.trim();
  if (!r1 && !r2 && !r3) {
    showToast("⚠️ Fill at least one reflection prompt!");
    return;
  }
  const weekLabel = getWeekLabel();
  reflections.unshift({ date: todayStr(), week: weekLabel, r1, r2, r3 });
  save("dt_reflect", reflections);
  document.getElementById("ref1").value = "";
  document.getElementById("ref2").value = "";
  document.getElementById("ref3").value = "";
  renderReflections();
  showToast("✅ Reflection saved! Sehr gut!");
}

function getWeekLabel() {
  const d = new Date();
  const start = new Date(d);
  start.setDate(d.getDate() - d.getDay() + 1);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const fmt = (dt) =>
    dt.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return `Week of ${fmt(start)} – ${fmt(end)}`;
}

function renderReflections() {
  const el = document.getElementById("reflectionList");
  if (!reflections.length) {
    el.innerHTML =
      '<div class="empty-state"><div class="empty-icon">🪞</div><div>No reflections yet. Do your first one this Sunday!</div></div>';
    return;
  }
  el.innerHTML = reflections
    .map(
      (r, i) => `
    <div class="reflect-entry">
      <div class="reflect-week">📅 ${r.week || formatDate(r.date)}</div>
      ${
        r.r1
          ? `<div class="reflect-block"><div class="reflect-block-label">Was hat sich verbessert?</div><div class="reflect-text">${escHtml(
              r.r1
            )}</div></div>`
          : ""
      }
      ${
        r.r2
          ? `<div class="reflect-block"><div class="reflect-block-label">Was war schwierig?</div><div class="reflect-text">${escHtml(
              r.r2
            )}</div></div>`
          : ""
      }
      ${
        r.r3
          ? `<div class="reflect-block"><div class="reflect-block-label">Ziel für nächste Woche</div><div class="reflect-text">${escHtml(
              r.r3
            )}</div></div>`
          : ""
      }
      <button class="btn btn-danger btn-sm" style="margin-top:10px" onclick="deleteReflection(${i})">🗑 Delete</button>
    </div>
  `
    )
    .join("");
}

function deleteReflection(i) {
  if (!confirm("Delete this reflection?")) return;
  reflections.splice(i, 1);
  save("dt_reflect", reflections);
  renderReflections();
  showToast("Reflection deleted.");
}

// ─── GRAMMAR ──────────────────────────────────────────────────────────────────
function renderGrammar() {
  document.getElementById("allTips").innerHTML = GRAMMAR_TIPS.map(
    (t, i) => `
    <div class="tip-card" style="margin-bottom:14px">
      <div class="tip-num">Tip ${i + 1}</div>
      <div class="tip-rule">${t.rule}</div>
      <div class="tip-example">${escHtml(t.example)}</div>
    </div>
  `
  ).join("");
}

// ─── QUIZ ─────────────────────────────────────────────────────────────────────
const QUIZ_BANKS = {
  article: [
    { q: "___ Mann", options: ["der", "die", "das"], a: "der" },
    { q: "___ Frau", options: ["der", "die", "das"], a: "die" },
    { q: "___ Kind", options: ["der", "die", "das"], a: "das" },
    { q: "___ Auto", options: ["der", "die", "das"], a: "das" },
    { q: "___ Hund", options: ["der", "die", "das"], a: "der" },
    { q: "___ Katze", options: ["der", "die", "das"], a: "die" },
    { q: "___ Haus", options: ["der", "die", "das"], a: "das" },
    { q: "___ Apfel", options: ["der", "die", "das"], a: "der" },
    { q: "___ Sonne", options: ["der", "die", "das"], a: "die" },
    { q: "___ Buch", options: ["der", "die", "das"], a: "das" },
    { q: "___ Computer", options: ["der", "die", "das"], a: "der" },
    { q: "___ Datenbank", options: ["der", "die", "das"], a: "die" },
  ],
  sentence: [
    {
      q: "ich / Java / lerne",
      options: [
        "Ich lerne Java.",
        "Java ich lerne.",
        "Ich Java lerne.",
        "Lerne ich Java.",
      ],
      a: "Ich lerne Java.",
    },
    {
      q: "Entwickler / bin / ich",
      options: [
        "Ich bin Entwickler.",
        "Entwickler ich bin.",
        "Bin ich Entwickler.",
        "Ich Entwickler bin.",
      ],
      a: "Ich bin Entwickler.",
    },
    {
      q: "müde / bin / ich",
      options: [
        "Ich bin müde.",
        "Müde ich bin.",
        "Bin müde ich.",
        "Ich müde bin.",
      ],
      a: "Ich bin müde.",
    },
    {
      q: "wohnen / in / Berlin / wir",
      options: [
        "Wir wohnen in Berlin.",
        "In Berlin wir wohnen.",
        "Wohnen in Berlin wir.",
        "Wir in Berlin wohnen.",
      ],
      a: "Wir wohnen in Berlin.",
    },
    {
      q: "nicht / gut / schlafe / ich",
      options: [
        "Ich schlafe nicht gut.",
        "Ich nicht schlafe gut.",
        "Gut ich schlafe nicht.",
        "Schlafe ich nicht gut.",
      ],
      a: "Ich schlafe nicht gut.",
    },
    {
      q: "arbeiten / heute / wir",
      options: [
        "Wir arbeiten heute.",
        "Heute wir arbeiten.",
        "Wir heute arbeiten.",
        "Arbeiten wir heute.",
      ],
      a: "Wir arbeiten heute.",
    },
  ],
};

let quizState = { questions: [], idx: 0, score: 0 };

function startQuiz(type) {
  let questions = [];
  if (type === "vocab" || type === "weekly") {
    let source = vocab;
    if (type === "weekly") {
      const wkTs = Date.now() - 7 * 86400000;
      source = vocab.filter((v) => new Date(v.date).getTime() > wkTs);
      if (source.length < 4) source = vocab; // fallback if list too short
    }
    if (source.length < 4) {
      showToast("⚠️ You need at least 4 vocabulary words to play this quiz!");
      return;
    }
    source = [...source].sort(() => 0.5 - Math.random());
    const subset = source.slice(0, 10);
    questions = subset.map((v) => {
      const isDeToEn = Math.random() > 0.5;
      const q = isDeToEn ? v.de + " = ?" : v.en + " = ?";
      const a = isDeToEn ? v.en : v.de;

      const distractors = [...vocab]
        .filter((x) => x.de !== v.de)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((x) => (isDeToEn ? x.en : x.de));

      const opts = [a, ...distractors].sort(() => 0.5 - Math.random());
      return { q, options: opts, a };
    });
  } else {
    questions = [...QUIZ_BANKS[type]]
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);
  }

  quizState = { questions, idx: 0, score: 0 };
  document.getElementById("quizMenu").style.display = "none";
  document.getElementById("quizResult").style.display = "none";
  document.getElementById("quizActive").style.display = "block";

  const labels = {
    vocab: "Vocabulary Quiz",
    article: "Article Quiz",
    sentence: "Sentence Order",
    weekly: "Weekly Review",
  };
  document.getElementById("quizTypeLabel").textContent = labels[type];

  renderQuestion();
}

function renderQuestion() {
  const c = quizState;
  const q = c.questions[c.idx];
  document.getElementById("quizProgress").textContent = `${c.idx + 1} / ${
    c.questions.length
  }`;
  document.getElementById("quizQuestion").textContent = q.q;

  const optsEl = document.getElementById("quizOptions");
  optsEl.innerHTML = q.options
    .map(
      (opt) => `
    <button class="quiz-opt" onclick="selectAnswer('${opt.replace(
      /'/g,
      "\\'"
    )}', this)">${escHtml(opt)}</button>
  `
    )
    .join("");
  document.getElementById("quizNextBtn").style.display = "none";
}

function selectAnswer(ans, btn) {
  if (
    document.querySelector(".quiz-opt.correct") ||
    document.querySelector(".quiz-opt.wrong")
  )
    return;

  const c = quizState;
  const correctAns = c.questions[c.idx].a;

  document.querySelectorAll(".quiz-opt").forEach((b) => {
    if (b.textContent === correctAns) b.classList.add("correct");
    else if (b === btn) b.classList.add("wrong");
    b.disabled = true;
  });

  if (ans === correctAns) {
    c.score++;
    showToast("✅ Richtig!");
  } else {
    showToast("❌ Falsch!");
  }

  document.getElementById("quizNextBtn").style.display = "block";
}

function nextQuestion() {
  quizState.idx++;
  if (quizState.idx >= quizState.questions.length) {
    endQuiz();
  } else {
    renderQuestion();
  }
}

function endQuiz() {
  document.getElementById("quizActive").style.display = "none";
  document.getElementById("quizResult").style.display = "block";
  document.getElementById(
    "quizScore"
  ).textContent = `${quizState.score} / ${quizState.questions.length}`;
}

function quitQuiz() {
  document.getElementById("quizActive").style.display = "none";
  document.getElementById("quizResult").style.display = "none";
  document.getElementById("quizMenu").style.display = "block";
}

// ─── AUDIO & SPEECH (No Backend) ──────────────────────────────────────────────
function speakWord(word) {
  const synth = window.speechSynthesis;
  if (!synth) {
    showToast("⚠️ Your browser does not support text-to-speech.");
    return;
  }
  const utterThis = new SpeechSynthesisUtterance(word);
  utterThis.lang = "de-DE";
  synth.speak(utterThis);
}

function checkPronunciation() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showToast("⚠️ Browser unsupported. Use Google Chrome!");
    return;
  }

  const target = document.getElementById("targetPronunciation").value.trim();
  if (!target) {
    showToast("⚠️ Type a word or sentence to practice first!");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "de-DE";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  const resEl = document.getElementById("pronunciationResult");
  resEl.textContent = "Listening... Speak now!";
  resEl.style.color = "var(--text)";

  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (transcript.toLowerCase() === target.toLowerCase()) {
      resEl.textContent = `✅ Perfect! You said: "${transcript}"`;
      resEl.style.color = "var(--accent3)";
    } else {
      resEl.textContent = `❌ Heard: "${transcript}" (Try again!)`;
      resEl.style.color = "var(--danger)";
    }
  };
  recognition.onerror = () => {
    resEl.textContent = "⚠️ Mic Error or No Speech Detected";
    resEl.style.color = "var(--danger)";
  };
}

let mediaRecorder;
let audioChunks = [];
let audioDb = load("dt_audio", []);

function toggleRecording() {
  const btn = document.getElementById("btnRecord");
  const status = document.getElementById("recordingStatus");

  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    btn.textContent = "🔴 Start Recording";
    btn.classList.replace("btn-outline", "btn-danger");
    status.style.display = "none";
    return;
  }

  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      btn.textContent = "⏹ Stop Recording";
      btn.classList.replace("btn-danger", "btn-outline");
      status.style.display = "block";

      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result;
          audioDb.unshift({
            date: todayStr(),
            id: Date.now(),
            base64: base64Audio,
          });
          if (audioDb.length > 3) audioDb.pop(); // Keep max 3 locally to avoid blowing up Quota
          save("dt_audio", audioDb);
          audioChunks = [];
          renderAudio();
          showToast("🎙️ Audio saved safely in your browser!");
        };
        // Stop mic tracks
        stream.getTracks().forEach((track) => track.stop());
      });
    })
    .catch((e) => {
      showToast("⚠️ Microphone access denied or not available.");
    });
}

function renderAudio() {
  const el = document.getElementById("audioList");
  if (!audioDb.length) {
    if (el)
      el.innerHTML =
        '<div style="color:var(--text-muted);font-size:0.9rem">No recordings yet.</div>';
    return;
  }
  if (el)
    el.innerHTML = audioDb
      .map(
        (a, i) => `
    <div style="background:var(--surface); padding:10px; border-radius:8px; margin-bottom:10px; display:flex; align-items:center; gap:10px;">
      <span style="font-size:0.8rem; color:var(--text-muted); min-width:60px;">${formatDate(
        a.date
      )}</span>
      <audio controls src="${a.base64}" style="flex:1; height:30px;"></audio>
      <button class="btn btn-danger btn-sm" onclick="deleteAudio(${i})">🗑</button>
    </div>
  `
      )
      .join("");
}

function deleteAudio(i) {
  audioDb.splice(i, 1);
  save("dt_audio", audioDb);
  renderAudio();
}

function deleteAudio(id) {
  if (!confirm("Delete this recording?")) return;
  audioDb = audioDb.filter((a) => a.id !== id);
  save("dt_audio", audioDb);
  renderAudio();
  showToast("Recording deleted.");
}

// ─── INIT ─────────────────────────────────────────────────────────────────────

let timeTrackerInterval;
function initTimeTracker() {
  let mins = load("dt_time_" + todayStr(), 0);
  const display = document.getElementById("timeTrackerDisplay");
  if (display) display.textContent = mins + " mins today";

  // Update every 60 seconds
  timeTrackerInterval = setInterval(() => {
    mins++;
    save("dt_time_" + todayStr(), mins);
    if (display) display.textContent = mins + " mins today";
    // Live update the heatmap color!
  }, 60000);
}

document.addEventListener("DOMContentLoaded", () => {
  initTimeTracker();
  renderDashboard();
  initDiary();
  updateFlashcard();
  updateTodayWordCount();
  renderAudio();
});

// Added Features
let dictationWord = "";
function buildSentence() {
  document.getElementById("sbResult").innerText = `${
    document.getElementById("sbSub").value
  } ${document.getElementById("sbVerb").value} ${
    document.getElementById("sbObj").value
  }.`;
}
function renderSRS() {
  const el = document.getElementById("srsDueList");
  if (!el) return;

  const now = Date.now();
  const due = vocab.filter((v) => !v.nextReview || v.nextReview <= now);

  if (due.length === 0) {
    el.innerHTML =
      '<div style="padding:20px;text-align:center;color:var(--success)">&#127881; You have caught up on all your reviews!</div>';
    return;
  }

  const w = due[0];
  const vIdx = vocab.findIndex((v) => v.de === w.de);

  el.innerHTML = `
    <div style="font-size:1.5rem;font-weight:700;text-align:center;margin-bottom:10px">${w.de}</div>
    <div style="text-align:center;margin-bottom:20px"><button class="btn btn-outline btn-sm" onclick="this.style.display='none'; document.getElementById('srsAns').style.display='block'">Show Answer</button></div>
    <div id="srsAns" style="display:none; text-align:center">
      <div style="font-size:1.1rem;color:var(--text-muted);margin-bottom:20px">${w.en}</div>
      <div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap">
        <button class="btn btn-outline" style="border-color:var(--danger);color:var(--danger)" onclick="rateSRS(${vIdx}, 1)">Again (1 min)</button>
        <button class="btn btn-outline" style="border-color:var(--gold);color:var(--gold)" onclick="rateSRS(${vIdx}, 2)">Hard (1 day)</button>
        <button class="btn btn-outline" style="border-color:var(--success);color:var(--success)" onclick="rateSRS(${vIdx}, 3)">Good (3 days)</button>
        <button class="btn btn-outline" style="border-color:var(--accent);color:var(--accent)" onclick="rateSRS(${vIdx}, 4)">Easy (7 days)</button>
      </div>
    </div>
  `;
}

function rateSRS(idx, rating) {
  const w = vocab[idx];
  if (!w) return;

  const now = Date.now();
  let daysToAdd = 0;
  if (rating === 1) daysToAdd = 0.001; // 1.4 minutes
  else if (rating === 2) daysToAdd = 1;
  else if (rating === 3) daysToAdd = 3;
  else if (rating === 4) daysToAdd = 7;

  w.nextReview = now + daysToAdd * 86400000;
  save("dt_vocab", vocab);
  renderSRS();
}
function startDictation() {
  const v = JSON.parse(localStorage.getItem("dt_vocab") || "[]");
  if (!v.length) {
    alert("Add vocab first");
    return;
  }
  dictationWord = v[Math.floor(Math.random() * v.length)].de;
  speechSynthesis.speak(new SpeechSynthesisUtterance(dictationWord));
}
function checkDictation() {
  const a = document.getElementById("dictationAnswer").value.trim();
  document.getElementById("dictationResult").innerText =
    a.toLowerCase() == dictationWord.toLowerCase()
      ? "Correct"
      : "Wrong: " + dictationWord;
}
document.addEventListener("DOMContentLoaded", renderSRS);

function toggleDropdown(e) {
  e.stopPropagation();
  const dropdown = document.getElementById("moreDropdown");
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();

  // Use fixed positioning to escape overflow:auto clipping
  dropdown.style.position = "fixed";
  dropdown.style.top = rect.bottom + 4 + "px";
  dropdown.style.right = window.innerWidth - rect.right + "px";
  dropdown.style.left = "auto";

  dropdown.classList.toggle("show");
}

window.onclick = function (event) {
  if (
    !event.target.matches(".drop-btn") &&
    !event.target.closest(".drop-btn")
  ) {
    const dropdown = document.getElementById("moreDropdown");
    if (dropdown && dropdown.classList.contains("show")) {
      dropdown.classList.remove("show");
    }
  }
};

// --- OFFLINE DATABASE ENGINE ---

let DAILY_SENTENCES = load("dt_sentences", []);
let sentences_pool = load("dt_sentences_pool", []);

// FIX CORRUPTED SENTENCES
if (DAILY_SENTENCES.length > 0 && DAILY_SENTENCES[0].de === "Hallo") {
  console.log("Wiping corrupted sentences array...");
  DAILY_SENTENCES = [];
  sentences_pool = [];
  localStorage.removeItem("dt_sentences");
  localStorage.removeItem("dt_sentences_pool");
}

function loadDailyInspiration() {
  const allWords = [...vocab, ...vocab_pool];
  const w =
    allWords.length > 0
      ? allWords[Math.floor(Math.random() * allWords.length)]
      : { de: "Lerne!", en: "Learn!" };
  const allSents = [...DAILY_SENTENCES, ...sentences_pool];
  const s =
    allSents.length > 0
      ? allSents[Math.floor(Math.random() * allSents.length)]
      : { de: "Lerne jeden Tag!", en: "Learn every day!" };

  const wdEl = document.getElementById("wotdDe");
  if (wdEl) {
    wdEl.innerText = w.de;
    document.getElementById("wotdEn").innerText = w.en;
  }
  const sdEl = document.getElementById("sotdDe");
  if (sdEl) {
    sdEl.innerText = s.de;
    document.getElementById("sotdEn").innerText = s.en;
  }
}

// --- SENTENCE BUILDER IN DIARY ---
function setupSentenceBuilder() {
  const wordEl = document.getElementById("builderWord");
  if (!wordEl) return;
  if (vocab.length > 0) {
    const randomVocab = vocab[Math.floor(Math.random() * vocab.length)];
    wordEl.innerText = randomVocab.de;
  } else {
    wordEl.innerText = "lernen"; // fallback
  }
}

// Override diary init
const oldInitDiary =
  typeof initDiary !== "undefined" ? initDiary : function () {};
initDiary = function () {
  oldInitDiary();
  setupSentenceBuilder();
};

// Override save diary
const oldSaveDiary =
  typeof saveDiaryEntry !== "undefined" ? saveDiaryEntry : function () {};
saveDiaryEntry = function () {
  const p1 = document.getElementById("prompt1").value.trim();
  const p2 = document.getElementById("prompt2").value.trim();
  const p3 = document.getElementById("prompt3").value.trim();
  const p4 = document.getElementById("prompt4").value.trim(); // sentence builder
  const p5 = document.getElementById("prompt5")?.value.trim() || ""; // free writing

  if (!p1 && !p2 && !p3 && !p4) {
    showToast("?? Please fill at least one prompt!");
    return;
  }
  const entry = { date: todayStr(), ts: Date.now(), p1, p2, p3, p4, p5 };
  diaryEntries.unshift(entry);
  save("dt_entries", diaryEntries);
  clearDiary();
  renderDashboard();
  setupSentenceBuilder();
  showToast("? Diary & Sentence saved!");
};

const oldClearDiary = clearDiary;
clearDiary = function () {
  oldClearDiary();
  if (document.getElementById("prompt4"))
    document.getElementById("prompt4").value = "";
  if (document.getElementById("prompt5"))
    document.getElementById("prompt5").value = "";
};

// --- SRS LOGIC ---
// Override reveal flash
const oldRevealFlash = revealFlash;
revealFlash = function () {
  if (!vocab.length) return;
  document.getElementById("flashBack").textContent =
    vocab[flashIndex]?.en ?? "";
  document.getElementById("srsButtons").style.display = "flex";
  document.getElementById("nextFlashBtn").style.display = "none";
};

function submitSrs(difficulty) {
  if (!vocab.length) return;
  let word = vocab[flashIndex];
  let days = 1;
  if (difficulty === "good") days = 3;
  if (difficulty === "easy") days = 7;

  let nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + days);
  word.dueDate = nextDate.toISOString().split("T")[0];

  save("dt_vocab", vocab);
  showToast("Next review: " + days + " days");
  nextFlash();
}

// Override next flash
const oldNextFlash = nextFlash;
nextFlash = function () {
  document.getElementById("srsButtons").style.display = "none";
  document.getElementById("nextFlashBtn").style.display = "inline-flex";

  // Prioritize due words
  const today = todayStr();
  let dueWords = vocab.filter((v) => !v.dueDate || v.dueDate <= today);

  if (dueWords.length === 0) {
    document.getElementById("flashFront").textContent = "?? All caught up!";
    document.getElementById("flashBack").textContent = "No words due today.";
    document.getElementById("nextFlashBtn").style.display = "none";
    return;
  }

  flashIndex = vocab.indexOf(
    dueWords[Math.floor(Math.random() * dueWords.length)]
  );
  document.getElementById("flashFront").textContent = vocab[flashIndex].de;
  document.getElementById("flashBack").textContent = "";
};

// Hook initialization
document.addEventListener("DOMContentLoaded", () => {
  loadDailyInspiration();
  setTimeout(setupSentenceBuilder, 500); // ensure elements exist
});

// --- ADVANCED QUIZZES (MCQ & LISTENING) ---
const oldStartQuiz =
  typeof startQuiz !== "undefined" ? startQuiz : function () {};
startQuiz = function (type) {
  if (type === "listening" || type === "mcq") {
    const allItems = [...vocab, ...DAILY_SENTENCES];
    if (allItems.length < 4) {
      showToast("?? Add at least 4 items (words or sentences) first!");
      return;
    }
    quizState.type = type;
    quizState.score = 0;
    quizState.idx = 0;

    // Generate 10 random questions
    quizState.questions = [];
    for (let i = 0; i < 10; i++) {
      let target = allItems[Math.floor(Math.random() * allItems.length)];
      // Get 3 random wrong options
      let wrongs = allItems
        .filter((v) => v.de !== target.de)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      let options = [target.en, ...wrongs.map((w) => w.en)].sort(
        () => 0.5 - Math.random()
      );

      quizState.questions.push({
        de: target.de,
        options: options,
        answer: target.en,
      });
    }

    document.getElementById("quizMenu").style.display = "none";
    document.getElementById("quizActive").style.display = "block";
    renderQuestion();
  } else {
    // fallback to original if exists
    if (typeof oldStartQuiz === "function") oldStartQuiz(type);
  }
};

const oldRenderQuestion =
  typeof renderQuestion !== "undefined" ? renderQuestion : function () {};
renderQuestion = function () {
  if (quizState.type === "listening" || quizState.type === "mcq") {
    const q = quizState.questions[quizState.idx];
    document.getElementById("quizProgress").textContent =
      quizState.idx + 1 + " / " + quizState.questions.length;
    document.getElementById("quizTypeLabel").textContent =
      quizState.type === "listening" ? "?? Listening" : "?? MCQ";

    if (quizState.type === "listening") {
      document.getElementById("quizQuestion").innerHTML =
        '<button class="btn btn-primary" onclick="speakWord(\'' +
        q.de.replace(/'/g, "\\'") +
        "')\">?? Play Audio</button>";
      speakWord(q.de); // auto play
    } else {
      document.getElementById("quizQuestion").textContent = q.de;
    }

    document.getElementById("quizOptions").innerHTML = q.options
      .map(
        (opt, i) => `
      <button class="quiz-opt" id="opt${i}" onclick="checkAnswer('${opt.replace(
          /'/g,
          "\\'"
        )}', ${i}, '${q.answer.replace(/'/g, "\\'")}')">${opt}</button>
    `
      )
      .join("");

    document.getElementById("quizNextBtn").style.display = "none";
  } else {
    if (typeof oldRenderQuestion === "function") oldRenderQuestion();
  }
};

const oldCheckAnswer =
  typeof checkAnswer !== "undefined" ? checkAnswer : function () {};
checkAnswer = function (ans, btnIdx, correctAns) {
  if (quizState.type === "listening" || quizState.type === "mcq") {
    document.querySelectorAll(".quiz-opt").forEach((b) => (b.disabled = true));
    if (ans === correctAns) {
      document.getElementById("opt" + btnIdx).classList.add("correct");
      quizState.score++;
      showToast("? Correct!");
    } else {
      document.getElementById("opt" + btnIdx).classList.add("wrong");
      // Highlight correct answer
      let opts = document.querySelectorAll(".quiz-opt");
      opts.forEach((b) => {
        if (b.innerText === correctAns) b.classList.add("correct");
      });
      showToast("? Wrong!");
    }
    document.getElementById("quizNextBtn").style.display = "block";
  } else {
    if (typeof oldCheckAnswer === "function")
      oldCheckAnswer(ans, btnIdx, correctAns);
  }
};

document.querySelector("nav").addEventListener("scroll", () => {
  const dropdown = document.getElementById("moreDropdown");
  if (dropdown && dropdown.classList.contains("show")) {
    dropdown.classList.remove("show");
  }
});

// --- DATA BACKUP & RESTORE ---
function exportData() {
  const data = {
    dt_entries: load("dt_entries", []),
    dt_vocab: load("dt_vocab", []),
    dt_speak: load("dt_speak", []),
    dt_sentences: load("dt_sentences", DEFAULT_SENTENCES),
    dt_stories: load("dt_stories", DEFAULT_STORIES),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "deutsches_tagebuch_backup_" + todayStr() + ".json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast("? Backup Downloaded!");
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data.dt_entries) save("dt_entries", data.dt_entries);
      if (data.dt_vocab) save("dt_vocab", data.dt_vocab);
      if (data.dt_speak) save("dt_speak", data.dt_speak);
      if (data.dt_sentences) save("dt_sentences", data.dt_sentences);
      if (data.dt_stories) save("dt_stories", data.dt_stories);
      showToast("?? Backup Restored Successfully!");
      setTimeout(() => location.reload(), 1000);
    } catch (err) {
      showToast("? Error: Invalid Backup File");
    }
  };
  reader.readAsText(file);
}

// --- CSV BULK IMPORT ---
function importCsv(event) {
  const file = event.target.files[0];
  if (!file) return;

  let userLvl = window.prompt(
    "What level are the contents of this file? (Type A1, A2, B1, B2, C1, or MIXED)",
    "MIXED"
  );
  if (!userLvl) return;
  userLvl = userLvl.trim().toUpperCase();
  if (!["A1", "A2", "B1", "B2", "C1", "MIXED"].includes(userLvl))
    userLvl = "MIXED";

  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    const lines = text.split("\n").filter((l) => l.trim().length > 0);
    let added = 0;

    lines.forEach((line, i) => {
      const parts = line.split(",");
      if (parts.length >= 2) {
        const de = parts[0].trim();
        const en = parts[1].trim();
        let explicitLvl =
          parts.length > 2 ? parts[2].trim().toUpperCase() : null;

        let itemLvl = userLvl;
        if (explicitLvl && ["A1", "A2", "B1", "B2", "C1"].includes(explicitLvl))
          itemLvl = explicitLvl;
        else if (userLvl === "MIXED") {
          const pct = i / lines.length;
          if (pct < 0.25) itemLvl = "A1";
          else if (pct < 0.5) itemLvl = "A2";
          else if (pct < 0.75) itemLvl = "B1";
          else itemLvl = "B2";
        }

        if (
          de &&
          en &&
          !vocab_pool.find((v) => v.de === de) &&
          !vocab.find((v) => v.de === de)
        ) {
          vocab_pool.push({ de, en, cat: "CSV", ts: Date.now(), lvl: itemLvl });
          added++;
        }
      }
    });
    save("dt_vocab_pool", vocab_pool);
    showToast(`Added ${added} new words to the hidden pool!`, "var(--success)");
    localStorage.removeItem("dt_last_unlock");
    checkDailyUnlock();
  };
  reader.readAsText(file);
}

// --- READING COMPREHENSION ---
let STORIES = load("dt_stories", []);
let stories_pool = load("dt_stories_pool", []);

let currentStory = null;

function loadStory(index) {
  currentStory = STORIES[index];
  document.getElementById("readingContent").style.display = "block";
  document.getElementById("readingQuestions").style.display = "block";

  document.getElementById("storyTitle").innerText = currentStory.title;
  document.getElementById("storyText").innerHTML = currentStory.text;

  for (let i = 1; i <= 3; i++) {
    document.getElementById("q" + i + "Text").innerText =
      currentStory.questions[i - 1].text;
    document.getElementById("q" + i + "Res").innerText = "";
  }
}

function checkReading(qNum, userAnswer) {
  if (!currentStory) return;
  const correct = currentStory.questions[qNum - 1].answer;
  const resEl = document.getElementById("q" + qNum + "Res");
  if (userAnswer === correct) {
    resEl.innerText = "? Richtig!";
    resEl.style.color = "var(--success)";
  } else {
    resEl.innerText = "? Falsch!";
    resEl.style.color = "var(--danger)";
  }
}

// --- B2 GRAMMAR & VERB QUIZZES ---
const GRAMMAR_QUESTIONS = [
  {
    text: "Ich fahre mit ___ Auto zur Arbeit.",
    options: ["dem", "das", "den", "der"],
    answer: "dem",
  },
  {
    text: "Wir danken ___ f�r die Hilfe.",
    options: ["Sie", "Ihre", "Ihnen", "Ihr"],
    answer: "Ihnen",
  },
  {
    text: "Er legt das Buch auf ___ Tisch.",
    options: ["den", "dem", "der", "das"],
    answer: "den",
  },
  {
    text: "Das Buch liegt auf ___ Tisch.",
    options: ["den", "dem", "der", "das"],
    answer: "dem",
  },
  {
    text: "Ich erinnere mich nicht ___ seinen Namen.",
    options: ["an", "auf", "�ber", "f�r"],
    answer: "an",
  },
  {
    text: "Trotz ___ Regens gehen wir spazieren.",
    options: ["den", "dem", "des", "der"],
    answer: "des",
  },
];

const IRREGULAR_VERBS = [
  { inf: "gehen", praet: "ging", perf: "gegangen" },
  { inf: "sehen", praet: "sah", perf: "gesehen" },
  { inf: "schreiben", praet: "schrieb", perf: "geschrieben" },
  { inf: "bleiben", praet: "blieb", perf: "geblieben" },
  { inf: "sprechen", praet: "sprach", perf: "gesprochen" },
  { inf: "nehmen", praet: "nahm", perf: "genommen" },
];

const b2StartQuiz =
  typeof startQuiz !== "undefined" ? startQuiz : function () {};
startQuiz = function (type) {
  if (type === "grammar") {
    quizState.type = "grammar";
    quizState.score = 0;
    quizState.idx = 0;
    quizState.questions = [...GRAMMAR_QUESTIONS]
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);
    document.getElementById("quizMenu").style.display = "none";
    document.getElementById("quizActive").style.display = "block";
    renderQuestion();
  } else if (type === "verbs") {
    quizState.type = "verbs";
    quizState.score = 0;
    quizState.idx = 0;
    let selectedVerbs = [...IRREGULAR_VERBS]
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);
    quizState.questions = selectedVerbs.map((v) => ({
      de: "Infinitive: <b>" + v.inf + "</b>",
      verb: v,
      options: [],
      answer: "", // manual input mode
    }));
    document.getElementById("quizMenu").style.display = "none";
    document.getElementById("quizActive").style.display = "block";
    renderQuestion();
  } else {
    b2StartQuiz(type);
  }
};

const b2RenderQuestion =
  typeof renderQuestion !== "undefined" ? renderQuestion : function () {};
renderQuestion = function () {
  if (quizState.type === "grammar") {
    const q = quizState.questions[quizState.idx];
    document.getElementById("quizProgress").textContent =
      quizState.idx + 1 + " / " + quizState.questions.length;
    document.getElementById("quizTypeLabel").textContent = "?? Grammar B2";
    document.getElementById("quizQuestion").textContent = q.text;
    document.getElementById("quizOptions").innerHTML = q.options
      .map(
        (opt, i) => `
      <button class="quiz-opt" id="opt${i}" onclick="checkAnswer('${opt}', ${i}, '${q.answer}')">${opt}</button>
    `
      )
      .join("");
    document.getElementById("quizNextBtn").style.display = "none";
  } else if (quizState.type === "verbs") {
    const q = quizState.questions[quizState.idx];
    document.getElementById("quizProgress").textContent =
      quizState.idx + 1 + " / " + quizState.questions.length;
    document.getElementById("quizTypeLabel").textContent = "?? Irregular Verbs";
    document.getElementById("quizQuestion").innerHTML = q.de;

    // Custom Input UI for Verbs
    document.getElementById("quizOptions").innerHTML = `
      <div style="display:flex; flex-direction:column; gap:10px; align-items:center; width:100%">
        <input id="verbPraet" placeholder="Pr�teritum (e.g. ging)" style="width:80%; padding:10px; text-align:center">
        <input id="verbPerf" placeholder="Partizip II (e.g. gegangen)" style="width:80%; padding:10px; text-align:center">
        <button class="btn btn-primary" onclick="checkVerbAnswer()">Check</button>
        <div id="verbResult" style="font-weight:bold; margin-top:10px"></div>
      </div>
    `;
    document.getElementById("quizNextBtn").style.display = "none";
  } else {
    b2RenderQuestion();
  }
};

function checkVerbAnswer() {
  const p1 = document.getElementById("verbPraet").value.trim().toLowerCase();
  const p2 = document.getElementById("verbPerf").value.trim().toLowerCase();
  const verb = quizState.questions[quizState.idx].verb;

  const resEl = document.getElementById("verbResult");
  if (p1 === verb.praet && p2 === verb.perf) {
    resEl.innerHTML = "? Correct!";
    resEl.style.color = "var(--success)";
    quizState.score++;
  } else {
    resEl.innerHTML =
      "? Wrong! It is: <b>" + verb.praet + "</b> / <b>" + verb.perf + "</b>";
    resEl.style.color = "var(--danger)";
  }
  document.getElementById("quizNextBtn").style.display = "block";
}

// --- DIARY SELF-CORRECTION ---
const b2SaveDiary =
  typeof saveDiaryEntry !== "undefined" ? saveDiaryEntry : function () {};

saveDiaryEntry = function () {
  const p1 = document.getElementById("prompt1").value.trim();
  const p2 = document.getElementById("prompt2").value.trim();
  const p3 = document.getElementById("prompt3").value.trim();
  const p4 = document.getElementById("prompt4").value.trim();

  if (!p1 && !p2 && !p3 && !p4) {
    showToast("⚠️ Please write something first!");
    return;
  }

  // Show Grammar Checklist Modal first (same as before)
  document.getElementById("chk1").checked = false;
  document.getElementById("chk2").checked = false;
  document.getElementById("chk3").checked = false;
  document.getElementById("diaryChecklistModal").style.display = "flex";
};

async function confirmDiarySave() {
  if (
    !document.getElementById("chk1").checked ||
    !document.getElementById("chk2").checked ||
    !document.getElementById("chk3").checked
  ) {
    showToast("⚠️ Please check all boxes to confirm your grammar is correct!");
    return;
  }

  // 🛡️ ANTI-CHEAT 3: Daily Diary Cap (only first entry of the day counts for points)
  const todayKey = "dt_diary_count_" + todayStr();
  const todayCount = parseInt(localStorage.getItem(todayKey) || "0");

  // Get the diary text to validate
  const diaryText = [
    document.getElementById("prompt1").value.trim(),
    document.getElementById("prompt2").value.trim(),
    document.getElementById("prompt3").value.trim(),
    document.getElementById("prompt4").value.trim(),
  ]
    .filter(Boolean)
    .join(" ");

  // 🛡️ ANTI-CHEAT 4: Gatekeeper — only validate on the first entry (saves API calls)
  if (todayCount === 0) {
    const confirmBtn = document.querySelector(
      "button[onclick='confirmDiarySave()']"
    );
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.textContent = "🛡️ Checking...";
    }

    const check = await validateGerman(diaryText);

    if (confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.textContent = "✅ Save Entry";
    }

    if (!check.isValid) {
      showToast(`🚫 Blocked: ${check.reason}`, "var(--danger)");
      return;
    }

    // Mark first entry of the day as counted
    localStorage.setItem(todayKey, "1");
  } else {
    showToast(
      "📝 Entry saved! (Only your first daily entry counts for level progress)",
      "var(--gold)"
    );
  }

  document.getElementById("diaryChecklistModal").style.display = "none";
  b2SaveDiary();
}

function toggleWiki() {
  const el = document.getElementById("wikiContent");
  if (el.style.display === "none") {
    el.style.display = "block";
  } else {
    el.style.display = "none";
  }
}

// Hook reading section to auto-load Story 1
const originalShowSectionReading =
  typeof showSection !== "undefined" ? showSection : function () {};
showSection = function (id) {
  originalShowSectionReading(id);
  if (
    id === "reading" &&
    document.getElementById("readingContent").style.display === "none"
  ) {
    loadStory(0); // Auto-load the first story
  }
};

// --- DYNAMIC IMPORTERS ---
function importSentenceCsv(event) {
  const file = event.target.files[0];
  if (!file) return;

  let userLvl = window.prompt(
    "What level are the contents of this file? (Type A1, A2, B1, B2, C1, or MIXED)",
    "MIXED"
  );
  if (!userLvl) return;
  userLvl = userLvl.trim().toUpperCase();
  if (!["A1", "A2", "B1", "B2", "C1", "MIXED"].includes(userLvl))
    userLvl = "MIXED";

  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    const lines = text.split("\n").filter((l) => l.trim().length > 0);
    let added = 0;

    lines.forEach((line, i) => {
      const parts = line.split(",");
      if (parts.length >= 2) {
        const de = parts[0].trim();
        const en = parts[1].trim();
        let explicitLvl =
          parts.length > 2 ? parts[2].trim().toUpperCase() : null;

        let itemLvl = userLvl;
        if (explicitLvl && ["A1", "A2", "B1", "B2", "C1"].includes(explicitLvl))
          itemLvl = explicitLvl;
        else if (userLvl === "MIXED") {
          const pct = i / lines.length;
          if (pct < 0.25) itemLvl = "A1";
          else if (pct < 0.5) itemLvl = "A2";
          else if (pct < 0.75) itemLvl = "B1";
          else itemLvl = "B2";
        }

        if (
          de &&
          en &&
          !sentences_pool.find((s) => s.de === de) &&
          !DAILY_SENTENCES.find((s) => s.de === de)
        ) {
          sentences_pool.push({ de, en, lvl: itemLvl });
          added++;
        }
      }
    });
    save("dt_sentences_pool", sentences_pool);
    showToast(
      `Added ${added} new sentences to the hidden pool!`,
      "var(--success)"
    );
    localStorage.removeItem("dt_last_unlock");
    checkDailyUnlock();
  };
  reader.readAsText(file);
}

function importStoryJson(event) {
  const file = event.target.files[0];
  if (!file) return;

  let userLvl = window.prompt(
    "What level are the stories in this file? (Type A1, A2, B1, B2, C1, or MIXED)",
    "MIXED"
  );
  if (!userLvl) return;
  userLvl = userLvl.trim().toUpperCase();
  if (!["A1", "A2", "B1", "B2", "C1", "MIXED"].includes(userLvl))
    userLvl = "MIXED";

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      if (!Array.isArray(data))
        throw new Error("JSON must be an array of stories.");

      let added = 0;
      data.forEach((story, i) => {
        if (
          story.title &&
          story.text &&
          story.questions &&
          story.questions.length === 3
        ) {
          let explicitLvl = story.lvl ? story.lvl.toUpperCase() : null;
          let itemLvl = userLvl;

          if (
            explicitLvl &&
            ["A1", "A2", "B1", "B2", "C1"].includes(explicitLvl)
          )
            itemLvl = explicitLvl;
          else if (userLvl === "MIXED") {
            const pct = i / data.length;
            if (pct < 0.25) itemLvl = "A1";
            else if (pct < 0.5) itemLvl = "A2";
            else if (pct < 0.75) itemLvl = "B1";
            else itemLvl = "B2";
          }

          story.lvl = itemLvl;
          if (
            !stories_pool.find((s) => s.title === story.title) &&
            !STORIES.find((s) => s.title === story.title)
          ) {
            stories_pool.push(story);
            added++;
          }
        }
      });
      save("dt_stories_pool", stories_pool);
      showToast(
        `Added ${added} new stories to the hidden pool!`,
        "var(--success)"
      );
      localStorage.removeItem("dt_last_unlock");
      checkDailyUnlock();
    } catch (err) {
      showToast("? Error: Invalid Story JSON format", "var(--danger)");
    }
  };
  reader.readAsText(file);
}

function updateStoryButtons() {
  if (STORIES.length > 3)
    document.getElementById("storyBtn3").style.display = "inline-block";
  if (STORIES.length > 4)
    document.getElementById("storyBtn4").style.display = "inline-block";
}

// Hook showSection to update story buttons if needed
const originalShowSectionReadingDynamic = showSection;
showSection = function (id) {
  originalShowSectionReadingDynamic(id);
  if (id === "reading") {
    updateStoryButtons();
  }
};

async function fetchCsvFromWeb() {
  const url = prompt(
    "Enter the raw CSV URL (e.g., a Raw GitHub link or public CSV):\n\nNote: The file must be in 'German,English' format.",
    "https://raw.githubusercontent.com/.../words.csv"
  );
  if (!url || url.trim() === "") return;

  try {
    showToast("? Downloading from Web...", "var(--gold)");
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network response was not ok");

    const text = await res.text();
    const lines = text.split("\n");
    let added = 0;

    lines.forEach((line) => {
      const parts = line.split(",");
      if (parts.length >= 2) {
        const de = parts[0].trim();
        const en = parts[1].trim();
        if (de && en && !vocab.find((v) => v.de === de)) {
          vocab.push({ de, en, level: 0, nextReview: Date.now() });
          added++;
        }
      }
    });

    if (added > 0) {
      save("dt_vocab", vocab);
      renderVocab();
      showToast("?? Successfully imported " + added + " words from the Web!");
    } else {
      showToast("?? No new valid words found in that URL.");
    }
  } catch (error) {
    console.error("Fetch error: ", error);
    showToast(
      "? Failed to fetch. Make sure it is a valid raw URL and allows CORS.",
      "var(--danger)"
    );
  }
}

// ONE-TIME MIGRATION: If the user already has 1000 words in active vocab, reset it!
if (vocab.length > 200 && vocab_pool.length === 0) {
  console.log("Migrating massive active lists back to pools...");
  vocab_pool = [...vocab];
  vocab = [];
  sentences_pool = [...DAILY_SENTENCES];
  DAILY_SENTENCES = [];
  stories_pool = [...STORIES];
  STORIES = [];

  save("dt_vocab_pool", vocab_pool);
  save("dt_vocab", vocab);
  save("dt_sentences_pool", sentences_pool);
  save("dt_sentences", DAILY_SENTENCES);
  save("dt_stories_pool", stories_pool);
  save("dt_stories", STORIES);

  // Clear last unlock so it unlocks today instantly
  localStorage.removeItem("dt_last_unlock");
}

// Tagging Migration
if (vocab_pool.length > 0 && !vocab_pool[0].lvl) {
  console.log("Tagging vocab pool with levels");
  const vLen = vocab_pool.length;
  vocab_pool.forEach((w, i) => {
    if (i < vLen * 0.25) w.lvl = "A1";
    else if (i < vLen * 0.5) w.lvl = "A2";
    else if (i < vLen * 0.75) w.lvl = "B1";
    else w.lvl = "B2";
  });
  save("dt_vocab_pool", vocab_pool);

  // also reset the last unlock to force an immediate demonstration of the new Smart Unlock today
  localStorage.removeItem("dt_last_unlock");
}

if (sentences_pool.length > 0 && !sentences_pool[0].lvl) {
  console.log("Tagging sentences pool with levels");
  const sLen = sentences_pool.length;
  sentences_pool.forEach((s, i) => {
    if (i < sLen * 0.25) s.lvl = "A1";
    else if (i < sLen * 0.5) s.lvl = "A2";
    else if (i < sLen * 0.75) s.lvl = "B1";
    else s.lvl = "B2";
  });
  save("dt_sentences_pool", sentences_pool);
}

function checkDailyUnlock() {
  const lastUnlock = load("dt_last_unlock", "");
  const today = todayStr();

  if (lastUnlock !== today) {
    let unlocked = 0;

    // ONE-TIME FIX: If the user is confused by having 25 words, wipe active vocab to let it cleanly pull exactly 10 today.
    if (vocab.length === 25) {
      console.log("Resetting 25 words back to 0 so we can pull exactly 10...");
      vocab_pool = [...vocab, ...vocab_pool];
      vocab = [];
    }
    const roadmap = load("dt_roadmap", {});
    const activeLevel =
      ["A1", "A2", "B1", "B2"].find((l) => !roadmap[l]) || "B2";

    // Unlock 10 words
    for (let i = 0; i < 10; i++) {
      const idx = vocab_pool.findIndex((w) => w.lvl === activeLevel);
      if (idx > -1) {
        const w = vocab_pool.splice(idx, 1)[0];
        if (!vocab.find((x) => x.de === w.de)) {
          vocab.push(w);
          unlocked++;
        }
      } else if (vocab_pool.length > 0) {
        const w = vocab_pool.shift();
        if (!vocab.find((x) => x.de === w.de)) {
          vocab.push(w);
          unlocked++;
        }
      }
    }

    // Unlock 1 sentence
    const sIdx = sentences_pool.findIndex((s) => s.lvl === activeLevel);
    if (sIdx > -1) {
      const s = sentences_pool.splice(sIdx, 1)[0];
      if (!DAILY_SENTENCES.find((x) => x.de === s.de)) {
        DAILY_SENTENCES.push(s);
        unlocked++;
      }
    } else if (sentences_pool.length > 0) {
      const s = sentences_pool.shift();
      if (!DAILY_SENTENCES.find((x) => x.de === s.de)) {
        DAILY_SENTENCES.push(s);
        unlocked++;
      }
    }

    // Unlock 1 story
    const stIdx = stories_pool.findIndex((st) =>
      st.title.includes("[" + activeLevel + "]")
    );
    if (stIdx > -1) {
      const st = stories_pool.splice(stIdx, 1)[0];
      if (!STORIES.find((x) => x.title === st.title)) {
        STORIES.push(st);
        unlocked++;
      }
    } else if (stories_pool.length > 0) {
      const st = stories_pool.shift();
      if (!STORIES.find((x) => x.title === st.title)) {
        STORIES.push(st);
        unlocked++;
      }
    }

    if (unlocked > 0) {
      save("dt_vocab", vocab);
      save("dt_vocab_pool", vocab_pool);
      save("dt_sentences", DAILY_SENTENCES);
      save("dt_sentences_pool", sentences_pool);
      save("dt_stories", STORIES);
      save("dt_stories_pool", stories_pool);
      save("dt_last_unlock", today);

      setTimeout(() => {
        showToast(
          `?? Daily Unlock! Scaled for Level ${activeLevel}!`,
          "var(--gold)"
        );
        renderVocab();
        renderDashboard();
      }, 1500);
    }
  }
}

// Call checkDailyUnlock after everything is initialized
document.addEventListener("DOMContentLoaded", () => {
  checkDailyUnlock();
});

// --- 1 & 2. SMART FILTER & CLOUD DICTIONARY (Preserving your Sentence search!) ---
function searchDictionary() {
  const term = document.getElementById("dictSearch").value.trim().toLowerCase();
  const resEl = document.getElementById("dictResults");

  if (!term) {
    resEl.innerHTML =
      '<div style="text-align:center;padding:40px;color:var(--text-muted)">Type a word to begin searching...</div>';
    return;
  }

  // Load words from active list and pool
  const vocab = load("dt_vocab", []);
  const vocab_pool = load("dt_vocab_pool", []);
  const allWords = new Map();
  vocab.forEach((v) => allWords.set(v.de, v));
  vocab_pool.forEach((v) => {
    if (!allWords.has(v.de)) allWords.set(v.de, v);
  });

  // Load sentences from active list and pool
  const DAILY_SENTENCES = load("dt_sentences", []);
  const sentences_pool = load("dt_sentences_pool", []);
  const allSents = new Map();
  DAILY_SENTENCES.forEach((s) => allSents.set(s.de, s));
  sentences_pool.forEach((s) => {
    if (!allSents.has(s.de)) allSents.set(s.de, s);
  });

  // Safe term for regex
  let safeTerm = term;
  try {
    safeTerm = term.replace(/[.*+?^$\{\}()|[\]\\]/g, "\\$&");
  } catch (e) {}
  const boundaryRegex = new RegExp("(?:^|\\s|-)" + safeTerm, "i");

  const wordMatches = Array.from(allWords.values())
    .filter((v) => {
      const deLow = v.de.toLowerCase();
      const enLow = v.en.toLowerCase();
      const strippedDe = deLow.replace(/^(der|die|das)\s+/, "");
      if (deLow === term || enLow === term || strippedDe === term) return true;
      if (term === "der" || term === "die" || term === "das") return false;
      return boundaryRegex.test(deLow) || boundaryRegex.test(enLow);
    })
    .slice(0, 20);

  const sentMatches = Array.from(allSents.values())
    .filter((s) => {
      if (term === "der" || term === "die" || term === "das") return false;
      const deLow = s.de.toLowerCase();
      const enLow = s.en.toLowerCase();
      return boundaryRegex.test(deLow) || boundaryRegex.test(enLow);
    })
    .slice(0, 20);

  let html = "";

  // 1. Show Local Word Matches
  if (wordMatches.length > 0) {
    html +=
      '<div class="card-title" style="margin-top:10px">&#128218; Vocabulary Matches</div><div style="display:flex;flex-direction:column;gap:10px;margin-bottom:24px">';
    html += wordMatches
      .map(
        (w) => `
      <div class="card" style="display:flex;align-items:center;justify-content:space-between;padding:12px;margin:0">
        <div>
          <div style="font-weight:800;font-size:1.1rem;color:var(--accent)">${escHtml(
            w.de
          )}</div>
          <div style="color:var(--text-muted);font-size:0.95rem">${escHtml(
            w.en
          )}</div>
        </div>
        <button class="btn btn-outline btn-sm" onclick="speakWord('${escHtml(
          w.de
        ).replace(
          /'/g,
          "\\'"
        )}')" style="border-radius:50%;width:35px;height:35px;padding:0;display:flex;align-items:center;justify-content:center">&#128266;</button>
      </div>
    `
      )
      .join("");
    html += "</div>";
  }

  // 2. Show Local Sentence Matches
  if (sentMatches.length > 0) {
    html +=
      '<div class="card-title">&#128172; Contextual Sentences</div><div style="display:flex;flex-direction:column;gap:10px;margin-bottom:24px">';
    html += sentMatches
      .map(
        (s) => `
      <div class="card" style="padding:12px;margin:0">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px">
           <div style="font-weight:600;font-size:1rem;color:var(--text);margin-bottom:4px">${escHtml(
             s.de
           )}</div>
           <button class="btn btn-outline btn-sm" onclick="speakWord('${escHtml(
             s.de
           ).replace(
             /'/g,
             "\\'"
           )}')" style="border-radius:50%;min-width:35px;height:35px;padding:0;display:flex;align-items:center;justify-content:center">&#128266;</button>
        </div>
        <div style="color:var(--text-muted);font-size:0.9rem;border-left:3px solid var(--border);padding-left:10px;margin-top:5px">${escHtml(
          s.en
        )}</div>
      </div>
    `
      )
      .join("");
    html += "</div>";
  }

  // 3. ALWAYS show the Google Translate button at the bottom!
  if (wordMatches.length === 0 && sentMatches.length === 0) {
    html += `
      <div style="text-align:center;padding:40px;color:var(--text-muted);">
        <div style="font-size:3rem; margin-bottom:10px;">☁️</div>
        <div>No local results for "<b>${escHtml(term)}</b>".</div>
        <button class="btn btn-primary" style="margin-top:15px;" onclick="fetchCloudTranslation('${escHtml(
          term
        ).replace(/'/g, "\\'")}')">
          Fetch from Google Translate
        </button>
      </div>
    `;
  } else {
    html += `
      <div style="text-align:center; padding-top:10px; border-top:1px solid var(--border);">
        <div style="font-size:0.9rem; color:var(--text-muted); margin-bottom:10px; margin-top:10px;">Didn't find what you were looking for?</div>
        <button class="btn btn-outline" onclick="fetchCloudTranslation('${escHtml(
          term
        ).replace(/'/g, "\\'")}')">
          ☁️ Fetch from Google Translate
        </button>
      </div>
    `;
  }

  resEl.innerHTML = html;
}

// --- OMNIDIRECTIONAL DICTIONARY ENGINE (Google Translate Version) ---
async function smartTranslate(inputWord) {
  const word = inputWord.trim();
  const safeWord = encodeURIComponent(word);

  // We ask Google Translate to translate it into BOTH languages simultaneously!
  const [resDE, resEN] = await Promise.all([
    fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=de&dt=t&q=${safeWord}`
    ),
    fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=de&tl=en&dt=t&q=${safeWord}`
    ),
  ]);

  const dataDE = await resDE.json();
  const dataEN = await resEN.json();

  // Google returns the translation in a deeply nested array: data[0][0][0]
  const textToGerman = dataDE[0] && dataDE[0][0] ? dataDE[0][0][0] : "";
  const textToEnglish = dataEN[0] && dataEN[0][0] ? dataEN[0][0][0] : "";

  const lowerInput = word.toLowerCase();

  // Check 1: If asking Google to make it German gave us a DIFFERENT word, it means you typed English!
  if (textToGerman && textToGerman.toLowerCase() !== lowerInput) {
    return { german: textToGerman, english: word };
  }

  // Check 2: If asking Google to make it English gave us a DIFFERENT word, it means you typed German!
  if (textToEnglish && textToEnglish.toLowerCase() !== lowerInput) {
    return { german: word, english: textToEnglish };
  }

  // If the word is identical in both languages (e.g. "Computer" or "Internet"), just save it!
  return { german: word, english: word };
}

// --- NEW SMART CLOUD FETCH BUTTON LOGIC ---
async function fetchCloudTranslation(term) {
  const resEl = document.getElementById("dictResults");
  resEl.innerHTML = `<div style="text-align:center;padding:40px;color:var(--accent)">🔄 Translating "<b>${escHtml(
    term
  )}</b>"...</div>`;

  try {
    // 1. Ask the smart translator for the omnidirectional result
    const result = await smartTranslate(term);

    // 2. Add the result directly to your active Flashcards!
    vocab.unshift({
      de: result.german,
      en: result.english,
      cat: "Dictionary",
      date: todayStr(),
    });

    // 3. Save the new flashcard and update your dashboard!
    save("dt_vocab", vocab);

    if (typeof updateTodayWordCount === "function") updateTodayWordCount();
    if (typeof renderVocab === "function")
      renderVocab(typeof currentFilter !== "undefined" ? currentFilter : "All");

    // 4. Show the success UI
    resEl.innerHTML = `
      <div class="card" style="text-align:center; padding:30px; border:1px solid var(--success);">
        <div style="font-size:3rem; margin-bottom:10px;">✅</div>
        <h3 style="color:var(--success); margin:0;">Translation Found!</h3>
        <div style="font-size:1.5rem; font-weight:800; margin:15px 0;">${escHtml(
          result.german
        )}</div>
        <div style="color:var(--text-muted); font-size:1.1rem; margin-bottom:20px;">${escHtml(
          result.english
        )}</div>
        <p style="color:var(--text-muted); font-size:0.9rem;">This word has been automatically added to your Flashcards!</p>
        <button class="btn btn-outline" style="margin-top:10px;" onclick="document.getElementById('dictSearch').value=''; document.getElementById('dictResults').innerHTML='';">Clear Search</button>
      </div>
    `;
  } catch (err) {
    resEl.innerHTML = `<div style="text-align:center;padding:40px;color:var(--danger)">❌ Error connecting to translation server. Please try again.</div>`;
  }
}

// --- EXTRAORDINARY GAMIFIED DAILY WARM-UP ---
let warmupTimerInterval = null;
let warmupTimeLeft = 10;
let warmupHasAnswered = false;

// 1. Automatically Inject Professional Confetti Engine
if (!document.getElementById("confetti-script")) {
  const script = document.createElement("script");
  script.id = "confetti-script";
  script.src =
    "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
  document.head.appendChild(script);
}

function checkDailyWarmup() {
  if (localStorage.getItem("dt_last_warmup") === todayStr()) return;
  const pool = [...vocab, ...DAILY_SENTENCES];
  if (pool.length < 4) {
    localStorage.setItem("dt_last_warmup", todayStr());
    return;
  }

  let wCount = parseInt(localStorage.getItem("dt_warmup_count") || "0");

  // RESET UI STATE
  warmupHasAnswered = false;
  warmupTimeLeft = 10;

  const timerBar = document.getElementById("warmupTimerBar");
  timerBar.style.width = "100%";
  timerBar.style.background = "var(--success)";
  timerBar.style.boxShadow = "0 0 15px var(--success)";

  document.getElementById("warmupCard").classList.remove("extreme-shake-anim");
  document.getElementById("warmupModal").classList.remove("damage-flash");

  document.getElementById("warmupIcon").innerHTML = "&#9889;"; // Lightning bolt!
  document.getElementById("warmupTitle").innerText = "DAILY CHALLENGE";
  document.getElementById("warmupTitle").style.background =
    "linear-gradient(to right, #fff, #aaa)";
  document.getElementById("warmupTitle").style.webkitTextFillColor =
    "transparent";
  document.getElementById("warmupTitle").style.webkitBackgroundClip = "text";

  document.getElementById("warmupSub").innerText =
    "You have 10 seconds. Don't mess up!";
  document.getElementById("warmupModal").style.display = "flex";

  // START SMART NEON TIMER
  clearInterval(warmupTimerInterval);
  warmupTimerInterval = setInterval(() => {
    if (warmupHasAnswered) return clearInterval(warmupTimerInterval);

    warmupTimeLeft--;
    timerBar.style.width = warmupTimeLeft * 10 + "%";

    // Dynamic Colors based on pressure!
    if (warmupTimeLeft === 5) {
      timerBar.style.background = "var(--warning)";
      timerBar.style.boxShadow = "0 0 20px var(--warning)";
    } else if (warmupTimeLeft <= 3) {
      // Flashing Red Alert!
      timerBar.style.background = "var(--danger)";
      timerBar.style.boxShadow =
        warmupTimeLeft % 2 === 0 ? "0 0 30px var(--danger)" : "none";
    }

    // TIMEOUT GAME OVER!
    if (warmupTimeLeft <= 0) {
      clearInterval(warmupTimerInterval);
      submitWarmup(null, "TIMEOUT", "TIMEOUT_CORRECT");
    }
  }, 1000);

  // PROGRESSIVE DIFFICULTY ALGORITHM
  let isEnToDe = false;
  let useSentence = false;
  let useGrammar = false;
  if (wCount < 3) {
    isEnToDe = false;
    useSentence = false;
  } else if (wCount < 7) {
    isEnToDe = false;
    useSentence = Math.random() > 0.5;
  } else if (wCount < 14) {
    isEnToDe = Math.random() > 0.5;
    useSentence = Math.random() > 0.5;
  } else {
    isEnToDe = Math.random() > 0.3;
    useSentence = Math.random() > 0.4;
    useGrammar =
      Math.random() > 0.7 && active_grammar && active_grammar.length > 0;
  }

  let target, wrongs, qText, correctAns;
  if (useGrammar) {
    target = active_grammar[Math.floor(Math.random() * active_grammar.length)];
    wrongs = ["er", "sie", "es", "dem", "den", "der", "das", "die", "em", "en"]
      .filter((x) => x !== target.answer)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    qText = target.text.replace("___", " [...] ");
    correctAns = target.answer;
    document.getElementById("warmupQuestion").innerHTML =
      "Fill in the blank:<br><br><span style='color:var(--accent);'>" +
      qText +
      "</span>";
  } else {
    const subPool = useSentence ? DAILY_SENTENCES : vocab;
    if (subPool.length < 4) {
      checkDailyWarmup();
      return;
    } // fallback
    target = subPool[Math.floor(Math.random() * subPool.length)];
    wrongs = subPool
      .filter((x) => x.de !== target.de)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    qText = isEnToDe ? target.en : target.de;
    correctAns = isEnToDe ? target.de : target.en;
    document.getElementById(
      "warmupQuestion"
    ).innerHTML = `<span style="color:var(--text-muted); font-size:1.1rem; display:block; margin-bottom:10px;">${
      isEnToDe ? "Translate to German:" : "What does this mean?"
    }</span><span style="color:#fff;">${qText}</span>`;
  }

  let options = [
    correctAns,
    ...wrongs.map((w) => (useGrammar ? w : isEnToDe ? w.de : w.en)),
  ].sort(() => 0.5 - Math.random());

  document.getElementById("warmupOptions").innerHTML = options
    .map(
      (opt) => `
    <button class="warmup-btn-extra" 
      onclick="submitWarmup(this, '${opt.replace(
        /'/g,
        "\\'"
      )}', '${correctAns.replace(/'/g, "\\'")}')">
      ${opt}
    </button>
  `
    )
    .join("");
}

function submitWarmup(btnElement, ans, correct) {
  if (warmupHasAnswered) return;
  warmupHasAnswered = true;
  clearInterval(warmupTimerInterval); // Stop timer

  // Disable all buttons immediately
  const allBtns = document.querySelectorAll(".warmup-btn-extra");
  allBtns.forEach((b) => {
    b.disabled = true;
    b.style.opacity = "0.5";
    b.style.transform = "none"; // kill hover effect
    b.style.boxShadow = "none";
  });

  if (ans === correct) {
    // 🏆 VICTORY!
    if (btnElement) {
      btnElement.style.opacity = "1";
      btnElement.style.background = "var(--success)";
      btnElement.style.color = "white";
      btnElement.style.borderColor = "var(--success)";
      btnElement.style.boxShadow = "0 0 20px var(--success)";
    }
    document.getElementById("warmupIcon").innerHTML = "🏆";
    document.getElementById("warmupTitle").innerText = "PERFECT!";
    document.getElementById("warmupTitle").style.background = "none";
    document.getElementById("warmupTitle").style.webkitTextFillColor =
      "var(--success)";
    document.getElementById("warmupTitle").style.textShadow =
      "0 0 20px rgba(16, 185, 129, 0.5)";
    document.getElementById("warmupSub").innerText = "App unlocking...";

    // Trigger Professional Confetti
    if (typeof confetti === "function") {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#10b981", "#ffffff", "#3b82f6", "#f59e0b"],
      });
    }

    let wCount = parseInt(localStorage.getItem("dt_warmup_count") || "0");
    localStorage.setItem("dt_warmup_count", wCount + 1); // Increase difficulty

    // Unlock after 2.5s
    setTimeout(() => {
      document.getElementById("warmupModal").style.display = "none";
    }, 2500);
  } else {
    // 💀 GAME OVER (OR TIMEOUT)
    document.getElementById("warmupCard").classList.add("extreme-shake-anim");
    document.getElementById("warmupModal").classList.add("damage-flash"); // Flash whole screen red!

    document.getElementById("warmupIcon").innerHTML = "💀";
    document.getElementById("warmupTitle").innerText =
      ans === "TIMEOUT" ? "TIME'S UP!" : "GAME OVER";
    document.getElementById("warmupTitle").style.background = "none";
    document.getElementById("warmupTitle").style.webkitTextFillColor =
      "var(--danger)";
    document.getElementById("warmupTitle").style.textShadow =
      "0 0 20px rgba(239, 68, 68, 0.8)";
    document.getElementById("warmupSub").innerText =
      "Memorize the correct answer below. Unlocking soon...";

    // Color clicked button RED
    if (btnElement) {
      btnElement.style.opacity = "1";
      btnElement.style.background = "var(--danger)";
      btnElement.style.color = "white";
      btnElement.style.borderColor = "var(--danger)";
      btnElement.style.boxShadow = "0 0 20px var(--danger)";
    }

    // Find the CORRECT button and color it NEON GREEN
    allBtns.forEach((b) => {
      if (b.innerText.trim() === correct.trim()) {
        b.style.opacity = "1";
        b.style.background = "var(--success)";
        b.style.color = "white";
        b.style.borderColor = "var(--success)";
        b.style.boxShadow = "0 0 20px var(--success)";
      }
    });

    // Fade out red flash slowly
    setTimeout(() => {
      document.getElementById("warmupModal").classList.remove("damage-flash");
    }, 500);

    // Unlock after 3.5 seconds so they can read the right answer
    setTimeout(() => {
      document.getElementById("warmupModal").style.display = "none";
    }, 3500);
  }

  // Lock out for the rest of the day
  localStorage.setItem("dt_last_warmup", todayStr());
}

async function checkDiaryGrammar(autoSave = false) {
  const p1 = document.getElementById("prompt1").value.trim();
  const p2 = document.getElementById("prompt2").value.trim();
  const p3 = document.getElementById("prompt3").value.trim();
  let fullText = [p1, p2, p3].filter((x) => x).join(". ");
  if (fullText.length > 0 && !fullText.endsWith(".")) fullText += ".";

  if (!fullText) {
    if (!autoSave)
      showToast("Please write something in the diary prompts first!");
    return false;
  }

  const fbDiv = document.getElementById("grammarFeedback");
  fbDiv.style.display = "block";
  fbDiv.style.background = "rgba(239,68,68,0.1)";
  fbDiv.style.borderColor = "var(--danger)";
  fbDiv.innerHTML =
    '<div style="text-align:center;color:var(--text);">&#8987; Checking grammar using LanguageTool AI...</div>';

  try {
    const res = await fetch("https://api.languagetool.org/v2/check", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ text: fullText, language: "de-DE" }),
    });
    const data = await res.json();

    if (data.matches.length === 0) {
      fbDiv.style.background = "rgba(16,185,129,0.1)";
      fbDiv.style.borderColor = "var(--success)";
      fbDiv.innerHTML =
        '<span style="color:var(--success); font-weight:800;">&#10004;&#65039; No grammar mistakes found! Perfect!</span>';
      return true;
    } else {
      let html =
        '<div style="color:var(--danger); font-weight:800; margin-bottom:15px;">&#9888;&#65039; Found ' +
        data.matches.length +
        " potential mistakes:</div>";
      data.matches.forEach((m) => {
        const errorText = fullText.substring(m.offset, m.offset + m.length);
        const suggestions = m.replacements
          .map((r) => r.value)
          .slice(0, 3)
          .join(", ");
        html += `
          <div style="margin-bottom:15px; font-size:0.95rem; background:var(--surface); padding:10px; border-radius:5px;">
            <div style="margin-bottom:5px"><b>Issue:</b> ${m.message}</div>
            <div style="margin-bottom:5px"><b>Text:</b> <span style="background:var(--danger); color:white; padding:2px 4px; border-radius:3px;">${errorText}</span></div>
            <div><b>Suggestions:</b> <span style="color:var(--success); font-weight:600;">${
              suggestions || "None"
            }</span></div>
          </div>
        `;
      });
      fbDiv.innerHTML = html;
      return false;
    }
  } catch (e) {
    fbDiv.innerHTML =
      '<div style="text-align:center;color:var(--danger);">&#10060; Error reaching LanguageTool API. Are you connected to the internet?</div>';
    return true; // allow save if offline
  }
}

// F3: Grammar Logic
let grammar_pool = load("dt_grammar_pool", []);
let active_grammar = load("dt_grammar", []);

const oldStartQuizF3 =
  typeof startQuiz !== "undefined" ? startQuiz : function () {};
startQuiz = function (type) {
  if (type === "grammar") {
    const pool = [...active_grammar, ...grammar_pool];
    if (pool.length < 1) {
      showToast("No grammar rules found!");
      return;
    }

    quizState.type = "grammar";
    quizState.score = 0;
    quizState.idx = 0;
    quizState.questions = pool.sort(() => 0.5 - Math.random()).slice(0, 10);

    document.getElementById("quizMenu").style.display = "none";
    document.getElementById("quizActive").style.display = "block";
    document.getElementById("quizTypeLabel").innerHTML =
      "&#10024; Grammar (L�ckentext)";
    renderQuestion();
  } else {
    oldStartQuizF3(type);
  }
};

const oldRenderQuestionF3 =
  typeof renderQuestion !== "undefined" ? renderQuestion : function () {};
renderQuestion = function () {
  if (quizState.type === "grammar") {
    const q = quizState.questions[quizState.idx];
    document.getElementById("quizProgress").textContent =
      quizState.idx + 1 + " / " + quizState.questions.length;

    document.getElementById("quizQuestion").innerHTML = `
      <div style="font-size:1.3rem; margin-bottom:10px;">
        ${q.text.replace(
          "___",
          '<input type="text" id="grammarAns" style="width:60px; text-align:center; font-size:1.2rem; padding:4px; border:2px solid var(--accent); border-radius:4px; background:var(--surface); color:var(--text);" autocomplete="off">'
        )}
      </div>
      <div style="font-size:0.9rem; color:var(--text-muted);">${
        q.hint || ""
      }</div>
    `;

    document.getElementById(
      "quizOptions"
    ).innerHTML = `<button class="btn btn-primary" onclick="checkAnswer(document.getElementById('grammarAns').value.trim(), 0, '${q.answer.replace(
      /'/g,
      "\\'"
    )}')" style="width:100%">Check Answer</button>`;
    document.getElementById("quizNextBtn").style.display = "none";

    setTimeout(() => {
      const inp = document.getElementById("grammarAns");
      if (inp) inp.focus();
    }, 100);
  } else {
    oldRenderQuestionF3();
  }
};

const oldCheckAnswerF3 =
  typeof checkAnswer !== "undefined" ? checkAnswer : function () {};
checkAnswer = function (ans, btnIdx, correctAns) {
  if (quizState.type === "grammar") {
    const input = document.getElementById("grammarAns");
    if (ans.toLowerCase() === correctAns.toLowerCase()) {
      input.style.borderColor = "var(--success)";
      input.style.color = "var(--success)";
      quizState.score++;
      showToast("Correct!", "var(--success)");
    } else {
      input.style.borderColor = "var(--danger)";
      input.style.color = "var(--danger)";
      input.value = correctAns;
      showToast("Wrong!", "var(--danger)");
    }
    input.disabled = true;
    document.querySelector("#quizOptions button").style.display = "none";
    document.getElementById("quizNextBtn").style.display = "block";
  } else {
    oldCheckAnswerF3(ans, btnIdx, correctAns);
  }
};

// F4: Dynamic Reading Menu
function renderReadingMenu() {
  if (STORIES.length === 0) STORIES = load("dt_saved_stories", []);
  const container = document.getElementById("storyBtnContainer");
  if (!container) return;

  if (STORIES.length === 0) {
    container.innerHTML = `<div style="color:var(--text-muted); font-size:0.9rem;">No True/False stories saved.</div>`;
    return;
  }

  // This ONLY renders your stories like "Der Apfel" and a Delete button!
  container.innerHTML =
    STORIES.map(
      (s, i) =>
        `<button class="btn btn-outline" onclick="loadStory(${i})">${s.title}</button>`
    ).join("") +
    `
    <button class="btn btn-outline btn-sm" style="border-color:var(--danger); color:var(--danger); margin-left:auto;" onclick="localStorage.removeItem('dt_saved_stories'); STORIES=[]; document.getElementById('readingContent').style.display='none'; document.getElementById('readingQuestions').style.display='none'; renderReadingMenu();">🗑️ Clear Stories</button>
  `;
}

// GLOBAL STARTUP HOOKS
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    if (typeof renderReadingMenu === "function") renderReadingMenu();
    const lastSec = localStorage.getItem("dt_current_section");
    if (lastSec) showSection(lastSec);
    if (typeof syncCloudData === "function") syncCloudData();
    if (typeof checkDailyWarmup === "function") checkDailyWarmup();
  }, 500);
});

// PHASE 1: CLOUD SYNC ENGINE
async function syncCloudData() {
  // If vocab_pool is empty, it means this is a fresh install or a new browser!
  // We fetch our starter databases directly from the GitHub Cloud (data folder).
  if (vocab_pool.length === 0) {
    console.log("Cloud Sync: Initiating massive data fetch...");
    try {
      const vRes = await fetch("data/vocab-api.json");
      const sRes = await fetch("data/sentences-api.json");
      const gRes = await fetch("data/grammar-api.json");

      const vData = await vRes.json();
      const sData = await sRes.json();
      const gData = await gRes.json();

      // Seed the pools
      vocab_pool = vData;
      sentences_pool = sData;
      grammar_pool = gData;

      // Save them locally permanently
      save("dt_vocab_pool", vocab_pool);
      save("dt_sentences_pool", sentences_pool);
      save("dt_grammar_pool", grammar_pool);

      console.log("Cloud Sync Complete!");

      // Since it's a fresh sync, trigger unlock
      checkDailyUnlock();
      renderDashboard();
    } catch (e) {
      console.error(
        "Cloud Sync Failed: Check internet connection or CORS rules.",
        e
      );
    }
  }
}

// PHASE 2: VOICE TYPING (Speech-To-Text)
let currentSpeechRec = null;

function startVoiceTyping(inputId, btnElement) {
  if (
    !("webkitSpeechRecognition" in window) &&
    !("SpeechRecognition" in window)
  ) {
    showToast(
      "Your browser does not support Voice Typing. Please use Chrome.",
      "var(--danger)"
    );
    return;
  }

  if (currentSpeechRec) {
    currentSpeechRec.stop();
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  currentSpeechRec = new SpeechRecognition();

  currentSpeechRec.lang = "de-DE"; // Force German recognition
  currentSpeechRec.interimResults = true;
  currentSpeechRec.continuous = false; // Stop when they stop speaking

  const inputEl = document.getElementById(inputId);
  const originalText = inputEl.value;
  const originalIcon = btnElement.innerHTML;

  btnElement.innerHTML = "&#128308;"; // Red circle recording icon
  btnElement.style.borderColor = "var(--danger)";
  btnElement.style.color = "var(--danger)";

  currentSpeechRec.onresult = (event) => {
    let interimTranscript = "";
    let finalTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    // We append the final transcript if they stopped, else show interim
    const spacer =
      originalText.length > 0 && !originalText.endsWith(" ") ? " " : "";
    inputEl.value = originalText + spacer + finalTranscript + interimTranscript;

    // trigger word count update manually
    const evt = new Event("input", { bubbles: true });
    inputEl.dispatchEvent(evt);
  };

  currentSpeechRec.onerror = (event) => {
    console.error("Speech recognition error", event.error);
    showToast("Speech Recognition Error: " + event.error, "var(--danger)");
    resetMicBtn(btnElement, originalIcon);
  };

  currentSpeechRec.onend = () => {
    resetMicBtn(btnElement, originalIcon);
    currentSpeechRec = null;
  };

  currentSpeechRec.start();
  showToast("Listening... Speak in German!", "var(--success)");
}

function resetMicBtn(btnElement, originalIcon) {
  btnElement.innerHTML = originalIcon;
  btnElement.style.borderColor = "";
  btnElement.style.color = "";
}

// PHASE 3: LIVE DICTIONARY FALLBACK
async function liveTranslateFallback(term) {
  const btn = document.getElementById("liveTranslateBtn");
  if (!btn) return;

  btn.innerHTML = "&#8987; Fetching from MyMemory API...";
  btn.disabled = true;

  try {
    // Detect if they typed english by checking if it contains english characters mostly?
    // Actually MyMemory auto-detects pretty well if we do de|en but sometimes we need autodetect.
    // Let's just do autodetect|en for now, or assume German->English.
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        term
      )}&langpair=de|en`
    );
    const data = await res.json();

    if (data && data.responseData && data.responseData.translatedText) {
      let translatedText = data.responseData.translatedText;

      // If the API couldn't translate it, it just returns the same string.
      if (translatedText.toLowerCase() === term.toLowerCase()) {
        btn.innerHTML = "&#10060; Word not found in API. Try Google.";
        btn.onclick = () =>
          window.open(
            "https://translate.google.com/?sl=auto&tl=en&text=" +
              encodeURIComponent(term)
          );
        btn.disabled = false;
        return;
      }

      // We don't know for sure if they typed DE or EN.
      // If we assume they typed DE, then 'translatedText' is EN.
      vocab_pool.unshift({
        de: term,
        en: translatedText,
        level: 0,
        nextReview: Date.now(),
      });
      save("dt_vocab_pool", vocab_pool);

      showToast("&#10024; Translated & saved to Flashcards!", "var(--success)");
      searchDictionary(); // Re-render instantly
    } else {
      btn.innerHTML = "&#10060; Translation failed. Try Google.";
      btn.onclick = () =>
        window.open(
          "https://translate.google.com/?sl=auto&tl=en&text=" +
            encodeURIComponent(term)
        );
      btn.disabled = false;
    }
  } catch (e) {
    btn.innerHTML = "&#10060; Offline. Try Google.";
    btn.onclick = () =>
      window.open(
        "https://translate.google.com/?sl=auto&tl=en&text=" +
          encodeURIComponent(term)
      );
    btn.disabled = false;
  }
}

// PHASE 4: LIVE NEWS & LINGQ EXTRACTION
// --- SMART FILTER & CLOUD DICTIONARY ---

// Override renderReadingMenu to add the News button
const ogRenderReadingMenu =
  typeof renderReadingMenu !== "undefined" ? renderReadingMenu : function () {};
renderReadingMenu = function () {
  if (STORIES.length === 0) STORIES = load("dt_saved_stories", []);
  const container = document.getElementById("storyBtnContainer");
  if (!container) return;
  container.innerHTML =
    `<button class="btn btn-primary" onclick="fetchLiveNews()">&#128240; Fetch Live News (DW)</button>` +
    STORIES.map(
      (s, i) =>
        `<button class="btn btn-outline" onclick="loadStory(${i})">${s.title}</button>`
    ).join("") +
    `
    <div style="position:relative; overflow:hidden; display:inline-block; margin-left:auto">
      <button class="btn btn-outline btn-sm" style="border-color:var(--accent); color:var(--accent)">Upload Stories (JSON)</button>
      <input type="file" accept=".json" onchange="importStoryJson(event)" style="position:absolute; left:0; top:0; opacity:0; cursor:pointer; height:100%">
    </div>
  `;
};

// Override loadStory to make text Interactive (LingQ Method)
const ogLoadStory =
  typeof loadStory !== "undefined" ? loadStory : function () {};
loadStory = function (index) {
  ogLoadStory(index);
  // Now make the text interactive!
  const textEl = document.getElementById("storyText");
  let rawHtml = textEl.innerHTML;

  // A simple regex to wrap words in spans, ignoring HTML tags
  // We temporarily replace a tags to avoid wrapping their attributes
  const tempLinks = [];
  rawHtml = rawHtml.replace(/<a [^>]+>.*?<\/a>/g, (match) => {
    tempLinks.push(match);
    return `###LINK${tempLinks.length - 1}###`;
  });

  // Wrap words
  rawHtml = rawHtml.replace(
    /([a-zA-Z�������]+)/g,
    '<span class="lingq-word" onclick="translateLingqWord(this.innerText)">$1</span>'
  );

  // Restore links
  rawHtml = rawHtml.replace(
    /###LINK(\d+)###/g,
    (match, p1) => tempLinks[parseInt(p1)]
  );

  textEl.innerHTML = rawHtml;
};

// LingQ Translation Engine
let currentLingqWord = "";
let currentLingqTranslation = "";

async function translateLingqWord(word) {
  // strip punctuation from word just in case
  const cleanWord = word.replace(/[^a-zA-Z�������]/g, "");
  if (!cleanWord) return;

  currentLingqWord = cleanWord;
  const tooltip = document.getElementById("lingqTooltip");
  const deEl = document.getElementById("lingqDe");
  const enEl = document.getElementById("lingqEn");
  const saveBtn = document.getElementById("lingqSaveBtn");

  deEl.innerText = cleanWord;
  enEl.innerHTML = "&#8987; Translating...";
  saveBtn.disabled = true;
  tooltip.style.display = "flex";

  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        cleanWord
      )}&langpair=de|en`
    );
    const data = await res.json();
    if (data && data.responseData && data.responseData.translatedText) {
      currentLingqTranslation = data.responseData.translatedText;
      enEl.innerText = currentLingqTranslation;
      saveBtn.disabled = false;
    } else {
      enEl.innerText = "Translation not found.";
    }
  } catch (e) {
    enEl.innerText = "Offline. Cannot translate.";
  }
}

function saveLingqWord() {
  if (!currentLingqWord || !currentLingqTranslation) return;

  vocab_pool.unshift({
    de: currentLingqWord,
    en: currentLingqTranslation,
    level: currentLevelIndex || 0,
    nextReview: Date.now(),
  });
  save("dt_vocab_pool", vocab_pool);

  showToast("&#10024; Saved to Flashcards!", "var(--success)");
  document.getElementById("lingqTooltip").style.display = "none";
}

// ==========================================
// 🤖 AI GERMAN TUTOR — COMPLETE ENGINE
// ==========================================

// ─── STATE ───────────────────────────────────────────────────────────────────
let _aiHistory = []; // Conversation history (max 10 messages)
let _aiMode = "free"; // Current mode: free | interview | office | daily
let _aiBusy = false; // Prevents double-sends while AI is thinking
let _aiMsgCount = 0; // Session message counter
let _ttsBtn = null; // Currently active TTS speaker button
let _aiVoiceRec = null; // Voice recognition instance

// ─── MODE NAMES ───────────────────────────────────────────────────────────────
const AI_MODE_NAMES = {
  free: { tutor: "Frau Schmidt", role: "German Tutor" },
  interview: { tutor: "Herr Wagner", role: "HR Manager — TechCorp Berlin" },
  office: { tutor: "Jonas", role: "Your German Colleague" },
  daily: { tutor: "Various", role: "Daily Life Scenarios" },
};

// ─── SYSTEM PROMPTS ───────────────────────────────────────────────────────────
function _aiSystemPrompt(mode, ctx) {
  const base = `Student level: ${ctx.level}. Student goal: Work as IT professional in Germany. Context today: ${ctx.info}`;
  const rules = `
STRICT RULES (always follow these):
1. Reply in German first. On a new line write "🇬🇧" followed by the English translation.
2. Keep replies SHORT — 2 to 4 sentences maximum. This is a conversation not a lecture.
3. Always end your reply with ONE follow-up question in German.
4. If the student makes a grammar mistake: write "✏️ Correction:" on a new line, show the correct form in English, then continue the conversation in German.
5. When you naturally introduce a new German word relevant to working in Germany, format it EXACTLY as: [Neues Wort: die Besprechung = the meeting]
6. Never break character. Never speak in English as yourself.`;

  const prompts = {
    free: `You are "Frau Schmidt", a strict but encouraging German language tutor. ${base}\n${rules}`,
    interview: `You are "Herr Wagner", a senior HR manager at TechCorp Berlin interviewing a Java developer candidate. Conduct a REAL German job interview. Only use formal Sie-form. Ask real interview questions: background, experience, strengths, salary, why Germany. ${base}\n${rules}\nSTART: "Guten Tag! Ich bin Herr Wagner von TechCorp Berlin. Bitte stellen Sie sich kurz vor."`,
    office: `You are "Jonas", a friendly German software developer colleague at a Berlin startup. Use casual du-form. Simulate daily office scenarios: standup, code review, lunch, meetings. Mix in real IT vocabulary. ${base}\n${rules}\nSTART: "Hey! Morgen! Wie läuft's? Hast du den PR schon gereviewed?"`,
    daily: `You are playing everyday German characters: neighbor, shop assistant, doctor receptionist, train conductor, landlord. Start with a random scenario and stay in character. ${base}\n${rules}`,
  };
  return prompts[mode] || prompts.free;
}

// ─── CONTEXT BUILDER ──────────────────────────────────────────────────────────
function _aiContext() {
  const lv = getLevel(diaryEntries.length, vocab.length);
  const todayWords = vocab.filter((v) => v.date === todayStr()).length;
  const lastEntry = (
    diaryEntries[0]?.p1 ||
    diaryEntries[0]?.content ||
    "None yet"
  ).slice(0, 120);
  return {
    level: lv.label,
    info: `Words added today: ${todayWords}. Last diary snippet: "${lastEntry}"`,
  };
}

// ─── KEY MANAGEMENT ───────────────────────────────────────────────────────────
function _aiKey() {
  return localStorage.getItem("dt_gemini_key") || "";
}

function saveAIKey() {
  const key = document.getElementById("aiKeyInput").value.trim();

  // Relaxed check: Google API keys are usually 39-51 characters.
  if (key.length < 30) {
    showToast("⚠️ Invalid key! It looks too short.");
    return;
  }

  localStorage.setItem("dt_gemini_key", key);
  document.getElementById("aiKeySetup").style.display = "none";
  document.getElementById("aiChatMessages").style.display = "flex";

  if (typeof _aiStartSession === "function") _aiStartSession();
  showToast("✅ Connected! Frau Schmidt is ready to teach.");
}

function clearAIKey() {
  localStorage.removeItem("dt_gemini_key");
  document.getElementById("aiKeyInput").value = "";
  document.getElementById("aiKeySetup").style.display = "flex";
  document.getElementById("aiChatMessages").style.display = "none";
  showToast("🔑 API key removed.");
}

// ─── MODAL TOGGLE ─────────────────────────────────────────────────────────────
function toggleAITutor() {
  const modal = document.getElementById("aiTutorModal");
  const fab = document.getElementById("aiTutorBtn");
  const isOpen = modal.classList.contains("ai-modal-open");

  if (isOpen) {
    modal.classList.remove("ai-modal-open");
    fab.classList.remove("ai-open");
    fab.textContent = "🤖";
  } else {
    modal.classList.add("ai-modal-open");
    fab.classList.add("ai-open");
    fab.textContent = "✕";

    if (!_aiKey()) {
      document.getElementById("aiKeySetup").style.display = "flex";
      document.getElementById("aiChatMessages").style.display = "none";
    } else {
      document.getElementById("aiKeySetup").style.display = "none";
      document.getElementById("aiChatMessages").style.display = "flex";
      if (_aiHistory.length === 0) _aiStartSession();
    }
    setTimeout(() => document.getElementById("aiChatInput")?.focus(), 350);
  }
}

// ─── SESSION START ─────────────────────────────────────────────────────────────
function _aiStartSession() {
  _aiHistory = [];
  document.getElementById("aiChatMessages").innerHTML = "";
  _updateTutorName();
  _aiCallAPI(null, true); // Pass null = greeting message
}

function _updateTutorName() {
  const info = AI_MODE_NAMES[_aiMode] || AI_MODE_NAMES.free;
  const nameEl = document.getElementById("aiTutorName");
  if (nameEl) nameEl.textContent = `${info.tutor} — ${info.role}`;
}

// ─── MODE SWITCH ──────────────────────────────────────────────────────────────
function switchChatMode(mode) {
  _aiMode = mode;
  _aiHistory = [];
  document.getElementById("aiChatMessages").innerHTML = "";
  _updateTutorName();
  const sel = document.getElementById("aiChatMode");
  const label = sel ? sel.options[sel.selectedIndex].text : mode;
  _appendSysMsg(`✅ Switched to: ${label}`);
  if (_aiKey()) _aiCallAPI(null, true);
}

// ─── SEND MESSAGE ─────────────────────────────────────────────────────────────
async function sendAIMessage() {
  const input = document.getElementById("aiChatInput");
  const text = (input.value || "").trim();
  if (!text || _aiBusy) return;
  if (!_aiKey()) {
    showToast("⚠️ Please add your Gemini API key first!");
    return;
  }

  input.value = "";
  _appendUserBubble(text);
  _aiCallAPI(text, false);
}

// ─── GEMINI API CALL ──────────────────────────────────────────────────────────
async function _aiCallAPI(userText, isGreeting) {
  _aiBusy = true;
  _showTyping(true);

  const ctx = _aiContext();
  const sysPrompt = _aiSystemPrompt(_aiMode, ctx);

  if (!isGreeting && userText) {
    _aiHistory.push({ role: "user", parts: [{ text: userText }] });
    if (_aiHistory.length > 10) _aiHistory = _aiHistory.slice(-10);
  }

  const contents = isGreeting
    ? [
        {
          role: "user",
          parts: [
            {
              text: "BEGIN. Start the session as described in your instructions.",
            },
          ],
        },
      ]
    : _aiHistory;

  // Just grab the key that your "Connect" button saved!
  const key = localStorage.getItem("dt_gemini_key");

  if (!key) {
    _showTyping(false);
    _aiBusy = false;
    return alert(
      "Please paste your Gemini API Key in the chat setup screen first!"
    );
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: sysPrompt }] },
          contents,
          generationConfig: { maxOutputTokens: 300, temperature: 0.8 },
        }),
      }
    );

    if (res.status === 429) {
      _showTyping(false);
      _aiBusy = false;
      _appendSysMsg(
        "⏳ Rate limit reached! The free tier needs a 1-minute break. Come back shortly!"
      );
      return;
    }

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err?.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) throw new Error("Empty response from API");

    _aiHistory.push({ role: "model", parts: [{ text: reply }] });
    _aiMsgCount++;
    _updateUsageInfo();
    _showTyping(false);
    _aiBusy = false;
    _appendAIBubble(reply);
  } catch (err) {
    console.error("AI Tutor error:", err);
    _showTyping(false);
    _aiBusy = false;
    _appendSysMsg(
      `❌ Error: ${err.message}. Check your API key or internet connection.`
    );
  }
}

// Check for saved key when the app first loads and hide it with stars!
setTimeout(() => {
  if (localStorage.getItem("dt_ai_key")) {
    const aiBox = document.getElementById("aiKeyInput");
    if (aiBox) aiBox.value = "********";
  }
}, 500);

// ─── RENDER: AI BUBBLE ────────────────────────────────────────────────────────
function _appendAIBubble(raw) {
  let text = raw;
  let translation = "";
  let correction = "";
  let newWord = null;

  // Extract 🇬🇧 English translation
  const tMatch = raw.match(/🇬🇧\s*([\s\S]+?)(?=✏️|$$|$)/);
  if (tMatch) {
    translation = tMatch[1].trim();
    text = text.replace(tMatch[0], "");
  }

  // Extract ✏️ Correction
  const cMatch = raw.match(/✏️\s*Correction:\s*([\s\S]+?)(?=🇬🇧|$$|$)/);
  if (cMatch) {
    correction = cMatch[1].trim();
    text = text.replace(cMatch[0], "");
  }

  // Extract [Neues Wort: X = Y]
  const wMatch = raw.match(/\[Neues Wort:\s*(.+?)\s*=\s*(.+?)\]/);
  if (wMatch) {
    newWord = { de: wMatch[1].trim(), en: wMatch[2].trim() };
    text = text.replace(wMatch[0], "");
  }

  text = text.trim();
  const ttsText = text.replace(/[^\w\s.,!?äöüÄÖÜß-]/g, "").trim();

  const msgs = document.getElementById("aiChatMessages");
  const wrap = document.createElement("div");
  wrap.className = "ai-bubble-wrap";

  // Create safe strings for HTML attributes
  const safeTts = ttsText.replace(/"/g, "&quot;");

  wrap.innerHTML = `
    <div class="ai-bubble-avatar">👩‍🏫</div>
    <div style="max-width:80%;">
      <div class="ai-bubble ai-msg">
        ${_safeHtml(text)}
        ${
          translation
            ? `<div class="ai-translation">🇬🇧 ${_safeHtml(translation)}</div>`
            : ""
        }
        <button class="ai-speaker-btn"
          data-tts="${safeTts}"
          onclick="aiSpeakToggle(this, this.getAttribute('data-tts'))"
          title="Listen / Stop">🔊</button>
      </div>
      ${
        correction
          ? `
        <div class="ai-bubble correction-msg">
          ✏️ <strong>Correction:</strong> ${_safeHtml(correction)}
          <button class="ai-save-note-btn"
            data-note="${correction.replace(/"/g, "&quot;")}"
            onclick="aiSaveNote(this.getAttribute('data-note'))">
            💾 Save as Study Note
          </button>
        </div>`
          : ""
      }
      ${
        newWord
          ? `
        <div class="ai-new-word-badge"
          data-de="${newWord.de.replace(/"/g, "&quot;")}"
          data-en="${newWord.en.replace(/"/g, "&quot;")}"
          onclick="aiSaveWord(this.getAttribute('data-de'), this.getAttribute('data-en'))">
          ➕ <strong>${_safeHtml(newWord.de)}</strong> = ${_safeHtml(
              newWord.en
            )} — Tap to save!
        </div>`
          : ""
      }
    </div>`;
  msgs.appendChild(wrap);
  _aiScrollBottom();
}

// ─── RENDER: USER BUBBLE ──────────────────────────────────────────────────────
function _appendUserBubble(text) {
  const msgs = document.getElementById("aiChatMessages");
  const wrap = document.createElement("div");
  wrap.className = "ai-bubble-wrap user-wrap";
  wrap.innerHTML = `
    <div class="ai-bubble user-msg">${_safeHtml(text)}</div>
    <div class="ai-bubble-avatar">👤</div>`;
  msgs.appendChild(wrap);
  _aiScrollBottom();
}

// ─── RENDER: SYSTEM MESSAGE ───────────────────────────────────────────────────
function _appendSysMsg(text) {
  const msgs = document.getElementById("aiChatMessages");
  const div = document.createElement("div");
  div.className = "ai-sys-msg";
  div.textContent = text;
  msgs.appendChild(div);
  _aiScrollBottom();
}

// ─── HELPER: SAFE HTML ────────────────────────────────────────────────────────
function _safeHtml(str) {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
}

function _aiScrollBottom() {
  const m = document.getElementById("aiChatMessages");
  if (m) m.scrollTop = m.scrollHeight;
}

// ─── TYPING INDICATOR ─────────────────────────────────────────────────────────
function _showTyping(show) {
  const el = document.getElementById("aiTyping");
  if (el) {
    el.style.display = show ? "flex" : "none";
    if (show) _aiScrollBottom();
  }
}

// ─── SMART TTS TOGGLE (🔊 / ⏹️) ─────────────────────────────────────────────
function aiSpeakToggle(btn, text) {
  // Same button clicked while playing → STOP
  if (_ttsBtn === btn) {
    window.speechSynthesis.cancel();
    _ttsReset(btn);
    _ttsBtn = null;
    return;
  }
  // Different button clicked → stop current, start new
  if (_ttsBtn) {
    window.speechSynthesis.cancel();
    _ttsReset(_ttsBtn);
  }

  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "de-DE";
  utt.rate = 0.9;
  const voices = window.speechSynthesis.getVoices();
  const voice =
    voices.find((v) => v.lang === "de-DE" && v.name.includes("Google")) ||
    voices.find((v) => v.lang === "de-DE") ||
    voices.find((v) => v.lang.startsWith("de"));
  if (voice) utt.voice = voice;

  btn.innerHTML = "⏹️";
  btn.title = "Click to stop";
  btn.style.color = "var(--danger)";
  _ttsBtn = btn;

  utt.onend = () => {
    _ttsReset(btn);
    _ttsBtn = null;
  };
  utt.onerror = () => {
    _ttsReset(btn);
    _ttsBtn = null;
  };
  window.speechSynthesis.speak(utt);
}

function _ttsReset(btn) {
  if (!btn) return;
  btn.innerHTML = "🔊";
  btn.title = "Listen / Stop";
  btn.style.color = "";
}

// ─── VOICE INPUT (🎙️) ────────────────────────────────────────────────────────
function toggleAIVoiceInput() {
  const btn = document.getElementById("aiMicBtn");

  if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
    showToast("⚠️ Voice input is not supported in this browser. Try Chrome.");
    return;
  }

  // If already recording → stop
  if (_aiVoiceRec) {
    _aiVoiceRec.stop();
    _aiVoiceRec = null;
    btn.classList.remove("ai-recording");
    btn.textContent = "🎙️";
    return;
  }

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  _aiVoiceRec = new SR();
  _aiVoiceRec.lang = "de-DE";
  _aiVoiceRec.continuous = false;
  _aiVoiceRec.interimResults = false;

  btn.classList.add("ai-recording");
  btn.textContent = "🔴";

  _aiVoiceRec.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    document.getElementById("aiChatInput").value = transcript;
    btn.classList.remove("ai-recording");
    btn.textContent = "🎙️";
    _aiVoiceRec = null;
    // Auto-send after 400ms so user can see what was transcribed
    setTimeout(() => sendAIMessage(), 400);
  };

  _aiVoiceRec.onerror = () => {
    btn.classList.remove("ai-recording");
    btn.textContent = "🎙️";
    _aiVoiceRec = null;
    showToast("⚠️ Could not hear you. Please try again!");
  };

  _aiVoiceRec.onend = () => {
    btn.classList.remove("ai-recording");
    btn.textContent = "🎙️";
    _aiVoiceRec = null;
  };

  _aiVoiceRec.start();
}

// ─── GRAMMAR NOTE SAVE ────────────────────────────────────────────────────────
function aiSaveNote(correctionText) {
  const notes = JSON.parse(localStorage.getItem("dt_grammar_notes") || "[]");
  if (notes.some((n) => n.correction === correctionText)) {
    showToast("⚠️ This correction is already in your notes!");
    return;
  }
  notes.unshift({
    date: todayStr(),
    correction: correctionText,
    level: getLevel(diaryEntries.length, vocab.length).label,
  });
  localStorage.setItem("dt_grammar_notes", JSON.stringify(notes));
  showToast("💾 Saved to Grammar Notes!");
}

// ─── NEW WORD SAVE FROM CHAT ───────────────────────────────────────────────────
function aiSaveWord(de, en) {
  if (vocab.some((v) => v.de.toLowerCase() === de.toLowerCase())) {
    showToast(`⚠️ "${de}" is already in your vocabulary!`);
    return;
  }
  vocab.unshift({ de, en, cat: "AI Chat", date: todayStr() });
  save("dt_vocab", vocab);
  renderDashboard();
  showToast(`✅ "${de}" added to Vocabulary!`);
}

// ─── CLEAR CHAT ───────────────────────────────────────────────────────────────
function clearAIChat() {
  if (_ttsBtn) {
    window.speechSynthesis.cancel();
    _ttsReset(_ttsBtn);
    _ttsBtn = null;
  }
  _aiHistory = [];
  _aiMsgCount = 0;
  document.getElementById("aiChatMessages").innerHTML = "";
  _updateUsageInfo();
  if (_aiKey()) _aiStartSession();
}

// ─── USAGE INFO ───────────────────────────────────────────────────────────────
function _updateUsageInfo() {
  const el = document.getElementById("aiUsageInfo");
  if (el) el.textContent = `${_aiMsgCount} messages sent today`;
}

// --- 3. LIVE NEWS & CACHING ---
// ==========================================
// 🧠 SMART QUESTION GENERATOR ENGINE       <-- PASTE ALL OF BLOCK 1 HERE
// ==========================================
function qg_getSentences(text) {
  return text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10 && s.split(" ").length > 2);
}
function qg_getWords(text) {
  return text
    .toLowerCase()
    .replace(/[^a-zäöüß\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}
// ─── LEVEL 1: TF-IDF SCORER ───────────────────────────────────────────────────
function qg_tfIdfScore(sentences) {
  const stopWords = new Set([
    "der",
    "die",
    "das",
    "ein",
    "eine",
    "und",
    "oder",
    "aber",
    "ist",
    "sind",
    "war",
    "hat",
    "haben",
    "wird",
    "werden",
    "mit",
    "von",
    "für",
    "auf",
    "in",
    "an",
    "zu",
    "im",
    "dem",
    "den",
    "des",
    "sich",
    "auch",
    "nach",
    "bei",
    "aus",
    "sie",
    "er",
    "es",
    "wir",
    "ich",
    "du",
    "wie",
    "als",
    "dass",
    "wenn",
    "weil",
    "so",
    "noch",
    "mehr",
    "nur",
    "bis",
    "über",
    "unter",
    "durch",
    "gegen",
    "ohne",
    "beim",
    "vom",
    "zum",
    "zur",
    "wird",
    "wurde",
    "worden",
  ]);
  const N = sentences.length;
  const df = {};
  sentences.forEach((s) => {
    const unique = new Set(qg_getWords(s).filter((w) => !stopWords.has(w)));
    unique.forEach((w) => {
      df[w] = (df[w] || 0) + 1;
    });
  });
  return sentences
    .map((sentence) => {
      const words = qg_getWords(sentence).filter((w) => !stopWords.has(w));
      if (!words.length) return { sentence, score: 0 };
      const wc = {};
      words.forEach((w) => {
        wc[w] = (wc[w] || 0) + 1;
      });
      const score = Object.entries(wc).reduce((sum, [word, count]) => {
        return sum + (count / words.length) * Math.log(N / (df[word] || 1));
      }, 0);
      return { sentence, score };
    })
    .sort((a, b) => b.score - a.score);
}
// ─── LEVEL 2: NAMED ENTITY EXTRACTOR ─────────────────────────────────────────
function qg_extractEntities(text) {
  const entities = { names: [], dates: [], numbers: [] };
  const skipWords = new Set([
    "Der",
    "Die",
    "Das",
    "Ein",
    "Eine",
    "Und",
    "Aber",
    "Oder",
    "Wenn",
    "Dass",
    "Nach",
    "Über",
    "Unter",
    "Durch",
    "Gegen",
    "Ohne",
    "Beim",
    "Vom",
    "Zum",
    "Zur",
    "Wird",
    "Wurde",
    "Haben",
    "Sein",
    "Sind",
  ]);
  const sentences = text.split(/[.!?]/);
  sentences.forEach((sentence) => {
    const words = sentence.trim().split(/\s+/);
    words.forEach((word, i) => {
      const clean = word.replace(/[,;:()„"]/g, "");
      if (
        i > 0 &&
        /^[A-ZÄÖÜ][a-zäöüß]{3,}$/.test(clean) &&
        !skipWords.has(clean)
      ) {
        if (!entities.names.includes(clean)) entities.names.push(clean);
      }
    });
    const dates = sentence.match(
      /\d{1,2}\.\s*(?:Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember)(?:\s*\d{4})?|\b\d{4}\b/g
    );
    if (dates)
      dates.forEach((d) => {
        if (!entities.dates.includes(d)) entities.dates.push(d);
      });
    const nums = sentence.match(
      /\d+[.,]?\d*\s*(?:Prozent|Millionen|Milliarden|Euro|%)?/g
    );
    if (nums)
      nums.forEach((n) => {
        if (!entities.numbers.includes(n)) entities.numbers.push(n);
      });
  });
  return entities;
}
// ─── LEVEL 3: READABILITY SCORE ───────────────────────────────────────────────
function qg_readabilityScore(text) {
  const sentences = qg_getSentences(text);
  const words = qg_getWords(text);
  if (!sentences.length || !words.length) return 5;
  const avgSentLen = words.length / sentences.length;
  const avgWordLen = words.reduce((s, w) => s + w.length, 0) / words.length;
  return Math.min(
    10,
    Math.max(1, Math.round(avgSentLen * 0.3 + avgWordLen * 0.7))
  );
}
// ─── LEVEL 4: HARD WORD EXTRACTOR ────────────────────────────────────────────
function qg_extractHardWords(text) {
  const stop = new Set([
    "der",
    "die",
    "das",
    "ein",
    "eine",
    "und",
    "oder",
    "aber",
    "ist",
    "sind",
    "war",
    "hat",
    "haben",
    "wird",
    "werden",
    "mit",
    "von",
    "für",
    "auf",
    "in",
    "an",
    "zu",
    "im",
    "dem",
    "den",
    "des",
    "sich",
    "auch",
    "nach",
    "bei",
    "aus",
  ]);
  return [
    ...new Set(
      text
        .split(/\s+/)
        .map((w) => w.replace(/[^a-zA-ZäöüÄÖÜß]/g, ""))
        .filter((w) => w.length > 8 && !stop.has(w.toLowerCase()))
    ),
  ]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
}
// ─── MAIN QUESTION GENERATOR ──────────────────────────────────────────────────
async function generateArticleQuestions() {
  // Try to find the article text from any known container
  const articleEl =
    document.getElementById("articleContent") ||
    document.getElementById("storyContent") ||
    document.getElementById("readingContent") ||
    document.querySelector(".story-text");
  if (!articleEl || !articleEl.innerText.trim()) {
    showToast("⚠️ No article loaded! Please fetch a news article first.");
    return;
  }
  const articleText = articleEl.innerText.trim();
  const btn = document.getElementById("generateQuestionsBtn");
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="qg-spinner"></span> Analysing Article...';
  }
  // Run all 4 levels
  const sentences = qg_getSentences(articleText);
  const scored = qg_tfIdfScore(sentences);
  const entities = qg_extractEntities(articleText);
  const hardWords = qg_extractHardWords(articleText);
  const levelData = getLevel(diaryEntries.length, vocab.length);
  const userLevel = levelData.label.split(" ")[0];
  if (sentences.length < 1) {
    showToast("⚠️ Article too short to generate questions!");
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = "🧠 Generate Questions";
    }
    return;
  }
  const questions = [];
  // Q1: True/False — top TF-IDF sentence (always correct statement)
  if (scored.length > 0) {
    questions.push({
      type: "true_false",
      correct: true,
      question: scored[0].sentence,
      hint: "This sentence comes directly from the article.",
    });
  }
  // Q2: True/False — modified sentence (make it false by swapping a number)
  if (scored.length > 1 && entities.numbers.length > 0) {
    const original = scored[1].sentence;
    const num = entities.numbers[0];
    const fakeNum = String(parseInt(num) + Math.floor(Math.random() * 10 + 2));
    const modified = original.includes(num)
      ? original.replace(num, fakeNum)
      : original;
    const isTrueStatement = modified === original;
    questions.push({
      type: "true_false",
      correct: isTrueStatement,
      question: modified,
      hint: isTrueStatement
        ? "This appears exactly in the article."
        : `Check the numbers carefully — the article uses a different value.`,
    });
  } else if (scored.length > 1) {
    questions.push({
      type: "true_false",
      correct: true,
      question: scored[1].sentence,
      hint: "This sentence comes from the article.",
    });
  }
  // Q3: Multiple Choice — "Which sentence is in the article?"
  if (scored.length >= 4) {
    const correct = scored[0].sentence;
    const distractors = scored.slice(-3).map((s) => s.sentence);
    const options = [correct, ...distractors].sort(() => Math.random() - 0.5);
    questions.push({
      type: "multiple_choice",
      question:
        "Welcher Satz steht wörtlich im Artikel? (Which sentence appears in the article?)",
      options,
      correct: options.indexOf(correct),
      hint: "The correct sentence is copied word-for-word from the main article body.",
    });
  }
  // Q4: Named Entity — "Who is mentioned?"
  if (entities.names.length >= 2) {
    const correctName = entities.names[0];
    const fakeNames = [
      "Hans Becker",
      "Maria Schmidt",
      "Thomas Weber",
      "Anna Fischer",
    ].filter((n) => n !== correctName);
    const options = [correctName, ...fakeNames.slice(0, 3)].sort(
      () => Math.random() - 0.5
    );
    questions.push({
      type: "multiple_choice",
      question:
        "Welche Person wird im Artikel namentlich erwähnt? (Which person is mentioned by name?)",
      options,
      correct: options.indexOf(correctName),
      hint: "Look for capitalized proper nouns in the article.",
    });
  }
  // Q5: Number/Date MCQ (B1/B2 only)
  if (
    ["B1", "B2", "B1 Intermed.", "B2 Fluent"].some((l) =>
      levelData.label.includes(l.split(" ")[0])
    ) &&
    entities.numbers.length > 0
  ) {
    const num = entities.numbers[0];
    const base = parseInt(num) || 10;
    const options = [
      num,
      String(base + 5),
      String(base * 2),
      String(Math.max(1, base - 3)),
    ].sort(() => Math.random() - 0.5);
    questions.push({
      type: "multiple_choice",
      question: `Welche Zahl/welches Datum erscheint im Artikel? (Which number or date appears in the article?)`,
      options,
      correct: options.indexOf(num),
      hint: "Scan the article carefully for statistics, dates, or figures.",
    });
  }
  // Q6: Vocabulary in Context (uses your existing smartTranslate)
  if (hardWords.length > 0 && navigator.onLine) {
    try {
      const word = hardWords[0];
      const translation = await smartTranslate(word);
      const correctEn = translation.english || word;
      const fakeAnswers = [
        "to run quickly",
        "a type of building",
        "an important person",
        "to cause problems",
      ];
      const options = [correctEn, ...fakeAnswers.slice(0, 3)].sort(
        () => Math.random() - 0.5
      );
      questions.push({
        type: "multiple_choice",
        question: `Was bedeutet das Wort "${word}" auf Englisch? (What does "${word}" mean in English?)`,
        options,
        correct: options.indexOf(correctEn),
        hint: `"${word}" is a key word from the article. Try to remember its context.`,
      });
    } catch (e) {
      /* Skip if translate fails */
    }
  }
  if (btn) {
    btn.disabled = false;
    btn.innerHTML = "🔄 Regenerate Questions";
  }
  renderArticleQuestions(questions);
}
// ─── QUESTION RENDERER ────────────────────────────────────────────────────────
function renderArticleQuestions(questions) {
  const zone = document.getElementById("questionZone");
  if (!zone || !questions.length) return;
  window._aqQuestions = questions;
  window._aqAnswers = new Array(questions.length).fill(null);
  let html = `
    <div class="card" style="margin-top:20px; border-color:var(--accent2); animation: fadeIn 0.4s ease;">
      <div class="card-title">🧠 Verständnisfragen</div>
      <div class="card-sub" style="margin-bottom:20px;">Answer every question then click "Check Answers".</div>`;
  questions.forEach((q, qi) => {
    html += `<div class="question-card" id="qcard-${qi}">
      <div class="question-text">${qi + 1}. ${q.question}</div>`;
    if (q.type === "true_false") {
      html += `<div style="display:flex;gap:10px;">
        <button class="aq-opt-btn aq-true" id="q${qi}_true" onclick="aqSelect(${qi}, true)">✅ Richtig (True)</button>
        <button class="aq-opt-btn aq-false" id="q${qi}_false" onclick="aqSelect(${qi}, false)">❌ Falsch (False)</button>
      </div>`;
    } else {
      html += `<div style="display:flex;flex-direction:column;gap:8px;">`;
      q.options.forEach((opt, oi) => {
        html += `<button class="aq-opt-btn" id="q${qi}_opt${oi}" onclick="aqSelect(${qi}, ${oi})">${String.fromCharCode(
          65 + oi
        )}. ${opt}</button>`;
      });
      html += `</div>`;
    }
    html += `<div class="qg-hint" id="qhint-${qi}">💡 ${q.hint}</div></div>`;
  });
  html += `
    <div style="display:flex;gap:10px;margin-top:16px;">
      <button class="btn btn-primary" onclick="aqCheckAnswers()" style="flex:1;justify-content:center;">✅ Check Answers</button>
      <button class="btn btn-outline" onclick="aqToggleHints()" style="flex:1;justify-content:center;">💡 Hints</button>
    </div>
    <div id="aqScoreCard" style="display:none;margin-top:16px;padding:24px;border-radius:12px;text-align:center;background:linear-gradient(135deg,rgba(91,141,238,0.15),rgba(167,139,250,0.15));border:1px solid var(--accent);"></div>
    </div>`;
  zone.innerHTML = html;
  zone.style.display = "block";
  setTimeout(
    () => zone.scrollIntoView({ behavior: "smooth", block: "start" }),
    100
  );
}
// ─── INTERACTION HANDLERS ─────────────────────────────────────────────────────
function aqSelect(qi, answer) {
  window._aqAnswers[qi] = answer;
  const q = window._aqQuestions[qi];
  const card = document.getElementById(`qcard-${qi}`);
  card
    .querySelectorAll(".aq-opt-btn")
    .forEach((b) => b.classList.remove("aq-selected"));
  const btn =
    q.type === "true_false"
      ? document.getElementById(`q${qi}_${answer}`)
      : document.getElementById(`q${qi}_opt${answer}`);
  if (btn) btn.classList.add("aq-selected");
}
function aqToggleHints() {
  window._aqQuestions.forEach((_, qi) => {
    const h = document.getElementById(`qhint-${qi}`);
    if (h) h.style.display = h.style.display === "none" ? "block" : "none";
  });
}
function aqCheckAnswers() {
  const questions = window._aqQuestions;
  const userAnswers = window._aqAnswers;
  let correct = 0;
  questions.forEach((q, qi) => {
    const isCorrect = userAnswers[qi] !== null && userAnswers[qi] === q.correct;
    if (isCorrect) correct++;
    const card = document.getElementById(`qcard-${qi}`);
    card.style.border = isCorrect
      ? "1px solid var(--success)"
      : "1px solid var(--danger)";
    card.style.background = isCorrect
      ? "rgba(16,185,129,0.07)"
      : "rgba(239,68,68,0.07)";
    if (!isCorrect) {
      const hint = document.getElementById(`qhint-${qi}`);
      if (hint) hint.style.display = "block";
    }
    // Highlight correct answer in green
    const correctId =
      q.type === "true_false"
        ? `q${qi}_${q.correct}`
        : `q${qi}_opt${q.correct}`;
    const correctBtn = document.getElementById(correctId);
    if (correctBtn) {
      correctBtn.style.background = "rgba(16,185,129,0.25)";
      correctBtn.style.borderColor = "var(--success)";
    }
  });
  const pct = Math.round((correct / questions.length) * 100);
  const emoji = pct === 100 ? "🏆" : pct >= 80 ? "🎉" : pct >= 60 ? "👍" : "📚";
  const msg =
    pct === 100
      ? "Perfekt! Ausgezeichnet!"
      : pct >= 80
      ? "Sehr gut! Great work!"
      : pct >= 60
      ? "Gut! Keep practising!"
      : "Weitermachen! Review the article and try again!";
  // Bonus XP for 60%+
  if (pct >= 60) {
    vocab.push({
      de: `[Reading XP ${todayStr()}]`,
      en: "[Auto XP Bonus]",
      cat: "Reading",
      date: todayStr(),
    });
    vocab.push({
      de: `[Reading XP Extra]`,
      en: "[Auto XP Bonus]",
      cat: "Reading",
      date: todayStr(),
    });
    save("dt_vocab", vocab);
    renderDashboard();
  }
  const sc = document.getElementById("aqScoreCard");
  sc.style.display = "block";
  sc.innerHTML = `
    <div style="font-size:2.8rem;margin-bottom:8px;">${emoji}</div>
    <div style="font-size:1.6rem;font-weight:900;color:var(--text);">${correct} / ${
    questions.length
  } Richtig</div>
    <div style="font-size:0.95rem;color:var(--text-muted);margin-top:6px;">${msg}</div>
    ${
      pct >= 60
        ? '<div style="font-size:0.8rem;color:var(--success);margin-top:10px;font-weight:700;">+2 XP awarded to your Level Progress! ⭐</div>'
        : ""
    }`;
  sc.scrollIntoView({ behavior: "smooth" });
  showToast(`${emoji} ${correct}/${questions.length} correct! ${msg}`);
}
async function fetchLiveNews() {
  const container = document.getElementById("liveNewsContainer");
  const btn = document.getElementById("fetchNewsBtn");

  btn.innerHTML = "🔄 Fetching...";
  btn.disabled = true;
  container.innerHTML =
    '<div style="text-align:center; padding:30px; color:var(--text-muted);">Downloading live news... ⏳</div>';

  try {
    const res = await fetch(
      "https://api.rss2json.com/v1/api.json?rss_url=https://www.tagesschau.de/xml/rss2/&api_key=&_=" +
        Date.now()
    );
    const data = await res.json();

    if (data.items && data.items.length > 0) {
      const shuffled = data.items.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 10); // Grab 10 random fresh articles

      localStorage.setItem("dt_live_news", JSON.stringify(selected));
      renderLiveNews();
      showToast("Live news updated!", "var(--success)");
    } else {
      throw new Error("No articles");
    }
  } catch (e) {
    console.error(e);
    showToast("Failed to fetch news. Try again later.", "var(--danger)");
    renderLiveNews();
  }
  const qBtn = document.getElementById("generateQuestionsBtn");
  if (qBtn) qBtn.style.display = "inline-flex";
  document.getElementById("questionZone").innerHTML = "";
  document.getElementById("questionZone").style.display = "none";
  btn.innerHTML = "🔄 Fetch Live News (DW)";
  btn.disabled = false;
}

function renderLiveNews() {
  const container = document.getElementById("liveNewsContainer");
  const cached = localStorage.getItem("dt_live_news");

  if (!cached) {
    container.innerHTML =
      '<div style="text-align:center; color:var(--text-muted); padding:30px; background:var(--surface2); border-radius:12px;">No cached news found. Click Fetch to get today\'s articles!</div>';
    return;
  }

  const articles = JSON.parse(cached);

  // Hide question zone when new articles load
  const qZone = document.getElementById("questionZone");
  if (qZone) {
    qZone.innerHTML = "";
    qZone.style.display = "none";
  }

  const wrapWords = (text) => {
    return text
      .split(/\s+/)
      .map((word) => {
        const cleanWord = word.replace(/[.,!?":;()]/g, "");
        return `<span class="lingq-word" onclick="handleNewsWordClick('${escHtml(
          cleanWord.replace(/'/g, "\\'")
        )}')">${escHtml(word)}</span>`;
      })
      .join(" ");
  };

  container.innerHTML = articles
    .map((article, idx) => {
      // Store clean text on a data attribute for the question generator
      const cleanText = (
        article.title +
        ". " +
        (article.description || "")
      ).replace(/<[^>]+>/g, "");

      return `
      <div style="background:var(--surface2); padding:20px; border-radius:12px; border-left:4px solid var(--accent); margin-bottom:16px;">
        <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:8px;">${new Date(
          article.pubDate
        ).toLocaleString()}</div>
        <h3 id="article-title-${idx}" style="margin-top:0; margin-bottom:10px; line-height:1.4;">${wrapWords(
        article.title
      )}</h3>
        <div id="article-body-${idx}" style="line-height:1.6; color:var(--text-muted);">${wrapWords(
        article.description || ""
      )}</div>
        
        <!-- Hidden clean text for question generator -->
        <div id="article-raw-${idx}" style="display:none;">${escHtml(
        cleanText
      )}</div>

        <div style="display:flex; gap:10px; margin-top:15px; flex-wrap:wrap; align-items:center;">
          <a href="${article.link}" target="_blank" 
            style="color:var(--accent); text-decoration:none; font-size:0.9rem; font-weight:600;">
            Read full article on Tagesschau →
          </a>
          <button class="btn btn-outline btn-sm" 
            onclick="generateArticleQuestions(${idx})" 
            style="font-size:0.8rem; padding:6px 14px; border-color:var(--accent2); color:var(--accent2);">
            🧠 Test My Understanding
          </button>
        </div>
      </div>
    `;
    })
    .join("");
}

function clearNewsCache() {
  localStorage.removeItem("dt_live_news");
  renderLiveNews();
  showToast("News cache cleared!", "var(--success)");
}

async function handleNewsWordClick(word) {
  if (!word) return;
  const tooltip = document.getElementById("lingqTooltip");
  const tooltipDe = document.getElementById("lingqDe");
  const tooltipEn = document.getElementById("lingqEn");

  tooltipDe.innerText = word;
  tooltipEn.innerText = "Translating... ⏳";
  tooltip.style.display = "flex";

  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        word
      )}&langpair=de|en`
    );
    const data = await res.json();
    if (data.responseData && data.responseData.translatedText) {
      tooltipEn.innerText = data.responseData.translatedText;
      document.getElementById("lingqSaveBtn").onclick = () => {
        saveCloudWord(word, data.responseData.translatedText);
        tooltip.style.display = "none";
      };
    }
  } catch (e) {
    tooltipEn.innerText = "Translation failed.";
  }
}

// Load cached news automatically when the page starts
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("liveNewsContainer")) {
    renderLiveNews();
  }
});
// ==========================================
// ☁️ ADVANCED GITHUB CLOUD SYNC SYSTEM ☁️
// ==========================================

let syncTimeout = null;
let syncPollingInterval = null;

// OVERRIDE the default save function!
// This saves locally instantly, then queues a cloud sync 3 seconds later.
const originalSave = save;
save = function (key, data) {
  originalSave(key, data); // Save instantly to local browser

  const token = localStorage.getItem("dt_gh_token");
  const gistId = localStorage.getItem("dt_gist_id");
  if (token && gistId) {
    clearTimeout(syncTimeout);
    updateSyncStatus("🟡 Changes detected. Syncing in 3s...", "var(--warning)");
    syncTimeout = setTimeout(() => {
      pushToCloud(token, gistId);
    }, 3000);
  }
};

// Start the live background poller when the app loads
function initCloud() {
  const token = localStorage.getItem("dt_gh_token");
  const gistId = localStorage.getItem("dt_gist_id");

  if (token && gistId) {
    document.getElementById("ghTokenInput").value = "********";
    document.getElementById("ghGistInput").value = gistId;
    updateSyncStatus("🟢 Connected. Polling active.", "var(--success)");

    // Live Polling: Check for external changes every 30 seconds
    clearInterval(syncPollingInterval);
    syncPollingInterval = setInterval(() => {
      silentCheckCloud(token, gistId);
    }, 30000);
  }
}

// Called when you click "Connect & Sync"
async function setupCloud() {
  const token = document.getElementById("ghTokenInput").value.trim();
  let gistId = document.getElementById("ghGistInput").value.trim();

  if (!token) return alert("Please enter a GitHub Token!");

  updateSyncStatus("🔄 Connecting...", "var(--accent)");

  try {
    if (!gistId) {
      // Create new Gist!
      const payload = buildGistPayload();
      const res = await fetch("https://api.github.com/gists", {
        method: "POST",
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
        body: JSON.stringify({
          description: "German Diary Database (DO NOT DELETE)",
          public: false,
          files: payload,
        }),
      });
      const data = await res.json();
      gistId = data.id;
      localStorage.setItem("dt_gist_id", gistId);
      document.getElementById("ghGistInput").value = gistId;
      alert(
        `Success! Your database is created.\nGist ID: ${gistId}\n(Save this ID to use on your phone!)`
      );
    }

    localStorage.setItem("dt_gh_token", token);
    localStorage.setItem("dt_last_sync", new Date().toISOString());
    initCloud();
    pushToCloud(token, gistId);
  } catch (err) {
    console.error(err);
    updateSyncStatus("🔴 Connection Failed", "var(--danger)");
  }
}

// Builds the multi-file architecture!
function buildGistPayload() {
  // We grab the raw strings from localStorage to build the separate files
  return {
    "diary_entries.json": {
      content: localStorage.getItem("dt_entries") || "[]",
    },
    "vocabulary.json": { content: localStorage.getItem("dt_vocab") || "[]" },
    "settings.json": { content: localStorage.getItem("dt_theme") || "dark" },
    "stories.json": {
      content: localStorage.getItem("dt_saved_stories") || "[]",
    },
  };
}

async function pushToCloud(token, gistId) {
  try {
    updateSyncStatus("🔄 Uploading to cloud...", "var(--accent)");
    const payload = buildGistPayload();

    await fetch(`https://api.github.com/gists/${gistId}`, {
      method: "PATCH",
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
      body: JSON.stringify({ files: payload }),
    });

    localStorage.setItem("dt_last_sync", new Date().toISOString());
    updateSyncStatus(
      `🟢 Synced at ${new Date().toLocaleTimeString()}`,
      "var(--success)"
    );
  } catch (err) {
    updateSyncStatus("🔴 Sync Failed", "var(--danger)");
  }
}

async function forcePullCloud() {
  const token =
    localStorage.getItem("dt_gh_token") ||
    document.getElementById("ghTokenInput").value;
  const gistId =
    localStorage.getItem("dt_gist_id") ||
    document.getElementById("ghGistInput").value;
  if (!token || !gistId) return alert("Missing token or Gist ID!");

  updateSyncStatus("🔄 Downloading from cloud...", "var(--accent)");
  await pullData(token, gistId);
}

async function silentCheckCloud(token, gistId) {
  try {
    const res = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: { Authorization: `token ${token}` },
    });
    const data = await res.json();

    const cloudTime = new Date(data.updated_at).getTime();
    const localTime = new Date(
      localStorage.getItem("dt_last_sync") || 0
    ).getTime();

    // CONFLICT RESOLUTION: Cloud is newer than local!
    if (cloudTime > localTime + 5000) {
      updateSyncStatus(
        "⚠️ Newer data found in cloud. Auto-pulling...",
        "var(--warning)"
      );
      await pullData(token, gistId, data);
    }
  } catch (e) {
    console.error("Polling failed", e);
  }
}

async function pullData(token, gistId, preFetchedData = null) {
  try {
    const data =
      preFetchedData ||
      (await (
        await fetch(`https://api.github.com/gists/${gistId}`, {
          headers: { Authorization: `token ${token}` },
        })
      ).json());

    // Inject the cloud files back into localStorage safely
    if (data.files["diary_entries.json"])
      localStorage.setItem(
        "dt_entries",
        data.files["diary_entries.json"].content
      );
    if (data.files["vocabulary.json"])
      localStorage.setItem("dt_vocab", data.files["vocabulary.json"].content);
    if (data.files["stories.json"])
      localStorage.setItem(
        "dt_saved_stories",
        data.files["stories.json"].content
      );

    localStorage.setItem("dt_last_sync", new Date().toISOString());
    localStorage.setItem("dt_gh_token", token);
    localStorage.setItem("dt_gist_id", gistId);

    updateSyncStatus(
      `🟢 Pulled latest at ${new Date().toLocaleTimeString()}`,
      "var(--success)"
    );

    // Force the UI to refresh with the new data
    alert("Data successfully restored from cloud! Refreshing...");
    location.reload();
  } catch (err) {
    updateSyncStatus("🔴 Pull Failed", "var(--danger)");
  }
}

function updateSyncStatus(msg, color) {
  const el = document.getElementById("syncStatus");
  if (el) {
    el.innerHTML = `Status: <span style="color:${color}">${msg}</span>`;
  }
}

// Boot up the cloud connection when script runs!
setTimeout(initCloud, 1000);

// --- FEEDBACK WIDGET LOGIC ---
const WEB3FORMS_ACCESS_KEY = "e9c6eec4-1444-437d-be24-21c7e25f66fc"; // Put your key here!

function toggleFeedback() {
  document.getElementById("feedbackModal").classList.toggle("open");
}

function selectFeedbackType(btn, type) {
  document.getElementById("feedbackType").value = type; // Update hidden input
  document
    .querySelectorAll(".emoji-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active"); // Highlight the clicked emoji
}

async function submitFeedback(event) {
  event.preventDefault(); // Stop the page from reloading

  const submitBtn = document.getElementById("feedbackSubmitBtn");
  const btnText = document.getElementById("feedbackBtnText");
  const type = document.getElementById("feedbackType").value;
  const email = document.getElementById("feedbackEmail").value;
  const message = document.getElementById("feedbackMessage").value;

  // UI Loading State
  submitBtn.disabled = true;
  submitBtn.style.opacity = "0.7";
  btnText.innerText = "⏳ Sending to Developer...";

  // Prepare data for Web3Forms
  const payload = {
    access_key: WEB3FORMS_ACCESS_KEY, // Keeps using your key!
    subject: `[${type}] New Feedback for German Diary!`,
    from_name: "German Diary Feedback",
    replyto: email || undefined, // Lets you click "Reply" directly in your email!
    template: "box", // Forces Web3Forms to use a beautiful HTML layout!
    Feedback_Type: type,
    User_Email: email || "Anonymous",
    Message: message,
  };

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.success) {
      // SUCCESS! Shoot Confetti from the button!
      btnText.innerText = "✅ Sent Successfully!";
      submitBtn.style.background = "var(--success)";

      if (typeof confetti === "function") {
        const rect = submitBtn.getBoundingClientRect();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: rect.top / window.innerHeight,
          },
        });
      }

      // Close and reset after 2 seconds
      setTimeout(() => {
        toggleFeedback();
        document.getElementById("feedbackForm").reset();
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
        submitBtn.style.background = "";
        btnText.innerText = "🚀 Send securely";
      }, 2500);
    } else {
      throw new Error(result.message || "Unknown error");
    }
  } catch (error) {
    console.error(error);
    btnText.innerText = "❌ Error! Try Again";
    submitBtn.style.background = "var(--danger)";
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.style.opacity = "1";
      submitBtn.style.background = "";
      btnText.innerText = "🚀 Send securely";
    }, 3000);
  }
}

// ==========================================
// IDLE-AWARE BOOTCAMP ENGINE & HEATMAP
// ==========================================
let btc_lastActiveTime = Date.now();
let btc_activeSecondsToday = parseInt(
  localStorage.getItem(`dt_active_${todayStr()}`) || "0"
);
let btc_hasAchievedGoalToday =
  localStorage.getItem(`dt_achieved_${todayStr()}`) === "true";

// 1. Listen for Human Interaction
function btc_markActive() {
  btc_lastActiveTime = Date.now();
  const statusEl = document.getElementById("antiCheatStatus");

  // When we wake up from being paused...
  if (statusEl && statusEl.innerText.includes("PAUSED")) {
    // If we already hit the goal today, return to GOLD state!
    if (btc_hasAchievedGoalToday) {
      statusEl.innerHTML = "🏆 GOAL REACHED! (Active)";
      statusEl.style.background = "rgba(251, 191, 36, 0.15)";
      statusEl.style.color = "var(--gold)";
      statusEl.style.borderColor = "var(--gold)";
    } else {
      // Otherwise, return to standard GREEN state
      statusEl.innerHTML = "🟢 ENGINE ACTIVE";
      statusEl.style.background = "rgba(16, 185, 129, 0.15)";
      statusEl.style.color = "var(--success)";
      statusEl.style.borderColor = "rgba(16, 185, 129, 0.3)";
    }
  }
}
["mousemove", "keydown", "click", "scroll", "touchstart"].forEach((evt) => {
  window.addEventListener(evt, btc_markActive, { passive: true });
});

// 2. Format Time Helper (MM:SS)
function btc_formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// 3. Get Goal Based on Level
function btc_getDailyGoalSeconds() {
  const level = localStorage.getItem("dt_level") || "A1";
  const map = {
    Starter: 15 * 60,
    A1: 30 * 60,
    A2: 60 * 60,
    B1: 90 * 60,
    B2: 120 * 60,
  };
  return map[level] || 30 * 60;
}

// 4. The Core Engine Loop (Runs every 1 second)
setInterval(() => {
  const now = Date.now();
  const goalSecs = btc_getDailyGoalSeconds();
  const goalEl = document.getElementById("bootcampGoalDisplay");
  if (goalEl)
    goalEl.innerText = `Goal: ${goalSecs / 60} Mins (${
      localStorage.getItem("dt_level") || "A1"
    })`;
  // Check Idle Status
  const isIdle = now - btc_lastActiveTime > 30000;
  // STRICT MODE FOREVER: We removed the check, so it ALWAYS pauses when idle!
  if (isIdle) {
    const statusEl = document.getElementById("antiCheatStatus");
    // If it's active OR showing goal reached, force it to PAUSE!
    if (
      statusEl &&
      (statusEl.innerText.includes("ACTIVE") ||
        statusEl.innerText.includes("REACHED"))
    ) {
      statusEl.innerHTML = "⏸️ TIMER PAUSED (IDLE)";
      statusEl.style.background = "rgba(248, 113, 113, 0.15)";
      statusEl.style.color = "var(--danger)";
      statusEl.style.borderColor = "rgba(248, 113, 113, 0.3)";
    }
  } else {
    // We are active! Count up!
    btc_activeSecondsToday++;
    localStorage.setItem(`dt_active_${todayStr()}`, btc_activeSecondsToday);
    const timeEl = document.getElementById("bootcampTimeDisplay");
    const barEl = document.getElementById("bootcampProgressBar");
    if (timeEl) timeEl.innerText = btc_formatTime(btc_activeSecondsToday);
    if (barEl && !btc_hasAchievedGoalToday) {
      let pct = (btc_activeSecondsToday / goalSecs) * 100;
      if (pct > 100) pct = 100;
      barEl.style.width = pct + "%";
    }
    // CHECK VICTORY CONDITION!
    if (btc_activeSecondsToday >= goalSecs && !btc_hasAchievedGoalToday) {
      btc_hasAchievedGoalToday = true;
      localStorage.setItem(`dt_achieved_${todayStr()}`, "true");
      let currentStreak = parseInt(localStorage.getItem("dt_streak") || "0");
      localStorage.setItem("dt_streak", currentStreak + 1);
      let history = JSON.parse(localStorage.getItem("dt_history") || "[]");
      if (!history.includes(todayStr())) {
        history.push(todayStr());
        localStorage.setItem("dt_history", JSON.stringify(history));
      }
      btc_triggerVictoryUI();
      btc_renderHeatmap();
    }
  }
}, 1000);

// 5. The Victory Celebration
function btc_triggerVictoryUI() {
  const glow = document.getElementById("bootcampGlow");
  const time = document.getElementById("bootcampTimeDisplay");
  const bar = document.getElementById("bootcampProgressBar");
  const status = document.getElementById("antiCheatStatus");

  if (glow) glow.style.opacity = "1";
  if (time) time.style.color = "var(--gold)";
  if (bar) bar.style.background = "linear-gradient(90deg, #fbbf24, #f59e0b)";
  if (bar) bar.style.width = "100%";
  if (status) {
    status.innerHTML = "🏆 GOAL REACHED!";
    status.style.background = "rgba(251, 191, 36, 0.15)";
    status.style.color = "var(--gold)";
    status.style.borderColor = "var(--gold)";
  }

  // Shoot Professional Confetti (Using your existing engine)
  if (typeof confetti === "function") {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.4 },
      colors: ["#fbbf24", "#f59e0b", "#ffffff"],
    });
  }
}

// 6. The Fixed-Width Perfect Heatmap Renderer
// 6. Matrix Squares Heatmap (Concept 1 - No Numbers)
function btc_renderHeatmap() {
  const container = document.getElementById("bootcampHeatmap");
  if (!container) return;

  // Force the exact Matrix grid layout so it fits perfectly in the compact card
  container.style.display = "grid";
  container.style.gridTemplateColumns = "repeat(7, 20px)";
  container.style.gap = "6px";
  container.style.justifyContent = "center";

  let history = JSON.parse(localStorage.getItem("dt_history") || "[]");

  // We need exactly 35 blocks (5 weeks * 7 days)
  let html = "";
  for (let i = 34; i >= 0; i--) {
    let d = new Date();
    d.setDate(d.getDate() - i);
    let ds = d.toISOString().split("T")[0]; // Format YYYY-MM-DD

    let isComplete = history.includes(ds);
    let blockClass = isComplete ? "heat-block active-heat" : "heat-block";
    let titleText = isComplete ? `Goal CRUSHED on ${ds}` : `Missed on ${ds}`;

    html += `<div class="${blockClass}" title="${titleText}"></div>`;
  }
  container.innerHTML = html;
}

// 7. Initial Load Setup
window.addEventListener("DOMContentLoaded", () => {
  if (btc_hasAchievedGoalToday) {
    setTimeout(btc_triggerVictoryUI, 100);
  }
  btc_renderHeatmap();
});

// ==========================================
// 🚀 PHASE 6: ONBOARDING LOGIC
// ==========================================
let _onboardState = { level: null, goal: null, time: null, step: 1 };

// Check if user needs onboarding when page loads
document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("dt_onboarded")) {
    document.getElementById("onboardingModal").style.display = "flex";
  }
});

function selectLevel(val, btn) {
  _onboardState.level = val;
  _highlightBtn(btn);
  _showNextBtn();
}
function selectGoal(val, btn) {
  _onboardState.goal = val;
  _highlightBtn(btn);
  _showNextBtn();
}
function selectTime(val, btn) {
  _onboardState.time = val;
  _highlightBtn(btn);
  _showNextBtn();
}

function _highlightBtn(btn) {
  const siblings = btn.parentElement.children;
  for (let b of siblings) b.classList.remove("selected");
  btn.classList.add("selected");
}

function _showNextBtn() {
  document.getElementById("onboardNextBtn").style.display = "block";
}

function nextOnboardStep() {
  if (_onboardState.step === 1 && !_onboardState.level) return;
  if (_onboardState.step === 2 && !_onboardState.goal) return;
  if (_onboardState.step === 3 && !_onboardState.time) return;

  document
    .getElementById(`onboardStep${_onboardState.step}`)
    .classList.remove("active");
  document.getElementById("onboardNextBtn").style.display = "none";

  _onboardState.step++;

  if (_onboardState.step > 3) {
    completeOnboarding();
  } else {
    document
      .getElementById(`onboardStep${_onboardState.step}`)
      .classList.add("active");
  }
}

function completeOnboarding() {
  // Save to local storage so they never see it again unless they clear data
  localStorage.setItem("dt_onboarded", "true");
  localStorage.setItem("dt_user_level_start", _onboardState.level);
  localStorage.setItem("dt_user_goal", _onboardState.goal);
  localStorage.setItem("dt_daily_time", _onboardState.time);

  // Auto-Config based on goal
  if (_onboardState.goal === "work") {
    if (typeof importItVocab === "function") {
      importItVocab(); // Auto-load IT packs automatically
      setTimeout(
        () => showToast("💼 IT Vocabulary Pack Pre-loaded for Work!"),
        800
      );
    }
  }

  // Hide Modal
  document.getElementById("onboardingModal").style.display = "none";
  setTimeout(
    () => showToast("🎉 Setup complete! Welcome to your structured path."),
    1500
  );

  // Refresh dashboard
  if (typeof renderDashboard === "function") renderDashboard();
}

// (Optional) Run this in the console to test the modal again:
// localStorage.removeItem('dt_onboarded'); location.reload();

// ==========================================
// 🚀 PHASE 1 & 5: MISSION ENGINE & DASHBOARD
// ==========================================

// USING VAR INSTEAD OF CONST TO PREVENT SYNTAX ERRORS FOREVER!
var MISSION_TASKS_TEMPLATE = [
  {
    id: "vocab",
    icon: "🧠",
    title: "Learn 5 new words",
    target: 5,
    time: 5,
    action: "showSection('vocab')",
    btnText: "Open Vocab",
  },
  {
    id: "diary",
    icon: "✍️",
    title: "Write 1 diary entry",
    target: 1,
    time: 10,
    action: "showSection('diary')",
    btnText: "Open Diary",
  },
  {
    id: "reading",
    icon: "📰",
    title: "Read 1 news article",
    target: 1,
    time: 5,
    action: "showSection('reading')",
    btnText: "Open Reading",
  },
  {
    id: "quiz",
    icon: "🎯",
    title: "Complete 1 quiz",
    target: 1,
    time: 5,
    action: "showSection('quiz')",
    btnText: "Start Quiz",
  },
];

function generateDailyMission() {
  const today = todayStr();
  let missionState = load("dt_mission_state", { date: null, tasks: {} });
  if (missionState.date !== today) {
    missionState = { date: today, tasks: {} };
    MISSION_TASKS_TEMPLATE.forEach((t) => (missionState.tasks[t.id] = 0));
    save("dt_mission_state", missionState);
  }
  const todayVocab = vocab.filter((v) => v.date === today).length;
  missionState.tasks["vocab"] = Math.min(todayVocab, 5);
  const todayDiary = diaryEntries.filter((e) => e.date === today).length;
  missionState.tasks["diary"] = Math.min(todayDiary, 1);
  save("dt_mission_state", missionState);
  renderMissionCard();
}

function renderMissionCard() {
  const missionEl = document.getElementById("missionTaskList");
  if (!missionEl) return;
  const missionState = load("dt_mission_state", {
    date: todayStr(),
    tasks: {},
  });
  let totalTasks = MISSION_TASKS_TEMPLATE.length,
    completedTasks = 0,
    estTimeRemaining = 0;

  const dEl = document.getElementById("missionDate");
  if (dEl) dEl.textContent = formatDate(todayStr());

  let html = "";
  MISSION_TASKS_TEMPLATE.forEach((task) => {
    const progress = missionState.tasks[task.id] || 0;
    const isDone = progress >= task.target;
    if (isDone) completedTasks++;
    else estTimeRemaining += task.time;
    html += `
      <div class="mission-task-item ${
        isDone ? "completed" : ""
      }" style="display:flex; justify-content:space-between; padding:12px; background:rgba(255,255,255,0.03); margin-bottom:8px; border-radius:8px;">
        <div><span style="margin-right:10px">${task.icon}</span> <span>${
      task.title
    }</span> <span style="font-size:0.8rem; color:var(--text-muted)">(${progress}/${
      task.target
    })</span></div>
        ${
          isDone
            ? '<span style="color:var(--success); font-weight:bold;">✓ Done</span>'
            : `<button class="btn btn-outline btn-sm" onclick="${task.action}">${task.btnText}</button>`
        }
      </div>`;
  });
  missionEl.innerHTML = html;

  const pct = Math.round((completedTasks / totalTasks) * 100);
  const pctEl = document.getElementById("missionPct");
  if (pctEl) pctEl.textContent = `${pct}%`;

  const timeEl = document.getElementById("missionEstTime");
  if (timeEl) {
    if (pct === 100) {
      timeEl.innerHTML = "🎉 All daily tasks completed!";
      timeEl.style.color = "var(--success)";
    } else {
      timeEl.innerHTML = `⏱️ Est. time: ${estTimeRemaining} mins`;
      timeEl.style.color = "var(--text-muted)";
    }
  }
}

function updateDashboardStats() {
  let known = 0,
    learning = 0;
  vocab.forEach((v) => {
    if (v.interval && v.interval > 10) known++;
    else learning++;
  });
  const totalSrs = known + learning;
  const retention = totalSrs > 0 ? Math.round((known / totalSrs) * 100) : 0;

  const elVocab = document.getElementById("statVocabHealth");
  if (elVocab) elVocab.textContent = `${retention}%`;
  const elVocabSub = document.getElementById("statVocabSub");
  if (elVocabSub)
    elVocabSub.textContent = `Known: ${known} | Learning: ${learning}`;

  const quizScores = load("dt_quiz_history", []);
  let totalScore = 0,
    totalMax = 0;
  quizScores.forEach((q) => {
    totalScore += q.score;
    totalMax += q.max;
  });
  const accuracy = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;

  const elQuiz = document.getElementById("statQuizAcc");
  if (elQuiz) elQuiz.textContent = `${accuracy}%`;
  const elQuizSub = document.getElementById("statQuizSub");
  if (elQuizSub)
    elQuizSub.textContent = `${quizScores.length} total quizzes taken`;

  const vocabScore = Math.min(100, Math.round((vocab.length / 500) * 100));
  const grammarScore = Math.min(
    100,
    Math.round(((diaryEntries.length * 3) / 100) * 100)
  );
  const writingScore = Math.min(
    100,
    Math.round((diaryEntries.length / 50) * 100)
  );
  const totalReadiness = Math.round(
    (vocabScore + grammarScore + writingScore) / 3
  );

  const rEl = document.getElementById("readinessScore");
  if (rEl) rEl.textContent = `${totalReadiness}%`;

  const pbV = document.getElementById("pbVocab");
  if (pbV) pbV.style.width = `${vocabScore}%`;
  const pctV = document.getElementById("pctVocab");
  if (pctV) pctV.textContent = `${vocabScore}%`;

  const pbG = document.getElementById("pbGrammar");
  if (pbG) pbG.style.width = `${grammarScore}%`;
  const pctG = document.getElementById("pctGrammar");
  if (pctG) pctG.textContent = `${grammarScore}%`;

  const pbW = document.getElementById("pbWriting");
  if (pbW) pbW.style.width = `${writingScore}%`;
  const pctW = document.getElementById("pctWriting");
  if (pctW) pctW.textContent = `${writingScore}%`;

  const gList = document.getElementById("grammarUnlocksList");
  if (gList) {
    const levels = [
      {
        name: "A1 (Beginner)",
        desc: "Articles, Present Tense",
        reqV: 0,
        reqD: 0,
      },
      {
        name: "A2 (Elementary)",
        desc: "Perfect Tense, Modals",
        reqV: 50,
        reqD: 5,
      },
      {
        name: "B1 (Intermediate)",
        desc: "Subordinate Clauses, weil/dass",
        reqV: 150,
        reqD: 20,
      },
      {
        name: "B2 (Fluent)",
        desc: "Konjunktiv II, Passive Voice",
        reqV: 400,
        reqD: 50,
      },
    ];
    gList.innerHTML = levels
      .map((lv) => {
        const isUnlocked =
          vocab.length >= lv.reqV && diaryEntries.length >= lv.reqD;
        const progressStr = !isUnlocked
          ? `<div style="font-size:0.75rem; color:var(--accent); margin-top:4px;">Need: ${Math.max(
              0,
              lv.reqV - vocab.length
            )} words, ${Math.max(
              0,
              lv.reqD - diaryEntries.length
            )} diaries</div>`
          : "";
        return `
      <div style="padding:10px 12px; background:${
        isUnlocked ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.02)"
      }; border:1px solid ${
          isUnlocked ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"
        }; border-radius:8px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="font-weight:700; color:var(--text);">${
            isUnlocked ? "✅" : "🔒"
          } ${lv.name}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${
            isUnlocked ? "Unlocked" : "Locked"
          }</div>
        </div>
        <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">${
          lv.desc
        }</div>
        ${progressStr}
      </div>`;
      })
      .join("");
  }
}

function forceGrammarTipRender() {
  const fallbackTips = [
    {
      rule: "Articles: der / die / das",
      example: "der Mann (the man), die Frau (the woman), das Kind (the child)",
    },
    {
      rule: "Present tense: regular verbs",
      example: "lernen -> ich lerne, du lernst, er lernt",
    },
    {
      rule: "Negation with 'nicht'",
      example: "Ich arbeite nicht. (I don't work.)",
    },
  ];
  const tipPool =
    typeof appState !== "undefined" &&
    appState.grammar_pool &&
    appState.grammar_pool.length > 0
      ? appState.grammar_pool
      : typeof GRAMMAR_TIPS !== "undefined"
      ? GRAMMAR_TIPS
      : fallbackTips;

  const tip = tipPool[new Date().getDate() % tipPool.length];

  const tr = document.getElementById("dashTipRule");
  if (tr) tr.textContent = tip.rule || tip.text || "Grammar Tip";
  const te = document.getElementById("dashTipExample");
  if (te) te.textContent = tip.example || tip.hint || "Keep practicing!";
}

// 5. Override Render Engine safely!
var fallbackDashRender = renderDashboard;
renderDashboard = function () {
  try {
    fallbackDashRender();
  } catch (e) {}

  try {
    generateDailyMission();
  } catch (e) {
    console.error("Mission failed", e);
  }
  try {
    updateDashboardStats();
  } catch (e) {
    console.error("Stats failed", e);
  }
  try {
    forceGrammarTipRender();
  } catch (e) {
    console.error("Tip failed", e);
  }
};

setTimeout(() => {
  if (localStorage.getItem("dt_gemini_key")) {
    const aiBox = document.getElementById("aiKeyInput");
    if (aiBox) aiBox.value = "********";
  }
}, 500);

// ==========================================
// 🔍 PHASE 7: LOCAL GRAMMAR HEURISTICS ENGINE
// ==========================================

function analyzeGrammar() {
  const t1 = document.getElementById("prompt1").value.trim();
  const t2 = document.getElementById("prompt2").value.trim();
  const t3 = document.getElementById("prompt3").value.trim();
  const t4 = document.getElementById("prompt4").value.trim();
  const t5 = document.getElementById("prompt5").value.trim();

  const allText = [t1, t2, t3, t4, t5].filter(Boolean).join(" ");
  const panel = document.getElementById("grammarAnalysisResult");

  if (!allText) {
    alert("Please write something in your diary first!");
    return;
  }

  panel.style.display = "block";
  let html = `<h4 style="margin-top:0; color:var(--accent); display:flex; align-items:center; gap:8px;">🔍 Instant Grammar Analysis</h4>
              <ul style="padding-left:20px; margin-bottom:0; display:flex; flex-direction:column; gap:10px; font-size:0.95rem;">`;

  let issues = 0;

  // 1. Subordinate Clauses (verb-at-end check)
  const subClauses = allText.match(/\b(weil|dass|wenn)\b([^.,!?]+)/gi);
  if (subClauses) {
    subClauses.forEach((clause) => {
      const words = clause.trim().split(" ");
      const lastWord = words[words.length - 1].toLowerCase();
      // Basic check: German verbs often end in -en, -t, or -e.
      if (
        !lastWord.endsWith("en") &&
        !lastWord.endsWith("t") &&
        !lastWord.endsWith("e")
      ) {
        html += `<li>⚠️ Check your verb placement after <b>${words[0]}</b>! In German, the verb must go to the very end of the sentence. (e.g., <i>weil ich müde <b>bin</b></i>)</li>`;
        issues++;
      } else {
        html += `<li>✅ Great job using <b>${words[0]}</b> and sending the verb to the end!</li>`;
      }
    });
  }

  // 2. English words detected
  const englishBlacklist = [
    "and",
    "but",
    "because",
    "the",
    "is",
    "you",
    "my",
    "with",
    "work",
    "job",
    "good",
    "bad",
    "today",
    "tomorrow",
    "very",
  ];
  const words = allText.replace(/[.,!?]/g, "").split(/\s+/);
  const foundEnglish = words.filter((w) =>
    englishBlacklist.includes(w.toLowerCase())
  );
  if (foundEnglish.length > 0) {
    const unique = [...new Set(foundEnglish)];
    html += `<li>⚠️ Possible English words detected: <b>${unique.join(
      ", "
    )}</b>. Try to find the German equivalent!</li>`;
    issues++;
  }

  // 3. Sentences under 6 words
  const sentences = allText.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const shortSentences = sentences.filter(
    (s) => s.trim().split(/\s+/).length < 6
  );
  if (shortSentences.length > 2) {
    html += `<li>⚠️ You have several very short sentences. Try combining them using <i>und</i>, <i>aber</i>, or <i>weil</i> to sound more fluent!</li>`;
    issues++;
  }

  // 4. Missing Umlauts
  if (!/[äöüßÄÖÜ]/.test(allText) && allText.length > 50) {
    html += `<li>ℹ️ No umlauts (ä, ö, ü) or ß detected. Make sure you are spelling words correctly!</li>`;
  }

  // 5. Positive reinforcement for Perfekt tense
  if (
    /\b(habe|hast|hat|haben|habt)\b\s+.*\b(ge[a-z]+t|ge[a-z]+en)\b/i.test(
      allText
    ) ||
    /\b(bin|bist|ist|sind|seid)\b\s+.*\b(ge[a-z]+t|ge[a-z]+en|worden)\b/i.test(
      allText
    )
  ) {
    html += `<li>✅ Perfect! You successfully used the past tense (Perfekt) to describe what you did!</li>`;
  }

  if (issues === 0) {
    html += `<li>🌟 <b>Fantastic writing!</b> No major basic errors detected. Keep practicing!</li>`;
  }

  html += `</ul>`;
  panel.innerHTML = html;
}
