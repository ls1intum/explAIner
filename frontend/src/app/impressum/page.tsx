export default function ImpressumPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-background overflow-auto">
      <main className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="max-w-3xl w-full bg-card rounded-3xl shadow-lg px-12 py-10 border-2 border-secondary">
          <h1 className="text-5xl font-bold mb-10 text-foreground">Impressum</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Angaben gemäß § 5 TMG</h2>
            <p className="text-base text-foreground mb-1">Martin Stierlen</p>
            <p className="text-base text-foreground mb-1">Maria-Luiko-Str. 16</p>
            <p className="text-base text-foreground">80636 München</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Kontakt</h2>
            <p className="text-base text-foreground mb-1">
              E-Mail: <a href="mailto:martin.stierlen@tum.de" className="text-primary hover:underline">martin.stierlen(at)tum.de</a>
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Haftungsausschluss</h2>
            <p className="text-base text-muted-foreground">
              Diese Plattform dient zu Forschungszwecken im Rahmen eines universitären Projekts.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
