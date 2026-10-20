// AI drafting. Provider: Anthropic (default when ANTHROPIC_API_KEY is set), OpenAI (OPENAI_API_KEY),
// or "mock" for offline testing. Override with AI_PROVIDER and AI_MODEL.

const SYSTEM = `You are a careful news editor for TheJobSeek, a job and work-visa news website read by job seekers from Pakistan, India and the Gulf.

You receive the text of ONE official notice or press release. Decide if it is worth publishing and, if so, write an ORIGINAL news article from it.

STRICT RULES
1. Use ONLY facts stated in the SOURCE TEXT. Never invent or guess numbers, dates, salaries, fees, eligibility, deadlines, names or quotes. If a detail is not in the source, leave it out.
2. Write in your own words. Do not copy any sentence or any run of more than 8 consecutive words from the source (official post titles and proper names are fine).
3. Clear, neutral news style for non-native English readers: short sentences, no hype, no clickbait, no emojis.
4. 300–600 words of Markdown. Do NOT include an H1. Use "## " subheadings such as "Key details", "Who can apply", "How to apply", "What this means for job seekers" ONLY when the source supports them. A table is welcome for multiple posts/vacancies.
5. Do not tell readers to pay anyone. Do not claim TheJobSeek offers jobs or visas.
6. Set "publish": false when ANY is true: the notice is not about jobs, recruitment, exams/results, work visas, immigration for work, or labour/worker rules; the source text is too thin to write 300 useful words without inventing; the application deadline has already passed relative to TODAY; it is a tender/procurement/event/ceremony/meeting with no practical value for job seekers.
7. title: 50–75 characters, factual, main keyword near the start (e.g. "UK Raises Skilled Worker Visa Salary Threshold: What Changes").
8. description: 140–160 characters summary.
9. lastDate: application deadline as YYYY-MM-DD ONLY if explicitly stated in the source, else "".

Return ONLY a JSON object, no markdown fences:
{"publish": boolean, "reason": string, "title": string, "description": string, "country": string, "category": string, "organization": string, "lastDate": string, "tags": string[], "body": string}`;

export function provider() {
  if (process.env.AI_PROVIDER) return process.env.AI_PROVIDER;
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  if (process.env.OPENAI_API_KEY) return "openai";
  return "none";
}

export async function draftArticle({ source, item, text, today, countries, categories }) {
  const user = `TODAY: ${today}
SOURCE NAME: ${source.name}
SOURCE URL: ${item.url}
DEFAULT COUNTRY: ${source.country}
ALLOWED country values: ${countries.join(", ")}
ALLOWED category values: ${categories.join(", ")}
NOTICE TITLE: ${item.title}

SOURCE TEXT:
"""
${text}
"""`;

  const p = provider();
  let raw;
  if (p === "anthropic") raw = await anthropic(user);
  else if (p === "openai") raw = await openai(user);
  else if (p === "mock") raw = mock(source, item, text);
  else throw new Error("No AI provider configured. Set ANTHROPIC_API_KEY or OPENAI_API_KEY.");
  return parseJson(raw);
}

async function anthropic(user) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.AI_MODEL || "claude-sonnet-5-5",
      max_tokens: 3000,
      system: SYSTEM,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic API ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  return data.content?.map((c) => c.text || "").join("") || "";
}

async function openai(user) {
  if (!process.env.AI_MODEL) throw new Error("Set AI_MODEL (e.g. your preferred OpenAI model) when using OpenAI.");
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      model: process.env.AI_MODEL,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: user },
      ],
    }),
  });
  if (!res.ok) throw new Error(`OpenAI API ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

function parseJson(raw) {
  const s = raw.indexOf("{");
  const e = raw.lastIndexOf("}");
  if (s < 0 || e < s) throw new Error("AI did not return JSON");
  return JSON.parse(raw.slice(s, e + 1));
}

// Offline test double: produces a plausible draft from the source text.
function mock(source, item, text) {
  const words = text.split(/\s+/);
  const relevant = /job|recruit|visa|vacanc|worker|labour|labor/i.test(item.title + text);
  return JSON.stringify({
    publish: relevant && words.length > 60,
    reason: relevant ? "relevant" : "not job related",
    title: `Mock: ${item.title}`.slice(0, 75),
    description: `Mock summary of ${item.title}`.padEnd(140, ".").slice(0, 155),
    country: source.country,
    category: "visa-labour-law",
    organization: source.name,
    lastDate: "",
    tags: ["test"],
    body: "## Key details\n\n" + Array(40).fill("This is a mock paragraph written for testing only.").join(" "),
  });
}
