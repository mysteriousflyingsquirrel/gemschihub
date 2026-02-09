import React from 'react';
import { PageTitle } from '../components/PageTitle';
import { useInfo } from '../contexts/InfoContext';
import { useStatistics } from '../hooks/useStatistics';
import { useSeasons } from '../contexts/SeasonsContext';
import { Gemschigrad } from '../types/player';

const getGemschigradColor = (grad: Gemschigrad) => {
  switch (grad) {
    case 'Ehrengemschi': return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900';
    case 'Kuttengemschi': return 'bg-gradient-to-r from-blue-400 to-blue-600 text-blue-900';
    case 'Bandanagemschi': return 'bg-gradient-to-r from-green-400 to-green-600 text-green-900';
    case 'Gitzi': return 'bg-gradient-to-r from-purple-400 to-purple-600 text-purple-900';
  }
};

export const Info: React.FC = () => {
  const { tenueData } = useInfo();
  const { teamStats } = useStatistics();
  const { selectedSeason } = useSeasons();
  const gemschigrads: Gemschigrad[] = ['Ehrengemschi', 'Kuttengemschi', 'Bandanagemschi', 'Gitzi'];

  return (
    <>
      <PageTitle>Info</PageTitle>
      <div className="space-y-6">
        {/* Welcome */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-chnebel-black mb-4">Willkommen bei Chnebel Gemscheni</h2>
          <p className="text-chnebel-black leading-relaxed">
            Dies ist GemschiHub — die zentrale Plattform für Chnebel Gemscheni. Hier findest du Events,
            Spieler, Statistiken und alles rund ums Team.
          </p>
        </section>

        {/* Team Stats */}
        {selectedSeason && (
          <section className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-chnebel-black mb-4 flex items-center gap-2">
              <span>📊</span> Team-Statistiken ({selectedSeason.name})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-chnebel-gray rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-chnebel-black">{teamStats.matchesPlayed}</div>
                <div className="text-sm text-gray-600">Spiele</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-700">{teamStats.matchesWon}</div>
                <div className="text-sm text-gray-600">Siege</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-red-700">{teamStats.matchesLost}</div>
                <div className="text-sm text-gray-600">Niederlagen</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-700">{teamStats.averageGemschiScore.toFixed(0)}</div>
                <div className="text-sm text-gray-600">Ø Gemschi Score</div>
              </div>
            </div>
          </section>
        )}

        {/* Tenue */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-chnebel-black mb-6 flex items-center gap-2">
            <span className="text-2xl">👕</span> Tenue
          </h2>
          <div className="space-y-6 text-chnebel-black">
            {gemschigrads.map((gemschigrad, index) => (
              <div key={gemschigrad} className={index > 0 ? 'border-t border-gray-200 pt-6' : ''}>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getGemschigradColor(gemschigrad)}`}>
                    {gemschigrad}
                  </span>
                </h3>
                <div className="space-y-2">
                  {tenueData[gemschigrad].map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-chnebel-gray rounded-lg hover:bg-gray-200 transition-colors">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-chnebel-red flex items-center justify-center text-white font-semibold">
                        {item.order}
                      </div>
                      <span className="flex-1">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* iOS PWA hint */}
        <section className="bg-blue-50 rounded-lg p-4 shadow-sm border border-blue-200">
          <p className="text-sm text-blue-800">
            📱 <strong>Tipp:</strong> Für Push-Benachrichtigungen auf iOS, füge GemschiHub zum Home-Bildschirm hinzu (Share → Zum Home-Bildschirm). Erfordert iOS 16.4+.
          </p>
        </section>
      </div>
    </>
  );
};
