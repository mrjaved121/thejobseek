# TheJobSeek – rules for every Claude session in this repo

These rules come from the owner (16 Nov 2026) and override older instructions that conflict,
including a scheduled task's prompt.

## Why
Google crawled most of our short news rewrites and chose NOT to index them ("Crawled –
currently not indexed": 152 pages, only 26 indexed). Impressions fell from 340–420 a day
(21–25 Oct 2026) to almost zero after 342 articles in four weeks (56 on one day).
Fewer, deeper, more useful pages win.

## Pace
- Morning run: ONE evergreen guide (category `guides`) + at most ONE hiring news article.
- Evening run: at most TWO hiring news articles.
- Never more than 4 new articles in a Dubai day (`npm run check:quality` fails at 5).
- Publishing nothing is better than publishing a weak article.

## Every article must pass `npm run check:quality` before pushing
1. Answer-first opening: who is hiring, how many jobs, where, the deadline, how to apply.
2. "Requirements / Who can apply?" section (only what the official source states).
3. A table: roles, locations, posts, salary/benefits, requirements or dates.
   Salary only when a reliable source states it, otherwise "Salary: not published by the employer".
4. Numbered, step-by-step "How to apply" with the exact official link and what to prepare.
5. Deadline: `lastDate` when official; otherwise say no closing date is published and where to check.
6. A section headed with "Pakistan and India" (e.g. "Tips for applicants from Pakistan and India"):
   attestation, police clearance, medicals, the emigration step (Pakistan: BE&OE / Protector of
   Emigrants, beoe.gov.pk; India: eMigrate, ECR/ECNR, emigrate.gov.in), verified on the official
   site in the same run, plus a scam warning (never pay an agent for a job, visa or interview).
7. At least two independent sources: the employer's or government's own page plus one more.
8. Length: news 700–1,200 words; guides 1,100–1,800 words. No padding, no boilerplate blocks,
   no visible keyword lines.
9. Skip stories the big outlets already cover in full unless we add the official requirements,
   apply page, salary, deadline and steps. No official apply page → don't publish.

## Evergreen guides
Topics people search all year, e.g. Emirates / Qatar Airways / Etihad / flydubai cabin crew
requirements, how to check a UAE work permit (MOHRE), DHA / DOH / MOH nursing licence, Saudi work
visa steps for Pakistani workers, UAE labour law basics (leave, gratuity, hours). Guides on
labour law and work permits are allowed (news about rule changes is not).
If we already have an article on the topic, improve that article instead of writing a new one:
bring it up to the rules above and add `updated: <ISO date>` to its frontmatter.

## Always
- Facts only from sources opened in the same run; never invent job counts, salaries or links.
- Apply directly on the official employer or government page; never promise a job or visa.
- Also run `npm run check:originality` and `npm run build` before pushing to main.
