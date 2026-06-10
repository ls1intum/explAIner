import Link from 'next/link';

export default function DatenschutzPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-background overflow-auto">
      <main className="flex-1 flex items-start justify-center px-6 py-8">
        <div className="max-w-3xl w-full bg-card rounded-3xl shadow-lg px-12 py-10 border-2 border-secondary text-foreground">
          <h1 className="text-5xl font-bold mb-10">Datenschutzerklärung</h1>

          {/* Intro */}
          <section className="mb-10">
            <p className="text-base mb-4">
              Die Technische Universität München (TUM) nimmt den Schutz personenbezogener Daten
              sehr ernst und nutzt eine sichere und verschlüsselte Kommunikation (HTTPS mit gültigem
              Zertifikat, TLS). ExplAIner ist eine experimentelle, KI-gestützte Lernanwendung, die
              im Rahmen eines universitären Forschungsprojekts der TUM betrieben wird. Die Teilnahme
              ist freiwillig.
            </p>
            <p className="text-base mb-4">
              ExplAIner verarbeitet personenbezogene Daten ausschließlich auf Grundlage Ihrer
              Einwilligung, die im Rahmen der vorgeschalteten Online-Studie (Umfrage) eingeholt wird
              (Art. 6 Abs. 1 lit. a DSGVO). Sie können diese Einwilligung jederzeit mit Wirkung für
              die Zukunft widerrufen.
            </p>
            <p className="text-base">
              Nachfolgend informieren wir über Art, Umfang und Zweck der Erhebung und Verwendung
              personenbezogener Daten. Diese Informationen können jederzeit von dieser Webseite
              abgerufen werden.
            </p>
          </section>

          {/* Allgemeine Informationen */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6">Allgemeine Informationen</h2>

            <h3 className="text-xl font-bold mb-3">Name und Kontaktdaten des Verantwortlichen</h3>
            <p className="text-base mb-1">Technische Universität München</p>
            <p className="text-base mb-1">Postanschrift: Arcisstraße 21, 80333 München</p>
            <p className="text-base mb-1">Telefon: +49&#8209;(0)89&#8209;289&#8209;01</p>
            <p className="text-base mb-6">
              E-Mail:{' '}
              <a href="mailto:poststelle@tum.de" className="text-primary hover:underline">
                poststelle@tum.de
              </a>
            </p>

            <h3 className="text-xl font-bold mb-3">Verantwortlich für das Projekt ExplAIner</h3>
            <p className="text-base mb-1">Prof. Dr. Stephan Krusche</p>
            <p className="text-base mb-1">
              Professur für Applied Education Technologies, TUM School of Computation, Information
              and Technology
            </p>
            <p className="text-base mb-1">Boltzmannstraße 3, 85748 Garching b. München</p>
            <p className="text-base mb-1">
              E-Mail:{' '}
              <a href="mailto:krusche@tum.de" className="text-primary hover:underline">
                krusche@tum.de
              </a>
            </p>
            <p className="text-base mb-6">Telefon: +49 89 289 18233</p>

            <h3 className="text-xl font-bold mb-3">
              Kontaktdaten des/der Datenschutzbeauftragten
            </h3>
            <p className="text-base mb-1">
              Der/Die Datenschutzbeauftragte der Technischen Universität München
            </p>
            <p className="text-base mb-1">Postanschrift: Arcisstraße 21, 80333 München</p>
            <p className="text-base mb-1">Telefon: 089/289-17052</p>
            <p className="text-base">
              E-Mail:{' '}
              <a
                href="mailto:beauftragter@datenschutz.tum.de"
                className="text-primary hover:underline"
              >
                beauftragter@datenschutz.tum.de
              </a>
            </p>
          </section>

          {/* Zwecke und Rechtsgrundlagen */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6">
              Zwecke und Rechtsgrundlagen der Verarbeitung
            </h2>
            <p className="text-base mb-4">
              Zweck der Verarbeitung ist die Bereitstellung einer KI-gestützten Lernanwendung sowie
              die wissenschaftliche Untersuchung des Lernens mit dieser Anwendung im Rahmen eines
              Forschungsprojekts.
            </p>
            <p className="text-base">
              Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die im Rahmen der
              der Nutzung vorgeschalteten Online-Studie eingeholt wird. Die Teilnahme ist freiwillig;
              aus einer Nichtteilnahme entstehen Ihnen keine Nachteile.
            </p>
          </section>

          {/* Empfänger */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6">Empfänger personenbezogener Daten</h2>
            <p className="text-base mb-3">
              Eine Übermittlung Ihrer Daten an Empfänger außerhalb der TUM findet nur in folgendem,
              für den Betrieb erforderlichen Umfang statt:
            </p>
            <ul className="list-disc pl-6 text-base mb-4 space-y-2">
              <li>
                <span className="font-semibold">Technischer Betrieb / Hosting:</span> Die Anwendung
                wird auf einem Server der Technischen Universität München (Professur für Applied
                Education Technologies, TUM School of Computation, Information and Technology,
                Garching) betrieben.
              </li>
              <li>
                <span className="font-semibold">KI-gestützte Inhaltsgenerierung:</span> Die von
                Ihnen eingegebenen Texte werden zur Generierung der Lerninhalte an den Dienst SAIA
                (Scalable Artificial Intelligence Accelerator) der Gesellschaft für
                wissenschaftliche Datenverarbeitung mbH Göttingen (GWDG) übermittelt. Näheres siehe
                Abschnitt „KI-gestützte Inhaltsgenerierung“.
              </li>
            </ul>
            <p className="text-base">
              Gegebenenfalls werden Ihre Daten an die zuständigen Aufsichts- und
              Rechnungsprüfungsbehörden zur Wahrnehmung der jeweiligen Kontrollrechte übermittelt.
            </p>
          </section>

          {/* Speicherdauer */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6">Dauer der Speicherung</h2>
            <p className="text-base">
              Die im Rahmen einer Lernsitzung erzeugten Daten werden im Zuge der wissenschaftlichen
              Auswertung vollständig anonymisiert; die nicht anonymisierten Ausgangsdaten werden
              anschließend gelöscht. Die anonymisierten Daten lassen keinen Rückschluss auf einzelne
              Personen zu, unterliegen damit nicht mehr der DSGVO und können unbefristet aufbewahrt,
              ausgewertet und im Sinne offener Wissenschaft anderen Forschenden zur Verfügung
              gestellt werden. Server-Logdateien werden nach 14 Tagen automatisch gelöscht, sofern
              sie nicht zur Aufklärung eines konkreten Sicherheitsvorfalls benötigt werden.
            </p>
          </section>

          {/* Ihre Rechte */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6">Ihre Rechte</h2>
            <p className="text-base mb-3">
              Soweit wir von Ihnen personenbezogene Daten verarbeiten, stehen Ihnen als Betroffener
              folgende Rechte zu:
            </p>
            <ul className="list-disc pl-6 text-base space-y-2">
              <li>
                Sie haben das Recht auf Auskunft über die zu Ihrer Person gespeicherten Daten
                (Art. 15 DSGVO).
              </li>
              <li>
                Sollten unrichtige personenbezogene Daten verarbeitet werden, steht Ihnen ein Recht
                auf Berichtigung zu (Art. 16 DSGVO).
              </li>
              <li>
                Liegen die gesetzlichen Voraussetzungen vor, so können Sie die Löschung oder
                Einschränkung der Verarbeitung verlangen (Art. 17 und 18 DSGVO).
              </li>
              <li>
                Sofern die Verarbeitung auf Ihrer Einwilligung beruht und automatisiert erfolgt,
                steht Ihnen gegebenenfalls ein Recht auf Datenübertragbarkeit zu (Art. 20 DSGVO).
              </li>
              <li>
                Da die Verarbeitung auf Ihrer Einwilligung beruht, können Sie diese jederzeit für
                die Zukunft widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten
                Verarbeitung wird durch den Widerruf nicht berührt.
              </li>
            </ul>
          </section>

          {/* Beschwerderecht */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6">Beschwerderecht bei der Aufsichtsbehörde</h2>
            <p className="text-base mb-1">
              Weiterhin besteht ein Beschwerderecht beim Bayerischen Landesbeauftragten für den
              Datenschutz. Diesen können Sie unter folgenden Kontaktdaten erreichen:
            </p>
            <p className="text-base mb-1">Postanschrift: Postfach 22 12 19, 80502 München</p>
            <p className="text-base mb-1">Adresse: Wagmüllerstraße 18, 80538 München</p>
            <p className="text-base mb-1">Telefon: 089 212672-0</p>
            <p className="text-base mb-1">
              E-Mail:{' '}
              <a
                href="mailto:poststelle@datenschutz-bayern.de"
                className="text-primary hover:underline"
              >
                poststelle@datenschutz-bayern.de
              </a>
            </p>
            <p className="text-base">
              <a
                href="https://www.datenschutz-bayern.de/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                https://www.datenschutz-bayern.de/
              </a>
            </p>
          </section>

          {/* Internetauftritt */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6">Informationen zum Internetauftritt</h2>

            <h3 className="text-xl font-bold mb-3">Protokollierung</h3>
            <p className="text-base mb-3">
              Wenn Sie diese Webseite aufrufen, übermittelt Ihr Internetbrowser Daten an unseren
              Webserver. Die folgenden Daten werden während einer laufenden Verbindung zur
              Kommunikation zwischen Ihrem Browser und unserem Server temporär in einer Logdatei
              aufgezeichnet:
            </p>
            <ul className="list-disc pl-6 text-base mb-3 space-y-1">
              <li>IP-Adresse des anfragenden Rechners</li>
              <li>Datum und Uhrzeit des Zugriffs</li>
              <li>Name, URL und übertragene Datenmenge der abgerufenen Datei</li>
              <li>Zugriffsstatus (angeforderte Datei übertragen, nicht gefunden etc.)</li>
              <li>Erkennungsdaten des verwendeten Browser- und Betriebssystems</li>
              <li>Webseite, von der aus der Zugriff erfolgte (sofern übermittelt)</li>
            </ul>
            <p className="text-base mb-2">
              <span className="font-semibold">Rechtsgrundlage:</span> Art. 6 Abs. 1 lit. e DSGVO
              i.&nbsp;V.&nbsp;m. Art. 4 Abs. 1 BayDSG. Die Protokollierung ist zur Sicherstellung
              eines ordnungsgemäßen und sicheren Betriebs der Plattform erforderlich.
            </p>
            <p className="text-base mb-6">
              <span className="font-semibold">Speicherdauer:</span> Logdateien werden nach 14 Tagen
              automatisch gelöscht.
            </p>

            <h3 className="text-xl font-bold mb-3">Cookies</h3>
            <p className="text-base mb-3">
              ExplAIner verwendet ausschließlich ein technisch notwendiges Cookie:
            </p>
            <ul className="list-disc pl-6 text-base mb-3 space-y-1">
              <li>
                <span className="font-semibold">Zugangs-Cookie (<code>explainer_access</code>):</span>{' '}
                Hält den Zugang frei, solange die Anwendung über einen Zugangstoken geschützt ist.
                Es dient ausschließlich diesem Zweck.
              </li>
            </ul>
            <p className="text-base">
              Es werden keine Cookies zu Tracking-, Analyse- oder Werbezwecken eingesetzt. Technisch
              notwendige Cookies sind zur Bereitstellung des Dienstes erforderlich und bedürfen
              keiner Einwilligung gemäß § 25 Abs. 2 Nr. 2 TDDDG.
            </p>
          </section>

          {/* Einzelne Verarbeitungen */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6">Informationen zu einzelnen Verarbeitungen</h2>

            <h3 className="text-xl font-bold mb-3">Daten der Lernsitzung</h3>
            <p className="text-base mb-3">
              ExplAIner erfordert keine Anmeldung und legt kein Benutzerkonto an. Es werden weder
              Name, E-Mail-Adresse, Matrikelnummer noch eine TUM-Kennung erhoben. Eine Lernsitzung
              wird unter einer zufällig erzeugten, nicht auf Ihre Person rückführbaren Kennung
              gespeichert. Dabei werden verarbeitet:
            </p>
            <ul className="list-disc pl-6 text-base mb-3 space-y-1">
              <li>von Ihnen gewähltes Thema, Lernziel und (optional) angegebenes Vorwissen</li>
              <li>Ihre Nachrichten im Chat sowie die generierten Antworten</li>
              <li>Ihre Antworten auf Übungs-/Quizfragen und deren Auswertung</li>
              <li>eine optionale Bewertung (Feedback) der Sitzung</li>
              <li>Zeitstempel zu Beginn und Abschluss der Sitzung</li>
            </ul>
            <p className="text-base mb-6">
              <span className="font-semibold">Hinweis:</span> Bitte geben Sie in den Freitextfeldern
              (Thema, Vorwissen, Chat) keine personenbezogenen Daten über sich oder Dritte ein, da
              diese Eingaben gespeichert und an den KI-Dienst übermittelt werden.
            </p>

            <h3 className="text-xl font-bold mb-3">KI-gestützte Inhaltsgenerierung</h3>
            <p className="text-base mb-3">
              Zur Erzeugung der Lerninhalte (z. B. Erklärungen, Übungsfragen, Chat-Antworten) werden
              die von Ihnen eingegebenen Texte an den Dienst SAIA der GWDG übermittelt und dort von
              einem KI-Modell verarbeitet. Dabei gilt:
            </p>
            <ul className="list-disc pl-6 text-base mb-3 space-y-1">
              <li>
                Das verwendete (quelloffene) KI-Modell wird auf der Infrastruktur der GWDG in
                Deutschland betrieben. Eine Übermittlung in ein Drittland (z. B. die USA) findet
                nicht statt.
              </li>
              <li>
                Die Inhalte werden ausschließlich zur Bearbeitung Ihrer Anfrage verarbeitet und von
                der GWDG nicht dauerhaft gespeichert.
              </li>
              <li>Ihre Eingaben werden nicht zum Training von KI-Modellen verwendet.</li>
              <li>Alle Datenübertragungen sind verschlüsselt.</li>
            </ul>
            <p className="text-base mb-6">
              <span className="font-semibold">Rechtsgrundlage:</span> Art. 6 Abs. 1 lit. a DSGVO
              (Einwilligung).
            </p>

            <h3 className="text-xl font-bold mb-3">Wissenschaftliche Auswertung</h3>
            <p className="text-base mb-3">
              Die in den Lernsitzungen erzeugten Daten werden zu wissenschaftlichen Zwecken
              ausgewertet, um die Anwendung und das Lernen mit ihr zu untersuchen und
              weiterzuentwickeln. Die Daten werden hierzu vollständig anonymisiert. Die
              anonymisierten Daten können im Sinne offener Wissenschaft anderen Forschenden zur
              Verfügung gestellt und in anonymisierter, aggregierter Form veröffentlicht werden; ein
              Rückschluss auf einzelne Personen ist dabei ausgeschlossen.
            </p>
            <p className="text-base mb-6">
              <span className="font-semibold">Rechtsgrundlage:</span> Art. 6 Abs. 1 lit. a DSGVO
              (Einwilligung), eingeholt im Rahmen der vorgeschalteten Online-Studie.
            </p>

            <h3 className="text-xl font-bold mb-3">Keine automatisierte Entscheidungsfindung</h3>
            <p className="text-base">
              Die KI-gestützte Generierung von Lerninhalten und die Auswertung von Quizantworten
              dienen ausschließlich der Lernunterstützung. Es findet keine automatisierte
              Entscheidung mit rechtlicher Wirkung und kein Profiling im Sinne des Art. 22 DSGVO
              statt; insbesondere erfolgt keine Benotung oder Bewertung Ihrer Person.
            </p>
          </section>

          {/* Auskunft */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6">Auskunft und Kontakt</h2>
            <p className="text-base mb-3">
              Für nähere Informationen zur Verarbeitung Ihrer Daten und zur Ausübung Ihrer Rechte
              können Sie sich an die oben genannten Kontaktdaten des Verantwortlichen oder an den/die
              Datenschutzbeauftragte(n) der TUM wenden.
            </p>
            <p className="text-base">
              Da ExplAIner keine identifizierenden Daten erhebt und Lernsitzungen anonym gespeichert
              werden, ist eine Zuordnung gespeicherter Daten zu Ihrer Person regelmäßig nicht
              möglich (Art. 11 DSGVO). Zur Ausübung Ihrer Rechte ist daher ggf. die Angabe der
              jeweiligen Sitzungskennung erforderlich.
            </p>
          </section>

          <p className="text-sm text-muted-foreground">
            Siehe auch unser{' '}
            <Link href="/impressum" className="text-primary hover:underline">
              Impressum
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
