import React, { useState, useMemo } from 'react';
import { PageTitle } from '../components/PageTitle';
import { usePlayers } from '../contexts/PlayersContext';
import { useStatistics } from '../hooks/useStatistics';
import { Player, PlayerRole } from '../types/player';

const getRoleEmoji = (role: PlayerRole): string => {
  switch (role) {
    case 'Captain': return '👑';
    case 'CEO of Patchio': return '🌮';
    default: return '';
  }
};

const getGemschigradColor = (grad: Player['gemschigrad']) => {
  switch (grad) {
    case 'Ehrengemschi': return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900';
    case 'Kuttengemschi': return 'bg-gradient-to-r from-blue-400 to-blue-600 text-blue-900';
    case 'Bandanagemschi': return 'bg-gradient-to-r from-green-400 to-green-600 text-green-900';
    case 'Gitzi': return 'bg-gradient-to-r from-purple-400 to-purple-600 text-purple-900';
    default: return 'bg-gray-200 text-gray-800';
  }
};

const getScoreColor = (score: number): string => {
  const clamped = Math.max(0, Math.min(100, score));
  const red = Math.round(255 * (1 - clamped / 100));
  const green = Math.round(255 * (clamped / 100));
  return `rgb(${red}, ${green}, 0)`;
};

export const Spieler: React.FC = () => {
  const { players } = usePlayers();
  const { getPlayerStats } = useStatistics();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const sortedPlayers = useMemo(() => {
    const gemOrder: Record<Player['gemschigrad'], number> = {
      Ehrengemschi: 0, Kuttengemschi: 1, Bandanagemschi: 2, Gitzi: 3,
    };
    const klassOrder: Record<Player['klassierung'], number> = {
      N1: 0, N2: 1, N3: 2, N4: 3, R1: 4, R2: 5, R3: 6, R4: 7, R5: 8, R6: 9, R7: 10, R8: 11, R9: 12,
    };
    return [...players].sort((a, b) => {
      const gd = gemOrder[a.gemschigrad] - gemOrder[b.gemschigrad];
      if (gd !== 0) return gd;
      const kd = klassOrder[a.klassierung] - klassOrder[b.klassierung];
      if (kd !== 0) return kd;
      return a.name.localeCompare(b.name);
    });
  }, [players]);

  const selectedStats = selectedPlayer ? getPlayerStats(selectedPlayer.id) : null;

  return (
    <>
      <PageTitle>Spieler</PageTitle>

      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="w-full border-collapse bg-white rounded-lg shadow-sm overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-chnebel-red to-[#c4161e] text-white">
              <th className="px-6 py-4 text-left font-semibold">Name</th>
              <th className="px-6 py-4 text-left font-semibold">Gemschigrad</th>
              <th className="px-6 py-4 text-left font-semibold">Klassierung</th>
              <th className="px-6 py-4 text-left font-semibold">Gemschi Score</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, index) => {
              const stats = getPlayerStats(player.id);
              const score = stats?.gemschiScore ?? 0;
              return (
                <tr
                  key={player.id}
                  onClick={() => setSelectedPlayer(player)}
                  className={`border-b border-gray-200 cursor-pointer transition-all duration-200 hover:bg-chnebel-gray hover:shadow-md active:scale-[0.98] ${index === sortedPlayers.length - 1 ? '' : 'border-b'}`}
                >
                  <td className="px-6 py-4 text-chnebel-black font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-chnebel-gray flex items-center justify-center text-chnebel-black font-semibold text-sm overflow-hidden flex-shrink-0">
                        {player.profilePictureUrl ? (
                          <img src={player.profilePictureUrl} alt={player.name} className="w-full h-full object-cover" />
                        ) : (
                          player.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="flex items-center gap-2">
                          {player.name}
                          {getRoleEmoji(player.role) && <span className="text-yellow-500">{getRoleEmoji(player.role)}</span>}
                          {player.role !== 'Spieler' && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-100 text-yellow-800">{player.role}</span>
                          )}
                        </span>
                        {player.alias && <span className="text-sm text-gray-500 italic">"{player.alias}"</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getGemschigradColor(player.gemschigrad)}`}>
                      {player.gemschigrad}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-chnebel-black font-semibold">{player.klassierung}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${score}%`, backgroundColor: getScoreColor(score) }}
                        />
                      </div>
                      <span className="text-sm font-bold w-12 text-right" style={{ color: getScoreColor(score) }}>
                        {score.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {sortedPlayers.map((player) => {
          const stats = getPlayerStats(player.id);
          const score = stats?.gemschiScore ?? 0;
          return (
            <div
              key={player.id}
              onClick={() => setSelectedPlayer(player)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-chnebel-gray flex items-center justify-center text-chnebel-black font-semibold text-sm overflow-hidden flex-shrink-0">
                  {player.profilePictureUrl ? (
                    <img src={player.profilePictureUrl} alt={player.name} className="w-full h-full object-cover" />
                  ) : (
                    player.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 font-medium text-chnebel-black flex-wrap">
                    {player.name}
                    {getRoleEmoji(player.role) && <span className="text-yellow-500">{getRoleEmoji(player.role)}</span>}
                    {player.role !== 'Spieler' && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-100 text-yellow-800">{player.role}</span>
                    )}
                  </div>
                  {player.alias && <div className="text-sm text-gray-500 italic truncate">"{player.alias}"</div>}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getGemschigradColor(player.gemschigrad)}`}>
                  {player.gemschigrad}
                </span>
                <span className="text-sm font-semibold text-chnebel-black">{player.klassierung}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Gemschi Score</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${score}%`, backgroundColor: getScoreColor(score) }}
                  />
                </div>
                <span className="text-sm font-bold w-10 text-right" style={{ color: getScoreColor(score) }}>
                  {score.toFixed(0)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Player Detail Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={() => setSelectedPlayer(null)}>
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-chnebel-red to-[#c4161e] text-white p-6 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold overflow-hidden flex-shrink-0">
                    {selectedPlayer.profilePictureUrl ? (
                      <img src={selectedPlayer.profilePictureUrl} alt={selectedPlayer.name} className="w-full h-full object-cover" />
                    ) : (
                      selectedPlayer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      {selectedPlayer.name}
                      {getRoleEmoji(selectedPlayer.role) && <span className="text-yellow-300">{getRoleEmoji(selectedPlayer.role)}</span>}
                    </h2>
                    {selectedPlayer.alias && <p className="text-white/80 italic">"{selectedPlayer.alias}"</p>}
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {selectedPlayer.role !== 'Spieler' && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-400 text-yellow-900">{selectedPlayer.role}</span>
                      )}
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white/20">{selectedPlayer.gemschigrad}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white/20">{selectedPlayer.klassierung}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedPlayer(null)} className="text-white hover:bg-white/20 rounded-full p-2 transition-colors" aria-label="Schliessen">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Seasonal Stats */}
              {selectedStats && (
                <section>
                  <div className="bg-chnebel-red px-4 py-2 rounded-lg mb-4">
                    <h3 className="text-sm font-bold text-white tracking-wide">Saison-Statistiken</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {[
                      { label: 'Interclub-Anwesenheit', value: selectedStats.interclubAttendanceRate, weight: '20%' },
                      { label: 'Gewinnrate Einzel', value: selectedStats.singlesWinRate, weight: '10%' },
                      { label: 'Gewinnrate Doppel', value: selectedStats.doublesWinRate, weight: '10%' },
                      { label: 'Training-Anwesenheit', value: selectedStats.trainingAttendanceRate, weight: '10%' },
                      { label: 'Spirit-Event-Anwesenheit', value: selectedStats.spiritEventAttendanceRate, weight: '10%' },
                      { label: 'Spirit', value: selectedStats.spiritValue, weight: '40%' },
                    ].map(stat => (
                      <div key={stat.label} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-chnebel-black">{stat.label}</span>
                          <span className="text-sm font-semibold" style={{ color: getScoreColor(stat.value) }}>
                            {stat.value.toFixed(1)}%
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mb-2">({stat.weight})</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${stat.value}%`, backgroundColor: getScoreColor(stat.value) }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Gemschi Score */}
                  <div className="bg-gradient-to-br from-chnebel-gray to-gray-100 rounded-lg p-6 border-2 border-chnebel-red/20">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-chnebel-black">Gemschi Score</span>
                      <span className="text-2xl font-bold" style={{ color: getScoreColor(selectedStats.gemschiScore) }}>
                        {selectedStats.gemschiScore.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
                      <div
                        className="h-full rounded-full transition-all duration-500 shadow-lg"
                        style={{ width: `${selectedStats.gemschiScore}%`, backgroundColor: getScoreColor(selectedStats.gemschiScore) }}
                      />
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
