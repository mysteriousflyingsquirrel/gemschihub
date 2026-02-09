import React from 'react';
import { PageTitle } from '../components/PageTitle';

interface PatchAwardProps {
  name: string;
  description: string;
  schwierigkeitsgrad: string;
  raritaet: string;
  indikator: string;
  weiteres?: string;
  extra?: React.ReactNode;
}

const PatchAward: React.FC<PatchAwardProps> = ({ name, description, schwierigkeitsgrad, raritaet, indikator, weiteres, extra }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    {/* Patch image placeholder */}
    <div className="border-b border-gray-200 flex items-center justify-center py-4">
      <div className="w-[150px] h-[150px] bg-chnebel-gray rounded-lg flex items-center justify-center flex-shrink-0">
        <div className="text-center text-gray-400">
          <svg className="w-10 h-10 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs">150 x 150</span>
        </div>
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold text-chnebel-black mb-3">{name}</h3>
      <p className="text-chnebel-black mb-4 leading-relaxed">{description}</p>
      {extra}
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex gap-2">
          <span className="font-semibold text-gray-600 whitespace-nowrap">Schwierigkeitsgrad:</span>
          <span className="text-chnebel-black">{schwierigkeitsgrad}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-semibold text-gray-600 whitespace-nowrap">Rarit&auml;t:</span>
          <span className="text-chnebel-black">{raritaet}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-semibold text-gray-600 whitespace-nowrap">Indikator:</span>
          <span className="text-chnebel-black">{indikator}</span>
        </div>
        {weiteres && (
          <div className="flex gap-2">
            <span className="font-semibold text-gray-600 whitespace-nowrap">Weiteres:</span>
            <span className="text-chnebel-black">{weiteres}</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

export const Patchsystem: React.FC = () => {
  return (
    <>
      <PageTitle>Patchsystem</PageTitle>

      <div className="space-y-8 text-chnebel-black leading-relaxed">

        {/* Geschichte */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Geschichte</h2>
          <p className="mb-4">
            Der Erstentwurf des Chnebel Gemschi Patch Systems, das im Mai 2019 n. Chr. durch die Einf&uuml;hrung der heiligen Kutte im April 2019 n. Chr., in Kraft trat, legt die Lobung und Bestrafung der Chnebel Gemscheni fest. Es sieht eine demokratische Republik in Form eines Pr&auml;sidialsystems vor.
          </p>
          <p className="mb-4">
            Das Chnebel Gemschi Patch System wurde vom Gr&uuml;ndungsvater Tschedomat (1989 n. Chr., Grindelwald, Confoederatio Helvetica) erbiert.
          </p>
          <p className="mb-4">
            Es l&ouml;ste die zuvor geltenden anarchistischen Zust&auml;nde ab und etablierte eine starke Zentralgewalt mit einem CEO of Patchio an der Spitze, der sowohl Inventar- als auch Gl&auml;tteisen Chef ist.
          </p>
          <p className="mb-4">
            Der urspr&uuml;ngliche Entwurf bestand aus sechs Patch Awards. Im Laufe von zwei Jahren wurden f&uuml;nf weitere Zusatzawards angef&uuml;gt.
          </p>
          <p className="mb-4">
            Die &uuml;berarbeitete Version des Chnebel Gemschi Patch Systems 2022 enth&auml;lt ad&auml;quate Patch Awards, wie es sich aus der Praxis der Erstverfassung ergeben hat.
            Sie wurde von El Toro (1989 n. Chr., Grindelwald, Confoederatio Helvetica) im Mai 2022 n. Chr. erarbeitet und unter Eid von den offiziellen Chnebel Gemscheni abgesegnet.
          </p>
          <p>
            Sie umfasst generelle Artikel und die Deskription der unter Kriterien zu erhaltenden Patch Awards.
          </p>
        </section>

        {/* Generelle Artikel */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-6">Generelle Artikel</h2>
          <div className="space-y-3">
            <div className="bg-chnebel-gray rounded-lg p-4">
              <p><strong>Art. 1)</strong> Liegt der Verdacht auf einen zu verleihenden Patch vor (sich selbst oder andere), so kann jedes Chnebel Gemschi beim CEO of Patchio einen Antrag erstellen. Das Gremium, bestehend aus den offiziellen Chnebel Gemscheni, kann dies mittels demokratischer Abstimmung (absolutes Mehr) gew&auml;hren oder ablehnen. Bei einer Unentschlossenheit aus den Wahlen hat der Captain das Recht, mittels zweiter Stimme das Wahlresultat zu bestimmen.</p>
            </div>
            <div className="bg-chnebel-gray rounded-lg p-4">
              <p><strong>Art. 2)</strong> Vom Chnebel Gemschi Patch System befreit sind Ersatzspieler und Spieler der Probesaison ohne Besitz der Gemschi Kluft.</p>
            </div>
            <div className="bg-chnebel-gray rounded-lg p-4">
              <p><strong>Art. 3)</strong> Liegt eine Busse offen, ist das Chnebel Gemschi am Interclub Spieltag nur spielberechtigt, wenn die Busse bezahlt ist.</p>
            </div>
            <div className="bg-chnebel-gray rounded-lg p-4">
              <p><strong>Art. 4)</strong> Wurde ein Kleidungsst&uuml;ck der Gemschi Kluft verloren oder nicht Teil der Bschiecki, ist das Chnebel Gemschi am Interclub Spieltag nur spielberechtigt, wenn eine Best&auml;tigung vorliegt, dass fehlende Kleidungsst&uuml;cke ersetzt werden.</p>
            </div>
            <div className="bg-chnebel-gray rounded-lg p-4">
              <p><strong>Art. 5)</strong> Die Bussgelder werden in Ethereum oder in einen Shitcoin investiert. Der CEO of Patchio ist verantwortlich f&uuml;r das Investment.</p>
            </div>
          </div>
        </section>

        {/* Deskription der Patch Awards */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Deskription der Patch Awards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <PatchAward
              name="Hero of the day"
              description="Ein Gemschi ist an besagtem Tag nicht zu stoppen. Die Gravitationskraft wird komplett ausgeschaltet, das Gemschi hievt sein Ego zur Thermosph&auml;re hinaus. Die G&ouml;tter des M&auml;ttenbergs sind erg&ouml;tzt."
              schwierigkeitsgrad="Hoch"
              raritaet="0-1 pro Interclub Spieltag"
              indikator="Resultate Einzel und Doppel, Klassierung des Gegners, Position, Gutachten des Gremiums"
            />

            <PatchAward
              name="Loser of the day"
              description="Dem Gemschi l&auml;uft an diesem Tag nichts. Es wird von den Gegnern vorgef&uuml;hrt und blamiert sich bis aufs Gl&auml;ck. Die nachtr&auml;glichen Ausreden ziehen sich &uuml;ber den ganzen Spieltag hinaus."
              schwierigkeitsgrad="Niedrig"
              raritaet="0-1 pro Interclub Spieltag"
              indikator="Resultate Einzel und Doppel, Klassierung des Gegners, Position, Gutachten des Gremiums"
            />

            <PatchAward
              name="Special achievement"
              description="Der Haudegen unter dem Gemscheni. Ein Gemschi zeigt ein von ihm nicht erwartetes, positives Engagement f&uuml;rs Team. Dieser Patch wird gerne gesehen und kann mit Stolz auf der Kutte getragen werden."
              schwierigkeitsgrad="Hoch"
              raritaet="0-n rund um die Uhr"
              indikator="Gutachten des Gremiums"
            />

            <PatchAward
              name="Cunt"
              description="Der Flegel unter den Gemscheni. Ein Gemschi verh&auml;lt sich asozial gegen&uuml;ber dem Team, dem gegnerischen Team (wird aufgehoben wenn besagter Gegner ein Spassti ist) oder auf dem Platz. Chnebel zerschlagen? Wird nicht geduldet. Versp&auml;tung ohne plausible Ausrede? Wird nicht geduldet. Dem Gegner das Bein brechen? Wird nicht geduldet. Ein Spassti am Netz abschiessen? Ist erw&uuml;nscht."
              schwierigkeitsgrad="Niedrig"
              raritaet="0-n pro Interclub Spieltag"
              indikator="Gutachten des Gremiums, Beschwerden von Drittpersonen"
            />

            <PatchAward
              name="Victim"
              description="Das Gejammer ist gross. Hier ein Wehwehchen, da ein Bobo, dort ein bisschen Kopfschmerzen. Das Gremium kanns nicht mehr h&ouml;ren. Geh nach Hause zu Mutti du Memme."
              schwierigkeitsgrad="Niedrig"
              raritaet="0-n pro Interclub Spieltag"
              indikator="Verletzungsgrad, medizinisches Gutachten des Gremiums"
            />

            <PatchAward
              name="After party bad behavior"
              description="Kann passieren, muss aber nicht. Ein Gemschi verh&auml;lt sich w&auml;hrend oder nach dem freudigen Teil des Interclub Spieltags so, dass der Tanzb&auml;r ein seichtes &laquo;Dont Overbite&raquo; von sich geben w&uuml;rde. Das Skandalometer weist einen sehr hohen, inakzeptablen Wert auf. Der Patch ist weder gut noch schlecht, er macht das Gemschi auf eine Art und Weise sympathisch. Die Geschichte dahinter darf an die &Ouml;ffentlichkeit."
              schwierigkeitsgrad="Mittel"
              raritaet="0-n pro Interclub Spieltag"
              indikator="Gutachten des Gremiums, Beschwerden von Drittpersonen, schriftliche/m&uuml;ndliche Verbote f&uuml;r Lokalit&auml;ten, Spitalaufenthalte, L&auml;mpen mit den F&uuml;xen"
            />

            <PatchAward
              name="Kutten Nutte"
              description="Das seri&ouml;se Auftreten ist das Markenzeichen schlechthin eines Gemschis. So wird grosser Wert auf korrekte Garderobe gelegt. Fehlen ein oder mehrere Kleidungsst&uuml;cke der oberen Schicht, wird das Gemschi mit dem Kutten Nutte Patch bestraft. Um Rufsch&auml;digung zu minimieren, ist eine zus&auml;tzliche Bestrafung mittels Busse essentiell. Fehlt eines der Kleidungsst&uuml;cke, muss besagtes Gemschi mit einer Busse von CHF 50.00 rechnen (Maximalbusse CHF 100.00). Jedes Gemschi ist selber verantwortlich f&uuml;r die ordentliche Garderobenf&uuml;hrung und Beschaffung der Kluft."
              schwierigkeitsgrad="Variabel (Je nach Verpeiltheit des Gemschis)"
              raritaet="0-n pro Interclub Spieltag"
              indikator="Gutachten des Gremiums"
              extra={
                <div className="bg-chnebel-gray rounded-lg p-3 mb-3 text-sm">
                  <p className="font-semibold mb-1">Betroffen sind folgende Kleidungsst&uuml;cke:</p>
                  <p>Trainerj&auml;ckli, Trainerhosen, Spielshirt, Kutte, Gemschipulli. Je nach Witterungsverh&auml;ltnisse kann der Capitano die Kleiderordnung ansorbieren.</p>
                </div>
              }
            />

            <PatchAward
              name="Shame"
              description="Die H&ouml;chststrafe. Tr&auml;ger dieses Patches werden lebenslang sichtlich der Schande geb&uuml;hrt. Verliert ein Gemschi ein Kleidungsst&uuml;ck der oberen Schicht, sollte dieses unverz&uuml;glich auf Kosten und Organisation des Gemschis ersetzt werden. Ist betroffenes Kleidungsst&uuml;ck am Interclub Spieltag nicht vorhanden, tritt automatisch der Kutten Nutte Patch in Kraft, bis das Kleidungsst&uuml;ck ersetzt wurde oder die Gemscheni einen Outfitwechsel durchf&uuml;hren. Wird die Kutte in die ewigen Jagdgr&uuml;nde geyeetet, Gott bewahre, muss die Kutte ersetzt werden. S&auml;mtliche Patches gehen verloren und die Schande wird mit dem Shame Patch gut sichtbar auf der neuen Kutte angebracht."
              schwierigkeitsgrad="Hoch"
              raritaet="0-n pro Interclub Spieltag"
              indikator="Gutachten des Gremiums"
            />

            <PatchAward
              name="Vegas"
              description="What happens in Vegas, stays in Vegas. Der seltenste Patch im System kann ausschliesslich an Teamdynamikf&ouml;rderungswochenendausfl&uuml;gen verliehen werden. Ein Gemschi &uuml;ber&auml;utert komplett. Die Geschichte dahinter wird die &Ouml;ffentlichkeit nie erfahren. Medienanfragen werden rigoros abgeblockt."
              schwierigkeitsgrad="Sehr Hoch"
              raritaet="0-n pro Chnebelgemschiteamdynamikf&ouml;rderungswochenendausflug"
              indikator="Aussage des Angeklagten, Zeugenaussagen, Ger&uuml;chte, Gutachten des Gremiums"
              weiteres="In dubio pro reo"
            />

            <PatchAward
              name="L&auml;tsch Patch"
              description="Ein Gemschi entscheidet sich, nichts zum Teamspirit beizutragen und erscheint nicht zu den Teamdynamikf&ouml;rderungswochenendausfl&uuml;gen. Ein solcher ist ein L&auml;tsch, es soll Vogelscheisse auf ihn hageln."
              schwierigkeitsgrad="Niedrig"
              raritaet="0-n pro Chnebelgemschiteamdynamikf&ouml;rderungswochenendausflug"
              indikator="Der L&auml;tsch"
            />

          </div>
        </section>

      </div>
    </>
  );
};
