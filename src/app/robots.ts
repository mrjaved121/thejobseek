import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

// Search engines and AI assistants are all welcome: being cited by ChatGPT, Claude, Perplexity,
// Gemini and Copilot brings readers. Remove a name from AI_BOTS to opt that crawler out.
const AI_BOTS = [
  // OpenAI (ChatGPT search, browsing, training)
  "OAI-SearchBot", "ChatGPT-User", "GPTBot",
  // Anthropic (Claude)
  "Claude-SearchBot", "Claude-User", "ClaudeBot", "anthropic-ai",
  // Perplexity
  "PerplexityBot", "Perplexity-User",
  // Google Gemini / AI Overviews (Googlebot itself is covered by "*")
  "Google-Extended",
  // Microsoft Copilot uses Bingbot (covered by "*"); Apple Intelligence / Siri
  "Applebot", "Applebot-Extended",
  // Others
  "Amazonbot", "DuckAssistBot", "Meta-ExternalAgent", "MistralAI-User", "cohere-ai", "YouBot", "CCBot",
];

const DISALLOW = ["/search/", "/search-index.json"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      { userAgent: AI_BOTS, allow: ["/", "/llms.txt", "/llms-full.txt"], disallow: DISALLOW },
    ],
    sitemap: [`${SITE.url}/sitemap.xml`, `${SITE.url}/news-sitemap.xml`],
    host: SITE.url,
  };
}
