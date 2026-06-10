import Link from 'next/link';

export default function ImpressumPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-background overflow-auto">
      <main className="flex-1 flex items-start justify-center px-6 py-8">
        <div className="max-w-3xl w-full bg-card rounded-3xl shadow-lg px-12 py-10 border-2 border-secondary">
          <h1 className="text-5xl font-bold mb-10 text-foreground">Impressum</h1>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Herausgeber</h2>
            <p className="text-base text-foreground mb-1">Technische Universität München</p>
            <p className="text-base text-foreground mb-1">Postanschrift: Arcisstraße 21, 80333 München</p>
            <p className="text-base text-foreground mb-1">Telefon: +49&#8209;(0)89&#8209;289&#8209;01</p>
            <p className="text-base text-foreground">
              E-Mail:{' '}
              <a href="mailto:poststelle@tum.de" className="text-primary hover:underline">
                poststelle(at)tum.de
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Vertretungsberechtigt</h2>
            <p className="text-base text-foreground">
              Die Technische Universität München wird gesetzlich vertreten durch den Präsidenten
              Prof. Dr. Thomas F. Hofmann.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
              Umsatzsteueridentifikationsnummer
            </h2>
            <p className="text-base text-foreground">DE811193231 (gemäß § 27a Umsatzsteuergesetz)</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Verantwortlich für den Inhalt</h2>
            <p className="text-base text-foreground mb-1">Prof. Dr. Stephan Krusche</p>
            <p className="text-base text-foreground mb-1">
              Professur für Applied Education Technologies (TUS1322)
            </p>
            <p className="text-base text-foreground mb-1">
              TUM School of Computation, Information and Technology
            </p>
            <p className="text-base text-foreground mb-1">
              Boltzmannstraße 3, 85748 Garching b. München
            </p>
            <p className="text-base text-foreground mb-1">
              E-Mail:{' '}
              <a href="mailto:krusche@tum.de" className="text-primary hover:underline">
                krusche(at)tum.de
              </a>
            </p>
            <p className="text-base text-foreground">Telefon: +49 89 289 18233</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Projektkontakt</h2>
            <p className="text-base text-foreground mb-1">
              ExplAIner ist eine experimentelle Lernanwendung, die im Rahmen eines
              Forschungsprojekts der TUM betrieben wird.
            </p>
            <p className="text-base text-foreground">
              E-Mail:{' '}
              <a
                href="mailto:ben.lenk-ostendorf@tum.de"
                className="text-primary hover:underline"
              >
                ben.lenk-ostendorf@tum.de
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Haftungsausschluss</h2>
            <p className="text-base text-muted-foreground mb-4">
              Alle auf dieser Internetseite bereitgestellten Informationen haben wir nach bestem
              Wissen und Gewissen erarbeitet und geprüft. Eine Gewähr für die jederzeitige
              Aktualität, Richtigkeit, Vollständigkeit und Verfügbarkeit der bereitgestellten
              Informationen können wir allerdings nicht übernehmen. Ein Vertragsverhältnis mit den
              Nutzern des Internetangebots kommt nicht zustande.
            </p>
            <p className="text-base text-muted-foreground">
              Wir haften nicht für Schäden, die durch die Nutzung dieses Internetangebots entstehen.
              Dieser Haftungsausschluss gilt nicht, soweit die Vorschriften des § 839 BGB (Haftung
              bei Amtspflichtverletzung) einschlägig sind.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Links</h2>
            <p className="text-base text-muted-foreground">
              Von unseren eigenen Inhalten sind Querverweise („Links“) auf die Webseiten anderer
              Anbieter zu unterscheiden. Für illegale, fehlerhafte oder unvollständige Inhalte und
              insbesondere für Schäden, die aus der Nutzung oder Nichtnutzung von Informationen
              Dritter entstehen, haftet allein der jeweilige Anbieter der Seite.
            </p>
          </section>

          <p className="text-sm text-muted-foreground">
            Siehe auch unsere{' '}
            <Link href="/datenschutz" className="text-primary hover:underline">
              Datenschutzerklärung
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
