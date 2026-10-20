import type { Metadata } from "next";
import StaticPage from "@/components/StaticPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact ${SITE.name} for corrections, news tips, advertising or general questions.`,
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  const socials = Object.entries(SITE.social).filter(([, v]) => v);
  return (
    <StaticPage title="Contact Us" path="/contact">
      <p>We read every message. Please choose the right subject so we can reply faster.</p>
      <ul>
        <li><strong>Corrections:</strong> send the article link and what is wrong, with an official source if possible.</li>
        <li><strong>News tips:</strong> share official recruitment notices or announcements.</li>
        <li><strong>Advertising and partnerships:</strong> include your company name and website.</li>
      </ul>
      <p>
        Email: <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
      </p>
      <p>Based in Dubai, United Arab Emirates.</p>
      {socials.length > 0 && (
        <p>
          Social:{" "}
          {socials.map(([k, v], i) => (
            <span key={k}>
              {i > 0 && " · "}
              <a href={v} target="_blank" rel="noopener">{k[0].toUpperCase() + k.slice(1)}</a>
            </span>
          ))}
        </p>
      )}
      <p className="notice">
        We cannot help with individual job applications or visas, and we never ask for payment
        for jobs. Please apply through the official source linked in each article.
      </p>
    </StaticPage>
  );
}
