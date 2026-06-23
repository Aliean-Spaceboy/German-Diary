const fs = require('fs');

let js = fs.readFileSync('script.js', 'utf-8');

const newWords = `const DAILY_WORDS = [
  {de: "die Datenbank", en: "database"}, {de: "die Schnittstelle", en: "interface"},
  {de: "entwickeln", en: "to develop"}, {de: "die Herausforderung", en: "challenge"},
  {de: "erfolgreich", en: "successful"}, {de: "das Ziel", en: "goal"},
  {de: "verbessern", en: "to improve"}, {de: "die Entscheidung", en: "decision"},
  {de: "die Zukunft", en: "future"}, {de: "die Lösung", en: "solution"},
  {de: "die Erfahrung", en: "experience"}, {de: "versuchen", en: "to try"},
  {de: "die Anwendung", en: "application"}, {de: "die Umgebung", en: "environment"},
  {de: "das Unternehmen", en: "company"}, {de: "die Besprechung", en: "meeting"},
  {de: "teilnehmen", en: "to participate"}, {de: "unterstützen", en: "to support"},
  {de: "die Verantwortung", en: "responsibility"}, {de: "unabhängig", en: "independent"},
  {de: "erklären", en: "to explain"}, {de: "der Fehler", en: "error / bug"},
  {de: "hinzufügen", en: "to add"}, {de: "löschen", en: "to delete / erase"},
  {de: "speichern", en: "to save"}, {de: "die Leistung", en: "performance"},
  {de: "die Bedingung", en: "condition"}, {de: "verfügbar", en: "available"},
  {de: "die Sicherheit", en: "security"}, {de: "das Netzwerk", en: "network"},
  {de: "der Benutzer", en: "user"}, {de: "die Erlaubnis", en: "permission"},
  {de: "die Nachricht", en: "message"}, {de: "verstehen", en: "to understand"},
  {de: "die Ausbildung", en: "education / training"}, {de: "die Kenntnisse", en: "skills / knowledge"},
  {de: "der Vertrag", en: "contract"}, {de: "das Gehalt", en: "salary"},
  {de: "die Bewerbung", en: "application (job)"}, {de: "der Lebenslauf", en: "resume"},
  {de: "vorbereiten", en: "to prepare"}, {de: "die Gelegenheit", en: "opportunity"},
  {de: "die Anforderung", en: "requirement"}, {de: "die Bereitstellung", en: "deployment"},
  {de: "die Architektur", en: "architecture"}, {de: "zuverlässig", en: "reliable"}
];`;

const newSentences = `const DAILY_SENTENCES = [
  {de: "Ich versuche jeden Tag mein Deutsch zu verbessern.", en: "I try to improve my German every day."},
  {de: "Programmieren macht mir viel Spaß.", en: "Programming is a lot of fun for me."},
  {de: "Mein Ziel ist es, in Deutschland zu arbeiten.", en: "My goal is to work in Germany."},
  {de: "Aller Anfang ist schwer.", en: "Every beginning is difficult."},
  {de: "Übung macht den Meister.", en: "Practice makes perfect."},
  {de: "Könnten Sie das bitte wiederholen?", en: "Could you please repeat that?"},
  {de: "Ich arbeite als Softwareentwickler.", en: "I work as a software developer."},
  {de: "Wir müssen den Fehler so schnell wie möglich beheben.", en: "We need to fix the bug as quickly as possible."},
  {de: "Die Datenbank ist momentan nicht erreichbar.", en: "The database is currently unreachable."},
  {de: "Ich habe viel Erfahrung mit Java und Spring Boot.", en: "I have a lot of experience with Java and Spring Boot."},
  {de: "Wir haben morgen eine wichtige Besprechung.", en: "We have an important meeting tomorrow."},
  {de: "Das Programm läuft sehr stabil.", en: "The program runs very stably."},
  {de: "Es gibt viele Herausforderungen bei diesem Projekt.", en: "There are many challenges with this project."},
  {de: "Ich bin für das Backend verantwortlich.", en: "I am responsible for the backend."},
  {de: "Ich freue mich auf die Zusammenarbeit.", en: "I look forward to working together."}
];`;

// Replace arrays using Regex
const wordsRegex = /const DAILY_WORDS = \[[\s\S]*?\];/;
const sentencesRegex = /const DAILY_SENTENCES = \[[\s\S]*?\];/;

js = js.replace(wordsRegex, newWords);
js = js.replace(sentencesRegex, newSentences);

fs.writeFileSync('script.js', js, 'utf-8');

console.log("Database expanded!");
