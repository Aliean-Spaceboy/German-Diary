const fs = require('fs');
const js = fs.readFileSync('script.js', 'utf8');

const code = 
  const document = {
    addEventListener: () => {},
    getElementById: () => ({ classList: { toggle: ()=>{}, contains: ()=>{}, remove: ()=>{}, add: ()=>{} }, style: {} }),
    querySelectorAll: () => [],
  };
  const window = { onclick: null };
  const localStorage = { getItem: ()=>null, setItem: ()=>{} };
  const Date = global.Date;
  const Math = global.Math;
  
  try {
     + js + 
    console.log("No top level errors!");
  } catch(e) {
    console.error("ERROR CAUGHT: ", e);
  }
;

fs.writeFileSync('test_run.js', code);
