import type { Metadata } from "next";
import StaticPage from "@/components/StaticPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE.name} collects, uses and protects information, including cookies and Google AdSense advertising.`,
  alternates: { canonical: "/privacy-policy/" },
};

export default function Privacy() {
  return (
    <StaticPage title="Privacy Policy" path="/privacy-policy/" updated="20 October 2026">
      <p>
        This policy explains how {SITE.name} ({SITE.domain}) handles information when you visit
        our website.
      </p>
      <h2>Information we collect</h2>
      <p>
        You can read our website without creating an account. We collect standard technical
        data such as your browser type, device, approximate location and pages visited, through
        server logs and analytics tools. If you email us, we receive your email address and
        message, which we use only to reply.
      </p>
      <h2>Cookies</h2>
      <p>
        We use cookies to understand how visitors use the site (Google Analytics) and to show
        advertising (Google AdSense). You can block or delete cookies in your browser settings.
      </p>
      <h2>Google AdSense and third-party advertising</h2>
      <ul>
        <li>Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites.</li>
        <li>Google&apos;s use of advertising cookies enables it and its partners to serve ads to you based on your visits to this site and/or other sites on the Internet.</li>
        <li>
          You may opt out of personalised advertising by visiting{" "}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener">Google Ads Settings</a>, or opt out
          of some third-party vendors&apos; cookies at{" "}
          <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener">aboutads.info</a>.
        </li>
        <li>
          Learn more in{" "}
          <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener">
            how Google uses information from sites that use its services
          </a>.
        </li>
      </ul>
      <h2>External links</h2>
      <p>
        Our articles link to official government and employer websites. We are not responsible
        for their content or privacy practices.
      </p>
      <h2>Children</h2>
      <p>This website is intended for adults seeking employment and does not knowingly collect data from children.</p>
      <h2>Your rights</h2>
      <p>
        You may ask us to access or delete any personal information you have sent us by
        emailing <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
      </p>
      <h2>Changes</h2>
      <p>We may update this policy and will change the date at the top of this page when we do.</p>
    </StaticPage>
  );
}
