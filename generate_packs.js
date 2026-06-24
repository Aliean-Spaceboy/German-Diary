const fs = require('fs');

// --- 1. VOCABULARY (A1 -> B2) ---
const vocab = `
hallo,hello
danke,thank you
bitte,please
ja,yes
nein,no
der Mann,man
die Frau,woman
das Kind,child
das Wasser,water
das Brot,bread
der Apfel,apple
essen,to eat
trinken,to drink
schlafen,to sleep
gehen,to go
kommen,to come
sehen,to see
hören,to hear
sprechen,to speak
lesen,to read
schreiben,to write
der Tag,day
die Nacht,night
heute,today
morgen,tomorrow
gestern,yesterday
die Woche,week
der Monat,month
das Jahr,year
die Farbe,color
rot,red
blau,blue
grün,green
schwarz,black
weiß,white
groß,big
klein,small
gut,good
schlecht,bad
schnell,fast
langsam,slow
heiß,hot
kalt,cold
das Haus,house
die Tür,door
das Fenster,window
das Auto,car
der Bus,bus
der Zug,train
der Bahnhof,train station
der Flughafen,airport
das Flugzeug,airplane
die Straße,street
der Platz,square/place
die Stadt,city
das Land,country/land
der Arzt,doctor (male)
die Ärztin,doctor (female)
das Krankenhaus,hospital
die Apotheke,pharmacy
die Krankheit,illness
der Schmerz,pain
gesund,healthy
krank,sick
das Geld,money
die Bank,bank
kaufen,to buy
verkaufen,to sell
bezahlen,to pay
kosten,to cost
teuer,expensive
billig,cheap
der Supermarkt,supermarket
das Geschäft,shop
das Restaurant,restaurant
die Schule,school
der Lehrer,teacher
der Schüler,student
lernen,to learn
studieren,to study
die Universität,university
die Prüfung,exam
die Note,grade
die Arbeit,work
der Beruf,profession/job
der Chef,boss
der Kollege,colleague
das Büro,office
der Computer,computer
das Telefon,telephone
anrufen,to call
schicken,to send
empfangen,to receive
die E-Mail,email
das Internet,internet
die Webseite,website
das Programm,program
die Software,software
die Hardware,hardware
der Bildschirm,screen
die Tastatur,keyboard
die Maus,mouse
der Drucker,printer
das Kabel,cable
die Batterie,battery
der Strom,electricity
das Passwort,password
der Benutzer,user
die Sicherheit,security
das Netzwerk,network
die Verbindung,connection
der Fehler,error
löschen,to delete
speichern,to save
kopieren,to copy
einfügen,to paste
drucken,to print
öffnen,to open
schließen,to close
starten,to start
beenden,to finish/quit
die Bedingung,condition
die Erlaubnis,permission
die Nachricht,message
verstehen,to understand
die Ausbildung,education / training
die Kenntnisse,skills / knowledge
der Vertrag,contract
das Gehalt,salary
die Bewerbung,application (job)
der Lebenslauf,resume
vorbereiten,to prepare
die Gelegenheit,opportunity
die Anforderung,requirement
die Bereitstellung,deployment
die Architektur,architecture
zuverlässig,reliable
erklären,to explain
teilnehmen,to participate
unterstützen,to support
das Unternehmen,company
die Umgebung,environment
versuchen,to try
die Erfahrung,experience
die Lösung,solution
die Zukunft,future
die Entscheidung,decision
verbessern,to improve
das Ziel,goal
erfolgreich,successful
die Herausforderung,challenge
entwickeln,to develop
die Schnittstelle,interface
die Datenbank,database
die Leistung,performance
die Eigenschaft,property/feature
der Zugriff,access
die Ausnahme,exception
die Variable,variable
die Funktion,function
der Zustand,state
das Ereignis,event
die Schleife,loop
der Speicher,memory
die Ausführung,execution
die Entwicklung,development
das Werkzeug,tool
das Konto,account
der Server,server
der Client,client
die Anfrage,request
die Antwort,response
das Protokoll,protocol
die Verschlüsselung,encryption
die Entschlüsselung,decryption
das Zertifikat,certificate
die Signatur,signature
die Firewall,firewall
der Virus,virus
der Trojaner,trojan
der Angriff,attack
die Abwehr,defense
die Schwachstelle,vulnerability
der Patch,patch
das Update,update
die Version,version
das System,system
die Plattform,platform
das Design,design
das Muster,pattern
die Regel,rule
das Gesetz,law
die Vorschrift,regulation
die Norm,standard
das Verfahren,procedure
der Prozess,process
der Ablauf,flow/sequence
der Schritt,step
die Phase,phase
der Meilenstein,milestone
das Projekt,project
das Team,team
die Rolle,role
die Aufgabe,task
das Ticket,ticket
der Bericht,report
die Besprechung,meeting
die Präsentation,presentation
der Kunde,customer
der Administrator,administrator
die Berechtigung,authorization
die Gruppe,group
die Richtlinie,policy
die Konfiguration,configuration
die Einstellung,setting
die Option,option
der Wert,value
der Parameter,parameter
das Argument,argument
der Datentyp,data type
die Klasse,class
das Objekt,object
die Methode,method
der Aufruf,call
die Rückgabe,return
der Test,test
die Überprüfung,verification
die Validierung,validation
`.trim();

fs.writeFileSync('vocab_pack_a1_b2.csv', vocab, 'utf8');

// --- 2. SENTENCES (A1 -> B2) ---
const sentences = `
Hallo, wie geht es dir?,Hello how are you?
Mir geht es gut, danke.,I am doing well thank you.
Wie heißt du?,What is your name?
Ich heiße Anna.,My name is Anna.
Woher kommst du?,Where do you come from?
Ich komme aus Deutschland.,I come from Germany.
Wo wohnst du?,Where do you live?
Ich wohne in Berlin.,I live in Berlin.
Sprechen Sie Englisch?,Do you speak English?
Ich spreche ein bisschen Deutsch.,I speak a little German.
Wie alt bist du?,How old are you?
Ich bin fünfundzwanzig Jahre alt.,I am twenty-five years old.
Was ist das?,What is that?
Das ist ein Buch.,That is a book.
Wo ist der Bahnhof?,Where is the train station?
Gehen Sie geradeaus und dann links.,Go straight and then left.
Ein Ticket nach München, bitte.,A ticket to Munich please.
Wie viel kostet das?,How much does that cost?
Das ist zu teuer.,That is too expensive.
Ich nehme das.,I will take it.
Die Rechnung, bitte.,The bill please.
Ich möchte einen Kaffee trinken.,I would like to drink a coffee.
Das Essen ist sehr lecker.,The food is very delicious.
Wann fährt der Bus ab?,When does the bus leave?
Der Bus fährt um zehn Uhr.,The bus leaves at ten o'clock.
Ich habe gestern Fußball gespielt.,I played football yesterday.
Wir sind ins Kino gegangen.,We went to the cinema.
Ich muss heute einkaufen.,I have to go shopping today.
Können Sie mir helfen?,Can you help me?
Es tut mir leid.,I am sorry.
Ich verstehe das nicht.,I do not understand that.
Können Sie das bitte wiederholen?,Can you please repeat that?
Was hast du am Wochenende gemacht?,What did you do on the weekend?
Ich habe ein interessantes Buch gelesen.,I read an interesting book.
Das Wetter ist heute sehr schön.,The weather is very nice today.
Morgen wird es regnen.,It will rain tomorrow.
Ich freue mich auf den Urlaub.,I am looking forward to the vacation.
Wir müssen einen Termin vereinbaren.,We need to arrange an appointment.
Passt es Ihnen am Dienstag um 14 Uhr?,Does Tuesday at 2 PM work for you?
Ich bin leider krank und kann nicht kommen.,Unfortunately I am sick and cannot come.
Ich muss den Code heute noch committen.,I have to commit the code today.
Der Server ist momentan nicht erreichbar.,The server is currently unreachable.
Wir haben ein Problem mit der Datenbankverbindung.,We have a problem with the database connection.
Können Sie den Fehler bitte reproduzieren?,Can you please reproduce the bug?
Das Update wird morgen früh installiert.,The update will be installed tomorrow morning.
Ich arbeite an einem neuen Feature.,I am working on a new feature.
Die Anwendung läuft jetzt viel schneller.,The application runs much faster now.
Wir müssen die Sicherheit unserer Daten gewährleisten.,We must ensure the security of our data.
Bitte prüfen Sie die Log-Dateien auf Fehlermeldungen.,Please check the log files for error messages.
Das Projekt ist fast abgeschlossen.,The project is almost finished.
Die Tests waren alle erfolgreich.,The tests were all successful.
Ich habe die Dokumentation aktualisiert.,I have updated the documentation.
Gibt es Neuigkeiten zum Release?,Is there any news regarding the release?
Wir sollten ein Backup der Datenbank machen.,We should make a backup of the database.
Die Benutzeroberfläche muss intuitiver werden.,The user interface needs to become more intuitive.
Ich brauche mehr Zeit für diese Aufgabe.,I need more time for this task.
Wir verwenden agile Methoden in unserem Team.,We use agile methods in our team.
Die Anforderungen haben sich geändert.,The requirements have changed.
Ich muss mich noch in die neue API einarbeiten.,I still need to familiarize myself with the new API.
Das System ist überlastet.,The system is overloaded.
Können Sie mir helfen diesen Fehler zu finden?,Can you help me find this bug?
Ich habe einen Workaround implementiert.,I have implemented a workaround.
Der Kunde ist mit der Lösung zufrieden.,The customer is satisfied with the solution.
Wir planen ein Meeting für nächste Woche.,We are planning a meeting for next week.
Die Skalierbarkeit ist ein wichtiges Thema.,Scalability is an important topic.
Ich schaue mir das Problem sofort an.,I will look into the problem immediately.
Die Performance hat sich deutlich verbessert.,The performance has improved significantly.
Wir müssen die Codequalität erhöhen.,We need to increase the code quality.
Das Framework bietet viele nützliche Funktionen.,The framework offers many useful features.
Ich bin mit dem aktuellen Stand sehr zufrieden.,I am very satisfied with the current status.
`.trim();

fs.writeFileSync('sentences_pack_a1_b2.csv', sentences, 'utf8');

// --- 3. STORIES (A1 -> B2) ---
const stories = [
  {
    "title": "[A1] Hallo, ich bin Anna!",
    "text": "Hallo! Ich heiße Anna und ich bin fünfundzwanzig Jahre alt. Ich komme aus Deutschland und ich wohne in Berlin. Berlin ist sehr groß und schön. Ich arbeite als Lehrerin in einer Schule. Mein Hobby ist lesen. Ich lese jeden Abend ein Buch. Ich habe auch einen Hund. Er heißt Max und ist sehr freundlich. Am Wochenende spiele ich oft mit Max im Park.",
    "questions": [
      { "text": "1. Anna wohnt in München.", "answer": false },
      { "text": "2. Anna arbeitet als Lehrerin.", "answer": true },
      { "text": "3. Annas Hund heißt Max.", "answer": true }
    ]
  },
  {
    "title": "[A1] Mein Tag",
    "text": "Ich stehe jeden Tag um sieben Uhr auf. Zuerst trinke ich einen Kaffee und esse Brot mit Marmelade. Dann dusche ich und ziehe mich an. Um acht Uhr fahre ich mit dem Bus zur Arbeit. Ich arbeite von neun bis fünfzehn Uhr im Büro. Am Nachmittag kaufe ich im Supermarkt ein. Ich kaufe Äpfel, Bananen und Milch. Am Abend koche ich das Abendessen. Ich esse Nudeln mit Tomatensoße. Um elf Uhr gehe ich schlafen.",
    "questions": [
      { "text": "1. Die Person fährt mit dem Zug zur Arbeit.", "answer": false },
      { "text": "2. Sie kauft Obst und Milch im Supermarkt.", "answer": true },
      { "text": "3. Am Abend isst sie Pizza.", "answer": false }
    ]
  },
  {
    "title": "[A2] Ein Urlaub in Italien",
    "text": "Letztes Jahr bin ich mit meiner Familie nach Italien gefahren. Wir haben ein kleines Haus am Meer gemietet. Das Wetter war die ganze Woche sehr sonnig und warm. Jeden Morgen sind wir früh aufgestanden und an den Strand gegangen. Das Wasser war sehr klar. Mittags haben wir oft Pizza oder Pasta gegessen. Das italienische Essen ist wirklich fantastisch! Am Abend sind wir durch die kleine Stadt spaziert und haben Eis gegessen. Es war ein wunderbarer Urlaub und wir möchten nächstes Jahr wieder dorthin fahren.",
    "questions": [
      { "text": "1. Die Familie hat ein großes Hotel am Strand gemietet.", "answer": false },
      { "text": "2. Sie haben jeden Mittag Pizza oder Pasta gegessen.", "answer": true },
      { "text": "3. Das Wetter war schlecht und kalt.", "answer": false }
    ]
  },
  {
    "title": "[A2] Einkaufen im Einkaufszentrum",
    "text": "Gestern war ich mit meiner Freundin Sarah im Einkaufszentrum. Sarah brauchte eine neue Jacke für den Winter. Wir waren in vielen verschiedenen Geschäften. Zuerst hat sie eine rote Jacke probiert, aber sie war zu teuer. Dann hat sie eine blaue Jacke gefunden. Sie war im Angebot und sah sehr gut aus. Sie hat die blaue Jacke gekauft. Danach waren wir noch einen Kaffee trinken und haben ein Stück Kuchen gegessen. Es war ein schöner, aber anstrengender Nachmittag.",
    "questions": [
      { "text": "1. Sarah hat eine rote Jacke gekauft.", "answer": false },
      { "text": "2. Die blaue Jacke war im Angebot.", "answer": true },
      { "text": "3. Nach dem Einkaufen haben sie Kuchen gegessen.", "answer": true }
    ]
  },
  {
    "title": "[B1] Ein neues Projekt",
    "text": "Das Softwareunternehmen 'TechSolutions' startet heute ein neues Projekt. Das Ziel ist es, eine mobile App für Studenten zu entwickeln. Die App soll den Studenten helfen, ihren Stundenplan besser zu organisieren. Der Projektleiter, Herr Müller, hat ein Team von fünf Entwicklern zusammengestellt. Das Team nutzt agile Methoden und plant wöchentliche Sprints. In der ersten Phase konzentrieren sie sich auf das Design der Benutzeroberfläche. Nächste Woche beginnen sie dann mit der Programmierung der Datenbank.",
    "questions": [
      { "text": "1. Das Unternehmen entwickelt eine App für Rentner.", "answer": false },
      { "text": "2. Das Team besteht aus fünf Entwicklern.", "answer": true },
      { "text": "3. Die Programmierung der Datenbank beginnt sofort.", "answer": false }
    ]
  },
  {
    "title": "[B2] Das Server-Update in der Nacht",
    "text": "Es war Freitagabend, 23:00 Uhr. Julian, ein Systemadministrator, trank seinen dritten Kaffee. Das Unternehmen hatte beschlossen, alle Server auf eine neue Linux-Version zu aktualisieren. Eigentlich sollte das automatisch passieren, aber ein Skript war fehlerhaft. Julian musste sich manuell per SSH auf jeden Server einloggen und das Update starten. Um 3:00 Uhr morgens war er endlich fertig. Er testete die Webseite: Sie war online und reagierte doppelt so schnell wie vorher. Erschöpft, aber zufrieden, ging er nach Hause.",
    "questions": [
      { "text": "1. Das Update passierte vollautomatisch ohne Probleme.", "answer": false },
      { "text": "2. Julian arbeitete bis spät in die Nacht.", "answer": true },
      { "text": "3. Nach dem Update war die Webseite langsamer.", "answer": false }
    ]
  },
  {
    "title": "[B2] Der mysteriöse Bug",
    "text": "Seit zwei Wochen klagten die Nutzer der neuen App über Abstürze. Die Fehlermeldungen waren unklar. Das QA-Team konnte den Fehler nicht reproduzieren. Erst als die Entwicklerin Sarah sich die Log-Dateien genau ansah, fand sie das Muster. Der Absturz passierte nur, wenn ein Nutzer ein Profilbild hochlud, das größer als 5 Megabyte war. Der Speicher des Servers lief voll, weil das Bildbearbeitungs-Modul ein Speicherleck (Memory Leak) hatte. Sarah schrieb einen Fix, der die Bildgröße vor dem Upload komprimierte. Das Problem war gelöst.",
    "questions": [
      { "text": "1. Der Fehler passierte bei jedem Nutzer.", "answer": false },
      { "text": "2. Sarah fand den Fehler durch das Lesen der Log-Dateien.", "answer": true },
      { "text": "3. Das Problem war ein Memory Leak.", "answer": true }
    ]
  }
];

fs.writeFileSync('stories_pack_a1_b2.json', JSON.stringify(stories, null, 2), 'utf8');

console.log("All A1->B2 packs generated successfully!");
