// AdSense requires ads.txt at the domain root. Generated from NEXT_PUBLIC_ADSENSE_CLIENT.
export const dynamic = "force-static";

export function GET() {
  const client = (process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "").replace(/^ca-/, "");
  const body = client ? `google.com, ${client}, DIRECT, f08c47fec0942fa0\n` : "# AdSense not configured yet\n";
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
