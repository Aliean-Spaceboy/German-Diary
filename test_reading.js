const fs = require('fs');
const js = fs.readFileSync('script.js', 'utf8');

const code = 
  const document = {
    addEventListener: () => {},
    getElementById: (id) => {
       if (id === 'moreDropdown') return { classList: { toggle: ()=>{}, contains: ()=>{}, remove: ()=>{}, add: ()=>{} }, style: {} };
       if (id === 'readingContent' || id === 'readingQuestions') return { style: {} };
       return { 
          classList: { toggle: ()=>{}, contains: ()=>{}, remove: ()=>{}, add: ()=>{} }, 
          style: {},
          innerHTML: '',
          innerText: '',
          textContent: ''
       };
    },
    querySelectorAll: () => [],
    querySelector: () => ({ addEventListener: ()=>{} })
  };
  const window = { onclick: null, innerWidth: 1000 };
  const localStorage = { getItem: ()=>null, setItem: ()=>{} };
  const Date = global.Date;
  const Math = global.Math;
  
   + js + 
  
  try {
    showSection('reading');
    console.log("showSection('reading') ran successfully");
  } catch(e) {
    console.error("ERROR CAUGHT: ", e);
  }
;

fs.writeFileSync('test_run.js', code);
