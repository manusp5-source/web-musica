import type { Metadata } from "next";
import Legal from "@/components/Legal";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  robots: { index: false },
};

export default function Page() {
  const L = site.legal;
  return (
    <Legal title="Privacy Policy" homeHref="/en" updatedLabel="Last updated">
      <p>
        In accordance with Regulation (EU) 2016/679 (GDPR) and Spanish Organic Law
        3/2018 (LOPDGDD), users are informed about the processing of their personal
        data.
      </p>

      <h2>1. Data controller</h2>
      <ul>
        <li><strong>Controller:</strong> {L.fullName}</li>
        <li><strong>Tax ID (NIF/DNI):</strong> {L.nif}</li>
        <li><strong>Address:</strong> {L.address}</li>
        <li><strong>Email:</strong> {L.privacyEmail}</li>
      </ul>

      <h2>2. Google Reviews shown on this site</h2>
      <p>
        The reviews section on this site publishes real reviews left by clients on my
        Google Business Profile, with their public name and the text they wrote, exactly
        as they appear on Google — <strong>never filtered by rating, never edited</strong>.
      </p>
      <ul>
        <li>
          <strong>Source:</strong> this is data the reviewer already made public by
          writing their review on Google. It is not collected or requested directly here.
        </li>
        <li>
          <strong>Data published:</strong> the reviewer&apos;s public Google name and the
          text of their review. Their profile photo is not shown, nor is any contact
          detail.
        </li>
        <li>
          <strong>Legal basis:</strong> legitimate interest (Art. 6.1.f GDPR), as this is
          an already-public opinion about the very professional service provided, without
          this being a disproportionate detriment to the data subject against the
          interest of showing real, verifiable reviews.
        </li>
        <li>
          <strong>Requesting removal:</strong> anyone who left a review can ask to have it
          removed from this site by writing to{" "}
          <a href={`mailto:${L.privacyEmail}`}>{L.privacyEmail}</a>. This is handled
          within 30 days, regardless of whether the review stays on Google.
        </li>
      </ul>

      <h2>3. What other data we collect and why</h2>
      <p>
        Through the contact form we collect the data you voluntarily provide: name,
        email, phone, event date and type, and your message. The purpose is to{" "}
        <strong>respond to your enquiry or quote request</strong> and to maintain the
        contact arising from it.
      </p>

      <h2>4. Legal basis</h2>
      <p>
        The legal basis for processing contact-form data is the{" "}
        <strong>data subject&apos;s consent</strong>, given by ticking the acceptance box
        and submitting the form (Art. 6.1.a GDPR). For Google Reviews, the basis is the
        legitimate interest described in section 2.
      </p>

      <h2>5. Data retention</h2>
      <p>
        Contact-form data will be kept for as long as necessary to handle the enquiry
        and, thereafter, for any legally required periods. If the enquiry does not lead
        to a booking, data will be deleted once it has been handled, and in any case
        within a maximum of 12 months from the last contact. Google Reviews are kept for
        as long as they remain published on Google, unless a removal request is made.
      </p>

      <h2>6. Recipients</h2>
      <p>
        Data will not be shared with third parties except where legally required. Data
        may be processed by technology providers rendering services to the controller
        (web hosting and form processing), acting as data processors under appropriate
        safeguards. If the form is processed through Formspree Inc. (USA), the transfer
        is covered by the EU-US Data Privacy Framework and/or Standard Contractual
        Clauses.
      </p>

      <h2>7. Your rights</h2>
      <p>
        You may exercise your rights of access, rectification, erasure, objection,
        restriction of processing and portability by writing to{" "}
        <a href={`mailto:${L.privacyEmail}`}>{L.privacyEmail}</a>. You may also lodge a
        complaint with the Spanish Data Protection Agency (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">www.aepd.es</a>).
      </p>

      <h2>8. Accuracy of data</h2>
      <p>
        You warrant that the data provided is true and undertake to notify any changes.
      </p>
    </Legal>
  );
}