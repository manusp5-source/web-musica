import type { Metadata } from "next";
import Legal from "@/components/Legal";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Legal Notice",
  robots: { index: false },
};

export default function Page() {
  const L = site.legal;
  return (
    <Legal title="Legal Notice" homeHref="/en" updatedLabel="Last updated">
      <h2>1. Identification</h2>
      <p>
        In compliance with Article 10 of Spanish Law 34/2002 on Information Society
        Services and Electronic Commerce (LSSI-CE), the owner of this website is:
      </p>
      <ul>
        <li><strong>Owner:</strong> {L.fullName}</li>
        <li><strong>Tax ID (NIF/DNI):</strong> {L.nif}</li>
        <li><strong>Address:</strong> {L.address}</li>
        <li><strong>Email:</strong> {site.email}</li>
        <li><strong>Website:</strong> {site.domain}</li>
      </ul>

      <h2>2. Purpose</h2>
      <p>
        This website provides information about the live music services (piano and
        viola) for events offered by the owner, and enables contact for quote requests.
      </p>

      <h2>3. Terms of use</h2>
      <p>
        Access to and use of this website confers the status of user, who accepts these
        terms. The user agrees to make appropriate use of the contents and not to use
        them for unlawful activities.
      </p>

      <h2>4. Intellectual property</h2>
      <p>
        All contents of this site (texts, images, audio and video recordings, design
        and code) are owned by the site owner or by third parties who have authorised
        their use, and are protected by intellectual property law. Reproduction without
        express authorisation is prohibited.
      </p>

      <h2>5. Liability</h2>
      <p>
        The owner is not liable for damages arising from misuse of the site or from its
        temporary unavailability due to technical causes.
      </p>

      <h2>6. Applicable law</h2>
      <p>
        These terms are governed by Spanish law. Any dispute shall be submitted to the
        courts of the owner&apos;s domicile.
      </p>
    </Legal>
  );
}