import Link from "next/link";
import { CONTACT_EMAIL, LegalPage } from "@/components/marketing/legal-page";

export const metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of SeeFood Enterprise.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="October 17, 2026">
      <section>
        <p>
          These terms govern your use of SeeFood Enterprise, including the
          website, web app and REST API at seefoodsystems.com, provided by
          SeeFood Systems (“SeeFood”, “we”). By using the service you agree to
          them.
        </p>
      </section>

      <section>
        <h2>The service</h2>
        <p>
          SeeFood classifies images as “Hot Dog” or “Not Hot Dog” using an AI
          model. It is a parody inspired by HBO's <em>Silicon Valley</em>,
          offered as a demonstration. Verdicts are automated and can be wrong.
          Don't rely on them for anything that matters, such as food safety,
          allergies or dietary decisions.
        </p>
      </section>

      <section>
        <h2>Your account</h2>
        <p>
          You are responsible for activity in your workspace and for keeping
          your API keys secret. Revoke a key in the app if you think it has been
          exposed.
        </p>
      </section>

      <section>
        <h2>Acceptable use</h2>
        <ul>
          <li>Only upload images you have the right to use.</li>
          <li>
            Don't upload illegal content, or content that infringes others'
            rights or privacy.
          </li>
          <li>
            Don't attempt to circumvent rate limits, access other users' data,
            or disrupt the service.
          </li>
          <li>
            Don't use the service to build a competing hot dog detection
            product. (We will know.)
          </li>
        </ul>
        <p className="mt-2">
          We may suspend accounts that violate these rules.
        </p>
      </section>

      <section>
        <h2>Your content</h2>
        <p>
          You keep all rights to the images you upload. You grant us permission
          to store and process them only to provide the service to you. How we
          handle your data is described in our{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </section>

      <section>
        <h2>Availability and changes</h2>
        <p>
          The service is provided “as is” and “as available”, without warranties
          of any kind. We may change, suspend or discontinue features at any
          time, and we may update these terms by posting a new version on this
          page.
        </p>
      </section>

      <section>
        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, SeeFood is not liable for any
          indirect, incidental or consequential damages, or for any loss arising
          from reliance on a classification.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions about these terms:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>
    </LegalPage>
  );
}
