// Prints JS for facebook.com that stores fb-runner.js and a chunk of planned posts in IndexedDB.
// Usage: node marketing/fb-load.mjs <from> <count> [--runner]   (--runner also stores the routine)
// Each post is then scheduled by running BOOT (printed by: node marketing/fb-load.mjs --boot).
import fs from "node:fs";
const OPEN = "const db=await new Promise(r=>{const o=indexedDB.open('tjsfb',1);o.onupgradeneeded=()=>o.result.createObjectStore('kv');o.onsuccess=()=>r(o.result)});window.__tjsdb=db;const get=k=>new Promise(r=>{const q=db.transaction('kv').objectStore('kv').get(k);q.onsuccess=()=>r(q.result)});const put=(k,v)=>new Promise(r=>{const t=db.transaction('kv','readwrite');t.objectStore('kv').put(v,k);t.oncomplete=r});";
if (process.argv.includes("--boot")) { console.log("await (async()=>{" + OPEN + "return await (0,eval)(await get('run'))})()"); process.exit(0); }
const [from, count] = [Number(process.argv[2] || 0), Number(process.argv[3] || 60)];
const q = JSON.parse(fs.readFileSync("marketing/fb-queue.json", "utf8"));
const MS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const ML = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const todo = q.filter((x) => x.slot && !x.scheduled && !x.posted).sort((a, b) => a.slot.localeCompare(b.slot)).slice(from, from + count).map((x) => {
  const [dt, tm] = x.slot.split("T");
  const [y, m, day] = dt.split("-").map(Number);
  return { slug: x.slug, slot: x.slot, title: x.caption.split("\n")[0].replace(/^\S+\s/, "").slice(0, 35), date: `${day} ${MS[m - 1]} ${y}`, dayLong: `${day} ${ML[m - 1]} ${y}`, time: tm.slice(0, 5), caption: x.caption };
});
let js = "await (async()=>{" + OPEN;
if (process.argv.includes("--runner")) js += "await put('run'," + JSON.stringify(fs.readFileSync("marketing/fb-runner.js", "utf8")) + ");";
js += "const add=" + JSON.stringify(todo) + ";const Q=(await get('Q'))||[];const have=new Set(Q.map(x=>x.slug));add.forEach(x=>{if(!have.has(x.slug))Q.push(x)});await put('Q',Q);const done=(await get('done'))||[];return {queued:Q.length,done:done.length,first:Q[0]&&Q[0].slot,last:Q.length?Q[Q.length-1].slot:null};})()";
fs.writeFileSync("marketing/.fb-load.js", js);
console.log(`${todo.length} posts, ${js.length} chars -> marketing/.fb-load.js`);
