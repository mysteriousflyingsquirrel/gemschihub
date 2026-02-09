import React from 'react';
import { PageTitle } from '../components/PageTitle';
import { SectionTitle } from '../components/SectionTitle';
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

const getGemschigradBorder = (grad: Gemschigrad) => {
  switch (grad) {
    case 'Ehrengemschi': return 'border-yellow-400';
    case 'Kuttengemschi': return 'border-blue-400';
    case 'Bandanagemschi': return 'border-green-400';
    case 'Gitzi': return 'border-purple-400';
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
        <section className="bg-white rounded-lg shadow-sm overflow-hidden">
          <SectionTitle>Willkommen bei Chnebel Gemscheni</SectionTitle>
          <div className="p-6">
            <p className="text-chnebel-black leading-relaxed">
              Dies ist GemschiHub — die zentrale Plattform für Chnebel Gemscheni. Hier findest du Events,
              Spieler, Statistiken und alles rund ums Team.
            </p>
          </div>
        </section>

        {/* Team Stats */}
        {selectedSeason && (
          <section className="bg-white rounded-lg shadow-sm overflow-hidden">
            <SectionTitle>Team-Statistiken ({selectedSeason.name})</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
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
        <section className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-chnebel-red px-5 py-3">
            <h2 className="text-lg font-bold text-white tracking-wide">Tenue</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
            {gemschigrads.map((gemschigrad) => (
              <div key={gemschigrad} className={`rounded-lg border-2 ${getGemschigradBorder(gemschigrad)} overflow-hidden`}>
                <div className={`px-4 py-2 ${getGemschigradColor(gemschigrad)}`}>
                  <span className="text-sm font-bold">{gemschigrad}</span>
                </div>
                <ol className="space-y-1.5 text-sm text-chnebel-black p-3">
                  {tenueData[gemschigrad].map((item) => (
                    <li key={item.id} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-chnebel-red text-white text-xs flex items-center justify-center font-semibold flex-shrink-0 mt-0.5">
                        {item.order}
                      </span>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ol>
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
