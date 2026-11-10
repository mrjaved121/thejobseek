# Facebook Page posting

Page: **The Job Seek Gulf Jobs & Career News**: https://www.facebook.com/thejobseeknews (Page ID `1343719545497150`).
Posts go out from the built-in browser in the Claude desktop app, where the owner is already logged in.

## Files

- `build-fb-queue.mjs`: rebuilds `fb-queue.json` from `content/articles/*.md` (one post per article, oldest first). It keeps the `posted` flags, so it's safe to run any time.
- `fb-next.mjs [count]`: prints today's batch, one JSON line each (`slug`, `TITLE`, `caption`). Articles from the last 3 days come first, then the oldest backlog.
- `mark-posted.mjs <slug>...`: marks articles as posted once they're live.

## Daily limit

**8 posts per day at most.** The Page is new and small, and a burst of link posts can get it flagged as spam. Stop the run early if Facebook shows any warning, block, "You can't post right now", checkpoint or login screen.

## How to post one article (built-in browser)

1. Navigate to `https://www.facebook.com/1343719545497150/?modal=composer` and wait 7 seconds.
2. Focus the text box (javascript_tool):
   ```js
   const d=[...document.querySelectorAll('[role=dialog]')].find(x=>x.innerText.includes('Create post')); const ed=d&&d.querySelector('[contenteditable=true][role=textbox]'); if(ed){ed.focus();} ({ed:!!ed, sendMsg: d?d.innerText.includes('Send Message'):null})
   ```
   If `ed` is false, or `sendMsg` is true, reload and try again. Don't type yet.
3. Type the caption with `computer` → `type`, adding a trailing space so Facebook picks up the link.
4. Wait for the link preview, click Next, check the settings screen, then click Post. Replace `TITLE` with the `TITLE` value from `fb-next.mjs`:
   ```js
   const TITLE='...'; const W=ms=>new Promise(r=>setTimeout(r,ms)); const vis=x=>x.getBoundingClientRect().width>0; let d,ok=false; for(let i=0;i<20;i++){ d=[...document.querySelectorAll('[role=dialog]')].find(x=>x.innerText.includes('Create post')&&vis(x)); if(d && d.innerText.includes(TITLE) && /THEJOBSEEK\.COM/i.test(d.innerText)) {ok=true;break;} await W(1000);} if(!ok) 'preview not ready'; else { await W(1500); d.querySelector('[aria-label="Next"]').click(); await W(5000); const s=[...document.querySelectorAll('[role=dialog]')].find(x=>x.innerText.startsWith('Post settings')&&vis(x)); const outer=[...document.querySelectorAll('[role=dialog]')].find(x=>x.querySelector('[aria-label="Post"]')); if(s && outer && outer.innerText.includes('Post preview') && outer.innerText.includes(TITLE)){ outer.querySelector('[aria-label="Post"]').click(); await W(7000); [...document.querySelectorAll('[role=dialog]')].some(x=>x.innerText.startsWith('Post settings')&&vis(x)) ? 'clicked, dialog still open' : 'posted'; } else 'settings check failed'; }
   ```
5. Only `"posted"` counts as success. Then run `node marketing/mark-posted.mjs <slug>`.
   For any other result, don't retry blindly. First open
   `https://www.facebook.com/professional_dashboard/content/content_library/` and check whether the title is already there, so nothing gets posted twice.

Never boost a post, touch ads, change Page settings or reply to messages as part of this job.
