import { CONTACT_EMAIL, LegalPage } from "@/components/marketing/legal-page";

export const metadata = {
  title: "Privacy Policy",
  description: "How SeeFood Systems collects, uses and deletes your data.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="October 17, 2026">
      <section>
        <p>
          This policy explains what data SeeFood Systems (“SeeFood”, “we”)
          collects when you use SeeFood Enterprise at seefoodsystems.com,
          including the web app and the REST API, how we use it, and how you can
          have it deleted.
        </p>
      </section>

      <section>
        <h2>Data we collect</h2>
        <ul>
          <li>
            <strong>Account information.</strong> When you sign in with Google,
            we receive your name, email address and profile picture from Google
            through Supabase Auth.
          </li>
          <li>
            <strong>Images you upload.</strong> Every image you submit for
            classification is stored in a private Supabase Storage bucket that
            only your account can access. A small thumbnail is stored with the
            scan record.
          </li>
          <li>
            <strong>Scan results.</strong> For each scan we store the verdict,
            confidence, a short description and explanation, the model used,
            processing time, the channel (web or API) and any feedback you give.
            These are stored in our Postgres database.
          </li>
          <li>
            <strong>API keys.</strong> We store a name, a short prefix and a
            one-way hash of each key. We never store the key itself.
          </li>
          <li>
            <strong>Technical data.</strong> Our hosting provider records
            standard request logs, such as IP address, user agent and
            timestamps, for security and reliability.
          </li>
          <li>
            <strong>Edited images.</strong> When you use Level it up or
            Hot-dogify, the AI-edited version of your image is stored privately
            alongside the original, with its new score.
          </li>
          <li>
            <strong>Location, only when you ask.</strong> If you use “Find hot
            dogs near me”, your browser shares your approximate location, which
            we round to about 100 meters and use only to search for nearby
            places. We do not store it.
          </li>
          <li>
            <strong>Data on your device.</strong> To work offline, the app keeps
            a copy of your scan history in your browser's local storage, and
            uses cookies to keep you signed in.
          </li>
        </ul>
      </section>

      <section>
        <h2>How we use it</h2>
        <ul>
          <li>
            To classify your images and show you the results, history and
            analytics.
          </li>
          <li>
            To authenticate you and keep your workspace separate from other
            users.
          </li>
          <li>
            To enforce rate limits, prevent abuse and keep the service secure.
          </li>
        </ul>
        <p className="mt-2">
          We do not sell your data, use it for advertising, or share it with
          anyone other than the processors below.
        </p>
      </section>

      <section>
        <h2>Processors</h2>
        <p>
          We rely on these providers to run SeeFood. Each processes data only to
          provide its service to us:
        </p>
        <ul>
          <li>
            <strong>Anthropic</strong>: analyzes uploaded images with Claude to
            produce the verdict.
          </li>
          <li>
            <strong>Supabase</strong>: authentication, Postgres database and
            image storage.
          </li>
          <li>
            <strong>Vercel</strong>: hosting and request handling for the
            website, app and API.
          </li>
          <li>
            <strong>PowerSync</strong>: syncs your scan history between our
            database and your devices.
          </li>
          <li>
            <strong>OpenRouter</strong> and <strong>Google</strong> (Gemini
            image model): edit images when you use Level it up or Hot-dogify.
          </li>
          <li>
            <strong>Komoot Photon</strong> (OpenStreetMap search): receives the
            rounded location for nearby hot dog place searches.
          </li>
          <li>
            <strong>Google</strong>: sign-in.
          </li>
        </ul>
      </section>

      <section>
        <h2>Retention and deletion</h2>
        <p>
          Scans and images are kept until you delete them. Deleting a scan in
          the app removes both the record and the stored image. To delete your
          entire account and all associated data, email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> from the
          address on your account. We will complete the deletion within 30 days
          and confirm by email.
        </p>
      </section>

      <section>
        <h2>Security</h2>
        <p>
          Data is encrypted in transit. Images are stored privately and served
          only through short-lived signed links. Every database read and write
          is scoped to the signed-in user.
        </p>
      </section>

      <section>
        <h2>Children</h2>
        <p>
          SeeFood is not directed at children under 13, and we do not knowingly
          collect their data.
        </p>
      </section>

      <section>
        <h2>Changes and contact</h2>
        <p>
          We will update this page if our practices change. Questions or
          requests: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>
    </LegalPage>
  );
}
