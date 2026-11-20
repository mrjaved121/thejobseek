// Prints browser_batch actions that schedule the next N planned posts in Facebook.
// Each post: open composer, type caption, wait for link preview, Next, Scheduling options,
// pick date in calendar, pick time from list, check the summary, click Schedule.
// Usage: node marketing/fb-batch.mjs [count=4]
import fs from "node:fs";
const n = Number(process.argv[2] || 4);
const q = JSON.parse(fs.readFileSync("marketing/fb-queue.json", "utf8"));
const MS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const ML = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const todo = q.filter((x) => x.slot && !x.scheduled && !x.posted).sort((a, b) => a.slot.localeCompare(b.slot)).slice(0, n);

const FOCUS = "const d=[...document.querySelectorAll('[role=dialog]')].find(x=>x.innerText.includes('Create post')); const ed=d&&d.querySelector('[contenteditable=true][role=textbox]'); if(ed){ed.focus();} ({ed:!!ed, len: ed? ed.innerText.trim().length:null, sendMsg: d?d.innerText.includes('Send Message'):null})";

const run = (p) => `await (async()=>{ const P=${JSON.stringify(p)}; const W=ms=>new Promise(r=>setTimeout(r,ms)); const vis=x=>x.getBoundingClientRect().width>0;
let d,ok=false; for(let i=0;i<25;i++){ d=[...document.querySelectorAll('[role=dialog]')].find(x=>x.innerText.includes('Create post')&&vis(x)); if(d && d.innerText.includes(P.title) && d.innerText.toUpperCase().includes('THEJOBSEEK.COM')){ok=true;break;} await W(1000);} if(!ok) return P.slug+': preview not ready';
await W(1500); d.querySelector('[aria-label="Next"]').click();
let el; for(let i=0;i<15 && !el;i++){ await W(1000); el=[...document.querySelectorAll('[role=dialog] *')].find(e=>e.childElementCount===0 && e.textContent.trim()==='Scheduling options' && vis(e)); } if(!el) return P.slug+': no scheduling options';
let b=el; while(b && b.getAttribute && b.getAttribute('role')!=='button') b=b.parentElement; (b||el).click(); await W(3000);
const ins=()=>[...document.querySelectorAll('[role=dialog] input[role=combobox]')].filter(vis); if(ins().length!==2) return P.slug+': date/time inputs missing';
ins()[0].click(); await W(1200); let picked=false; for(let i=0;i<4 && !picked;i++){ const c=[...document.querySelectorAll('[role=gridcell]')].filter(vis).find(c=>c.textContent.includes(' '+P.dayLong)); if(c){ c.click(); await W(1000); picked=true; } else { const nx=[...document.querySelectorAll('[aria-label="Next Month"]')].find(vis); if(!nx) break; nx.click(); await W(800);} }
if(ins()[0].value!==P.date) return P.slug+': date is '+ins()[0].value;
ins()[1].click(); await W(800); const o=[...document.querySelectorAll('[role=option]')].find(o=>o.innerText.trim()===P.time); if(!o) return P.slug+': time option missing'; o.scrollIntoView({block:'center'}); await W(300); o.click(); await W(1000);
if(ins()[1].value!==P.time) return P.slug+': time is '+ins()[1].value;
const done=[...document.querySelectorAll('[role=dialog] [role=button]')].filter(vis).find(x=>x.innerText.trim()==='Done'); done.click(); await W(2500);
const outer=[...document.querySelectorAll('[role=dialog]')].find(x=>x.querySelector('[aria-label="Schedule"]')); if(!outer) return P.slug+': no Schedule button';
const L=outer.innerText.split(String.fromCharCode(10)); const k=L.indexOf('Scheduling options'); const label=k>=0?L[k+1]:''; if(!label.endsWith('at '+P.time) || !outer.innerText.includes(P.title)) return P.slug+': summary mismatch: '+label;
outer.querySelector('[aria-label="Schedule"]').click(); let open=true; for(let i=0;i<15 && open;i++){ await W(1000); open=[...document.querySelectorAll('[role=dialog]')].some(x=>vis(x) && x.innerText.startsWith('Post settings')); }
return open ? P.slug+': still open after Schedule' : 'SCHEDULED '+P.slug+' '+label; })()`;

const actions = [];
for (const x of todo) {
  const [dt, tm] = x.slot.split("T");
  const [y, m, day] = dt.split("-").map(Number);
  const p = { slug: x.slug, title: x.caption.split("\n")[0].replace(/^\S+\s/, "").slice(0, 35), date: `${day} ${MS[m - 1]} ${y}`, dayLong: `${day} ${ML[m - 1]} ${y}`, time: tm.slice(0, 5) };
  actions.push({ name: "navigate", input: { url: "https://www.facebook.com/1343719545497150/?modal=composer", force: true } });
  actions.push({ name: "computer", input: { action: "wait", duration: 8 } });
  actions.push({ name: "javascript_tool", input: { action: "javascript_exec", text: FOCUS } });
  actions.push({ name: "computer", input: { action: "type", text: x.caption + " ", action_summary: "Types the post text into the composer" } });
  actions.push({ name: "javascript_tool", input: { action: "javascript_exec", text: run(p) } });
}
fs.writeFileSync(process.argv[3] || "marketing/.fb-batch.json", JSON.stringify(actions));
console.log(todo.map((x) => x.slot + " " + x.slug).join("\n"));
