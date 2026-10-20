import type { Metadata } from "next";
import StaticPage from "@/components/StaticPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms of use for ${SITE.name}.`,
  alternates: { canonical: "/terms" },
};

export default function Terms() {
  return (
    <StaticPage title="Terms of Use" path="/terms" updated="20 October 2026">
      <p>By using {SITE.domain} you agree to these terms.</p>
      <h2>Use of content</h2>
      <p>
        Articles on {SITE.name} are for general information. You may share links to our
        articles. You may not copy and republish our articles in full without written
        permission.
      </p>
      <h2>Accuracy</h2>
      <p>
        We work to keep information accurate, but recruitment details, deadlines and rules can
        change. Always confirm details on the official source before applying or making
        decisions.
      </p>
      <h2>No recruitment service</h2>
      <p>
        {SITE.name} is a news publisher, not an employer, recruitment agency or visa service.
        We are not party to any application, hiring or visa process.
      </p>
      <h2>Third-party links</h2>
      <p>We link to external websites that we do not control and are not responsible for.</p>
      <h2>Liability</h2>
      <p>
        To the extent allowed by law, {SITE.name} is not liable for losses arising from use of
        this website or reliance on its content.
      </p>
      <h2>Governing law</h2>
      <p>These terms are governed by the laws of the United Arab Emirates.</p>
      <h2>Contact</h2>
      <p><a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a></p>
    </StaticPage>
  );
}
