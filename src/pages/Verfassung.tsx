import React from 'react';
import { PageTitle } from '../components/PageTitle';

export const Verfassung: React.FC = () => {
  return (
    <>
      <PageTitle>Verfassung</PageTitle>

      <div className="space-y-8 text-chnebel-black leading-relaxed">

        {/* Geschichte */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Geschichte</h2>
          <p className="mb-4">
            Die Chnebel Gemschi Verfassung (lateinisch <em>ilcamoxi iactus</em> [&#x02C8;Die G&auml;msen des Knebels]) ist eine langlebige Verfassung mit dem Ziel, durch Aufkl&auml;rung und sittliche Verbesserung die Herrschaft des Gemschi Sprits in die Chnebel Gemscheni zu vertiefen. Die Verfassung wurde am 12. November 2022 n. Chr. vom Kernteam der Chnebel Gemscheni in Rotterdam erbiert.
          </p>
          <p className="mb-4">
            Hintergrund war der intellektuell nicht mehr vorhandene Gemschi Spirit an den Teamdynamikf&ouml;rderungswochenendausfl&uuml;gen, das fast vollst&auml;ndig nur vom Kernteam visitiert wurde. Das Kernteam wollte mit dieser Verfassung seinen Gemscheni Schutz vor deren Weiberns Intrigen bieten, die es allerorten vermutete, vor allem aber ihnen Zugang zu zeitgen&ouml;ssischer Bierkultur gew&auml;hren. Es garnierte ihre Gr&uuml;ndung mit antiken Mythen, namentlich aus dem Zusammenhang der Mysterien der G&ouml;tter des M&auml;ttenbergs. Laut des hiesigen Historikers Tony Wyss &auml;hnelte die Gr&uuml;ndung zu diesem Zeitpunkt der Herrschaft des Olymp (griechisch &#x1F4C;&#x03BB;&#x03C5;&#x03BC;&#x03C0;&#x03BF;&#x03C2; [&#x02C8;&#x0254;limb&#x0254;s]).
          </p>
          <p>
            Zahlreiche Mythen und Verschw&ouml;rungstheorien ranken sich um das angebliche Fortbestehen der Chnebel Gemscheni und ihre angeblichen geheimen T&auml;tigkeiten, darunter die Tennis Revolution, der Kampf gegen die B&auml;llelibueben und das Streben nach Weltherrschaft.
          </p>
        </section>

        {/* Der GemschiCodex */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-6">Der GemschiCodex</h2>

          {/* Generelles */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-chnebel-red">Generelles</h3>
            <div className="bg-chnebel-gray rounded-lg p-4">
              <p><strong>Art. 1)</strong> Der Gemschi Spirit muss in Ehre und W&uuml;rde gelebt werden.</p>
            </div>
          </div>

          {/* Bierversammlung */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-chnebel-red">Bierversammlung</h3>
            <div className="space-y-3">
              <div className="bg-chnebel-gray rounded-lg p-4">
                <p><strong>Art. 2)</strong> Die j&auml;hrliche Bierversammlung findet immer am Teamdynamikf&ouml;rderungswochenendausflug statt. Diese kann ausschliesslich in einer Bar oder Pub mit Hopfen Ausschanklizenz am Zielort des Teamdynamikf&ouml;rderungswochenendausflug ausgef&uuml;hrt werden.</p>
              </div>
              <div className="bg-chnebel-gray rounded-lg p-4">
                <p><strong>Art. 2a)</strong> Die anwesenden Gemscheni haben das Recht, den GemschiCodex anzupassen oder zu erg&auml;nzen.</p>
              </div>
              <div className="bg-chnebel-gray rounded-lg p-4">
                <p><strong>Art. 2b)</strong> Die Anwesenheit am Teamdynamikf&ouml;rderungswochenendausflug wie auch der Bierversammlung ist Ehrensache. Absente Gemscheni haben die Entscheidungen stillschweigend zu akzeptieren.</p>
              </div>
            </div>
          </div>

          {/* Captain */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-chnebel-red">Captain</h3>
            <div className="space-y-3">
              <div className="bg-chnebel-gray rounded-lg p-4">
                <p><strong>Art. 3)</strong> Der Captain wird j&auml;hrlich am Teamdynamikf&ouml;rderungswochenendausflug an der Bierversammlung durch die anwesenden Gemscheni gew&auml;hlt.</p>
              </div>
              <div className="bg-chnebel-gray rounded-lg p-4">
                <p><strong>Art. 3a)</strong> Das gew&auml;hlte Gemschi hat seinen Verpflichtungen als Captain f&uuml;r die kommende Saison ehrenvoll nachzugehen.</p>
              </div>
              <div className="bg-chnebel-gray rounded-lg p-4">
                <p><strong>Art. 3b)</strong> Der Captain elektiert eigenst&auml;ndig seinen Stellvertreter.</p>
              </div>
              <div className="bg-chnebel-gray rounded-lg p-4">
                <p><strong>Art. 3c)</strong> Die Amtszeit eines Captains beschr&auml;nkt sich auf maximal drei aufeinanderfolgende Jahre.</p>
              </div>
              <div className="bg-chnebel-gray rounded-lg p-4">
                <p><strong>Art. 3d)</strong> Bei Stimmengleichheit entscheidet der amtierende Captain per Stichentscheid oder bei Abwesenheit dessen Stellvertreter.</p>
              </div>
              <div className="bg-chnebel-gray rounded-lg p-4">
                <p><strong>Art. 3e)</strong> Ist der amtierende Captain unbrauchbar, kann hinter seinem R&uuml;cken durch mindestens drei Gemscheni eine ausserordentliche Bierversammlung einberufen werden und eine Neuwahl des Captains durchf&uuml;hren.</p>
              </div>
            </div>
          </div>

          {/* Mitgliederbeitrag */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-chnebel-red">Mitgliederbeitrag</h3>
            <div className="space-y-3">
              <div className="bg-chnebel-gray rounded-lg p-4">
                <p className="mb-3"><strong>Art. 4)</strong> Jedes Gemschi ist verpflichtet, einen j&auml;hrlichen Mitgliederbeitrag zu entrichten. Der Beitrag wird jeweils w&auml;hrend dem offiziellen Teamdynamikf&ouml;rderungswochenendausflug an der Bierversammlung festgelegt.</p>
                <p className="mb-2">Der Mitgliederbeitrag wird f&uuml;r folgende Zwecke eingesetzt:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Anschaffung neue Patches</li>
                  <li>Anschaffung diverse unabdingbare Requisiten</li>
                  <li>Diverses</li>
                </ul>
              </div>
              <div className="bg-chnebel-gray rounded-lg p-4">
                <p><strong>Art. 4a)</strong> Die restlichen Mittel aus den Mitgliederbeitr&auml;gen werden am j&auml;hrlichen Teamdynamikf&ouml;rderungswochenendausflug zur anabolischen Muskelf&ouml;rderung eingesetzt. Gemscheni, welche nicht am Teamdynamikf&ouml;rderungswochenendausflug teilnehmen, haben kein Anrecht auf die restlichen Mittel.</p>
              </div>
              <div className="bg-chnebel-gray rounded-lg p-4">
                <p className="mb-3"><strong>Art. 4b)</strong> Eine R&uuml;ckforderung kann aus folgenden unentschuldbaren Gr&uuml;nden geltend gemacht werden:</p>
                <ul className="list-disc list-inside ml-4 space-y-1 mb-3">
                  <li>Gemschi Nachwuchs in Erwartung</li>
                  <li>Verhinderung durch unabdingbaren beruflichen Terminen</li>
                  <li>Todesf&auml;lle in der Familie</li>
                  <li>schwere Krankheiten (ohne Selbstdiagnose)</li>
                  <li>eigene Hochzeit</li>
                </ul>
                <p className="mb-3">Die R&uuml;ckforderungsantr&auml;ge werden am Teamdynamikf&ouml;rderungswochenendausflug an der Bierversammlung durch die anwesenden Gemscheni genehmigt resp. abgelehnt.</p>
                <p className="italic text-gray-600">Grunds&auml;tzlich werden R&uuml;ckforderungsgesuche nicht gerne gesehen. Die Spende des Mitgliederbeitrages ist Ehrensache.</p>
              </div>
              <div className="bg-chnebel-gray rounded-lg p-4">
                <p><strong>Art. 4c)</strong> Der Mitgliederbeitrag muss sp&auml;testens zum letzten Tag des Jahres f&uuml;r die kommende Saison einbezahlt werden. Wird der Mitgliederbeitrag nicht bezahlt, muss der unehrenhafte Gemsch seine Kutte unverz&uuml;glich abgeben und ist f&uuml;r die kommende Saison weder Spielberechtigt noch wird er als Chnebel Gemschi angesehen. Der eingezogenen Kutte werden s&auml;mtliche Patches entfernt und f&uuml;r ein neues rekrutiertes Chnebel Gemschi freigegeben.</p>
              </div>
            </div>
          </div>

          {/* Mitgliedschaft */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-chnebel-red">Mitgliedschaft</h3>
            <div className="space-y-3">
              <div className="bg-chnebel-gray rounded-lg p-4">
                <p className="mb-3"><strong>Art. 5)</strong> Wenn im Team der Chnebel Gemscheni eine begehrte Stelle frei wird, beginnt die Rekrutierungsphase f&uuml;r neue Mitglieder.</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Neue Anw&auml;rter (&bdquo;Gitzeni&ldquo;) absolvieren zun&auml;chst eine Probesaison. Erf&uuml;llen sie die ben&ouml;tigten Attribute, k&ouml;nnen sie an der Bierversammlung offiziell aufgenommen werden.</li>
                  <li>Gibt es mehrere Anw&auml;rter f&uuml;r nur eine freie Kutte, spielen alle Bewerber eine Saison als Bandana Gemschi.</li>
                  <li>Das Bandana Gemschi mit dem besten Einsatz erh&auml;lt die Kutte.</li>
                  <li>Sind alle Kutten vergeben, wird erst bei der n&auml;chsten Entkuttung wieder ein Platz frei. In diesem Fall startet der gesamte Prozess &uuml;ber die Bandanas erneut.</li>
                  <li>Die &Uuml;bergabe von Kutten und Bandanas erfolgt abschliessend durch den Captain.</li>
                </ul>
              </div>
              <div className="bg-chnebel-gray rounded-lg p-4">
                <p><strong>Art. 5a)</strong> Ist ein Chnebel Gemschi unbrauchbar und zeigt keinen Effort, kann hinter seinem R&uuml;cken durch mindestens drei Kutten Gemscheni eine ausserordentliche Bierversammlung einberufen werden und &uuml;ber dessen Zukunft als Gemschi entschieden werden. Findet das Gremium das angeklagte Gemschi als nicht w&uuml;rdig, wird ihm seine Kutte unmittelbar eingezogen und wird nicht mehr als Chnebel Gemschi angesehen.</p>
              </div>
            </div>
          </div>

          {/* Ten&uuml; */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-chnebel-red">Ten&uuml;</h3>
            <div className="space-y-3">
              <div className="bg-chnebel-gray rounded-lg p-4">
                <p><strong>Art. 6)</strong> Das Ten&uuml; f&uuml;r die kommende Saison wird an der j&auml;hrlichen Bierversammlung definiert.</p>
              </div>
              <div className="bg-chnebel-gray rounded-lg p-4">
                <p><strong>Art. 6a)</strong> Die Beschaffung des Ten&uuml;s ist Ehrensache und jedes Gemschi ist selbst&auml;ndig verantwortlich.</p>
              </div>
              <div className="bg-chnebel-gray rounded-lg p-4">
                <p><strong>Art. 6b)</strong> Bussgelder und Bestrafungen werden gem&auml;ss Chnebel Gemschi Patch System verteilt.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer note */}
        <section className="bg-chnebel-red/10 border-2 border-chnebel-red/20 rounded-lg p-6">
          <p className="text-chnebel-black">
            Mit der Begleichung des Mitgliederbeitrages wird der GemschiCodex und das Patchsystem (siehe sep. Ausgedeihung) automatisch akzeptiert. Der GemschiCodex kann jeweils an der Bierversammlung angepasst werden. Jedes Gemschi muss sich selber updaten und den GemschiCodex in Ehre und W&uuml;rde auskalabruzieren.
          </p>
        </section>

      </div>
    </>
  );
};
