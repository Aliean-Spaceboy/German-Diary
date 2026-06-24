
// ─── DATA ─────────────────────────────────────────────────────────────────────
const GRAMMAR_TIPS = [
  { rule: "Articles: der / die / das", example: "der Mann (the man), die Frau (the woman), das Kind (the child)" },
  { rule: "Verb conjugation: sein (to be)", example: "Ich bin, Du bist, Er/Sie ist, Wir sind, Sie sind" },
  { rule: "Present tense: regular verbs", example: "lernen → ich lerne, du lernst, er lernt (I learn, you learn, he learns)" },
  { rule: "Negation with 'nicht'", example: "Ich arbeite nicht. (I don't work.) Sie kommt nicht. (She doesn't come.)" },
  { rule: "Perfect tense with 'haben'", example: "Ich habe gelernt. (I have learned.) Er hat gearbeitet. (He has worked.)" },
  { rule: "Perfect tense with 'sein'", example: "Ich bin gegangen. (I have gone.) Sie ist gefahren. (She has driven.)" },
  { rule: "Modal verbs: können / müssen / wollen", example: "Ich kann Deutsch sprechen. (I can speak German.)" },
  { rule: "Future tense with 'werden'", example: "Ich werde morgen lernen. (I will learn tomorrow.)" },
  { rule: "Accusative case: den/einen", example: "Ich sehe den Mann. (I see the man.) — Mann becomes den in accusative." },
  { rule: "Dative case: dem/einem", example: "Ich helfe dem Mann. (I help the man.) — Mann takes dem in dative." },
  { rule: "Word order: verb always second", example: "Heute lerne ich Deutsch. (Today I learn German.) — verb stays 2nd." },
  { rule: "Separable verbs: anfangen, aufhören", example: "Ich fange an. (I begin.) Er hört auf. (He stops.)" },
  { rule: "Conjunction: weil (because) — verb last", example: "Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte." },
  { rule: "Possessive pronouns: mein/meine", example: "mein Laptop (my laptop), meine Arbeit (my work)" },
  { rule: "Comparative: schneller, besser", example: "Ich spreche schneller als vorher. (I speak faster than before.)" },
  { rule: "Reflexive verbs: sich freuen, sich vorstellen", example: "Ich freue mich. (I am happy.) Ich stelle mich vor. (I introduce myself.)" },
  { rule: "Subordinate clauses with 'dass'", example: "Ich weiß, dass du Deutsch lernst. (I know that you learn German.)" },
  { rule: "Passive voice: werden + Partizip II", example: "Die App wird entwickelt. (The app is being developed.)" },
  { rule: "Konjunktiv II: würde + Infinitiv", example: "Ich würde gerne in Deutschland arbeiten. (I would like to work in Germany.)" },
  { rule: "Two-way prepositions: in, auf, an, etc.", example: "in + Dative (location): Ich bin in der Schule. / in + Accusative (movement): Ich gehe in die Schule." }
];

const SPEAKING_TOPICS = [
  { title: "Mein Beruf (My Job)", icon: "💼", hints: ["Ich bin Softwareentwickler", "Ich arbeite mit Java", "Meine Aufgaben sind...", "Ich arbeite von zu Hause"] },
  { title: "Mein Alltag (My Daily Routine)", icon: "🌅", hints: ["Ich stehe um ... Uhr auf", "Ich frühstücke um...", "Am Abend lerne ich..."] },
  { title: "Warum Deutschland? (Why Germany?)", icon: "🇩🇪", hints: ["Ich möchte in Deutschland arbeiten, weil...", "Die Technologiebranche in Deutschland...", "Mein Ziel ist..."] },
  { title: "Meine Familie (My Family)", icon: "👨‍👩‍👧", hints: ["Ich habe...", "Meine Mutter ist...", "Wir wohnen in..."] },
  { title: "Meine Hobbys (My Hobbies)", icon: "🎮", hints: ["In meiner Freizeit...", "Ich lese gerne...", "Ich lerne gerne..."] },
  { title: "Technologie (Technology)", icon: "💻", hints: ["Ich arbeite mit Spring Boot", "Docker hilft bei der Bereitstellung", "Kubernetes orchestriert Container"] },
];

const STARTER_PHRASES = [
  "Heute habe ich ", "Ich habe gelernt, dass ", "Ich bin müde, aber ", "Morgen werde ich ",
  "Ich arbeite an ", "Es war interessant, weil ", "Ich bin froh, dass ", "Ich habe Probleme mit "
];

// ─── STORAGE ──────────────────────────────────────────────────────────────────
function load(key, def) { try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch { return def; } }
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

let diaryEntries = load('dt_entries', []);
const DEFAULT_VOCAB = [
  { de: 'wie', en: 'as', level: 0, nextReview: Date.now() },
  { de: 'ich', en: 'I', level: 0, nextReview: Date.now() },
  { de: 'seine', en: 'his', level: 0, nextReview: Date.now() },
  { de: 'dass', en: 'that', level: 0, nextReview: Date.now() },
  { de: 'er', en: 'he', level: 0, nextReview: Date.now() },
  { de: 'war', en: 'was', level: 0, nextReview: Date.now() },
  { de: 'für', en: 'for', level: 0, nextReview: Date.now() },
  { de: 'auf', en: 'on', level: 0, nextReview: Date.now() },
  { de: 'sind', en: 'are', level: 0, nextReview: Date.now() },
  { de: 'mit', en: 'with', level: 0, nextReview: Date.now() },
  { de: 'sie', en: 'they', level: 0, nextReview: Date.now() },
  { de: 'sein', en: 'be', level: 0, nextReview: Date.now() },
  { de: 'bei', en: 'at', level: 0, nextReview: Date.now() },
  { de: 'ein', en: 'one', level: 0, nextReview: Date.now() },
  { de: 'haben', en: 'have', level: 0, nextReview: Date.now() },
  { de: 'dies', en: 'this', level: 0, nextReview: Date.now() },
  { de: 'aus', en: 'from', level: 0, nextReview: Date.now() },
  { de: 'durch', en: 'by', level: 0, nextReview: Date.now() },
  { de: 'heiß', en: 'hot', level: 0, nextReview: Date.now() },
  { de: 'Wort', en: 'word', level: 0, nextReview: Date.now() },
  { de: 'aber', en: 'but', level: 0, nextReview: Date.now() },
  { de: 'was', en: 'what', level: 0, nextReview: Date.now() },
  { de: 'einige', en: 'some', level: 0, nextReview: Date.now() },
  { de: 'ist', en: 'is', level: 0, nextReview: Date.now() },
  { de: 'es', en: 'it', level: 0, nextReview: Date.now() },
  { de: 'Sie', en: 'you', level: 0, nextReview: Date.now() },
  { de: 'oder', en: 'or', level: 0, nextReview: Date.now() },
  { de: 'hatte', en: 'had', level: 0, nextReview: Date.now() },
  { de: 'die', en: 'the', level: 0, nextReview: Date.now() },
  { de: 'von', en: 'of', level: 0, nextReview: Date.now() },
  { de: 'zu', en: 'to', level: 0, nextReview: Date.now() },
  { de: 'und', en: 'and', level: 0, nextReview: Date.now() },
  { de: 'ein', en: 'a', level: 0, nextReview: Date.now() },
  { de: 'bei', en: 'in', level: 0, nextReview: Date.now() },
  { de: 'wir', en: 'we', level: 0, nextReview: Date.now() },
  { de: 'können', en: 'can', level: 0, nextReview: Date.now() },
  { de: 'aus', en: 'out', level: 0, nextReview: Date.now() },
  { de: 'andere', en: 'other', level: 0, nextReview: Date.now() },
  { de: 'waren', en: 'were', level: 0, nextReview: Date.now() },
  { de: 'die', en: 'which', level: 0, nextReview: Date.now() },
  { de: 'tun', en: 'do', level: 0, nextReview: Date.now() },
  { de: 'ihre', en: 'their', level: 0, nextReview: Date.now() },
  { de: 'Zeit', en: 'time', level: 0, nextReview: Date.now() },
  { de: 'wenn', en: 'if', level: 0, nextReview: Date.now() },
  { de: 'werden', en: 'will', level: 0, nextReview: Date.now() },
  { de: 'wie', en: 'how', level: 0, nextReview: Date.now() },
  { de: 'sagte', en: 'said', level: 0, nextReview: Date.now() },
  { de: 'ein', en: 'an', level: 0, nextReview: Date.now() },
  { de: 'jeder', en: 'each', level: 0, nextReview: Date.now() },
  { de: 'sagen', en: 'tell', level: 0, nextReview: Date.now() },
  { de: 'tut', en: 'does', level: 0, nextReview: Date.now() },
  { de: 'Satz', en: 'set', level: 0, nextReview: Date.now() },
  { de: 'drei', en: 'three', level: 0, nextReview: Date.now() },
  { de: 'wollen', en: 'want', level: 0, nextReview: Date.now() },
  { de: 'Luft', en: 'air', level: 0, nextReview: Date.now() },
  { de: 'gut', en: 'well', level: 0, nextReview: Date.now() },
  { de: 'auch', en: 'also', level: 0, nextReview: Date.now() },
  { de: 'spielen', en: 'play', level: 0, nextReview: Date.now() },
  { de: 'klein', en: 'small', level: 0, nextReview: Date.now() },
  { de: 'Ende', en: 'end', level: 0, nextReview: Date.now() },
  { de: 'setzen', en: 'put', level: 0, nextReview: Date.now() },
  { de: 'Zuhause', en: 'home', level: 0, nextReview: Date.now() },
  { de: 'lesen', en: 'read', level: 0, nextReview: Date.now() },
  { de: 'seits', en: 'hand', level: 0, nextReview: Date.now() },
  { de: 'Hafen', en: 'port', level: 0, nextReview: Date.now() },
  { de: 'groß', en: 'large', level: 0, nextReview: Date.now() },
  { de: 'buchstabieren', en: 'spell', level: 0, nextReview: Date.now() },
  { de: 'hinzufügen', en: 'add', level: 0, nextReview: Date.now() },
  { de: 'auch', en: 'even', level: 0, nextReview: Date.now() },
  { de: 'Lande', en: 'land', level: 0, nextReview: Date.now() },
  { de: 'hier', en: 'here', level: 0, nextReview: Date.now() },
  { de: 'muss', en: 'must', level: 0, nextReview: Date.now() },
  { de: 'groß', en: 'big', level: 0, nextReview: Date.now() },
  { de: 'hoch', en: 'high', level: 0, nextReview: Date.now() },
  { de: 'so', en: 'such', level: 0, nextReview: Date.now() },
  { de: 'folgen', en: 'follow', level: 0, nextReview: Date.now() },
  { de: 'Akt', en: 'act', level: 0, nextReview: Date.now() },
  { de: 'warum', en: 'why', level: 0, nextReview: Date.now() },
  { de: 'fragen', en: 'ask', level: 0, nextReview: Date.now() },
  { de: 'Männer', en: 'men', level: 0, nextReview: Date.now() },
  { de: 'Veränderung', en: 'change', level: 0, nextReview: Date.now() },
  { de: 'ging', en: 'went', level: 0, nextReview: Date.now() },
  { de: 'Licht', en: 'light', level: 0, nextReview: Date.now() },
  { de: 'Art', en: 'kind', level: 0, nextReview: Date.now() },
  { de: 'aus', en: 'off', level: 0, nextReview: Date.now() },
  { de: 'müssen', en: 'need', level: 0, nextReview: Date.now() },
  { de: 'Haus', en: 'house', level: 0, nextReview: Date.now() },
  { de: 'Bild', en: 'picture', level: 0, nextReview: Date.now() },
  { de: 'versuchen', en: 'try', level: 0, nextReview: Date.now() },
  { de: 'uns', en: 'us', level: 0, nextReview: Date.now() },
  { de: 'wieder', en: 'again', level: 0, nextReview: Date.now() },
  { de: 'Tier', en: 'animal', level: 0, nextReview: Date.now() },
  { de: 'Punkt', en: 'point', level: 0, nextReview: Date.now() },
  { de: 'Mutter', en: 'mother', level: 0, nextReview: Date.now() },
  { de: 'Welt', en: 'world', level: 0, nextReview: Date.now() },
  { de: 'in der Nähe von', en: 'near', level: 0, nextReview: Date.now() },
  { de: 'bauen', en: 'build', level: 0, nextReview: Date.now() },
  { de: 'selbst', en: 'self', level: 0, nextReview: Date.now() },
  { de: 'Erde', en: 'earth', level: 0, nextReview: Date.now() },
  { de: 'Vater', en: 'father', level: 0, nextReview: Date.now() },
  { de: 'jeder', en: 'any', level: 0, nextReview: Date.now() },
  { de: 'neu', en: 'new', level: 0, nextReview: Date.now() },
  { de: 'Arbeit', en: 'work', level: 0, nextReview: Date.now() },
  { de: 'Teil', en: 'part', level: 0, nextReview: Date.now() },
  { de: 'nehmen', en: 'take', level: 0, nextReview: Date.now() },
  { de: 'erhalten', en: 'get', level: 0, nextReview: Date.now() },
  { de: 'Ort', en: 'place', level: 0, nextReview: Date.now() },
  { de: 'gemacht', en: 'made', level: 0, nextReview: Date.now() },
  { de: 'leben', en: 'live', level: 0, nextReview: Date.now() },
  { de: 'wo', en: 'where', level: 0, nextReview: Date.now() },
  { de: 'nach', en: 'after', level: 0, nextReview: Date.now() },
  { de: 'zurück', en: 'back', level: 0, nextReview: Date.now() },
  { de: 'wenig', en: 'little', level: 0, nextReview: Date.now() },
  { de: 'nur', en: 'only', level: 0, nextReview: Date.now() },
  { de: 'Runde', en: 'round', level: 0, nextReview: Date.now() },
  { de: 'Mann', en: 'man', level: 0, nextReview: Date.now() },
  { de: 'Jahr', en: 'year', level: 0, nextReview: Date.now() },
  { de: 'kam', en: 'came', level: 0, nextReview: Date.now() },
  { de: 'zeigen', en: 'show', level: 0, nextReview: Date.now() },
  { de: 'jeder', en: 'every', level: 0, nextReview: Date.now() },
  { de: 'gut', en: 'good', level: 0, nextReview: Date.now() },
  { de: 'mir', en: 'me', level: 0, nextReview: Date.now() },
  { de: 'geben', en: 'give', level: 0, nextReview: Date.now() },
  { de: 'unsere', en: 'our', level: 0, nextReview: Date.now() },
  { de: 'unter', en: 'under', level: 0, nextReview: Date.now() },
  { de: 'Name', en: 'name', level: 0, nextReview: Date.now() },
  { de: 'sehr', en: 'very', level: 0, nextReview: Date.now() },
  { de: 'durch', en: 'through', level: 0, nextReview: Date.now() },
  { de: 'nur', en: 'just', level: 0, nextReview: Date.now() },
  { de: 'Formular', en: 'form', level: 0, nextReview: Date.now() },
  { de: 'Satz', en: 'sentence', level: 0, nextReview: Date.now() },
  { de: 'groß', en: 'great', level: 0, nextReview: Date.now() },
  { de: 'denken', en: 'think', level: 0, nextReview: Date.now() },
  { de: 'sagen', en: 'say', level: 0, nextReview: Date.now() },
  { de: 'Hilfe', en: 'help', level: 0, nextReview: Date.now() },
  { de: 'niedrig', en: 'low', level: 0, nextReview: Date.now() },
  { de: 'Linie', en: 'line', level: 0, nextReview: Date.now() },
  { de: 'abweichen', en: 'differ', level: 0, nextReview: Date.now() },
  { de: 'wiederum', en: 'turn', level: 0, nextReview: Date.now() },
  { de: 'Ursache', en: 'cause', level: 0, nextReview: Date.now() },
  { de: 'viel', en: 'much', level: 0, nextReview: Date.now() },
  { de: 'bedeuten', en: 'mean', level: 0, nextReview: Date.now() },
  { de: 'vor', en: 'before', level: 0, nextReview: Date.now() },
  { de: 'Umzug', en: 'move', level: 0, nextReview: Date.now() },
  { de: 'Recht', en: 'right', level: 0, nextReview: Date.now() },
  { de: 'Junge', en: 'boy', level: 0, nextReview: Date.now() },
  { de: 'alt', en: 'old', level: 0, nextReview: Date.now() },
  { de: 'zu', en: 'too', level: 0, nextReview: Date.now() },
  { de: 'gleich', en: 'same', level: 0, nextReview: Date.now() },
  { de: 'sie', en: 'she', level: 0, nextReview: Date.now() },
  { de: 'alle', en: 'all', level: 0, nextReview: Date.now() },
  { de: 'da', en: 'there', level: 0, nextReview: Date.now() },
  { de: 'wenn', en: 'when', level: 0, nextReview: Date.now() },
  { de: 'nach oben', en: 'up', level: 0, nextReview: Date.now() },
  { de: 'Verwendung', en: 'use', level: 0, nextReview: Date.now() },
  { de: 'Ihre', en: 'your', level: 0, nextReview: Date.now() },
  { de: 'Weg', en: 'way', level: 0, nextReview: Date.now() },
  { de: 'über', en: 'about', level: 0, nextReview: Date.now() },
  { de: 'viele', en: 'many', level: 0, nextReview: Date.now() },
  { de: 'dann', en: 'then', level: 0, nextReview: Date.now() },
  { de: 'sie', en: 'them', level: 0, nextReview: Date.now() },
  { de: 'schreiben', en: 'write', level: 0, nextReview: Date.now() },
  { de: 'würde', en: 'would', level: 0, nextReview: Date.now() },
  { de: 'wie', en: 'like', level: 0, nextReview: Date.now() },
  { de: 'so', en: 'so', level: 0, nextReview: Date.now() },
  { de: 'diese', en: 'these', level: 0, nextReview: Date.now() },
  { de: 'sie', en: 'her', level: 0, nextReview: Date.now() },
  { de: 'lange', en: 'long', level: 0, nextReview: Date.now() },
  { de: 'machen', en: 'make', level: 0, nextReview: Date.now() },
  { de: 'Sache', en: 'thing', level: 0, nextReview: Date.now() },
  { de: 'sehen', en: 'see', level: 0, nextReview: Date.now() },
  { de: 'ihm', en: 'him', level: 0, nextReview: Date.now() },
  { de: 'zwei', en: 'two', level: 0, nextReview: Date.now() },
  { de: 'hat', en: 'has', level: 0, nextReview: Date.now() },
  { de: 'suchen', en: 'look', level: 0, nextReview: Date.now() },
  { de: 'mehr', en: 'more', level: 0, nextReview: Date.now() },
  { de: 'Tag', en: 'day', level: 0, nextReview: Date.now() },
  { de: 'könnte', en: 'could', level: 0, nextReview: Date.now() },
  { de: 'gehen', en: 'go', level: 0, nextReview: Date.now() },
  { de: 'kommen', en: 'come', level: 0, nextReview: Date.now() },
  { de: 'tat', en: 'did', level: 0, nextReview: Date.now() },
  { de: 'Anzahl', en: 'number', level: 0, nextReview: Date.now() },
  { de: 'klingen', en: 'sound', level: 0, nextReview: Date.now() },
  { de: 'nicht', en: 'no', level: 0, nextReview: Date.now() },
  { de: 'am meisten', en: 'most', level: 0, nextReview: Date.now() },
  { de: 'Menschen', en: 'people', level: 0, nextReview: Date.now() },
  { de: 'meine', en: 'my', level: 0, nextReview: Date.now() },
  { de: 'über', en: 'over', level: 0, nextReview: Date.now() },
  { de: 'wissen', en: 'know', level: 0, nextReview: Date.now() },
  { de: 'Wasser', en: 'water', level: 0, nextReview: Date.now() },
  { de: 'als', en: 'than', level: 0, nextReview: Date.now() },
  { de: 'Anruf', en: 'call', level: 0, nextReview: Date.now() },
  { de: 'erste', en: 'first', level: 0, nextReview: Date.now() },
  { de: 'die', en: 'who', level: 0, nextReview: Date.now() },
  { de: 'können', en: 'may', level: 0, nextReview: Date.now() },
  { de: 'nach unten', en: 'down', level: 0, nextReview: Date.now() },
  { de: 'Seite', en: 'side', level: 0, nextReview: Date.now() },
  { de: 'gewesen', en: 'been', level: 0, nextReview: Date.now() },
  { de: 'jetzt', en: 'now', level: 0, nextReview: Date.now() },
  { de: 'finden', en: 'find', level: 0, nextReview: Date.now() },
  { de: 'Kopf', en: 'head', level: 0, nextReview: Date.now() },
  { de: 'stehen', en: 'stand', level: 0, nextReview: Date.now() },
  { de: 'besitzen', en: 'own', level: 0, nextReview: Date.now() },
  { de: 'Seite', en: 'page', level: 0, nextReview: Date.now() },
  { de: 'sollte', en: 'should', level: 0, nextReview: Date.now() },
  { de: 'Land', en: 'country', level: 0, nextReview: Date.now() },
  { de: 'gefunden', en: 'found', level: 0, nextReview: Date.now() },
  { de: 'Antwort', en: 'answer', level: 0, nextReview: Date.now() },
  { de: 'Schule', en: 'school', level: 0, nextReview: Date.now() },
  { de: 'wachsen', en: 'grow', level: 0, nextReview: Date.now() },
  { de: 'Studie', en: 'study', level: 0, nextReview: Date.now() },
  { de: 'noch', en: 'still', level: 0, nextReview: Date.now() },
  { de: 'lernen', en: 'learn', level: 0, nextReview: Date.now() },
  { de: 'Anlage', en: 'plant', level: 0, nextReview: Date.now() },
  { de: 'Abdeckung', en: 'cover', level: 0, nextReview: Date.now() },
  { de: 'Lebensmittel', en: 'food', level: 0, nextReview: Date.now() },
  { de: 'Sonne', en: 'sun', level: 0, nextReview: Date.now() },
  { de: 'vier', en: 'four', level: 0, nextReview: Date.now() },
  { de: 'zwischen', en: 'between', level: 0, nextReview: Date.now() },
  { de: 'Zustand', en: 'state', level: 0, nextReview: Date.now() },
  { de: 'halten', en: 'keep', level: 0, nextReview: Date.now() },
  { de: 'Auge', en: 'eye', level: 0, nextReview: Date.now() },
  { de: 'nie', en: 'never', level: 0, nextReview: Date.now() },
  { de: 'letzte', en: 'last', level: 0, nextReview: Date.now() },
  { de: 'lassen', en: 'let', level: 0, nextReview: Date.now() },
  { de: 'Gedanken', en: 'thought', level: 0, nextReview: Date.now() },
  { de: 'Stadt', en: 'city', level: 0, nextReview: Date.now() },
  { de: 'Baum', en: 'tree', level: 0, nextReview: Date.now() },
  { de: 'überqueren', en: 'cross', level: 0, nextReview: Date.now() },
  { de: 'Bauernhof', en: 'farm', level: 0, nextReview: Date.now() },
  { de: 'schwer', en: 'hard', level: 0, nextReview: Date.now() },
  { de: 'Beginn', en: 'start', level: 0, nextReview: Date.now() },
  { de: 'Macht', en: 'might', level: 0, nextReview: Date.now() },
  { de: 'Geschichte', en: 'story', level: 0, nextReview: Date.now() },
  { de: 'Säge', en: 'saw', level: 0, nextReview: Date.now() },
  { de: 'weit', en: 'far', level: 0, nextReview: Date.now() },
  { de: 'Meer', en: 'sea', level: 0, nextReview: Date.now() },
  { de: 'ziehen', en: 'draw', level: 0, nextReview: Date.now() },
  { de: 'links', en: 'left', level: 0, nextReview: Date.now() },
  { de: 'spät', en: 'late', level: 0, nextReview: Date.now() },
  { de: 'laufen', en: 'run', level: 0, nextReview: Date.now() },
  { de: 'unterlassen Sie', en: 'don’t', level: 0, nextReview: Date.now() },
  { de: 'während', en: 'while', level: 0, nextReview: Date.now() },
  { de: 'Presse', en: 'press', level: 0, nextReview: Date.now() },
  { de: 'Schließen', en: 'close', level: 0, nextReview: Date.now() },
  { de: 'Nacht', en: 'night', level: 0, nextReview: Date.now() },
  { de: 'realen', en: 'real', level: 0, nextReview: Date.now() },
  { de: 'Leben', en: 'life', level: 0, nextReview: Date.now() },
  { de: 'wenige', en: 'few', level: 0, nextReview: Date.now() },
  { de: 'Norden', en: 'north', level: 0, nextReview: Date.now() },
  { de: 'Buch', en: 'book', level: 0, nextReview: Date.now() },
  { de: 'tragen', en: 'carry', level: 0, nextReview: Date.now() },
  { de: 'nahm', en: 'took', level: 0, nextReview: Date.now() },
  { de: 'Wissenschaft', en: 'science', level: 0, nextReview: Date.now() },
  { de: 'essen', en: 'eat', level: 0, nextReview: Date.now() },
  { de: 'Zimmer', en: 'room', level: 0, nextReview: Date.now() },
  { de: 'Freund', en: 'friend', level: 0, nextReview: Date.now() },
  { de: 'begann', en: 'began', level: 0, nextReview: Date.now() },
  { de: 'Idee', en: 'idea', level: 0, nextReview: Date.now() },
  { de: 'Fisch', en: 'fish', level: 0, nextReview: Date.now() },
  { de: 'berg', en: 'mountain', level: 0, nextReview: Date.now() },
  { de: 'Stopp', en: 'stop', level: 0, nextReview: Date.now() },
  { de: 'einmal', en: 'once', level: 0, nextReview: Date.now() },
  { de: 'Basis', en: 'base', level: 0, nextReview: Date.now() },
  { de: 'hören', en: 'hear', level: 0, nextReview: Date.now() },
  { de: 'Pferd', en: 'horse', level: 0, nextReview: Date.now() },
  { de: 'Schnitt', en: 'cut', level: 0, nextReview: Date.now() },
  { de: 'sicher', en: 'sure', level: 0, nextReview: Date.now() },
  { de: 'beobachten', en: 'watch', level: 0, nextReview: Date.now() },
  { de: 'Farbe', en: 'color', level: 0, nextReview: Date.now() },
  { de: 'Gesicht', en: 'face', level: 0, nextReview: Date.now() },
  { de: 'Holz', en: 'wood', level: 0, nextReview: Date.now() },
  { de: 'Haupt-', en: 'main', level: 0, nextReview: Date.now() },
  { de: 'geöffnet', en: 'open', level: 0, nextReview: Date.now() },
  { de: 'scheinen', en: 'seem', level: 0, nextReview: Date.now() },
  { de: 'zusammen', en: 'together', level: 0, nextReview: Date.now() },
  { de: 'nächste', en: 'next', level: 0, nextReview: Date.now() },
  { de: 'weiß', en: 'white', level: 0, nextReview: Date.now() },
  { de: 'Kinder', en: 'children', level: 0, nextReview: Date.now() },
  { de: 'Start', en: 'begin', level: 0, nextReview: Date.now() },
  { de: 'bekam', en: 'got', level: 0, nextReview: Date.now() },
  { de: 'gehen', en: 'walk', level: 0, nextReview: Date.now() },
  { de: 'Beispiel', en: 'example', level: 0, nextReview: Date.now() },
  { de: 'erleichtern', en: 'ease', level: 0, nextReview: Date.now() },
  { de: 'Papier', en: 'paper', level: 0, nextReview: Date.now() },
  { de: 'Gruppe', en: 'group', level: 0, nextReview: Date.now() },
  { de: 'immer', en: 'always', level: 0, nextReview: Date.now() },
  { de: 'Musik', en: 'music', level: 0, nextReview: Date.now() },
  { de: 'diejenigen', en: 'those', level: 0, nextReview: Date.now() },
  { de: 'beide', en: 'both', level: 0, nextReview: Date.now() },
  { de: 'Marke', en: 'mark', level: 0, nextReview: Date.now() },
  { de: 'oft', en: 'often', level: 0, nextReview: Date.now() },
  { de: 'Schreiben', en: 'letter', level: 0, nextReview: Date.now() },
  { de: 'bis', en: 'until', level: 0, nextReview: Date.now() },
  { de: 'Meile', en: 'mile', level: 0, nextReview: Date.now() },
  { de: 'Fluss', en: 'river', level: 0, nextReview: Date.now() },
  { de: 'Auto', en: 'car', level: 0, nextReview: Date.now() },
  { de: 'Füße', en: 'feet', level: 0, nextReview: Date.now() },
  { de: 'Pflege', en: 'care', level: 0, nextReview: Date.now() },
  { de: 'zweite', en: 'second', level: 0, nextReview: Date.now() },
  { de: 'genug', en: 'enough', level: 0, nextReview: Date.now() },
  { de: 'Ebene', en: 'plain', level: 0, nextReview: Date.now() },
  { de: 'Mädchen', en: 'girl', level: 0, nextReview: Date.now() },
  { de: 'üblich', en: 'usual', level: 0, nextReview: Date.now() },
  { de: 'jung', en: 'young', level: 0, nextReview: Date.now() },
  { de: 'bereit', en: 'ready', level: 0, nextReview: Date.now() },
  { de: 'oben', en: 'above', level: 0, nextReview: Date.now() },
  { de: 'je', en: 'ever', level: 0, nextReview: Date.now() },
  { de: 'rot', en: 'red', level: 0, nextReview: Date.now() },
  { de: 'Liste', en: 'list', level: 0, nextReview: Date.now() },
  { de: 'obwohl', en: 'though', level: 0, nextReview: Date.now() },
  { de: 'fühlen', en: 'feel', level: 0, nextReview: Date.now() },
  { de: 'Vortrag', en: 'talk', level: 0, nextReview: Date.now() },
  { de: 'Vogel', en: 'bird', level: 0, nextReview: Date.now() },
  { de: 'bald', en: 'soon', level: 0, nextReview: Date.now() },
  { de: 'Körper', en: 'body', level: 0, nextReview: Date.now() },
  { de: 'Hund', en: 'dog', level: 0, nextReview: Date.now() },
  { de: 'Familie', en: 'family', level: 0, nextReview: Date.now() },
  { de: 'direkt', en: 'direct', level: 0, nextReview: Date.now() },
  { de: 'Pose', en: 'pose', level: 0, nextReview: Date.now() },
  { de: 'verlassen', en: 'leave', level: 0, nextReview: Date.now() },
  { de: 'Lied', en: 'song', level: 0, nextReview: Date.now() },
  { de: 'messen', en: 'measure', level: 0, nextReview: Date.now() },
  { de: 'Tür', en: 'door', level: 0, nextReview: Date.now() },
  { de: 'Produkt', en: 'product', level: 0, nextReview: Date.now() },
  { de: 'schwarz', en: 'black', level: 0, nextReview: Date.now() },
  { de: 'kurz', en: 'short', level: 0, nextReview: Date.now() },
  { de: 'Zahl', en: 'numeral', level: 0, nextReview: Date.now() },
  { de: 'Klasse', en: 'class', level: 0, nextReview: Date.now() },
  { de: 'Wind', en: 'wind', level: 0, nextReview: Date.now() },
  { de: 'Frage', en: 'question', level: 0, nextReview: Date.now() },
  { de: 'passieren', en: 'happen', level: 0, nextReview: Date.now() },
  { de: 'vollständig', en: 'complete', level: 0, nextReview: Date.now() },
  { de: 'Schiff', en: 'ship', level: 0, nextReview: Date.now() },
  { de: 'Bereich', en: 'area', level: 0, nextReview: Date.now() },
  { de: 'Hälfte', en: 'half', level: 0, nextReview: Date.now() },
  { de: 'Stein', en: 'rock', level: 0, nextReview: Date.now() },
  { de: 'bestellen', en: 'order', level: 0, nextReview: Date.now() },
  { de: 'Feuer', en: 'fire', level: 0, nextReview: Date.now() },
  { de: 'Süden', en: 'south', level: 0, nextReview: Date.now() },
  { de: 'Problem', en: 'problem', level: 0, nextReview: Date.now() },
  { de: 'Stück', en: 'piece', level: 0, nextReview: Date.now() },
  { de: 'sagte', en: 'told', level: 0, nextReview: Date.now() },
  { de: 'wusste', en: 'knew', level: 0, nextReview: Date.now() },
  { de: 'passieren', en: 'pass', level: 0, nextReview: Date.now() },
  { de: 'seit', en: 'since', level: 0, nextReview: Date.now() },
  { de: 'obere', en: 'top', level: 0, nextReview: Date.now() },
  { de: 'ganze', en: 'whole', level: 0, nextReview: Date.now() },
  { de: 'König', en: 'king', level: 0, nextReview: Date.now() },
  { de: 'Straße', en: 'street', level: 0, nextReview: Date.now() },
  { de: 'Zoll', en: 'inch', level: 0, nextReview: Date.now() },
  { de: 'multiplizieren', en: 'multiply', level: 0, nextReview: Date.now() },
  { de: 'nichts', en: 'nothing', level: 0, nextReview: Date.now() },
  { de: 'Kurs', en: 'course', level: 0, nextReview: Date.now() },
  { de: 'bleiben', en: 'stay', level: 0, nextReview: Date.now() },
  { de: 'Rad', en: 'wheel', level: 0, nextReview: Date.now() },
  { de: 'voll', en: 'full', level: 0, nextReview: Date.now() },
  { de: 'Kraft', en: 'force', level: 0, nextReview: Date.now() },
  { de: 'blau', en: 'blue', level: 0, nextReview: Date.now() },
  { de: 'Objekt', en: 'object', level: 0, nextReview: Date.now() },
  { de: 'entscheiden', en: 'decide', level: 0, nextReview: Date.now() },
  { de: 'Oberfläche', en: 'surface', level: 0, nextReview: Date.now() },
  { de: 'tief', en: 'deep', level: 0, nextReview: Date.now() },
  { de: 'Mond', en: 'moon', level: 0, nextReview: Date.now() },
  { de: 'Insel', en: 'island', level: 0, nextReview: Date.now() },
  { de: 'Fuß', en: 'foot', level: 0, nextReview: Date.now() },
  { de: 'System', en: 'system', level: 0, nextReview: Date.now() },
  { de: 'beschäftigt', en: 'busy', level: 0, nextReview: Date.now() },
  { de: 'Prüfung', en: 'test', level: 0, nextReview: Date.now() },
  { de: 'Rekord', en: 'record', level: 0, nextReview: Date.now() },
  { de: 'Boot', en: 'boat', level: 0, nextReview: Date.now() },
  { de: 'gemeinsam', en: 'common', level: 0, nextReview: Date.now() },
  { de: 'goldenen', en: 'gold', level: 0, nextReview: Date.now() },
  { de: 'möglich', en: 'possible', level: 0, nextReview: Date.now() },
  { de: 'Flugzeug', en: 'plane', level: 0, nextReview: Date.now() },
  { de: 'statt', en: 'stead', level: 0, nextReview: Date.now() },
  { de: 'trocken', en: 'dry', level: 0, nextReview: Date.now() },
  { de: 'Wunder', en: 'wonder', level: 0, nextReview: Date.now() },
  { de: 'Lachen', en: 'laugh', level: 0, nextReview: Date.now() },
  { de: 'tausend', en: 'thousand', level: 0, nextReview: Date.now() },
  { de: 'vor', en: 'ago', level: 0, nextReview: Date.now() },
  { de: 'lief', en: 'ran', level: 0, nextReview: Date.now() },
  { de: 'überprüfen', en: 'check', level: 0, nextReview: Date.now() },
  { de: 'Spiel', en: 'game', level: 0, nextReview: Date.now() },
  { de: 'Form', en: 'shape', level: 0, nextReview: Date.now() },
  { de: 'gleichsetzen', en: 'equate', level: 0, nextReview: Date.now() },
  { de: 'heiß', en: 'hot', level: 0, nextReview: Date.now() },
  { de: 'Fehl', en: 'miss', level: 0, nextReview: Date.now() },
  { de: 'gebracht', en: 'brought', level: 0, nextReview: Date.now() },
  { de: 'Wärme', en: 'heat', level: 0, nextReview: Date.now() },
  { de: 'Schnee', en: 'snow', level: 0, nextReview: Date.now() },
  { de: 'Reifen', en: 'tire', level: 0, nextReview: Date.now() },
  { de: 'bringen', en: 'bring', level: 0, nextReview: Date.now() },
  { de: 'ja', en: 'yes', level: 0, nextReview: Date.now() },
  { de: 'entfernt', en: 'distant', level: 0, nextReview: Date.now() },
  { de: 'füllen', en: 'fill', level: 0, nextReview: Date.now() },
  { de: 'Osten', en: 'east', level: 0, nextReview: Date.now() },
  { de: 'malen', en: 'paint', level: 0, nextReview: Date.now() },
  { de: 'Sprache', en: 'language', level: 0, nextReview: Date.now() },
  { de: 'unter', en: 'among', level: 0, nextReview: Date.now() },
  { de: 'Einheit', en: 'unit', level: 0, nextReview: Date.now() },
  { de: 'Macht', en: 'power', level: 0, nextReview: Date.now() },
  { de: 'Stadt', en: 'town', level: 0, nextReview: Date.now() },
  { de: 'fein', en: 'fine', level: 0, nextReview: Date.now() },
  { de: 'sicher', en: 'certain', level: 0, nextReview: Date.now() },
  { de: 'fliegen', en: 'fly', level: 0, nextReview: Date.now() },
  { de: 'fallen', en: 'fall', level: 0, nextReview: Date.now() },
  { de: 'führen', en: 'lead', level: 0, nextReview: Date.now() },
  { de: 'Schrei', en: 'cry', level: 0, nextReview: Date.now() },
  { de: 'dunkel', en: 'dark', level: 0, nextReview: Date.now() },
  { de: 'Maschine', en: 'machine', level: 0, nextReview: Date.now() },
  { de: 'note', en: 'note', level: 0, nextReview: Date.now() },
  { de: 'warten', en: 'wait', level: 0, nextReview: Date.now() },
  { de: 'Plan', en: 'plan', level: 0, nextReview: Date.now() },
  { de: 'Abbildung', en: 'figure', level: 0, nextReview: Date.now() },
  { de: 'Stern', en: 'star', level: 0, nextReview: Date.now() },
  { de: 'Kasten', en: 'box', level: 0, nextReview: Date.now() },
  { de: 'Nomen', en: 'noun', level: 0, nextReview: Date.now() },
  { de: 'Feld', en: 'field', level: 0, nextReview: Date.now() },
  { de: 'Rest', en: 'rest', level: 0, nextReview: Date.now() },
  { de: 'richtig', en: 'correct', level: 0, nextReview: Date.now() },
  { de: 'fähig', en: 'able', level: 0, nextReview: Date.now() },
  { de: 'Pfund', en: 'pound', level: 0, nextReview: Date.now() },
  { de: 'getan', en: 'done', level: 0, nextReview: Date.now() },
  { de: 'Schönheit', en: 'beauty', level: 0, nextReview: Date.now() },
  { de: 'Antriebs', en: 'drive', level: 0, nextReview: Date.now() },
  { de: 'stand', en: 'stood', level: 0, nextReview: Date.now() },
  { de: 'enthalten', en: 'contain', level: 0, nextReview: Date.now() },
  { de: 'Front', en: 'front', level: 0, nextReview: Date.now() },
  { de: 'lehren', en: 'teach', level: 0, nextReview: Date.now() },
  { de: 'Woche', en: 'week', level: 0, nextReview: Date.now() },
  { de: 'Finale', en: 'final', level: 0, nextReview: Date.now() },
  { de: 'gab', en: 'gave', level: 0, nextReview: Date.now() },
  { de: 'grün', en: 'green', level: 0, nextReview: Date.now() },
  { de: 'oh', en: 'oh', level: 0, nextReview: Date.now() },
  { de: 'schnell', en: 'quick', level: 0, nextReview: Date.now() },
  { de: 'entwickeln', en: 'develop', level: 0, nextReview: Date.now() },
  { de: 'Ozean', en: 'ocean', level: 0, nextReview: Date.now() },
  { de: 'warme', en: 'warm', level: 0, nextReview: Date.now() },
  { de: 'kostenlos', en: 'free', level: 0, nextReview: Date.now() },
  { de: 'Minute', en: 'minute', level: 0, nextReview: Date.now() },
  { de: 'stark', en: 'strong', level: 0, nextReview: Date.now() },
  { de: 'besondere', en: 'special', level: 0, nextReview: Date.now() },
  { de: 'Geist', en: 'mind', level: 0, nextReview: Date.now() },
  { de: 'hinter', en: 'behind', level: 0, nextReview: Date.now() },
  { de: 'klar', en: 'clear', level: 0, nextReview: Date.now() },
  { de: 'Schwanz', en: 'tail', level: 0, nextReview: Date.now() },
  { de: 'produzieren', en: 'produce', level: 0, nextReview: Date.now() },
  { de: 'Tatsache', en: 'fact', level: 0, nextReview: Date.now() },
  { de: 'Raum', en: 'space', level: 0, nextReview: Date.now() },
  { de: 'gehört', en: 'heard', level: 0, nextReview: Date.now() },
  { de: 'beste', en: 'best', level: 0, nextReview: Date.now() },
  { de: 'Stunde', en: 'hour', level: 0, nextReview: Date.now() },
  { de: 'besser', en: 'better', level: 0, nextReview: Date.now() },
  { de: 'wahr', en: 'true', level: 0, nextReview: Date.now() },
  { de: 'während', en: 'during', level: 0, nextReview: Date.now() },
  { de: 'hundert', en: 'hundred', level: 0, nextReview: Date.now() },
  { de: 'fünf', en: 'five', level: 0, nextReview: Date.now() },
  { de: 'merken', en: 'remember', level: 0, nextReview: Date.now() },
  { de: 'Schritt', en: 'step', level: 0, nextReview: Date.now() },
  { de: 'früh', en: 'early', level: 0, nextReview: Date.now() },
  { de: 'halten', en: 'hold', level: 0, nextReview: Date.now() },
  { de: 'Westen', en: 'west', level: 0, nextReview: Date.now() },
  { de: 'Boden', en: 'ground', level: 0, nextReview: Date.now() },
  { de: 'Interesse', en: 'interest', level: 0, nextReview: Date.now() },
  { de: 'erreichen', en: 'reach', level: 0, nextReview: Date.now() },
  { de: 'schnell', en: 'fast', level: 0, nextReview: Date.now() },
  { de: 'Verbum', en: 'verb', level: 0, nextReview: Date.now() },
  { de: 'singen', en: 'sing', level: 0, nextReview: Date.now() },
  { de: 'hören', en: 'listen', level: 0, nextReview: Date.now() },
  { de: 'sechs', en: 'six', level: 0, nextReview: Date.now() },
  { de: 'Tabelle', en: 'table', level: 0, nextReview: Date.now() },
  { de: 'Reise', en: 'travel', level: 0, nextReview: Date.now() },
  { de: 'weniger', en: 'less', level: 0, nextReview: Date.now() },
  { de: 'Morgen', en: 'morning', level: 0, nextReview: Date.now() },
  { de: 'zehn', en: 'ten', level: 0, nextReview: Date.now() },
  { de: 'einfach', en: 'simple', level: 0, nextReview: Date.now() },
  { de: 'mehrere', en: 'several', level: 0, nextReview: Date.now() },
  { de: 'Vokal', en: 'vowel', level: 0, nextReview: Date.now() },
  { de: 'auf', en: 'toward', level: 0, nextReview: Date.now() },
  { de: 'Krieg', en: 'war', level: 0, nextReview: Date.now() },
  { de: 'legen', en: 'lay', level: 0, nextReview: Date.now() },
  { de: 'gegen', en: 'against', level: 0, nextReview: Date.now() },
  { de: 'Muster', en: 'pattern', level: 0, nextReview: Date.now() },
  { de: 'schleppend', en: 'slow', level: 0, nextReview: Date.now() },
  { de: 'Zentrum', en: 'center', level: 0, nextReview: Date.now() },
  { de: 'Liebe', en: 'love', level: 0, nextReview: Date.now() },
  { de: 'Person', en: 'person', level: 0, nextReview: Date.now() },
  { de: 'Geld', en: 'money', level: 0, nextReview: Date.now() },
  { de: 'dienen', en: 'serve', level: 0, nextReview: Date.now() },
  { de: 'erscheinen', en: 'appear', level: 0, nextReview: Date.now() },
  { de: 'Straße', en: 'road', level: 0, nextReview: Date.now() },
  { de: 'Karte', en: 'map', level: 0, nextReview: Date.now() },
  { de: 'regen', en: 'rain', level: 0, nextReview: Date.now() },
  { de: 'Regel', en: 'rule', level: 0, nextReview: Date.now() },
  { de: 'regieren', en: 'govern', level: 0, nextReview: Date.now() },
  { de: 'ziehen', en: 'pull', level: 0, nextReview: Date.now() },
  { de: 'Kälte', en: 'cold', level: 0, nextReview: Date.now() },
  { de: 'Hinweis', en: 'notice', level: 0, nextReview: Date.now() },
  { de: 'Stimme', en: 'voice', level: 0, nextReview: Date.now() },
  { de: 'Energie', en: 'energy', level: 0, nextReview: Date.now() },
  { de: 'Jagd', en: 'hunt', level: 0, nextReview: Date.now() },
  { de: 'wahrscheinlich', en: 'probable', level: 0, nextReview: Date.now() },
  { de: 'Bett', en: 'bed', level: 0, nextReview: Date.now() },
  { de: 'Bruder', en: 'brother', level: 0, nextReview: Date.now() },
  { de: 'Ei', en: 'egg', level: 0, nextReview: Date.now() },
  { de: 'Fahrt', en: 'ride', level: 0, nextReview: Date.now() },
  { de: 'Zelle', en: 'cell', level: 0, nextReview: Date.now() },
  { de: 'glauben', en: 'believe', level: 0, nextReview: Date.now() },
  { de: 'vielleicht', en: 'perhaps', level: 0, nextReview: Date.now() },
  { de: 'pflücken', en: 'pick', level: 0, nextReview: Date.now() },
  { de: 'plötzlich', en: 'sudden', level: 0, nextReview: Date.now() },
  { de: 'zählen', en: 'count', level: 0, nextReview: Date.now() },
  { de: 'Platz', en: 'square', level: 0, nextReview: Date.now() },
  { de: 'Grund', en: 'reason', level: 0, nextReview: Date.now() },
  { de: 'Dauer', en: 'length', level: 0, nextReview: Date.now() },
  { de: 'vertreten', en: 'represent', level: 0, nextReview: Date.now() },
  { de: 'Kunst', en: 'art', level: 0, nextReview: Date.now() },
  { de: 'Thema', en: 'subject', level: 0, nextReview: Date.now() },
  { de: 'Region', en: 'region', level: 0, nextReview: Date.now() },
  { de: 'Größe', en: 'size', level: 0, nextReview: Date.now() },
  { de: 'variieren', en: 'vary', level: 0, nextReview: Date.now() },
  { de: 'regeln', en: 'settle', level: 0, nextReview: Date.now() },
  { de: 'sprechen', en: 'speak', level: 0, nextReview: Date.now() },
  { de: 'Gewicht', en: 'weight', level: 0, nextReview: Date.now() },
  { de: 'allgemein', en: 'general', level: 0, nextReview: Date.now() },
  { de: 'Eis', en: 'ice', level: 0, nextReview: Date.now() },
  { de: 'Materie', en: 'matter', level: 0, nextReview: Date.now() },
  { de: 'Kreis', en: 'circle', level: 0, nextReview: Date.now() },
  { de: 'Paar', en: 'pair', level: 0, nextReview: Date.now() },
  { de: 'umfassen', en: 'include', level: 0, nextReview: Date.now() },
  { de: 'Kluft', en: 'divide', level: 0, nextReview: Date.now() },
  { de: 'Silbe', en: 'syllable', level: 0, nextReview: Date.now() },
  { de: 'Filz', en: 'felt', level: 0, nextReview: Date.now() },
  { de: 'groß', en: 'grand', level: 0, nextReview: Date.now() },
  { de: 'Kugel', en: 'ball', level: 0, nextReview: Date.now() },
  { de: 'noch', en: 'yet', level: 0, nextReview: Date.now() },
  { de: 'Welle', en: 'wave', level: 0, nextReview: Date.now() },
  { de: 'fallen', en: 'drop', level: 0, nextReview: Date.now() },
  { de: 'Herz', en: 'heart', level: 0, nextReview: Date.now() },
  { de: 'Uhr', en: 'am', level: 0, nextReview: Date.now() },
  { de: 'vorhanden', en: 'present', level: 0, nextReview: Date.now() },
  { de: 'schwer', en: 'heavy', level: 0, nextReview: Date.now() },
  { de: 'Tanz', en: 'dance', level: 0, nextReview: Date.now() },
  { de: 'Motor', en: 'engine', level: 0, nextReview: Date.now() },
  { de: 'Position', en: 'position', level: 0, nextReview: Date.now() },
  { de: 'Arm', en: 'arm', level: 0, nextReview: Date.now() },
  { de: 'breit', en: 'wide', level: 0, nextReview: Date.now() },
  { de: 'Segel', en: 'sail', level: 0, nextReview: Date.now() },
  { de: 'Material', en: 'material', level: 0, nextReview: Date.now() },
  { de: 'Fraktion', en: 'fraction', level: 0, nextReview: Date.now() },
  { de: 'Wald', en: 'forest', level: 0, nextReview: Date.now() },
  { de: 'sitzen', en: 'sit', level: 0, nextReview: Date.now() },
  { de: 'Rennen', en: 'race', level: 0, nextReview: Date.now() },
  { de: 'Fenster', en: 'window', level: 0, nextReview: Date.now() },
  { de: 'Speicher', en: 'store', level: 0, nextReview: Date.now() },
  { de: 'Sommer', en: 'summer', level: 0, nextReview: Date.now() },
  { de: 'Zug', en: 'train', level: 0, nextReview: Date.now() },
  { de: 'Schlaf', en: 'sleep', level: 0, nextReview: Date.now() },
  { de: 'beweisen', en: 'prove', level: 0, nextReview: Date.now() },
  { de: 'einsam', en: 'lone', level: 0, nextReview: Date.now() },
  { de: 'Bein', en: 'leg', level: 0, nextReview: Date.now() },
  { de: 'Übung', en: 'exercise', level: 0, nextReview: Date.now() },
  { de: 'Wand', en: 'wall', level: 0, nextReview: Date.now() },
  { de: 'Fang', en: 'catch', level: 0, nextReview: Date.now() },
  { de: 'Berg', en: 'mount', level: 0, nextReview: Date.now() },
  { de: 'wünschen', en: 'wish', level: 0, nextReview: Date.now() },
  { de: 'Himmel', en: 'sky', level: 0, nextReview: Date.now() },
  { de: 'Board', en: 'board', level: 0, nextReview: Date.now() },
  { de: 'Freude', en: 'joy', level: 0, nextReview: Date.now() },
  { de: 'Winter', en: 'winter', level: 0, nextReview: Date.now() },
  { de: 'sa', en: 'sat', level: 0, nextReview: Date.now() },
  { de: 'geschrieben', en: 'written', level: 0, nextReview: Date.now() },
  { de: 'wilden', en: 'wild', level: 0, nextReview: Date.now() },
  { de: 'Instrument', en: 'instrument', level: 0, nextReview: Date.now() },
  { de: 'gehalten', en: 'kept', level: 0, nextReview: Date.now() },
  { de: 'Glas', en: 'glass', level: 0, nextReview: Date.now() },
  { de: 'Gras', en: 'grass', level: 0, nextReview: Date.now() },
  { de: 'Kuh', en: 'cow', level: 0, nextReview: Date.now() },
  { de: 'Arbeit', en: 'job', level: 0, nextReview: Date.now() },
  { de: 'Rand', en: 'edge', level: 0, nextReview: Date.now() },
  { de: 'Zeichen', en: 'sign', level: 0, nextReview: Date.now() },
  { de: 'Besuch', en: 'visit', level: 0, nextReview: Date.now() },
  { de: 'Vergangenheit', en: 'past', level: 0, nextReview: Date.now() },
  { de: 'weich', en: 'soft', level: 0, nextReview: Date.now() },
  { de: 'Spaß', en: 'fun', level: 0, nextReview: Date.now() },
  { de: 'hell', en: 'bright', level: 0, nextReview: Date.now() },
  { de: 'Gases', en: 'gas', level: 0, nextReview: Date.now() },
  { de: 'Wetter', en: 'weather', level: 0, nextReview: Date.now() },
  { de: 'Monat', en: 'month', level: 0, nextReview: Date.now() },
  { de: 'Million', en: 'million', level: 0, nextReview: Date.now() },
  { de: 'tragen', en: 'bear', level: 0, nextReview: Date.now() },
  { de: 'Finish', en: 'finish', level: 0, nextReview: Date.now() },
  { de: 'glücklich', en: 'happy', level: 0, nextReview: Date.now() },
  { de: 'hoffen', en: 'hope', level: 0, nextReview: Date.now() },
  { de: 'blume', en: 'flower', level: 0, nextReview: Date.now() },
  { de: 'kleiden', en: 'clothe', level: 0, nextReview: Date.now() },
  { de: 'seltsam', en: 'strange', level: 0, nextReview: Date.now() },
  { de: 'Vorbei', en: 'gone', level: 0, nextReview: Date.now() },
  { de: 'Handel', en: 'trade', level: 0, nextReview: Date.now() },
  { de: 'Melodie', en: 'melody', level: 0, nextReview: Date.now() },
  { de: 'Reise', en: 'trip', level: 0, nextReview: Date.now() },
  { de: 'Büro', en: 'office', level: 0, nextReview: Date.now() },
  { de: 'empfangen', en: 'receive', level: 0, nextReview: Date.now() },
  { de: 'Reihe', en: 'row', level: 0, nextReview: Date.now() },
  { de: 'Mund', en: 'mouth', level: 0, nextReview: Date.now() },
  { de: 'genau', en: 'exact', level: 0, nextReview: Date.now() },
  { de: 'Zeichen', en: 'symbol', level: 0, nextReview: Date.now() },
  { de: 'sterben', en: 'die', level: 0, nextReview: Date.now() },
  { de: 'am wenigsten', en: 'least', level: 0, nextReview: Date.now() },
  { de: 'Ärger', en: 'trouble', level: 0, nextReview: Date.now() },
  { de: 'Schrei', en: 'shout', level: 0, nextReview: Date.now() },
  { de: 'außer', en: 'except', level: 0, nextReview: Date.now() },
  { de: 'schrieb', en: 'wrote', level: 0, nextReview: Date.now() },
  { de: 'Samen', en: 'seed', level: 0, nextReview: Date.now() },
  { de: 'Ton', en: 'tone', level: 0, nextReview: Date.now() },
  { de: 'beitreten', en: 'join', level: 0, nextReview: Date.now() },
  { de: 'vorschlagen', en: 'suggest', level: 0, nextReview: Date.now() },
  { de: 'sauber', en: 'clean', level: 0, nextReview: Date.now() },
  { de: 'Pause', en: 'break', level: 0, nextReview: Date.now() },
  { de: 'Dame', en: 'lady', level: 0, nextReview: Date.now() },
  { de: 'Hof', en: 'yard', level: 0, nextReview: Date.now() },
  { de: 'steigen', en: 'rise', level: 0, nextReview: Date.now() },
  { de: 'schlecht', en: 'bad', level: 0, nextReview: Date.now() },
  { de: 'Schlag', en: 'blow', level: 0, nextReview: Date.now() },
  { de: 'Öl', en: 'oil', level: 0, nextReview: Date.now() },
  { de: 'Blut', en: 'blood', level: 0, nextReview: Date.now() },
  { de: 'berühren', en: 'touch', level: 0, nextReview: Date.now() },
  { de: 'wuchs', en: 'grew', level: 0, nextReview: Date.now() },
  { de: 'Cent', en: 'cent', level: 0, nextReview: Date.now() },
  { de: 'mischen', en: 'mix', level: 0, nextReview: Date.now() },
  { de: 'Mannschaft', en: 'team', level: 0, nextReview: Date.now() },
  { de: 'Draht', en: 'wire', level: 0, nextReview: Date.now() },
  { de: 'Kosten', en: 'cost', level: 0, nextReview: Date.now() },
  { de: 'verloren', en: 'lost', level: 0, nextReview: Date.now() },
  { de: 'braun', en: 'brown', level: 0, nextReview: Date.now() },
  { de: 'tragen', en: 'wear', level: 0, nextReview: Date.now() },
  { de: 'Garten', en: 'garden', level: 0, nextReview: Date.now() },
  { de: 'gleich', en: 'equal', level: 0, nextReview: Date.now() },
  { de: 'gesendet', en: 'sent', level: 0, nextReview: Date.now() },
  { de: 'wählen', en: 'choose', level: 0, nextReview: Date.now() },
  { de: 'fiel', en: 'fell', level: 0, nextReview: Date.now() },
  { de: 'passen', en: 'fit', level: 0, nextReview: Date.now() },
  { de: 'fließen', en: 'flow', level: 0, nextReview: Date.now() },
  { de: 'Messe', en: 'fair', level: 0, nextReview: Date.now() },
  { de: 'Bank', en: 'bank', level: 0, nextReview: Date.now() },
  { de: 'sammeln', en: 'collect', level: 0, nextReview: Date.now() },
  { de: 'sparen', en: 'save', level: 0, nextReview: Date.now() },
  { de: 'Kontrolle', en: 'control', level: 0, nextReview: Date.now() },
  { de: 'dezimal', en: 'decimal', level: 0, nextReview: Date.now() },
  { de: 'Ohr', en: 'ear', level: 0, nextReview: Date.now() },
  { de: 'sonst', en: 'else', level: 0, nextReview: Date.now() },
  { de: 'ganz', en: 'quite', level: 0, nextReview: Date.now() },
  { de: 'pleite', en: 'broke', level: 0, nextReview: Date.now() },
  { de: 'Fall', en: 'case', level: 0, nextReview: Date.now() },
  { de: 'Mitte', en: 'middle', level: 0, nextReview: Date.now() },
  { de: 'töten', en: 'kill', level: 0, nextReview: Date.now() },
  { de: 'Sohn', en: 'son', level: 0, nextReview: Date.now() },
  { de: 'See', en: 'lake', level: 0, nextReview: Date.now() },
  { de: 'Moment', en: 'moment', level: 0, nextReview: Date.now() },
  { de: 'Maßstab', en: 'scale', level: 0, nextReview: Date.now() },
  { de: 'laut', en: 'loud', level: 0, nextReview: Date.now() },
  { de: 'Frühling', en: 'spring', level: 0, nextReview: Date.now() },
  { de: 'beobachten', en: 'observe', level: 0, nextReview: Date.now() },
  { de: 'Kind', en: 'child', level: 0, nextReview: Date.now() },
  { de: 'gerade', en: 'straight', level: 0, nextReview: Date.now() },
  { de: 'Konsonant', en: 'consonant', level: 0, nextReview: Date.now() },
  { de: 'Nation', en: 'nation', level: 0, nextReview: Date.now() },
  { de: 'Wörterbuch', en: 'dictionary', level: 0, nextReview: Date.now() },
  { de: 'milch', en: 'milk', level: 0, nextReview: Date.now() },
  { de: 'Geschwindigkeit', en: 'speed', level: 0, nextReview: Date.now() },
  { de: 'Verfahren', en: 'method', level: 0, nextReview: Date.now() },
  { de: 'Orgel', en: 'organ', level: 0, nextReview: Date.now() },
  { de: 'zahlen', en: 'pay', level: 0, nextReview: Date.now() },
  { de: 'Alter', en: 'age', level: 0, nextReview: Date.now() },
  { de: 'Abschnitt', en: 'section', level: 0, nextReview: Date.now() },
  { de: 'Kleid', en: 'dress', level: 0, nextReview: Date.now() },
  { de: 'Wolke', en: 'cloud', level: 0, nextReview: Date.now() },
  { de: 'Überraschung', en: 'surprise', level: 0, nextReview: Date.now() },
  { de: 'ruhig', en: 'quiet', level: 0, nextReview: Date.now() },
  { de: 'Stein', en: 'stone', level: 0, nextReview: Date.now() },
  { de: 'winzig', en: 'tiny', level: 0, nextReview: Date.now() },
  { de: 'Aufstieg', en: 'climb', level: 0, nextReview: Date.now() },
  { de: 'kühlen', en: 'cool', level: 0, nextReview: Date.now() },
  { de: 'Entwurf', en: 'design', level: 0, nextReview: Date.now() },
  { de: 'arm', en: 'poor', level: 0, nextReview: Date.now() },
  { de: 'Menge', en: 'lot', level: 0, nextReview: Date.now() },
  { de: 'Versuch', en: 'experiment', level: 0, nextReview: Date.now() },
  { de: 'Boden', en: 'bottom', level: 0, nextReview: Date.now() },
  { de: 'Schlüssel', en: 'key', level: 0, nextReview: Date.now() },
  { de: 'Eisen', en: 'iron', level: 0, nextReview: Date.now() },
  { de: 'Einzel', en: 'single', level: 0, nextReview: Date.now() },
  { de: 'Stick', en: 'stick', level: 0, nextReview: Date.now() },
  { de: 'Wohnung', en: 'flat', level: 0, nextReview: Date.now() },
  { de: 'zwanzig', en: 'twenty', level: 0, nextReview: Date.now() },
  { de: 'Haut', en: 'skin', level: 0, nextReview: Date.now() },
  { de: 'Lächeln', en: 'smile', level: 0, nextReview: Date.now() },
  { de: 'Falte', en: 'crease', level: 0, nextReview: Date.now() },
  { de: 'Loch', en: 'hole', level: 0, nextReview: Date.now() },
  { de: 'springen', en: 'jump', level: 0, nextReview: Date.now() },
  { de: 'Kind', en: 'baby', level: 0, nextReview: Date.now() },
  { de: 'acht', en: 'eight', level: 0, nextReview: Date.now() },
  { de: 'Dorf', en: 'village', level: 0, nextReview: Date.now() },
  { de: 'treffen', en: 'meet', level: 0, nextReview: Date.now() },
  { de: 'Wurzel', en: 'root', level: 0, nextReview: Date.now() },
  { de: 'kaufen', en: 'buy', level: 0, nextReview: Date.now() },
  { de: 'erhöhen', en: 'raise', level: 0, nextReview: Date.now() },
  { de: 'lösen', en: 'solve', level: 0, nextReview: Date.now() },
  { de: 'Metall', en: 'metal', level: 0, nextReview: Date.now() },
  { de: 'ob', en: 'whether', level: 0, nextReview: Date.now() },
  { de: 'drücken', en: 'push', level: 0, nextReview: Date.now() },
  { de: 'sieben', en: 'seven', level: 0, nextReview: Date.now() },
  { de: 'Absatz', en: 'paragraph', level: 0, nextReview: Date.now() },
  { de: 'dritte', en: 'third', level: 0, nextReview: Date.now() },
  { de: 'wird', en: 'shall', level: 0, nextReview: Date.now() },
  { de: 'Hand', en: 'held', level: 0, nextReview: Date.now() },
  { de: 'Haar', en: 'hair', level: 0, nextReview: Date.now() },
  { de: 'beschreiben', en: 'describe', level: 0, nextReview: Date.now() },
  { de: 'Koch', en: 'cook', level: 0, nextReview: Date.now() },
  { de: 'Boden', en: 'floor', level: 0, nextReview: Date.now() },
  { de: 'entweder', en: 'either', level: 0, nextReview: Date.now() },
  { de: 'Ergebnis', en: 'result', level: 0, nextReview: Date.now() },
  { de: 'brennen', en: 'burn', level: 0, nextReview: Date.now() },
  { de: 'Hügel', en: 'hill', level: 0, nextReview: Date.now() },
  { de: 'sicher', en: 'safe', level: 0, nextReview: Date.now() },
  { de: 'Katze', en: 'cat', level: 0, nextReview: Date.now() },
  { de: 'Jahrhundert', en: 'century', level: 0, nextReview: Date.now() },
  { de: 'betrachten', en: 'consider', level: 0, nextReview: Date.now() },
  { de: 'Typ', en: 'type', level: 0, nextReview: Date.now() },
  { de: 'Gesetz', en: 'law', level: 0, nextReview: Date.now() },
  { de: 'Bit', en: 'bit', level: 0, nextReview: Date.now() },
  { de: 'Küste', en: 'coast', level: 0, nextReview: Date.now() },
  { de: 'Kopie', en: 'copy', level: 0, nextReview: Date.now() },
  { de: 'Ausdruck', en: 'phrase', level: 0, nextReview: Date.now() },
  { de: 'still', en: 'silent', level: 0, nextReview: Date.now() },
  { de: 'hoch', en: 'tall', level: 0, nextReview: Date.now() },
  { de: 'Sand', en: 'sand', level: 0, nextReview: Date.now() },
  { de: 'Boden', en: 'soil', level: 0, nextReview: Date.now() },
  { de: 'Rolle', en: 'roll', level: 0, nextReview: Date.now() },
  { de: 'Temperatur', en: 'temperature', level: 0, nextReview: Date.now() },
  { de: 'Finger', en: 'finger', level: 0, nextReview: Date.now() },
  { de: 'Industrie', en: 'industry', level: 0, nextReview: Date.now() },
  { de: 'Wert', en: 'value', level: 0, nextReview: Date.now() },
  { de: 'Kampf', en: 'fight', level: 0, nextReview: Date.now() },
  { de: 'Lüge', en: 'lie', level: 0, nextReview: Date.now() },
  { de: 'schlagen', en: 'beat', level: 0, nextReview: Date.now() },
  { de: 'begeistern', en: 'excite', level: 0, nextReview: Date.now() },
  { de: 'natürlich', en: 'natural', level: 0, nextReview: Date.now() },
  { de: 'Blick', en: 'view', level: 0, nextReview: Date.now() },
  { de: 'Sinn', en: 'sense', level: 0, nextReview: Date.now() },
  { de: 'Hauptstadt', en: 'capital', level: 0, nextReview: Date.now() },
  { de: 'wird nicht', en: 'won’t', level: 0, nextReview: Date.now() },
  { de: 'Stuhl', en: 'chair', level: 0, nextReview: Date.now() },
  { de: 'Achtung', en: 'danger', level: 0, nextReview: Date.now() },
  { de: 'Obst', en: 'fruit', level: 0, nextReview: Date.now() },
  { de: 'reich', en: 'rich', level: 0, nextReview: Date.now() },
  { de: 'dick', en: 'thick', level: 0, nextReview: Date.now() },
  { de: 'Soldat', en: 'soldier', level: 0, nextReview: Date.now() },
  { de: 'Prozess', en: 'process', level: 0, nextReview: Date.now() },
  { de: 'betreiben', en: 'operate', level: 0, nextReview: Date.now() },
  { de: 'Praxis', en: 'practice', level: 0, nextReview: Date.now() },
  { de: 'trennen', en: 'separate', level: 0, nextReview: Date.now() },
  { de: 'schwierig', en: 'difficult', level: 0, nextReview: Date.now() },
  { de: 'Arzt', en: 'doctor', level: 0, nextReview: Date.now() },
  { de: 'Bitte', en: 'please', level: 0, nextReview: Date.now() },
  { de: 'schützen', en: 'protect', level: 0, nextReview: Date.now() },
  { de: 'Mittag', en: 'noon', level: 0, nextReview: Date.now() },
  { de: 'Ernte', en: 'crop', level: 0, nextReview: Date.now() },
  { de: 'modernen', en: 'modern', level: 0, nextReview: Date.now() },
  { de: 'Elementes', en: 'element', level: 0, nextReview: Date.now() },
  { de: 'treffen', en: 'hit', level: 0, nextReview: Date.now() },
  { de: 'Schüler', en: 'student', level: 0, nextReview: Date.now() },
  { de: 'Ecke', en: 'corner', level: 0, nextReview: Date.now() },
  { de: 'Partei', en: 'party', level: 0, nextReview: Date.now() },
  { de: 'Versorgung', en: 'supply', level: 0, nextReview: Date.now() },
  { de: 'deren', en: 'whose', level: 0, nextReview: Date.now() },
  { de: 'lokalisieren', en: 'locate', level: 0, nextReview: Date.now() },
  { de: 'Rings', en: 'ring', level: 0, nextReview: Date.now() },
  { de: 'Charakter', en: 'character', level: 0, nextReview: Date.now() },
  { de: 'insekt', en: 'insect', level: 0, nextReview: Date.now() },
  { de: 'gefangen', en: 'caught', level: 0, nextReview: Date.now() },
  { de: 'Zeit', en: 'period', level: 0, nextReview: Date.now() },
  { de: 'zeigen', en: 'indicate', level: 0, nextReview: Date.now() },
  { de: 'Funk', en: 'radio', level: 0, nextReview: Date.now() },
  { de: 'Speiche', en: 'spoke', level: 0, nextReview: Date.now() },
  { de: 'Atom', en: 'atom', level: 0, nextReview: Date.now() },
  { de: 'Mensch', en: 'human', level: 0, nextReview: Date.now() },
  { de: 'Geschichte', en: 'history', level: 0, nextReview: Date.now() },
  { de: 'Wirkung', en: 'effect', level: 0, nextReview: Date.now() },
  { de: 'elektrisch', en: 'electric', level: 0, nextReview: Date.now() },
  { de: 'erwarten', en: 'expect', level: 0, nextReview: Date.now() },
  { de: 'Knochen', en: 'bone', level: 0, nextReview: Date.now() },
  { de: 'Schiene', en: 'rail', level: 0, nextReview: Date.now() },
  { de: 'vorstellen', en: 'imagine', level: 0, nextReview: Date.now() },
  { de: 'bieten', en: 'provide', level: 0, nextReview: Date.now() },
  { de: 'zustimmen', en: 'agree', level: 0, nextReview: Date.now() },
  { de: 'so', en: 'thus', level: 0, nextReview: Date.now() },
  { de: 'sanft', en: 'gentle', level: 0, nextReview: Date.now() },
  { de: 'Frau', en: 'woman', level: 0, nextReview: Date.now() },
  { de: 'Kapitän', en: 'captain', level: 0, nextReview: Date.now() },
  { de: 'erraten', en: 'guess', level: 0, nextReview: Date.now() },
  { de: 'erforderlich', en: 'necessary', level: 0, nextReview: Date.now() },
  { de: 'scharf', en: 'sharp', level: 0, nextReview: Date.now() },
  { de: 'Flügel', en: 'wing', level: 0, nextReview: Date.now() },
  { de: 'schaffen', en: 'create', level: 0, nextReview: Date.now() },
  { de: 'Nachbar', en: 'neighbor', level: 0, nextReview: Date.now() },
  { de: 'Wasch', en: 'wash', level: 0, nextReview: Date.now() },
  { de: 'Fledermaus', en: 'bat', level: 0, nextReview: Date.now() },
  { de: 'eher', en: 'rather', level: 0, nextReview: Date.now() },
  { de: 'Menge', en: 'crowd', level: 0, nextReview: Date.now() },
  { de: 'mais', en: 'corn', level: 0, nextReview: Date.now() },
  { de: 'vergleichen', en: 'compare', level: 0, nextReview: Date.now() },
  { de: 'Gedicht', en: 'poem', level: 0, nextReview: Date.now() },
  { de: 'Schnur', en: 'string', level: 0, nextReview: Date.now() },
  { de: 'Glocke', en: 'bell', level: 0, nextReview: Date.now() },
  { de: 'abhängen', en: 'depend', level: 0, nextReview: Date.now() },
  { de: 'Fleisch', en: 'meat', level: 0, nextReview: Date.now() },
  { de: 'einreiben', en: 'rub', level: 0, nextReview: Date.now() },
  { de: 'Rohr', en: 'tube', level: 0, nextReview: Date.now() },
  { de: 'berühmt', en: 'famous', level: 0, nextReview: Date.now() },
  { de: 'Dollar', en: 'dollar', level: 0, nextReview: Date.now() },
  { de: 'Strom', en: 'stream', level: 0, nextReview: Date.now() },
  { de: 'Angst', en: 'fear', level: 0, nextReview: Date.now() },
  { de: 'Blick', en: 'sight', level: 0, nextReview: Date.now() },
  { de: 'dünn', en: 'thin', level: 0, nextReview: Date.now() },
  { de: 'Dreieck', en: 'triangle', level: 0, nextReview: Date.now() },
  { de: 'Erde', en: 'planet', level: 0, nextReview: Date.now() },
  { de: 'Eile', en: 'hurry', level: 0, nextReview: Date.now() },
  { de: 'Chef', en: 'chief', level: 0, nextReview: Date.now() },
  { de: 'Kolonie', en: 'colony', level: 0, nextReview: Date.now() },
  { de: 'Uhr', en: 'clock', level: 0, nextReview: Date.now() },
  { de: 'Mine', en: 'mine', level: 0, nextReview: Date.now() },
  { de: 'Krawatte', en: 'tie', level: 0, nextReview: Date.now() },
  { de: 'eingeben', en: 'enter', level: 0, nextReview: Date.now() },
  { de: 'Dur', en: 'major', level: 0, nextReview: Date.now() },
  { de: 'frisch', en: 'fresh', level: 0, nextReview: Date.now() },
  { de: 'Suche', en: 'search', level: 0, nextReview: Date.now() },
  { de: 'senden', en: 'send', level: 0, nextReview: Date.now() },
  { de: 'gelb', en: 'yellow', level: 0, nextReview: Date.now() },
  { de: 'Pistole', en: 'gun', level: 0, nextReview: Date.now() },
  { de: 'erlauben', en: 'allow', level: 0, nextReview: Date.now() },
  { de: 'Druck', en: 'print', level: 0, nextReview: Date.now() },
  { de: 'tot', en: 'dead', level: 0, nextReview: Date.now() },
  { de: 'Stelle', en: 'spot', level: 0, nextReview: Date.now() },
  { de: 'Wüste', en: 'desert', level: 0, nextReview: Date.now() },
  { de: 'Anzug', en: 'suit', level: 0, nextReview: Date.now() },
  { de: 'Strom', en: 'current', level: 0, nextReview: Date.now() },
  { de: 'Aufzug', en: 'lift', level: 0, nextReview: Date.now() },
  { de: 'stiegen', en: 'rose', level: 0, nextReview: Date.now() },
  { de: 'ankommen', en: 'arrive', level: 0, nextReview: Date.now() },
  { de: 'Stamm', en: 'master', level: 0, nextReview: Date.now() },
  { de: 'Spur', en: 'track', level: 0, nextReview: Date.now() },
  { de: 'Elternteil', en: 'parent', level: 0, nextReview: Date.now() },
  { de: 'Ufer', en: 'shore', level: 0, nextReview: Date.now() },
  { de: 'Teilung', en: 'division', level: 0, nextReview: Date.now() },
  { de: 'Blatt', en: 'sheet', level: 0, nextReview: Date.now() },
  { de: 'Substanz', en: 'substance', level: 0, nextReview: Date.now() },
  { de: 'begünstigen', en: 'favor', level: 0, nextReview: Date.now() },
  { de: 'verbinden', en: 'connect', level: 0, nextReview: Date.now() },
  { de: 'nach', en: 'post', level: 0, nextReview: Date.now() },
  { de: 'verbringen', en: 'spend', level: 0, nextReview: Date.now() },
  { de: 'Akkord', en: 'chord', level: 0, nextReview: Date.now() },
  { de: 'Fett', en: 'fat', level: 0, nextReview: Date.now() },
  { de: 'froh', en: 'glad', level: 0, nextReview: Date.now() },
  { de: 'Original', en: 'original', level: 0, nextReview: Date.now() },
  { de: 'Aktie', en: 'share', level: 0, nextReview: Date.now() },
  { de: 'Station', en: 'station', level: 0, nextReview: Date.now() },
  { de: 'Papa', en: 'dad', level: 0, nextReview: Date.now() },
  { de: 'Brot', en: 'bread', level: 0, nextReview: Date.now() },
  { de: 'aufladen', en: 'charge', level: 0, nextReview: Date.now() },
  { de: 'richtig', en: 'proper', level: 0, nextReview: Date.now() },
  { de: 'Leiste', en: 'bar', level: 0, nextReview: Date.now() },
  { de: 'Angebot', en: 'offer', level: 0, nextReview: Date.now() },
  { de: 'Segment', en: 'segment', level: 0, nextReview: Date.now() },
  { de: 'Sklave', en: 'slave', level: 0, nextReview: Date.now() },
  { de: 'ente', en: 'duck', level: 0, nextReview: Date.now() },
  { de: 'Augenblick', en: 'instant', level: 0, nextReview: Date.now() },
  { de: 'Markt', en: 'market', level: 0, nextReview: Date.now() },
  { de: 'Grad', en: 'degree', level: 0, nextReview: Date.now() },
  { de: 'besiedeln', en: 'populate', level: 0, nextReview: Date.now() },
  { de: 'küken', en: 'chick', level: 0, nextReview: Date.now() },
  { de: 'liebe', en: 'dear', level: 0, nextReview: Date.now() },
  { de: 'Feind', en: 'enemy', level: 0, nextReview: Date.now() },
  { de: 'antworten', en: 'reply', level: 0, nextReview: Date.now() },
  { de: 'Getränk', en: 'drink', level: 0, nextReview: Date.now() },
  { de: 'auftreten', en: 'occur', level: 0, nextReview: Date.now() },
  { de: 'Unterstützung', en: 'support', level: 0, nextReview: Date.now() },
  { de: 'Rede', en: 'speech', level: 0, nextReview: Date.now() },
  { de: 'Natur', en: 'nature', level: 0, nextReview: Date.now() },
  { de: 'Angebot', en: 'range', level: 0, nextReview: Date.now() },
  { de: 'Dampf', en: 'steam', level: 0, nextReview: Date.now() },
  { de: 'Bewegung', en: 'motion', level: 0, nextReview: Date.now() },
  { de: 'Weg', en: 'path', level: 0, nextReview: Date.now() },
  { de: 'Flüssigkeit', en: 'liquid', level: 0, nextReview: Date.now() },
  { de: 'protokollieren', en: 'log', level: 0, nextReview: Date.now() },
  { de: 'gemeint', en: 'meant', level: 0, nextReview: Date.now() },
  { de: 'Quotient', en: 'quotient', level: 0, nextReview: Date.now() },
  { de: 'Gebiss', en: 'teeth', level: 0, nextReview: Date.now() },
  { de: 'Schale', en: 'shell', level: 0, nextReview: Date.now() },
  { de: 'Hals', en: 'neck', level: 0, nextReview: Date.now() },
  { de: 'Sauerstoff', en: 'oxygen', level: 0, nextReview: Date.now() },
  { de: 'Zucker', en: 'sugar', level: 0, nextReview: Date.now() },
  { de: 'Tod', en: 'death', level: 0, nextReview: Date.now() },
  { de: 'ziemlich', en: 'pretty', level: 0, nextReview: Date.now() },
  { de: 'Geschicklichkeit', en: 'skill', level: 0, nextReview: Date.now() },
  { de: 'Frauen', en: 'women', level: 0, nextReview: Date.now() },
  { de: 'Saison', en: 'season', level: 0, nextReview: Date.now() },
  { de: 'Lösung', en: 'solution', level: 0, nextReview: Date.now() },
  { de: 'Magnet', en: 'magnet', level: 0, nextReview: Date.now() },
  { de: 'Silber', en: 'silver', level: 0, nextReview: Date.now() },
  { de: 'danken', en: 'thank', level: 0, nextReview: Date.now() },
  { de: 'Zweig', en: 'branch', level: 0, nextReview: Date.now() },
  { de: 'Spiel', en: 'match', level: 0, nextReview: Date.now() },
  { de: 'Suffix', en: 'suffix', level: 0, nextReview: Date.now() },
  { de: 'insbesondere', en: 'especially', level: 0, nextReview: Date.now() },
  { de: 'Feige', en: 'fig', level: 0, nextReview: Date.now() },
  { de: 'ängstlich', en: 'afraid', level: 0, nextReview: Date.now() },
  { de: 'riesig', en: 'huge', level: 0, nextReview: Date.now() },
  { de: 'Schwester', en: 'sister', level: 0, nextReview: Date.now() },
  { de: 'Stahl', en: 'steel', level: 0, nextReview: Date.now() },
  { de: 'diskutieren', en: 'discuss', level: 0, nextReview: Date.now() },
  { de: 'vorwärts', en: 'forward', level: 0, nextReview: Date.now() },
  { de: 'ähnlich', en: 'similar', level: 0, nextReview: Date.now() },
  { de: 'führen', en: 'guide', level: 0, nextReview: Date.now() },
  { de: 'Erfahrung', en: 'experience', level: 0, nextReview: Date.now() },
  { de: 'Partitur', en: 'score', level: 0, nextReview: Date.now() },
  { de: 'apfel', en: 'apple', level: 0, nextReview: Date.now() },
  { de: 'gekauft', en: 'bought', level: 0, nextReview: Date.now() },
  { de: 'geführt', en: 'led', level: 0, nextReview: Date.now() },
  { de: 'Tonhöhe', en: 'pitch', level: 0, nextReview: Date.now() },
  { de: 'Mantel', en: 'coat', level: 0, nextReview: Date.now() },
  { de: 'Masse', en: 'mass', level: 0, nextReview: Date.now() },
  { de: 'Karte', en: 'card', level: 0, nextReview: Date.now() },
  { de: 'Band', en: 'band', level: 0, nextReview: Date.now() },
  { de: 'Seil', en: 'rope', level: 0, nextReview: Date.now() },
  { de: 'Rutsch', en: 'slip', level: 0, nextReview: Date.now() },
  { de: 'gewinnen', en: 'win', level: 0, nextReview: Date.now() },
  { de: 'träumen', en: 'dream', level: 0, nextReview: Date.now() },
  { de: 'Abend', en: 'evening', level: 0, nextReview: Date.now() },
  { de: 'Zustand', en: 'condition', level: 0, nextReview: Date.now() },
  { de: 'Futtermittel', en: 'feed', level: 0, nextReview: Date.now() },
  { de: 'Werkzeug', en: 'tool', level: 0, nextReview: Date.now() },
  { de: 'gesamt', en: 'total', level: 0, nextReview: Date.now() },
  { de: 'Basis', en: 'basic', level: 0, nextReview: Date.now() },
  { de: 'Geruch', en: 'smell', level: 0, nextReview: Date.now() },
  { de: 'Tal', en: 'valley', level: 0, nextReview: Date.now() },
  { de: 'noch', en: 'nor', level: 0, nextReview: Date.now() },
  { de: 'doppelt', en: 'double', level: 0, nextReview: Date.now() },
  { de: 'Sitz', en: 'seat', level: 0, nextReview: Date.now() },
  { de: 'fortsetzen', en: 'continue', level: 0, nextReview: Date.now() },
  { de: 'Block', en: 'block', level: 0, nextReview: Date.now() },
  { de: 'Tabelle', en: 'chart', level: 0, nextReview: Date.now() },
  { de: 'Hut', en: 'hat', level: 0, nextReview: Date.now() },
  { de: 'verkaufen', en: 'sell', level: 0, nextReview: Date.now() },
  { de: 'Erfolg', en: 'success', level: 0, nextReview: Date.now() },
  { de: 'Firma', en: 'company', level: 0, nextReview: Date.now() },
  { de: 'subtrahieren', en: 'subtract', level: 0, nextReview: Date.now() },
  { de: 'Veranstaltung', en: 'event', level: 0, nextReview: Date.now() },
  { de: 'besondere', en: 'particular', level: 0, nextReview: Date.now() },
  { de: 'viel', en: 'deal', level: 0, nextReview: Date.now() },
  { de: 'schwimmen', en: 'swim', level: 0, nextReview: Date.now() },
  { de: 'Begriff', en: 'term', level: 0, nextReview: Date.now() },
  { de: 'Gegenteil', en: 'opposite', level: 0, nextReview: Date.now() },
  { de: 'Frau', en: 'wife', level: 0, nextReview: Date.now() },
  { de: 'Schuh', en: 'shoe', level: 0, nextReview: Date.now() },
  { de: 'Schulter', en: 'shoulder', level: 0, nextReview: Date.now() },
  { de: 'Verbreitung', en: 'spread', level: 0, nextReview: Date.now() },
  { de: 'arrangieren', en: 'arrange', level: 0, nextReview: Date.now() },
  { de: 'Lager', en: 'camp', level: 0, nextReview: Date.now() },
  { de: 'erfinden', en: 'invent', level: 0, nextReview: Date.now() },
  { de: 'Baumwolle', en: 'cotton', level: 0, nextReview: Date.now() },
  { de: 'geboren', en: 'born', level: 0, nextReview: Date.now() },
  { de: 'bestimmen', en: 'determine', level: 0, nextReview: Date.now() },
  { de: 'Quart', en: 'quart', level: 0, nextReview: Date.now() },
  { de: 'neun', en: 'nine', level: 0, nextReview: Date.now() },
  { de: 'Lastwagen', en: 'truck', level: 0, nextReview: Date.now() },
  { de: 'Lärm', en: 'noise', level: 0, nextReview: Date.now() },
  { de: 'Ebene', en: 'level', level: 0, nextReview: Date.now() },
  { de: 'Chance', en: 'chance', level: 0, nextReview: Date.now() },
  { de: 'sammeln', en: 'gather', level: 0, nextReview: Date.now() },
  { de: 'Geschäft', en: 'shop', level: 0, nextReview: Date.now() },
  { de: 'Stretch', en: 'stretch', level: 0, nextReview: Date.now() },
  { de: 'werfen', en: 'throw', level: 0, nextReview: Date.now() },
  { de: 'Glanz', en: 'shine', level: 0, nextReview: Date.now() },
  { de: 'Immobilien', en: 'property', level: 0, nextReview: Date.now() },
  { de: 'Spalte', en: 'column', level: 0, nextReview: Date.now() },
  { de: 'Molekül', en: 'molecule', level: 0, nextReview: Date.now() },
  { de: 'wählen', en: 'select', level: 0, nextReview: Date.now() },
  { de: 'falsch', en: 'wrong', level: 0, nextReview: Date.now() },
  { de: 'grau', en: 'gray', level: 0, nextReview: Date.now() },
  { de: 'Wiederholung', en: 'repeat', level: 0, nextReview: Date.now() },
  { de: 'erfordern', en: 'require', level: 0, nextReview: Date.now() },
  { de: 'breit', en: 'broad', level: 0, nextReview: Date.now() },
  { de: 'vorbereiten', en: 'prepare', level: 0, nextReview: Date.now() },
  { de: 'Salz', en: 'salt', level: 0, nextReview: Date.now() },
  { de: 'Nase', en: 'nose', level: 0, nextReview: Date.now() },
  { de: 'mehreren', en: 'plural', level: 0, nextReview: Date.now() },
  { de: 'Zorn', en: 'anger', level: 0, nextReview: Date.now() },
  { de: 'Anspruch', en: 'claim', level: 0, nextReview: Date.now() },
  { de: 'Kontinent', en: 'continent', level: 0, nextReview: Date.now() }
];
let vocab = load('dt_vocab', []);
let vocab_pool = load('dt_vocab_pool', DEFAULT_VOCAB);
let speakNotesList = load('dt_speak', []);

// ─── UTILITIES ────────────────────────────────────────────────────────────────
function todayStr() { return new Date().toISOString().split('T')[0]; }
function formatDate(d) { return new Date(d).toLocaleDateString('en-GB', { weekday:'long', year:'numeric', month:'long', day:'numeric' }); }
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('section-' + id).classList.add('active');
  const dropdown = document.getElementById('moreDropdown');
  if(dropdown && dropdown.classList.contains('show')) dropdown.classList.remove('show');
  document.querySelectorAll('.nav-btn').forEach(b => {
    if (b.getAttribute('onclick') && b.getAttribute('onclick').includes("'" + id + "'")) {
      b.classList.add('active');
    }
  });
  if (id === 'entries') renderEntries();
  if (id === 'vocab') { renderVocab('All'); document.querySelectorAll('.tab')[0]?.classList.add('active'); }
  if (id === 'grammar') renderGrammar();
  if (id === 'speaking') renderSpeaking();
  if (id === 'reflection') renderReflections();
  if (id === 'quiz') quitQuiz();
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function calcStreak() {
  const dates = [...new Set(diaryEntries.map(e => e.date))].sort();
  if (!dates.length) return 0;
  let streak = 0, day = new Date(todayStr());
  for (let i = dates.length - 1; i >= 0; i--) {
    const d = new Date(dates[i]);
    const diff = Math.round((day - d) / 86400000);
    if (diff === 0 || diff === 1) { streak++; day = d; } else break;
  }
  return streak;
}

function getLevel(entries, words) {
  const score = entries * 5 + words;
  if (score >= 600) return { label: "B2 🎉", pct: 100, class: "badge-b2" };
  if (score >= 350) return { label: "B1 ⭐", pct: 75 + Math.round((score-350)/10), class: "badge-b1" };
  if (score >= 150) return { label: "A2", pct: 40 + Math.round((score-150)/4.25), class: "badge-a2" };
  if (score >= 50)  return { label: "A1", pct: 10 + Math.round((score-50)/2), class: "badge-a1" };
  return { label: "Starter", pct: Math.round(score/5*10), class: "badge-a1" };
}

function renderDashboard() {
  const streak = calcStreak();
  document.getElementById('statEntries').textContent = diaryEntries.length;
  document.getElementById('statWords').textContent = vocab.length;
  document.getElementById('statStreak').textContent = streak;
  document.getElementById('streakBadge').textContent = `🔥 ${streak} Day Streak`;
  document.getElementById('todayDate').textContent = formatDate(todayStr());

  const lv = getLevel(diaryEntries.length, vocab.length);
  document.getElementById('currentLevel').textContent = lv.label;
  document.getElementById('currentLevel').className = 'level-badge ' + lv.class;
  document.getElementById('progressBar').style.width = Math.min(lv.pct, 100) + '%';

  const needed = 50 - (diaryEntries.length * 5 + vocab.length);
  document.getElementById('progressHint').textContent =
    needed > 0 ? `Add ${Math.ceil(needed/5)} entries or ${needed} vocab words to reach A1!`
               : `Great progress! Keep going daily 💪`;

  // Grammar tip
  const tip = GRAMMAR_TIPS[new Date().getDate() % GRAMMAR_TIPS.length];
  document.getElementById('dashTipRule').textContent = tip.rule;
  document.getElementById('dashTipExample').textContent = tip.example;

  // Roadmap
  renderRoadmap();

  // Heatmap
  renderHeatmap();
}

// ─── LEVEL ROADMAP ────────────────────────────────────────────────────────────
const LEVELS = [
  { id:'A1', label:'A1', sub:'~6 months', badge:'badge-a1' },
  { id:'A2', label:'A2', sub:'~12 months', badge:'badge-a2' },
  { id:'B1', label:'B1', sub:'~18 months', badge:'badge-b1' },
  { id:'B2', label:'B2', sub:'~24 months', badge:'badge-b2' },
];

function renderRoadmap() {
  const done = load('dt_roadmap', {});
  const el = document.getElementById('roadmap');
  el.innerHTML = LEVELS.map(lv => `
    <div class="roadmap-item ${done[lv.id] ? 'done' : ''}" onclick="toggleLevel('${lv.id}')">
      <div class="roadmap-check">${done[lv.id] ? '✓' : ''}</div>
      <div>
        <div class="roadmap-label">${lv.label}</div>
        <div class="roadmap-sub">${lv.sub}</div>
      </div>
    </div>
  `).join('');
}

function toggleLevel(id) {
  const done = load('dt_roadmap', {});
  done[id] = !done[id];
  save('dt_roadmap', done);
  renderRoadmap();
  showToast(done[id] ? `🎉 ${id} marked complete! Glückwunsch!` : `${id} unmarked.`);
}

function renderHeatmap() {
  const hm = document.getElementById('heatmap');
  hm.innerHTML = `<div class="heatmap-day-label">Su</div><div class="heatmap-day-label">Mo</div><div class="heatmap-day-label">Tu</div><div class="heatmap-day-label">We</div><div class="heatmap-day-label">Th</div><div class="heatmap-day-label">Fr</div><div class="heatmap-day-label">Sa</div>`;
  
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const todayDateNum = today.getDate();
  
  // Update subtitle
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const subEl = document.getElementById('heatmapSubtitle');
  if (subEl) subEl.textContent = `${monthNames[month]} ${year}`;
  
  // Find the day of the week the 1st of the month falls on
  const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
  
  // Find the number of days in the current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // 1. Generate invisible placeholder cells for the days before the 1st
  for (let i = 0; i < firstDay; i++) {
    const cell = document.createElement('div');
    cell.className = 'heat-cell heat-future';
    hm.appendChild(cell);
  }
  
  // 2. Generate the actual days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    const cell = document.createElement('div');
    cell.textContent = i;
    
    // Safely generate YYYY-MM-DD for the local timezone
    const ds = year + '-' + String(month+1).padStart(2,'0') + '-' + String(i).padStart(2,'0');
    
    if (i > todayDateNum) {
      // Future days
      cell.className = 'heat-cell';
      cell.style.opacity = '0.3';
      cell.title = "Future";
    } else {
      const count = load('dt_time_' + ds, 0);
      cell.className = 'heat-cell' + (count >= 30 ? ' heat-3' : count >= 15 ? ' heat-2' : count > 0 ? ' heat-1' : '');
      cell.title = ds + (count > 0 ? ` (${count} mins)` : ' (0 mins)');
    }
    hm.appendChild(cell);
  }
}

// ─── DIARY ────────────────────────────────────────────────────────────────────
function initDiary() {
  document.getElementById('diaryDate').textContent = '— ' + formatDate(todayStr());

  // Phrases
  const pl = document.getElementById('phraseList');
  pl.innerHTML = '';
  STARTER_PHRASES.forEach(p => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-outline btn-sm';
    btn.textContent = p;
    btn.onclick = () => { navigator.clipboard?.writeText(p); showToast(`Copied: "${p}"`); };
    pl.appendChild(btn);
  });

  // Word count listeners
  ['prompt1','prompt2','prompt3'].forEach((id,i) => {
    const el = document.getElementById(id);
    const wc = document.getElementById('wc'+(i+1));
    el.addEventListener('input', () => {
      const words = el.value.trim().split(/\s+/).filter(Boolean).length;
      wc.textContent = words + ' words';
    });
  });
}

function saveDiaryEntry() {
  const p1 = document.getElementById('prompt1').value.trim();
  const p2 = document.getElementById('prompt2').value.trim();
  const p3 = document.getElementById('prompt3').value.trim();
  const p4 = document.getElementById('prompt4').value.trim();
  if (!p1 && !p2 && !p3) { showToast('⚠️ Please fill at least one prompt!'); return; }
  const entry = { date: todayStr(), ts: Date.now(), p1, p2, p3, p4 };
  diaryEntries.unshift(entry);
  save('dt_entries', diaryEntries);
  clearDiary();
  renderDashboard();
  showToast('✅ Diary entry saved! Gut gemacht!');
}

function clearDiary() {
  ['prompt1','prompt2','prompt3','prompt4'].forEach(id => document.getElementById(id).value = '');
  ['wc1','wc2','wc3'].forEach(id => document.getElementById(id).textContent = '0 words');
}

// ─── PAST ENTRIES ─────────────────────────────────────────────────────────────
function renderEntries() {
  const el = document.getElementById('entriesList');
  if (!diaryEntries.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">📓</div><div>No entries yet. Write your first diary entry!</div></div>';
    return;
  }
  el.innerHTML = diaryEntries.map((e, i) => `
    <div class="entry-card">
      <div class="entry-date"><span>📅 ${formatDate(e.date)}</span></div>
      ${e.p1 ? `<div class="entry-block"><div class="entry-block-label">Was habe ich gemacht?</div><div class="entry-text">${escHtml(e.p1)}</div></div>` : ''}
      ${e.p2 ? `<div class="entry-block"><div class="entry-block-label">Was habe ich gelernt?</div><div class="entry-text">${escHtml(e.p2)}</div></div>` : ''}
      ${e.p3 ? `<div class="entry-block"><div class="entry-block-label">Was werde ich morgen machen?</div><div class="entry-text">${escHtml(e.p3)}</div></div>` : ''}
      ${e.p4 ? `<div class="entry-block"><div class="entry-block-label">Freitext</div><div class="entry-text">${escHtml(e.p4)}</div></div>` : ''}
      <div class="entry-actions"><button class="btn btn-danger btn-sm" onclick="deleteEntry(${i})">🗑 Delete</button></div>
    </div>
  `).join('');
}

function deleteEntry(i) {
  if (!confirm('Delete this entry?')) return;
  diaryEntries.splice(i, 1);
  save('dt_entries', diaryEntries);
  renderEntries(); renderDashboard();
  showToast('Entry deleted.');
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
}

// ─── VOCABULARY ───────────────────────────────────────────────────────────────
let currentFilter = 'All';
let flashIndex = 0;

function addVocab() {
  const de = document.getElementById('vocabDe').value.trim();
  const en = document.getElementById('vocabEn').value.trim();
  const cat = document.getElementById('vocabCat').value;
  if (!de || !en) { showToast('⚠️ Enter both German and English!'); return; }
  vocab.unshift({ de, en, cat, date: todayStr() });
  save('dt_vocab', vocab);
  document.getElementById('vocabDe').value = '';
  document.getElementById('vocabEn').value = '';
  updateTodayWordCount();
  renderVocab(currentFilter);
  updateFlashcard();
  renderDashboard();
  showToast(`✅ Added: ${de} = ${en}`);
}

function updateTodayWordCount() {
  const count = vocab.filter(v => v.date === todayStr()).length;
  document.getElementById('todayWordCount').textContent = count;
}

function renderVocab(filter) {
  currentFilter = filter;
  const list = filter === 'All' ? vocab : vocab.filter(v => v.cat === filter);
  document.getElementById('vocabCount').textContent = `(${list.length} words)`;
  const el = document.getElementById('vocabList');
  if (!list.length) {
    el.innerHTML = '<li style="text-align:center;padding:24px;color:var(--text-muted)">No words in this category yet.</li>';
    return;
  }
  el.innerHTML = list.map((v, i) => `
    <li class="vocab-item">
      <div>
        <span class="vocab-de ${getNounClass(v.de)}">${escHtml(v.de)}</span>
        <button onclick="speakWord('${v.de.replace(/'/g,"\\'")}')" style="background:none;border:none;cursor:pointer;font-size:1rem;margin-left:4px">🔊</button>
        <span class="vocab-cat">${v.cat}</span>
        <br><span class="vocab-en">${escHtml(v.en)}</span>
      </div>
      <button class="delete-btn" onclick="deleteVocab('${v.de.replace(/'/g,"\\'")}')">✕</button>
    </li>
  `).join('');
  updateTodayWordCount();
}

function deleteVocab(de) {
  vocab = vocab.filter(v => v.de !== de);
  save('dt_vocab', vocab);
  renderVocab(currentFilter);
  renderDashboard();
  showToast('Word removed.');
}

function getNounClass(word) {
  const w = word.toLowerCase();
  if(w.startsWith('der ')) return 'noun-der';
  if(w.startsWith('die ')) return 'noun-die';
  if(w.startsWith('das ')) return 'noun-das';
  return '';
}

function importItVocab() {
  const itWords = [
    { de: "die Anwendung", en: "application", cat: "Work", date: todayStr() },
    { de: "die Schnittstelle", en: "interface / API", cat: "Java", date: todayStr() },
    { de: "die Datenbank", en: "database", cat: "Database", date: todayStr() },
    { de: "die Cloud", en: "cloud", cat: "Cloud", date: todayStr() },
    { de: "die Infrastruktur", en: "infrastructure", cat: "Cloud", date: todayStr() },
    { de: "die Bereitstellung", en: "deployment", cat: "Kubernetes", date: todayStr() },
    { de: "die Erfahrung", en: "experience", cat: "Work", date: todayStr() },
    { de: "das Projekt", en: "project", cat: "Work", date: todayStr() },
    { de: "die Entwicklung", en: "development", cat: "Work", date: todayStr() },
    { de: "der Entwickler", en: "developer", cat: "Work", date: todayStr() },
    { de: "der Fehler", en: "bug / error", cat: "Java", date: todayStr() },
    { de: "die Anforderung", en: "requirement", cat: "Work", date: todayStr() },
    { de: "die Sicherheit", en: "security", cat: "Cloud", date: todayStr() },
    { de: "die Skalierbarkeit", en: "scalability", cat: "Cloud", date: todayStr() },
    { de: "das Vorstellungsgespräch", en: "job interview", cat: "Work", date: todayStr() }
  ];
  let imported = 0;
  itWords.forEach(w => {
    if (!vocab.some(v => v.de.toLowerCase() === w.de.toLowerCase())) { vocab.unshift(w); imported++; }
  });
  if (imported > 0) { 
    save('dt_vocab', vocab); 
    showToast('✅ ' + imported + ' IT words imported!'); 
    renderVocab(currentFilter); 
    updateTodayWordCount(); 
    renderDashboard(); 
  } else { 
    showToast('⚠️ Words are already in your list!'); 
  }
}

function filterVocab(filter, el) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderVocab(filter);
}

function updateFlashcard() {
  if (!vocab.length) { document.getElementById('flashFront').textContent = '—'; document.getElementById('flashBack').textContent = 'Add some words first!'; return; }
  flashIndex = Math.floor(Math.random() * vocab.length);
  document.getElementById('flashFront').textContent = vocab[flashIndex].de;
  document.getElementById('flashBack').textContent = '';
}

function revealFlash() {
  if (!vocab.length) return;
  document.getElementById('flashBack').textContent = vocab[flashIndex]?.en ?? '';
}

function nextFlash() { updateFlashcard(); }

// ─── SPEAKING ─────────────────────────────────────────────────────────────────
function renderSpeaking() {
  let dynamicHtml = '';
  if (vocab.length >= 4) {
    const randomWords = [...vocab].sort(()=>0.5-Math.random()).slice(0, 4).map(v => v.de);
    dynamicHtml = `
      <div class="speaking-topic" style="border-color:var(--accent);background:linear-gradient(135deg,rgba(91,141,238,0.1),transparent)">
        <div class="topic-title">✨ Dynamic Story (Auto-Updated)</div>
        <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:6px">Try to talk for 1 minute using these 4 random words from your list:</div>
        <ul class="topic-hints">${randomWords.map(h => `<li>${escHtml(h)}</li>`).join('')}</ul>
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

  document.getElementById('speakingTopics').innerHTML = dynamicHtml + SPEAKING_TOPICS.map(t => `
    <div class="speaking-topic">
      <div class="topic-title">${t.icon} ${t.title}</div>
      <ul class="topic-hints">${t.hints.map(h => `<li>${escHtml(h)}</li>`).join('')}</ul>
    </div>
  `).join('');

  const notes = load('dt_speak', []);
  const el = document.getElementById('savedSpeakNotes');
  if (notes.length) {
    el.innerHTML = '<div style="font-size:.85rem;color:var(--text-muted);margin-bottom:8px">📋 Saved Notes</div>' +
      notes.map(n => `<div class="entry-card"><div class="entry-date"><span>📅 ${formatDate(n.date)}</span></div><div class="entry-text">${escHtml(n.text)}</div></div>`).join('');
  }
}

function saveSpeakNotes() {
  const text = document.getElementById('speakNotes').value.trim();
  if (!text) { showToast('⚠️ Write your notes first!'); return; }
  speakNotesList.unshift({ date: todayStr(), text });
  save('dt_speak', speakNotesList);
  document.getElementById('speakNotes').value = '';
  renderSpeaking();
  showToast('✅ Speaking notes saved!');
}

// ─── WEEKLY REFLECTION ────────────────────────────────────────────────────────
let reflections = load('dt_reflect', []);

function saveReflection() {
  const r1 = document.getElementById('ref1').value.trim();
  const r2 = document.getElementById('ref2').value.trim();
  const r3 = document.getElementById('ref3').value.trim();
  if (!r1 && !r2 && !r3) { showToast('⚠️ Fill at least one reflection prompt!'); return; }
  const weekLabel = getWeekLabel();
  reflections.unshift({ date: todayStr(), week: weekLabel, r1, r2, r3 });
  save('dt_reflect', reflections);
  document.getElementById('ref1').value = '';
  document.getElementById('ref2').value = '';
  document.getElementById('ref3').value = '';
  renderReflections();
  showToast('✅ Reflection saved! Sehr gut!');
}

function getWeekLabel() {
  const d = new Date();
  const start = new Date(d); start.setDate(d.getDate() - d.getDay() + 1);
  const end = new Date(start); end.setDate(start.getDate() + 6);
  const fmt = dt => dt.toLocaleDateString('en-GB', { day:'numeric', month:'short' });
  return `Week of ${fmt(start)} – ${fmt(end)}`;
}

function renderReflections() {
  const el = document.getElementById('reflectionList');
  if (!reflections.length) {
    el.innerHTML = '<div class="empty-state"><div class="empty-icon">🪞</div><div>No reflections yet. Do your first one this Sunday!</div></div>';
    return;
  }
  el.innerHTML = reflections.map((r, i) => `
    <div class="reflect-entry">
      <div class="reflect-week">📅 ${r.week || formatDate(r.date)}</div>
      ${r.r1 ? `<div class="reflect-block"><div class="reflect-block-label">Was hat sich verbessert?</div><div class="reflect-text">${escHtml(r.r1)}</div></div>` : ''}
      ${r.r2 ? `<div class="reflect-block"><div class="reflect-block-label">Was war schwierig?</div><div class="reflect-text">${escHtml(r.r2)}</div></div>` : ''}
      ${r.r3 ? `<div class="reflect-block"><div class="reflect-block-label">Ziel für nächste Woche</div><div class="reflect-text">${escHtml(r.r3)}</div></div>` : ''}
      <button class="btn btn-danger btn-sm" style="margin-top:10px" onclick="deleteReflection(${i})">🗑 Delete</button>
    </div>
  `).join('');
}

function deleteReflection(i) {
  if (!confirm('Delete this reflection?')) return;
  reflections.splice(i, 1);
  save('dt_reflect', reflections);
  renderReflections();
  showToast('Reflection deleted.');
}

// ─── GRAMMAR ──────────────────────────────────────────────────────────────────
function renderGrammar() {
  document.getElementById('allTips').innerHTML = GRAMMAR_TIPS.map((t,i) => `
    <div class="tip-card" style="margin-bottom:14px">
      <div class="tip-num">Tip ${i+1}</div>
      <div class="tip-rule">${t.rule}</div>
      <div class="tip-example">${escHtml(t.example)}</div>
    </div>
  `).join('');
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
    { q: "___ Datenbank", options: ["der", "die", "das"], a: "die" }
  ],
  sentence: [
    { q: "ich / Java / lerne", options: ["Ich lerne Java.", "Java ich lerne.", "Ich Java lerne.", "Lerne ich Java."], a: "Ich lerne Java." },
    { q: "Entwickler / bin / ich", options: ["Ich bin Entwickler.", "Entwickler ich bin.", "Bin ich Entwickler.", "Ich Entwickler bin."], a: "Ich bin Entwickler." },
    { q: "müde / bin / ich", options: ["Ich bin müde.", "Müde ich bin.", "Bin müde ich.", "Ich müde bin."], a: "Ich bin müde." },
    { q: "wohnen / in / Berlin / wir", options: ["Wir wohnen in Berlin.", "In Berlin wir wohnen.", "Wohnen in Berlin wir.", "Wir in Berlin wohnen."], a: "Wir wohnen in Berlin." },
    { q: "nicht / gut / schlafe / ich", options: ["Ich schlafe nicht gut.", "Ich nicht schlafe gut.", "Gut ich schlafe nicht.", "Schlafe ich nicht gut."], a: "Ich schlafe nicht gut." },
    { q: "arbeiten / heute / wir", options: ["Wir arbeiten heute.", "Heute wir arbeiten.", "Wir heute arbeiten.", "Arbeiten wir heute."], a: "Wir arbeiten heute." }
  ]
};

let quizState = { questions: [], idx: 0, score: 0 };

function startQuiz(type) {
  let questions = [];
  if (type === 'vocab' || type === 'weekly') {
    let source = vocab;
    if (type === 'weekly') {
      const wkTs = Date.now() - 7*86400000;
      source = vocab.filter(v => new Date(v.date).getTime() > wkTs);
      if (source.length < 4) source = vocab; // fallback if list too short
    }
    if (source.length < 4) {
      showToast('⚠️ You need at least 4 vocabulary words to play this quiz!');
      return;
    }
    source = [...source].sort(()=>0.5-Math.random());
    const subset = source.slice(0, 10);
    questions = subset.map(v => {
      const isDeToEn = Math.random() > 0.5;
      const q = isDeToEn ? v.de + " = ?" : v.en + " = ?";
      const a = isDeToEn ? v.en : v.de;
      
      const distractors = [...vocab]
        .filter(x => x.de !== v.de)
        .sort(()=>0.5-Math.random())
        .slice(0, 3)
        .map(x => isDeToEn ? x.en : x.de);
      
      const opts = [a, ...distractors].sort(()=>0.5-Math.random());
      return { q, options: opts, a };
    });
  } else {
    questions = [...QUIZ_BANKS[type]].sort(()=>0.5-Math.random()).slice(0, 10);
  }

  quizState = { questions, idx: 0, score: 0 };
  document.getElementById('quizMenu').style.display = 'none';
  document.getElementById('quizResult').style.display = 'none';
  document.getElementById('quizActive').style.display = 'block';
  
  const labels = { vocab: 'Vocabulary Quiz', article: 'Article Quiz', sentence: 'Sentence Order', weekly: 'Weekly Review' };
  document.getElementById('quizTypeLabel').textContent = labels[type];
  
  renderQuestion();
}

function renderQuestion() {
  const c = quizState;
  const q = c.questions[c.idx];
  document.getElementById('quizProgress').textContent = `${c.idx + 1} / ${c.questions.length}`;
  document.getElementById('quizQuestion').textContent = q.q;
  
  const optsEl = document.getElementById('quizOptions');
  optsEl.innerHTML = q.options.map((opt) => `
    <button class="quiz-opt" onclick="selectAnswer('${opt.replace(/'/g,"\\'")}', this)">${escHtml(opt)}</button>
  `).join('');
  document.getElementById('quizNextBtn').style.display = 'none';
}

function selectAnswer(ans, btn) {
  if (document.querySelector('.quiz-opt.correct') || document.querySelector('.quiz-opt.wrong')) return;
  
  const c = quizState;
  const correctAns = c.questions[c.idx].a;
  
  document.querySelectorAll('.quiz-opt').forEach(b => {
    if (b.textContent === correctAns) b.classList.add('correct');
    else if (b === btn) b.classList.add('wrong');
    b.disabled = true;
  });
  
  if (ans === correctAns) {
    c.score++;
    showToast('✅ Richtig!');
  } else {
    showToast('❌ Falsch!');
  }
  
  document.getElementById('quizNextBtn').style.display = 'block';
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
  document.getElementById('quizActive').style.display = 'none';
  document.getElementById('quizResult').style.display = 'block';
  document.getElementById('quizScore').textContent = `${quizState.score} / ${quizState.questions.length}`;
}

function quitQuiz() {
  document.getElementById('quizActive').style.display = 'none';
  document.getElementById('quizResult').style.display = 'none';
  document.getElementById('quizMenu').style.display = 'block';
}

// ─── AUDIO & SPEECH (No Backend) ──────────────────────────────────────────────
function speakWord(word) {
  const synth = window.speechSynthesis;
  if (!synth) { showToast('⚠️ Your browser does not support text-to-speech.'); return; }
  const utterThis = new SpeechSynthesisUtterance(word);
  utterThis.lang = 'de-DE';
  synth.speak(utterThis);
}

function checkPronunciation() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) { showToast('⚠️ Browser unsupported. Use Google Chrome!'); return; }
  
  const target = document.getElementById('targetPronunciation').value.trim();
  if(!target) { showToast('⚠️ Type a word or sentence to practice first!'); return; }
  
  const recognition = new SpeechRecognition();
  recognition.lang = 'de-DE';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  
  const resEl = document.getElementById('pronunciationResult');
  resEl.textContent = 'Listening... Speak now!';
  resEl.style.color = 'var(--text)';
  
  recognition.start();
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if(transcript.toLowerCase() === target.toLowerCase()) {
      resEl.textContent = `✅ Perfect! You said: "${transcript}"`;
      resEl.style.color = 'var(--accent3)';
    } else {
      resEl.textContent = `❌ Heard: "${transcript}" (Try again!)`;
      resEl.style.color = 'var(--danger)';
    }
  };
  recognition.onerror = () => { resEl.textContent = '⚠️ Mic Error or No Speech Detected'; resEl.style.color = 'var(--danger)'; };
}

let mediaRecorder;
let audioChunks = [];
let audioDb = load('dt_audio', []);

function toggleRecording() {
  const btn = document.getElementById('btnRecord');
  const status = document.getElementById('recordingStatus');
  
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    btn.textContent = '🔴 Start Recording';
    btn.classList.replace('btn-outline', 'btn-danger');
    status.style.display = 'none';
    return;
  }

  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
    btn.textContent = '⏹ Stop Recording';
    btn.classList.replace('btn-danger', 'btn-outline');
    status.style.display = 'block';

    mediaRecorder.addEventListener("dataavailable", event => { audioChunks.push(event.data); });

    mediaRecorder.addEventListener("stop", () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = () => {
        const base64Audio = reader.result;
        audioDb.unshift({ date: todayStr(), id: Date.now(), base64: base64Audio });
        if(audioDb.length > 3) audioDb.pop(); // Keep max 3 locally to avoid blowing up Quota
        save('dt_audio', audioDb);
        audioChunks = [];
        renderAudio();
        showToast('🎙️ Audio saved safely in your browser!');
      };
      // Stop mic tracks
      stream.getTracks().forEach(track => track.stop());
    });
  }).catch(e => {
    showToast('⚠️ Microphone access denied or not available.');
  });
}

function renderAudio() {
  const el = document.getElementById('audioList');
  if(!el) return;
  if (!audioDb.length) { el.innerHTML='<div class="empty-state">No recordings yet. Do your first one!</div>'; return; }
  el.innerHTML = audioDb.map(a => `
    <div style="background:var(--surface2);padding:14px;border-radius:10px;border:1px solid var(--border)">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <span style="font-size:0.8rem;color:var(--text-muted);font-weight:600">📅 ${formatDate(a.date)}</span>
      </div>
      <audio controls src="${a.base64}" style="width:100%;height:40px"></audio>
      <button class="btn btn-outline btn-sm" onclick="deleteAudio(${a.id})" style="margin-top:10px;font-size:0.75rem">🗑 Delete</button>
    </div>
  `).join('');
}

function deleteAudio(id) {
  if(!confirm('Delete this recording?')) return;
  audioDb = audioDb.filter(a => a.id !== id);
  save('dt_audio', audioDb);
  renderAudio();
  showToast('Recording deleted.');
}

// ─── INIT ─────────────────────────────────────────────────────────────────────






let timeTrackerInterval;
function initTimeTracker() {
  let mins = load('dt_time_' + todayStr(), 0);
  const display = document.getElementById('timeTrackerDisplay');
  if (display) display.textContent = mins + ' mins today';
  
  // Update every 60 seconds
  timeTrackerInterval = setInterval(() => {
    mins++;
    save('dt_time_' + todayStr(), mins);
    if (display) display.textContent = mins + ' mins today';
    renderHeatmap(); // Live update the heatmap color!
  }, 60000);
}

document.addEventListener('DOMContentLoaded', () => {
  initTimeTracker();
  renderDashboard();
  initDiary();
  updateFlashcard();
  updateTodayWordCount();
  renderAudio();
});

// Added Features
let dictationWord='';
function buildSentence(){
 document.getElementById('sbResult').innerText=
 `${document.getElementById('sbSub').value} ${document.getElementById('sbVerb').value} ${document.getElementById('sbObj').value}.`;
}
function renderSRS() {
  const el = document.getElementById('srsDueList');
  if(!el) return;

  const now = Date.now();
  const due = vocab.filter(v => !v.nextReview || v.nextReview <= now);
  
  if(due.length === 0) {
    el.innerHTML = '<div style="padding:20px;text-align:center;color:var(--success)">&#127881; You have caught up on all your reviews!</div>';
    return;
  }
  
  const w = due[0];
  const vIdx = vocab.findIndex(v => v.de === w.de);
  
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
  if(!w) return;
  
  const now = Date.now();
  let daysToAdd = 0;
  if(rating === 1) daysToAdd = 0.001; // 1.4 minutes
  else if(rating === 2) daysToAdd = 1;
  else if(rating === 3) daysToAdd = 3;
  else if(rating === 4) daysToAdd = 7;
  
  w.nextReview = now + (daysToAdd * 86400000);
  save('dt_vocab', vocab);
  renderSRS();
}
function startDictation(){
 const v=JSON.parse(localStorage.getItem('dt_vocab')||'[]');
 if(!v.length){alert('Add vocab first');return;}
 dictationWord=v[Math.floor(Math.random()*v.length)].de;
 speechSynthesis.speak(new SpeechSynthesisUtterance(dictationWord));
}
function checkDictation(){
 const a=document.getElementById('dictationAnswer').value.trim();
 document.getElementById('dictationResult').innerText=a.toLowerCase()==dictationWord.toLowerCase()?'Correct':'Wrong: '+dictationWord;
}
document.addEventListener('DOMContentLoaded',renderSRS);

function toggleDropdown(e) {
  e.stopPropagation();
  const dropdown = document.getElementById('moreDropdown');
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  
  // Use fixed positioning to escape overflow:auto clipping
  dropdown.style.position = 'fixed';
  dropdown.style.top = (rect.bottom + 4) + 'px';
  dropdown.style.right = (window.innerWidth - rect.right) + 'px';
  dropdown.style.left = 'auto';
  
  dropdown.classList.toggle('show');
}

window.onclick = function(event) {
  if (!event.target.matches('.drop-btn') && !event.target.closest('.drop-btn')) {
    const dropdown = document.getElementById('moreDropdown');
    if (dropdown && dropdown.classList.contains('show')) {
      dropdown.classList.remove('show');
    }
  }
}

// --- DAILY WORD & SENTENCE (OFFLINE DATABASE) ---
const DAILY_WORDS = [
  {de: "die Datenbank", en: "database"}, {de: "die Schnittstelle", en: "interface"},
  {de: "entwickeln", en: "to develop"}, {de: "die Herausforderung", en: "challenge"},
  {de: "erfolgreich", en: "successful"}, {de: "das Ziel", en: "goal"},
  {de: "verbessern", en: "to improve"}, {de: "die Entscheidung", en: "decision"},
  {de: "die Zukunft", en: "future"}, {de: "die L�sung", en: "solution"},
  {de: "die Erfahrung", en: "experience"}, {de: "versuchen", en: "to try"},
  {de: "die Anwendung", en: "application"}, {de: "die Umgebung", en: "environment"},
  {de: "das Unternehmen", en: "company"}, {de: "die Besprechung", en: "meeting"},
  {de: "teilnehmen", en: "to participate"}, {de: "unterst�tzen", en: "to support"},
  {de: "die Verantwortung", en: "responsibility"}, {de: "unabh�ngig", en: "independent"},
  {de: "erkl�ren", en: "to explain"}, {de: "der Fehler", en: "error / bug"},
  {de: "hinzuf�gen", en: "to add"}, {de: "l�schen", en: "to delete / erase"},
  {de: "speichern", en: "to save"}, {de: "die Leistung", en: "performance"},
  {de: "die Bedingung", en: "condition"}, {de: "verf�gbar", en: "available"},
  {de: "die Sicherheit", en: "security"}, {de: "das Netzwerk", en: "network"},
  {de: "der Benutzer", en: "user"}, {de: "die Erlaubnis", en: "permission"},
  {de: "die Nachricht", en: "message"}, {de: "verstehen", en: "to understand"},
  {de: "die Ausbildung", en: "education / training"}, {de: "die Kenntnisse", en: "skills / knowledge"},
  {de: "der Vertrag", en: "contract"}, {de: "das Gehalt", en: "salary"},
  {de: "die Bewerbung", en: "application (job)"}, {de: "der Lebenslauf", en: "resume"},
  {de: "vorbereiten", en: "to prepare"}, {de: "die Gelegenheit", en: "opportunity"},
  {de: "die Anforderung", en: "requirement"}, {de: "die Bereitstellung", en: "deployment"},
  {de: "die Architektur", en: "architecture"}, {de: "zuverl�ssig", en: "reliable"}
];
const DEFAULT_SENTENCES = [
  { de: 'Hallo, wie geht es dir?', en: 'Hello, how are you?' },
  { de: 'Mir geht es gut, danke.', en: 'I am doing well, thank you.' },
  { de: 'Ich bin mit dem aktuellen Stand sehr zufrieden.', en: 'I am very satisfied with the current status.' }
];
let DAILY_SENTENCES = load('dt_sentences', []);
let sentences_pool = load('dt_sentences_pool', DEFAULT_SENTENCES);


  // FIX CORRUPTED SENTENCES
  if(DAILY_SENTENCES.length > 0 && DAILY_SENTENCES[0].de === 'Hallo') {
    console.log("Wiping corrupted sentences array...");
    DAILY_SENTENCES = [];
    sentences_pool = [];
    localStorage.removeItem('dt_sentences');
    localStorage.removeItem('dt_sentences_pool');
  }
  
function loadDailyInspiration() {
    const w = DAILY_WORDS[Math.floor(Math.random() * DAILY_WORDS.length)];
    const allSents = [...DAILY_SENTENCES, ...sentences_pool];
  const s = allSents.length > 0 ? allSents[Math.floor(Math.random() * allSents.length)] : {de: 'Lerne jeden Tag!', en: 'Learn every day!'};
  
  const wdEl = document.getElementById('wotdDe');
  if(wdEl) { wdEl.innerText = w.de; document.getElementById('wotdEn').innerText = w.en; }
  const sdEl = document.getElementById('sotdDe');
  if(sdEl) { sdEl.innerText = s.de; document.getElementById('sotdEn').innerText = s.en; }
}

// --- SENTENCE BUILDER IN DIARY ---
function setupSentenceBuilder() {
  const wordEl = document.getElementById('builderWord');
  if(!wordEl) return;
  if(vocab.length > 0) {
    const randomVocab = vocab[Math.floor(Math.random() * vocab.length)];
    wordEl.innerText = randomVocab.de;
  } else {
    wordEl.innerText = "lernen"; // fallback
  }
}

// Override diary init
const oldInitDiary = typeof initDiary !== "undefined" ? initDiary : function(){};
initDiary = function() {
  oldInitDiary();
  setupSentenceBuilder();
};

// Override save diary
const oldSaveDiary = typeof saveDiaryEntry !== "undefined" ? saveDiaryEntry : function(){};
saveDiaryEntry = function() {
  const p1 = document.getElementById('prompt1').value.trim();
  const p2 = document.getElementById('prompt2').value.trim();
  const p3 = document.getElementById('prompt3').value.trim();
  const p4 = document.getElementById('prompt4').value.trim(); // sentence builder
  const p5 = document.getElementById('prompt5')?.value.trim() || ''; // free writing
  
  if (!p1 && !p2 && !p3 && !p4) { showToast('?? Please fill at least one prompt!'); return; }
  const entry = { date: todayStr(), ts: Date.now(), p1, p2, p3, p4, p5 };
  diaryEntries.unshift(entry);
  save('dt_entries', diaryEntries);
  clearDiary();
  renderDashboard();
  setupSentenceBuilder();
  showToast('? Diary & Sentence saved!');
};

const oldClearDiary = clearDiary;
clearDiary = function() {
  oldClearDiary();
  if(document.getElementById('prompt4')) document.getElementById('prompt4').value = '';
  if(document.getElementById('prompt5')) document.getElementById('prompt5').value = '';
};

// --- SRS LOGIC ---
// Override reveal flash
const oldRevealFlash = revealFlash;
revealFlash = function() {
  if (!vocab.length) return;
  document.getElementById('flashBack').textContent = vocab[flashIndex]?.en ?? '';
  document.getElementById('srsButtons').style.display = 'flex';
  document.getElementById('nextFlashBtn').style.display = 'none';
};

function submitSrs(difficulty) {
  if(!vocab.length) return;
  let word = vocab[flashIndex];
  let days = 1;
  if(difficulty === 'good') days = 3;
  if(difficulty === 'easy') days = 7;
  
  let nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + days);
  word.dueDate = nextDate.toISOString().split('T')[0];
  
  save('dt_vocab', vocab);
  showToast('Next review: ' + days + ' days');
  nextFlash();
}

// Override next flash
const oldNextFlash = nextFlash;
nextFlash = function() {
  document.getElementById('srsButtons').style.display = 'none';
  document.getElementById('nextFlashBtn').style.display = 'inline-flex';
  
  // Prioritize due words
  const today = todayStr();
  let dueWords = vocab.filter(v => !v.dueDate || v.dueDate <= today);
  
  if(dueWords.length === 0) {
    document.getElementById('flashFront').textContent = '?? All caught up!';
    document.getElementById('flashBack').textContent = 'No words due today.';
    document.getElementById('nextFlashBtn').style.display = 'none';
    return;
  }
  
  flashIndex = vocab.indexOf(dueWords[Math.floor(Math.random() * dueWords.length)]);
  document.getElementById('flashFront').textContent = vocab[flashIndex].de;
  document.getElementById('flashBack').textContent = '';
};

// Hook initialization
document.addEventListener('DOMContentLoaded', () => {
  loadDailyInspiration();
  setTimeout(setupSentenceBuilder, 500); // ensure elements exist
});



// --- ADVANCED QUIZZES (MCQ & LISTENING) ---
const oldStartQuiz = typeof startQuiz !== "undefined" ? startQuiz : function(){};
startQuiz = function(type) {
  if (type === 'listening' || type === 'mcq') {
    
      const allItems = [...vocab, ...DAILY_SENTENCES];
      if (allItems.length < 4) { showToast('?? Add at least 4 items (words or sentences) first!'); return; }
      quizState.type = type;
      quizState.score = 0;
      quizState.idx = 0;
      
      // Generate 10 random questions
      quizState.questions = [];
      for(let i=0; i<10; i++) {
        let target = allItems[Math.floor(Math.random() * allItems.length)];
        // Get 3 random wrong options
        let wrongs = allItems.filter(v => v.de !== target.de).sort(()=>0.5-Math.random()).slice(0, 3);
      let options = [target.en, ...wrongs.map(w => w.en)].sort(()=>0.5-Math.random());
      
      quizState.questions.push({
        de: target.de,
        options: options,
        answer: target.en
      });
    }
    
    document.getElementById('quizMenu').style.display = 'none';
    document.getElementById('quizActive').style.display = 'block';
    renderQuestion();
  } else {
    // fallback to original if exists
    if(typeof oldStartQuiz === 'function') oldStartQuiz(type);
  }
};

const oldRenderQuestion = typeof renderQuestion !== "undefined" ? renderQuestion : function(){};
renderQuestion = function() {
  if (quizState.type === 'listening' || quizState.type === 'mcq') {
    const q = quizState.questions[quizState.idx];
    document.getElementById('quizProgress').textContent = (quizState.idx + 1) + ' / ' + quizState.questions.length;
    document.getElementById('quizTypeLabel').textContent = quizState.type === 'listening' ? '?? Listening' : '?? MCQ';
    
    if (quizState.type === 'listening') {
      document.getElementById('quizQuestion').innerHTML = '<button class="btn btn-primary" onclick="speakWord(\'' + q.de.replace(/'/g,"\\'") + '\')">?? Play Audio</button>';
      speakWord(q.de); // auto play
    } else {
      document.getElementById('quizQuestion').textContent = q.de;
    }
    
    document.getElementById('quizOptions').innerHTML = q.options.map((opt, i) => `
      <button class="quiz-opt" id="opt${i}" onclick="checkAnswer('${opt.replace(/'/g,"\\'")}', ${i}, '${q.answer.replace(/'/g,"\\'")}')">${opt}</button>
    `).join('');
    
    document.getElementById('quizNextBtn').style.display = 'none';
  } else {
    if(typeof oldRenderQuestion === 'function') oldRenderQuestion();
  }
};

const oldCheckAnswer = typeof checkAnswer !== "undefined" ? checkAnswer : function(){};
checkAnswer = function(ans, btnIdx, correctAns) {
  if (quizState.type === 'listening' || quizState.type === 'mcq') {
    document.querySelectorAll('.quiz-opt').forEach(b => b.disabled = true);
    if (ans === correctAns) {
      document.getElementById('opt'+btnIdx).classList.add('correct');
      quizState.score++;
      showToast('? Correct!');
    } else {
      document.getElementById('opt'+btnIdx).classList.add('wrong');
      // Highlight correct answer
      let opts = document.querySelectorAll('.quiz-opt');
      opts.forEach(b => { if(b.innerText === correctAns) b.classList.add('correct'); });
      showToast('? Wrong!');
    }
    document.getElementById('quizNextBtn').style.display = 'block';
  } else {
    if(typeof oldCheckAnswer === 'function') oldCheckAnswer(ans, btnIdx, correctAns);
  }
};



document.querySelector('nav').addEventListener('scroll', () => {
  const dropdown = document.getElementById('moreDropdown');
  if (dropdown && dropdown.classList.contains('show')) {
    dropdown.classList.remove('show');
  }
});


// --- DATA BACKUP & RESTORE ---
function exportData() {
  const data = {
    dt_entries: load('dt_entries', []),
    dt_vocab: load('dt_vocab', []),
    dt_speak: load('dt_speak', []),
    dt_sentences: load('dt_sentences', DEFAULT_SENTENCES),
    dt_stories: load('dt_stories', DEFAULT_STORIES)
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'deutsches_tagebuch_backup_' + todayStr() + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast('? Backup Downloaded!');
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data.dt_entries) save('dt_entries', data.dt_entries);
      if (data.dt_vocab) save('dt_vocab', data.dt_vocab);
      if (data.dt_speak) save('dt_speak', data.dt_speak);
      if (data.dt_sentences) save('dt_sentences', data.dt_sentences);
      if (data.dt_stories) save('dt_stories', data.dt_stories);
      showToast('?? Backup Restored Successfully!');
      setTimeout(() => location.reload(), 1000);
    } catch (err) {
      showToast('? Error: Invalid Backup File');
    }
  };
  reader.readAsText(file);
}


// --- CSV BULK IMPORT ---
function importCsv(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    let userLvl = window.prompt("What level are the contents of this file? (Type A1, A2, B1, B2, C1, or MIXED)", "MIXED");
    if (!userLvl) return;
    userLvl = userLvl.trim().toUpperCase();
    if (!['A1','A2','B1','B2','C1','MIXED'].includes(userLvl)) userLvl = 'MIXED';

    const reader = new FileReader();
    reader.onload = function(e) {
      const text = e.target.result;
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      let added = 0;
      
      lines.forEach((line, i) => {
        const parts = line.split(',');
        if (parts.length >= 2) {
          const de = parts[0].trim();
          const en = parts[1].trim();
          let explicitLvl = parts.length > 2 ? parts[2].trim().toUpperCase() : null;
          
          let itemLvl = userLvl;
          if (explicitLvl && ['A1','A2','B1','B2','C1'].includes(explicitLvl)) itemLvl = explicitLvl;
          else if (userLvl === 'MIXED') {
            const pct = i / lines.length;
            if (pct < 0.25) itemLvl = 'A1';
            else if (pct < 0.5) itemLvl = 'A2';
            else if (pct < 0.75) itemLvl = 'B1';
            else itemLvl = 'B2';
          }
          
          if (de && en && !vocab_pool.find(v => v.de === de) && !vocab.find(v => v.de === de)) {
            vocab_pool.push({ de, en, cat: 'CSV', ts: Date.now(), lvl: itemLvl });
            added++;
          }
        }
      });
      save('dt_vocab_pool', vocab_pool);
      showToast(`Added ${added} new words to the hidden pool!`, 'var(--success)');
      localStorage.removeItem('dt_last_unlock');
      checkDailyUnlock();
    };
    reader.readAsText(file);
}


// --- READING COMPREHENSION ---
const DEFAULT_STORIES = [
  {
    "title": "[A1] Hallo, ich bin Anna!",
    "text": "Hallo! Ich heiße Anna und ich bin fünfundzwanzig Jahre alt. Ich komme aus Deutschland und ich wohne in Berlin. Berlin ist sehr groß und schön. Ich arbeite als Lehrerin in einer Schule. Mein Hobby ist lesen. Ich lese jeden Abend ein Buch. Ich habe auch einen Hund. Er heißt Max und ist sehr freundlich. Am Wochenende spiele ich oft mit Max im Park.",
    "questions": [
      {
        "text": "1. Anna wohnt in München.",
        "answer": false
      },
      {
        "text": "2. Anna arbeitet als Lehrerin.",
        "answer": true
      },
      {
        "text": "3. Annas Hund heißt Max.",
        "answer": true
      }
    ]
  },
  {
    "title": "[A1] Mein Tag",
    "text": "Ich stehe jeden Tag um sieben Uhr auf. Zuerst trinke ich einen Kaffee und esse Brot mit Marmelade. Dann dusche ich und ziehe mich an. Um acht Uhr fahre ich mit dem Bus zur Arbeit. Ich arbeite von neun bis fünfzehn Uhr im Büro. Am Nachmittag kaufe ich im Supermarkt ein. Ich kaufe Äpfel, Bananen und Milch. Am Abend koche ich das Abendessen. Ich esse Nudeln mit Tomatensoße. Um elf Uhr gehe ich schlafen.",
    "questions": [
      {
        "text": "1. Die Person fährt mit dem Zug zur Arbeit.",
        "answer": false
      },
      {
        "text": "2. Sie kauft Obst und Milch im Supermarkt.",
        "answer": true
      },
      {
        "text": "3. Am Abend isst sie Pizza.",
        "answer": false
      }
    ]
  },
  {
    "title": "[A2] Ein Urlaub in Italien",
    "text": "Letztes Jahr bin ich mit meiner Familie nach Italien gefahren. Wir haben ein kleines Haus am Meer gemietet. Das Wetter war die ganze Woche sehr sonnig und warm. Jeden Morgen sind wir früh aufgestanden und an den Strand gegangen. Das Wasser war sehr klar. Mittags haben wir oft Pizza oder Pasta gegessen. Das italienische Essen ist wirklich fantastisch! Am Abend sind wir durch die kleine Stadt spaziert und haben Eis gegessen. Es war ein wunderbarer Urlaub und wir möchten nächstes Jahr wieder dorthin fahren.",
    "questions": [
      {
        "text": "1. Die Familie hat ein großes Hotel am Strand gemietet.",
        "answer": false
      },
      {
        "text": "2. Sie haben jeden Mittag Pizza oder Pasta gegessen.",
        "answer": true
      },
      {
        "text": "3. Das Wetter war schlecht und kalt.",
        "answer": false
      }
    ]
  },
  {
    "title": "[A2] Einkaufen im Einkaufszentrum",
    "text": "Gestern war ich mit meiner Freundin Sarah im Einkaufszentrum. Sarah brauchte eine neue Jacke für den Winter. Wir waren in vielen verschiedenen Geschäften. Zuerst hat sie eine rote Jacke probiert, aber sie war zu teuer. Dann hat sie eine blaue Jacke gefunden. Sie war im Angebot und sah sehr gut aus. Sie hat die blaue Jacke gekauft. Danach waren wir noch einen Kaffee trinken und haben ein Stück Kuchen gegessen. Es war ein schöner, aber anstrengender Nachmittag.",
    "questions": [
      {
        "text": "1. Sarah hat eine rote Jacke gekauft.",
        "answer": false
      },
      {
        "text": "2. Die blaue Jacke war im Angebot.",
        "answer": true
      },
      {
        "text": "3. Nach dem Einkaufen haben sie Kuchen gegessen.",
        "answer": true
      }
    ]
  },
  {
    "title": "[B1] Ein neues Projekt",
    "text": "Das Softwareunternehmen 'TechSolutions' startet heute ein neues Projekt. Das Ziel ist es, eine mobile App für Studenten zu entwickeln. Die App soll den Studenten helfen, ihren Stundenplan besser zu organisieren. Der Projektleiter, Herr Müller, hat ein Team von fünf Entwicklern zusammengestellt. Das Team nutzt agile Methoden und plant wöchentliche Sprints. In der ersten Phase konzentrieren sie sich auf das Design der Benutzeroberfläche. Nächste Woche beginnen sie dann mit der Programmierung der Datenbank.",
    "questions": [
      {
        "text": "1. Das Unternehmen entwickelt eine App für Rentner.",
        "answer": false
      },
      {
        "text": "2. Das Team besteht aus fünf Entwicklern.",
        "answer": true
      },
      {
        "text": "3. Die Programmierung der Datenbank beginnt sofort.",
        "answer": false
      }
    ]
  },
  {
    "title": "[B2] Das Server-Update in der Nacht",
    "text": "Es war Freitagabend, 23:00 Uhr. Julian, ein Systemadministrator, trank seinen dritten Kaffee. Das Unternehmen hatte beschlossen, alle Server auf eine neue Linux-Version zu aktualisieren. Eigentlich sollte das automatisch passieren, aber ein Skript war fehlerhaft. Julian musste sich manuell per SSH auf jeden Server einloggen und das Update starten. Um 3:00 Uhr morgens war er endlich fertig. Er testete die Webseite: Sie war online und reagierte doppelt so schnell wie vorher. Erschöpft, aber zufrieden, ging er nach Hause.",
    "questions": [
      {
        "text": "1. Das Update passierte vollautomatisch ohne Probleme.",
        "answer": false
      },
      {
        "text": "2. Julian arbeitete bis spät in die Nacht.",
        "answer": true
      },
      {
        "text": "3. Nach dem Update war die Webseite langsamer.",
        "answer": false
      }
    ]
  },
  {
    "title": "[B2] Der mysteriöse Bug",
    "text": "Seit zwei Wochen klagten die Nutzer der neuen App über Abstürze. Die Fehlermeldungen waren unklar. Das QA-Team konnte den Fehler nicht reproduzieren. Erst als die Entwicklerin Sarah sich die Log-Dateien genau ansah, fand sie das Muster. Der Absturz passierte nur, wenn ein Nutzer ein Profilbild hochlud, das größer als 5 Megabyte war. Der Speicher des Servers lief voll, weil das Bildbearbeitungs-Modul ein Speicherleck (Memory Leak) hatte. Sarah schrieb einen Fix, der die Bildgröße vor dem Upload komprimierte. Das Problem war gelöst.",
    "questions": [
      {
        "text": "1. Der Fehler passierte bei jedem Nutzer.",
        "answer": false
      },
      {
        "text": "2. Sarah fand den Fehler durch das Lesen der Log-Dateien.",
        "answer": true
      },
      {
        "text": "3. Das Problem war ein Memory Leak.",
        "answer": true
      }
    ]
  }
];
let STORIES = load('dt_stories', []);
let stories_pool = load('dt_stories_pool', DEFAULT_STORIES);

let currentStory = null;

function loadStory(index) {
  currentStory = STORIES[index];
  document.getElementById('readingContent').style.display = 'block';
  document.getElementById('readingQuestions').style.display = 'block';
  
  document.getElementById('storyTitle').innerText = currentStory.title;
  document.getElementById('storyText').innerHTML = currentStory.text;
  
  for(let i=1; i<=3; i++) {
    document.getElementById('q'+i+'Text').innerText = currentStory.questions[i-1].text;
    document.getElementById('q'+i+'Res').innerText = '';
  }
}

function checkReading(qNum, userAnswer) {
  if (!currentStory) return;
  const correct = currentStory.questions[qNum-1].answer;
  const resEl = document.getElementById('q'+qNum+'Res');
  if (userAnswer === correct) {
    resEl.innerText = '? Richtig!';
    resEl.style.color = 'var(--success)';
  } else {
    resEl.innerText = '? Falsch!';
    resEl.style.color = 'var(--danger)';
  }
}


// --- B2 GRAMMAR & VERB QUIZZES ---
const GRAMMAR_QUESTIONS = [
  { text: "Ich fahre mit ___ Auto zur Arbeit.", options: ["dem", "das", "den", "der"], answer: "dem" },
  { text: "Wir danken ___ f�r die Hilfe.", options: ["Sie", "Ihre", "Ihnen", "Ihr"], answer: "Ihnen" },
  { text: "Er legt das Buch auf ___ Tisch.", options: ["den", "dem", "der", "das"], answer: "den" },
  { text: "Das Buch liegt auf ___ Tisch.", options: ["den", "dem", "der", "das"], answer: "dem" },
  { text: "Ich erinnere mich nicht ___ seinen Namen.", options: ["an", "auf", "�ber", "f�r"], answer: "an" },
  { text: "Trotz ___ Regens gehen wir spazieren.", options: ["den", "dem", "des", "der"], answer: "des" }
];

const IRREGULAR_VERBS = [
  { inf: "gehen", praet: "ging", perf: "gegangen" },
  { inf: "sehen", praet: "sah", perf: "gesehen" },
  { inf: "schreiben", praet: "schrieb", perf: "geschrieben" },
  { inf: "bleiben", praet: "blieb", perf: "geblieben" },
  { inf: "sprechen", praet: "sprach", perf: "gesprochen" },
  { inf: "nehmen", praet: "nahm", perf: "genommen" }
];

const b2StartQuiz = typeof startQuiz !== "undefined" ? startQuiz : function(){};
startQuiz = function(type) {
  if (type === 'grammar') {
    quizState.type = 'grammar';
    quizState.score = 0; quizState.idx = 0;
    quizState.questions = [...GRAMMAR_QUESTIONS].sort(()=>0.5-Math.random()).slice(0, 5);
    document.getElementById('quizMenu').style.display = 'none';
    document.getElementById('quizActive').style.display = 'block';
    renderQuestion();
  } else if (type === 'verbs') {
    quizState.type = 'verbs';
    quizState.score = 0; quizState.idx = 0;
    let selectedVerbs = [...IRREGULAR_VERBS].sort(()=>0.5-Math.random()).slice(0, 5);
    quizState.questions = selectedVerbs.map(v => ({
      de: "Infinitive: <b>" + v.inf + "</b>",
      verb: v,
      options: [], answer: '' // manual input mode
    }));
    document.getElementById('quizMenu').style.display = 'none';
    document.getElementById('quizActive').style.display = 'block';
    renderQuestion();
  } else {
    b2StartQuiz(type);
  }
};

const b2RenderQuestion = typeof renderQuestion !== "undefined" ? renderQuestion : function(){};
renderQuestion = function() {
  if (quizState.type === 'grammar') {
    const q = quizState.questions[quizState.idx];
    document.getElementById('quizProgress').textContent = (quizState.idx + 1) + ' / ' + quizState.questions.length;
    document.getElementById('quizTypeLabel').textContent = '?? Grammar B2';
    document.getElementById('quizQuestion').textContent = q.text;
    document.getElementById('quizOptions').innerHTML = q.options.map((opt, i) => `
      <button class="quiz-opt" id="opt${i}" onclick="checkAnswer('${opt}', ${i}, '${q.answer}')">${opt}</button>
    `).join('');
    document.getElementById('quizNextBtn').style.display = 'none';
  } else if (quizState.type === 'verbs') {
    const q = quizState.questions[quizState.idx];
    document.getElementById('quizProgress').textContent = (quizState.idx + 1) + ' / ' + quizState.questions.length;
    document.getElementById('quizTypeLabel').textContent = '?? Irregular Verbs';
    document.getElementById('quizQuestion').innerHTML = q.de;
    
    // Custom Input UI for Verbs
    document.getElementById('quizOptions').innerHTML = `
      <div style="display:flex; flex-direction:column; gap:10px; align-items:center; width:100%">
        <input id="verbPraet" placeholder="Pr�teritum (e.g. ging)" style="width:80%; padding:10px; text-align:center">
        <input id="verbPerf" placeholder="Partizip II (e.g. gegangen)" style="width:80%; padding:10px; text-align:center">
        <button class="btn btn-primary" onclick="checkVerbAnswer()">Check</button>
        <div id="verbResult" style="font-weight:bold; margin-top:10px"></div>
      </div>
    `;
    document.getElementById('quizNextBtn').style.display = 'none';
  } else {
    b2RenderQuestion();
  }
};

function checkVerbAnswer() {
  const p1 = document.getElementById('verbPraet').value.trim().toLowerCase();
  const p2 = document.getElementById('verbPerf').value.trim().toLowerCase();
  const verb = quizState.questions[quizState.idx].verb;
  
  const resEl = document.getElementById('verbResult');
  if (p1 === verb.praet && p2 === verb.perf) {
    resEl.innerHTML = '? Correct!';
    resEl.style.color = 'var(--success)';
    quizState.score++;
  } else {
    resEl.innerHTML = '? Wrong! It is: <b>' + verb.praet + '</b> / <b>' + verb.perf + '</b>';
    resEl.style.color = 'var(--danger)';
  }
  document.getElementById('quizNextBtn').style.display = 'block';
}



// --- DIARY SELF-CORRECTION ---
const b2SaveDiary = typeof saveDiaryEntry !== "undefined" ? saveDiaryEntry : function(){};
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


function toggleWiki() {
  const el = document.getElementById('wikiContent');
  if (el.style.display === 'none') {
    el.style.display = 'block';
  } else {
    el.style.display = 'none';
  }
}


// Hook reading section to auto-load Story 1
const originalShowSectionReading = typeof showSection !== "undefined" ? showSection : function(){};
showSection = function(id) {
  originalShowSectionReading(id);
  if (id === 'reading' && document.getElementById('readingContent').style.display === 'none') {
    loadStory(0); // Auto-load the first story
  }
};


// --- DYNAMIC IMPORTERS ---
function importSentenceCsv(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    let userLvl = window.prompt("What level are the contents of this file? (Type A1, A2, B1, B2, C1, or MIXED)", "MIXED");
    if (!userLvl) return;
    userLvl = userLvl.trim().toUpperCase();
    if (!['A1','A2','B1','B2','C1','MIXED'].includes(userLvl)) userLvl = 'MIXED';

    const reader = new FileReader();
    reader.onload = function(e) {
      const text = e.target.result;
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      let added = 0;
      
      lines.forEach((line, i) => {
        const parts = line.split(',');
        if (parts.length >= 2) {
          const de = parts[0].trim();
          const en = parts[1].trim();
          let explicitLvl = parts.length > 2 ? parts[2].trim().toUpperCase() : null;
          
          let itemLvl = userLvl;
          if (explicitLvl && ['A1','A2','B1','B2','C1'].includes(explicitLvl)) itemLvl = explicitLvl;
          else if (userLvl === 'MIXED') {
            const pct = i / lines.length;
            if (pct < 0.25) itemLvl = 'A1';
            else if (pct < 0.5) itemLvl = 'A2';
            else if (pct < 0.75) itemLvl = 'B1';
            else itemLvl = 'B2';
          }
          
          if (de && en && !sentences_pool.find(s => s.de === de) && !DAILY_SENTENCES.find(s => s.de === de)) {
            sentences_pool.push({ de, en, lvl: itemLvl });
            added++;
          }
        }
      });
      save('dt_sentences_pool', sentences_pool);
      showToast(`Added ${added} new sentences to the hidden pool!`, 'var(--success)');
      localStorage.removeItem('dt_last_unlock');
      checkDailyUnlock();
    };
    reader.readAsText(file);
}

function importStoryJson(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    let userLvl = window.prompt("What level are the stories in this file? (Type A1, A2, B1, B2, C1, or MIXED)", "MIXED");
    if (!userLvl) return;
    userLvl = userLvl.trim().toUpperCase();
    if (!['A1','A2','B1','B2','C1','MIXED'].includes(userLvl)) userLvl = 'MIXED';

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const data = JSON.parse(e.target.result);
        if (!Array.isArray(data)) throw new Error('JSON must be an array of stories.');
        
        let added = 0;
        data.forEach((story, i) => {
          if (story.title && story.text && story.questions && story.questions.length === 3) {
            let explicitLvl = story.lvl ? story.lvl.toUpperCase() : null;
            let itemLvl = userLvl;
            
            if (explicitLvl && ['A1','A2','B1','B2','C1'].includes(explicitLvl)) itemLvl = explicitLvl;
            else if (userLvl === 'MIXED') {
              const pct = i / data.length;
              if (pct < 0.25) itemLvl = 'A1';
              else if (pct < 0.5) itemLvl = 'A2';
              else if (pct < 0.75) itemLvl = 'B1';
              else itemLvl = 'B2';
            }
            
            story.lvl = itemLvl;
            if (!stories_pool.find(s => s.title === story.title) && !STORIES.find(s => s.title === story.title)) {
              stories_pool.push(story);
              added++;
            }
          }
        });
        save('dt_stories_pool', stories_pool);
        showToast(`Added ${added} new stories to the hidden pool!`, 'var(--success)');
        localStorage.removeItem('dt_last_unlock');
        checkDailyUnlock();
      } catch(err) {
        showToast('? Error: Invalid Story JSON format', 'var(--danger)');
      }
    };
    reader.readAsText(file);
}

function updateStoryButtons() {
  if (STORIES.length > 3) document.getElementById('storyBtn3').style.display = 'inline-block';
  if (STORIES.length > 4) document.getElementById('storyBtn4').style.display = 'inline-block';
}

// Hook showSection to update story buttons if needed
const originalShowSectionReadingDynamic = showSection;
showSection = function(id) {
  originalShowSectionReadingDynamic(id);
  if (id === 'reading') {
    updateStoryButtons();
  }
};


async function fetchCsvFromWeb() {
  const url = prompt("Enter the raw CSV URL (e.g., a Raw GitHub link or public CSV):\n\nNote: The file must be in 'German,English' format.", "https://raw.githubusercontent.com/.../words.csv");
  if (!url || url.trim() === "" ) return;

  try {
    showToast('? Downloading from Web...', 'var(--gold)');
    const res = await fetch(url);
    if (!res.ok) throw new Error('Network response was not ok');
    
    const text = await res.text();
    const lines = text.split('\n');
    let added = 0;
    
    lines.forEach(line => {
      const parts = line.split(',');
      if (parts.length >= 2) {
        const de = parts[0].trim();
        const en = parts[1].trim();
        if (de && en && !vocab.find(v => v.de === de)) {
          vocab.push({ de, en, level: 0, nextReview: Date.now() });
          added++;
        }
      }
    });
    
    if (added > 0) {
      save('dt_vocab', vocab);
      renderVocab();
      showToast('?? Successfully imported ' + added + ' words from the Web!');
    } else {
      showToast('?? No new valid words found in that URL.');
    }
  } catch (error) {
    console.error("Fetch error: ", error);
    showToast('? Failed to fetch. Make sure it is a valid raw URL and allows CORS.', 'var(--danger)');
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
  
  save('dt_vocab_pool', vocab_pool);
  save('dt_vocab', vocab);
  save('dt_sentences_pool', sentences_pool);
  save('dt_sentences', DAILY_SENTENCES);
  save('dt_stories_pool', stories_pool);
  save('dt_stories', STORIES);
  
  // Clear last unlock so it unlocks today instantly
  localStorage.removeItem('dt_last_unlock');
}


// Tagging Migration
if (vocab_pool.length > 0 && !vocab_pool[0].lvl) {
  console.log("Tagging vocab pool with levels");
  const vLen = vocab_pool.length;
  vocab_pool.forEach((w, i) => {
    if (i < vLen * 0.25) w.lvl = 'A1';
    else if (i < vLen * 0.5) w.lvl = 'A2';
    else if (i < vLen * 0.75) w.lvl = 'B1';
    else w.lvl = 'B2';
  });
  save('dt_vocab_pool', vocab_pool);
  
  // also reset the last unlock to force an immediate demonstration of the new Smart Unlock today
  localStorage.removeItem('dt_last_unlock');
}

if (sentences_pool.length > 0 && !sentences_pool[0].lvl) {
  console.log("Tagging sentences pool with levels");
  const sLen = sentences_pool.length;
  sentences_pool.forEach((s, i) => {
    if (i < sLen * 0.25) s.lvl = 'A1';
    else if (i < sLen * 0.5) s.lvl = 'A2';
    else if (i < sLen * 0.75) s.lvl = 'B1';
    else s.lvl = 'B2';
  });
  save('dt_sentences_pool', sentences_pool);
}

function checkDailyUnlock() {
  const lastUnlock = load('dt_last_unlock', '');
  const today = todayStr();
  
  if (lastUnlock !== today) {
    let unlocked = 0;
    
    // ONE-TIME FIX: If the user is confused by having 25 words, wipe active vocab to let it cleanly pull exactly 10 today.
    if(vocab.length === 25) {
      console.log("Resetting 25 words back to 0 so we can pull exactly 10...");
      vocab_pool = [...vocab, ...vocab_pool];
      vocab = [];
    }
    const roadmap = load('dt_roadmap', {});
    const activeLevel = ['A1', 'A2', 'B1', 'B2'].find(l => !roadmap[l]) || 'B2';
    
    // Unlock 10 words
    for(let i=0; i<10; i++) {
      const idx = vocab_pool.findIndex(w => w.lvl === activeLevel);
      if(idx > -1) {
        const w = vocab_pool.splice(idx, 1)[0];
        if(!vocab.find(x => x.de === w.de)) { vocab.push(w); unlocked++; }
      } else if(vocab_pool.length > 0) {
        const w = vocab_pool.shift();
        if(!vocab.find(x => x.de === w.de)) { vocab.push(w); unlocked++; }
      }
    }
    
    // Unlock 1 sentence
    const sIdx = sentences_pool.findIndex(s => s.lvl === activeLevel);
    if(sIdx > -1) {
      const s = sentences_pool.splice(sIdx, 1)[0];
      if(!DAILY_SENTENCES.find(x => x.de === s.de)) { DAILY_SENTENCES.push(s); unlocked++; }
    } else if(sentences_pool.length > 0) {
      const s = sentences_pool.shift();
      if(!DAILY_SENTENCES.find(x => x.de === s.de)) { DAILY_SENTENCES.push(s); unlocked++; }
    }
    
    // Unlock 1 story
    const stIdx = stories_pool.findIndex(st => st.title.includes('[' + activeLevel + ']'));
    if(stIdx > -1) {
      const st = stories_pool.splice(stIdx, 1)[0];
      if(!STORIES.find(x => x.title === st.title)) { STORIES.push(st); unlocked++; }
    } else if(stories_pool.length > 0) {
      const st = stories_pool.shift();
      if(!STORIES.find(x => x.title === st.title)) { STORIES.push(st); unlocked++; }
    }
    
    if (unlocked > 0) {
      save('dt_vocab', vocab); save('dt_vocab_pool', vocab_pool);
      save('dt_sentences', DAILY_SENTENCES); save('dt_sentences_pool', sentences_pool);
      save('dt_stories', STORIES); save('dt_stories_pool', stories_pool);
      save('dt_last_unlock', today);
      
      setTimeout(() => {
        showToast(`?? Daily Unlock! Scaled for Level ${activeLevel}!`, 'var(--gold)');
        renderVocab(); renderDashboard();
      }, 1500);
    }
  }
}

// Call checkDailyUnlock after everything is initialized
document.addEventListener('DOMContentLoaded', () => {
  checkDailyUnlock();
});




function searchDictionary() {
  const term = document.getElementById('dictSearch').value.trim().toLowerCase();
  const resEl = document.getElementById('dictResults');
  
  if (!term) {
    resEl.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted)">Type a word to begin searching...</div>';
    return;
  }
  
  const allWords = new Map();
  vocab.forEach(v => allWords.set(v.de, v));
  vocab_pool.forEach(v => { if(!allWords.has(v.de)) allWords.set(v.de, v); });
  if (typeof DAILY_WORDS !== 'undefined') {
    DAILY_WORDS.forEach(v => { if(!allWords.has(v.de)) allWords.set(v.de, v); });
  }
  
  const allSents = new Map();
  DAILY_SENTENCES.forEach(s => allSents.set(s.de, s));
  sentences_pool.forEach(s => { if(!allSents.has(s.de)) allSents.set(s.de, s); });
  
  // Safe term for regex
  let safeTerm = term;
  try { safeTerm = term.replace(/[.*+?^$\{\}()|[\]\\]/g, '\\$&'); } catch(e) {}
  const boundaryRegex = new RegExp('(?:^|\\s|-)' + safeTerm, 'i');
  
  const wordMatches = Array.from(allWords.values()).filter(v => {
    const deLow = v.de.toLowerCase();
    const enLow = v.en.toLowerCase();
    const strippedDe = deLow.replace(/^(der|die|das)\s+/, '');
    
    if (deLow === term || enLow === term || strippedDe === term) return true;
    if (term === 'der' || term === 'die' || term === 'das') return false;
    
    return boundaryRegex.test(deLow) || boundaryRegex.test(enLow);
  }).slice(0, 20);
  
  const sentMatches = Array.from(allSents.values()).filter(s => {
    if (term === 'der' || term === 'die' || term === 'das') return false;
    
    const deLow = s.de.toLowerCase();
    const enLow = s.en.toLowerCase();
    return boundaryRegex.test(deLow) || boundaryRegex.test(enLow);
  }).slice(0, 20);
  
  if (wordMatches.length === 0 && sentMatches.length === 0) {
    resEl.innerHTML = `
      <div class="card" style="text-align:center;padding:30px">
        <div style="font-size:3rem;margin-bottom:10px">&#129335;</div>
        <div style="font-size:1.2rem;font-weight:700;margin-bottom:5px">Word not found in database.</div>
        <div style="color:var(--text-muted);margin-bottom:20px">Your offline dictionary only knows what you've uploaded or unlocked!</div>
        <button class="btn btn-primary" onclick="window.open('https://translate.google.com/?sl=auto&tl=en&text=' + encodeURIComponent('${term.replace(/'/g,"\\'")}') )">Search on Google Translate</button>
      </div>
    `;
    return;
  }
  
  let html = '';
  
  if (wordMatches.length > 0) {
    html += '<div class="card-title" style="margin-top:10px">&#128218; Vocabulary Matches</div><div style="display:flex;flex-direction:column;gap:10px;margin-bottom:24px">';
    html += wordMatches.map(w => `
      <div class="card" style="display:flex;align-items:center;justify-content:space-between;padding:12px;margin:0">
        <div>
          <div style="font-weight:800;font-size:1.1rem;color:var(--accent)">${w.de}</div>
          <div style="color:var(--text-muted);font-size:0.95rem">${w.en}</div>
        </div>
        <button class="btn btn-outline btn-sm" onclick="speakWord('${w.de.replace(/'/g,"\\'")}')" style="border-radius:50%;width:35px;height:35px;padding:0;display:flex;align-items:center;justify-content:center">&#128266;</button>
      </div>
    `).join('');
    html += '</div>';
  }
  
  if (sentMatches.length > 0) {
    html += '<div class="card-title">&#128172; Contextual Sentences</div><div style="display:flex;flex-direction:column;gap:10px">';
    html += sentMatches.map(s => `
      <div class="card" style="padding:12px;margin:0">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px">
           <div style="font-weight:600;font-size:1rem;color:var(--text);margin-bottom:4px">${s.de}</div>
           <button class="btn btn-outline btn-sm" onclick="speakWord('${s.de.replace(/'/g,"\\'")}')" style="border-radius:50%;min-width:35px;height:35px;padding:0;display:flex;align-items:center;justify-content:center">&#128266;</button>
        </div>
        <div style="color:var(--text-muted);font-size:0.9rem;border-left:3px solid var(--border);padding-left:10px;margin-top:5px">${s.en}</div>
      </div>
    `).join('');
    html += '</div>';
  }
  
  resEl.innerHTML = html;
}


