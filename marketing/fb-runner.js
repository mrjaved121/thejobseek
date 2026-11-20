// Runs inside facebook.com. Stored in IndexedDB "tjsfb" (store "kv", key "run") together with the
// queue ("Q"), the done list ("done") and the unsure list ("unsure"); Facebook clears big localStorage values.
// Started by the bootstrap in fb-load.mjs, which sets window.__tjsdb.
// Schedules up to window.__tjsN posts (default 1) from Q that aren't done or unsure, one after another.
// Progress goes to window.__tjsLog; it stops at the first post that isn't scheduled cleanly.
// The page must already show the Page's "Create post" composer (open ?modal=composer first).
(async () => {
  const W = (ms) => new Promise((r) => setTimeout(r, ms));
  const vis = (x) => x.getBoundingClientRect().width > 0;

  // Open the composer with the Page's "What's on your mind?" button if it isn't open already.
  async function openComposer() {
    for (let i = 0; i < 20; i++) {
      const d = [...document.querySelectorAll("[role=dialog]")].find((x) => x.innerText.includes("Create post") && vis(x));
      if (d && d.querySelector("[contenteditable=true][role=textbox]")) return true;
      if (i % 5 === 0) {
        const b = [...document.querySelectorAll("[role=button]")].filter(vis).find((x) => x.innerText.trim() === "What's on your mind?");
        if (b) b.click();
      }
      await W(1000);
    }
    return false;
  }

  async function one() {
    const W = (ms) => new Promise((r) => setTimeout(r, ms));
    const vis = (x) => x.getBoundingClientRect().width > 0;
    const NL = String.fromCharCode(10);
    const db = window.__tjsdb;
    const get = (k) => new Promise((r) => { const q = db.transaction("kv").objectStore("kv").get(k); q.onsuccess = () => r(q.result); });
    const put = (k, v) => new Promise((r) => { const t = db.transaction("kv", "readwrite"); t.objectStore("kv").put(v, k); t.oncomplete = r; });
    const Q = (await get("Q")) || [];
    const done = (await get("done")) || [];
    const unsure = (await get("unsure")) || [];
    const P = Q.find((x) => !done.includes(x.slug) && !unsure.includes(x.slug));
    if (!P) return "ALL DONE";
    // Facebook only accepts times in the future; never schedule a slot less than 20 minutes away.
    if (Date.parse(P.slot) < Date.now() + 20 * 60e3) return "SLOT PASSED " + P.slug + " " + P.slot;

    let d, ed;
    for (let i = 0; i < 15 && !ed; i++) {
      d = [...document.querySelectorAll("[role=dialog]")].find((x) => x.innerText.includes("Create post") && vis(x));
      ed = d && d.querySelector("[contenteditable=true][role=textbox]");
      if (!ed) await W(1000);
    }
    if (!ed) return "NO COMPOSER " + P.slug;
    if (d.innerText.includes("Send Message")) return "SEND MESSAGE ATTACHMENT " + P.slug;
    if (ed.innerText.trim().length) return "EDITOR NOT EMPTY " + P.slug;

    ed.focus();
    const dt = new DataTransfer();
    dt.setData("text/plain", P.caption + " ");
    ed.dispatchEvent(new ClipboardEvent("paste", { clipboardData: dt, bubbles: true, cancelable: true }));

    let ok = false;
    for (let i = 0; i < 25; i++) {
      // Wait for the real link preview card (it has a "remove" button), not just the pasted URL.
      if (d.innerText.includes(P.title) && d.querySelector('[aria-label="Remove link preview from your post"]')) { ok = true; break; }
      await W(1000);
    }
    if (!ok) return "PREVIEW NOT READY " + P.slug;
    await W(1500);
    d.querySelector('[aria-label="Next"]').click();

    let el;
    // The settings screen can take 30+ seconds to load.
    for (let i = 0; i < 45 && !el; i++) {
      await W(1000);
      el = [...document.querySelectorAll("[role=dialog] *")].find((e) => e.childElementCount === 0 && e.textContent.trim() === "Scheduling options" && vis(e));
    }
    if (!el) return "NO SCHEDULING OPTIONS " + P.slug;
    let b = el;
    while (b && b.getAttribute && b.getAttribute("role") !== "button") b = b.parentElement;
    (b || el).click();
    await W(3000);

    const ins = () => [...document.querySelectorAll("[role=dialog] input[role=combobox]")].filter(vis);
    if (ins().length !== 2) return "DATE/TIME INPUTS MISSING " + P.slug;
    ins()[0].click();
    await W(1200);
    let picked = false;
    for (let i = 0; i < 4 && !picked; i++) {
      const c = [...document.querySelectorAll("[role=gridcell]")].filter(vis).find((c) => c.textContent.includes(" " + P.dayLong));
      if (c) { c.click(); await W(1000); picked = true; }
      else {
        const nx = [...document.querySelectorAll('[aria-label="Next Month"]')].find(vis);
        if (!nx) break;
        nx.click();
        await W(800);
      }
    }
    if (ins()[0].value !== P.date) return "DATE WRONG " + P.slug + " got " + ins()[0].value;

    ins()[1].click();
    await W(800);
    const o = [...document.querySelectorAll("[role=option]")].find((o) => o.innerText.trim() === P.time);
    if (!o) return "TIME OPTION MISSING " + P.slug;
    o.scrollIntoView({ block: "center" });
    await W(300);
    o.click();
    await W(1000);
    if (ins()[1].value !== P.time) return "TIME WRONG " + P.slug + " got " + ins()[1].value;

    const doneBtn = [...document.querySelectorAll("[role=dialog] [role=button]")].filter(vis).find((x) => x.innerText.trim() === "Done");
    doneBtn.click();
    await W(2500);
    const outer = [...document.querySelectorAll("[role=dialog]")].find((x) => x.querySelector('[aria-label="Schedule"]'));
    if (!outer) return "NO SCHEDULE BUTTON " + P.slug;
    const L = outer.innerText.split(NL);
    const k = L.indexOf("Scheduling options");
    const label = k >= 0 ? L[k + 1] : "";
    if (!label.endsWith("at " + P.time) || !outer.innerText.includes(P.title)) return "SUMMARY MISMATCH " + P.slug + " " + label;

    outer.querySelector('[aria-label="Schedule"]').click();
    let open = true;
    for (let i = 0; i < 20 && open; i++) {
      await W(1000);
      // Facebook sometimes shows a "Speak to people directly" (add a Call Now button) upsell: decline it.
      const upsell = [...document.querySelectorAll("[role=dialog]")].find((x) => vis(x) && x.innerText.includes("Speak to people directly"));
      if (upsell) {
        const no = [...upsell.querySelectorAll("[role=button]")].find((x) => x.innerText.trim() === "Not now");
        if (no) { no.click(); await W(2000); }
      }
      open = [...document.querySelectorAll("[role=dialog]")].some((x) => vis(x) && (x.innerText.startsWith("Post settings") || x.innerText.includes("Speak to people directly")));
    }
    if (open) {
      // Schedule was clicked but the dialog didn't close: don't retry automatically, check by hand.
      unsure.push(P.slug);
      await put("unsure", unsure);
      return "UNSURE " + P.slug;
    }
    done.push(P.slug);
    await put("done", done);
    return "SCHEDULED " + P.slug + " " + label;
  }

  const N = window.__tjsN || 1;
  const log = [];
  window.__tjsLog = log;
  for (let n = 0; n < N; n++) {
    if (!(await openComposer())) { log.push("NO COMPOSER"); break; }
    const r = await one();
    log.push(r);
    if (!r.startsWith("SCHEDULED")) break;
    await W(3000);
  }
  return log.join(" | ");
})()
