import type { Metadata } from "next";
import Legal from "@/components/Legal";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Cookie Policy",
  robots: { index: false },
};

export default function Page() {
  const analytics = site.cookies.analyticsEnabled;
  const cfAnalytics = Boolean(site.analytics.cloudflareToken);
  return (
    <Legal title="Cookie Policy" homeHref="/en" updatedLabel="Last updated">
      <h2>1. What are cookies?</h2>
      <p>
        Cookies are small text files that websites store on your device to remember
        information about your visit.
      </p>

      <h2>2. Cookies used on this site</h2>
      {analytics ? (
        <>
          <p>This site uses the following categories of cookies:</p>
          <ul>
            <li>
              <strong>Technical (necessary) cookies:</strong> essential for the site to
              work. They do not require consent.
            </li>
            <li>
              <strong>Analytics cookies:</strong> allow us to measure and analyse
              browsing in aggregate to improve the site. They are only activated with
              your consent.
            </li>
          </ul>
          <p>
            You can accept or reject analytics cookies via the banner shown when you
            access the site, and change your choice at any time by clearing cookies in
            your browser settings.
          </p>
        </>
      ) : (
        <>
          <p>
            This site currently uses <strong>no tracking or advertising cookies</strong>.
            Only strictly necessary technical cookies may be used for the site to work
            properly, which are exempt from consent under Article 22.2 of the Spanish
            LSSI-CE.
          </p>
          <p>
            If analytics or third-party cookies are added in the future, this policy
            will be updated and your prior consent will be requested via a banner.
          </p>
        </>
      )}
      {cfAnalytics && (
        <p>
          Separately, this site uses Cloudflare Web Analytics to measure visits and page
          views in aggregate. This tool <strong>does not set any cookie or identifier on
          your device</strong>: it does not track you across visits or across websites, so
          it does not require your prior consent under Article 22.2 of the Spanish
          LSSI-CE. More information in{" "}
          <a href="https://www.cloudflare.com/web-analytics/" target="_blank" rel="noopener noreferrer">
            Cloudflare Web Analytics&apos; policy
          </a>.
        </p>
      )}

      <h2>3. Managing cookies</h2>
      <p>
        You can configure or disable cookies in your browser settings (Chrome, Firefox,
        Safari, Edge). See your browser&apos;s help for more information.
      </p>

      <h2>4. Contact</h2>
      <p>
        For any questions about this policy, write to{" "}
        <a href={`mailto:${site.legal.privacyEmail}`}>{site.legal.privacyEmail}</a>.
      </p>
    </Legal>
  );
}