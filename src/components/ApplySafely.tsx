import Link from "next/link";

/** Safety guidance shown on every Jobs page (useful, original content for readers and AdSense review). */
export default function ApplySafely() {
  return (
    <section className="apply-safely">
      <h2>How to apply safely</h2>
      <ul>
        <li><strong>Apply only through the official route.</strong> &quot;Apply on official site&quot; buttons go to the employer&apos;s or government&apos;s own careers page. For <em>Employer job posts</em>, CVs go to info@thejobseek.com and are passed only to that employer. We never send you to an agent.</li>
        <li><strong>Never pay for a job.</strong> Genuine employers do not charge for applications, interviews, job offers or work visas. In the UAE the employer pays for the work permit.</li>
        <li><strong>Check the email address.</strong> Real offers come from the company&apos;s own domain, not from a free email account or a WhatsApp number alone.</li>
        <li><strong>Keep your documents private.</strong> Only share your passport or ID through the official application portal.</li>
        <li><strong>Check the closing date</strong> and the requirements in the article before you apply.</li>
      </ul>
      <p>
        Read more: <Link href="/uae/uae-job-offer-scam-warning-signs/">warning signs of a fake job offer</Link> ·{" "}
        <Link href="/uae/how-to-find-a-job-in-uae-guide/">how to find a job in the UAE</Link>
      </p>
    </section>
  );
}
