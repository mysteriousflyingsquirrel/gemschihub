import React, { useState, useMemo } from 'react';
import { PageTitle } from '../components/PageTitle';
import { usePlayers } from '../contexts/PlayersContext';
import { Player, PlayerRole } from '../types/player';

const getRoleEmoji = (role: PlayerRole): string => {
  switch (role) {
    case 'Captain':
      return '👑';
    case 'CEO of Patchio':
      return '🌮';
    default:
      return '';
  }
};

export const Spieler: React.FC = () => {
  const { players } = usePlayers();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
  };

  const handleCloseModal = () => {
    setSelectedPlayer(null);
  };

  // Sorting function
  const sortPlayers = (players: Player[]): Player[] => {
    const gemschigradOrder: Record<Player['gemschigrad'], number> = {
      'Ehrengemschi': 0,
      'Kuttengemschi': 1,
      'Bandanagemschi': 2,
      'Gitzi': 3,
    };

    const klassierungOrder: Record<Player['klassierung'], number> = {
      'N1': 0,
      'N2': 1,
      'N3': 2,
      'N4': 3,
      'R1': 4,
      'R2': 5,
      'R3': 6,
      'R4': 7,
      'R5': 8,
      'R6': 9,
      'R7': 10,
      'R8': 11,
      'R9': 12,
    };

    return [...players].sort((a, b) => {
      // First: Sort by Gemschigrad
      const gemschigradDiff = gemschigradOrder[a.gemschigrad] - gemschigradOrder[b.gemschigrad];
      if (gemschigradDiff !== 0) return gemschigradDiff;

      // Second: Sort by Role (Captain first, then CEO of Patchio, then Spieler)
      const roleOrder: Record<PlayerRole, number> = {
        'Captain': 0,
        'CEO of Patchio': 1,
        'Spieler': 2,
      };
      const roleDiff = roleOrder[a.role] - roleOrder[b.role];
      if (roleDiff !== 0) return roleDiff;

      // Third: Sort by Klassierung
      return klassierungOrder[a.klassierung] - klassierungOrder[b.klassierung];
    });
  };

  const sortedPlayers = useMemo(() => sortPlayers(players), [players]);

  // Calculate Gemschi Score
  const calculateGemschiScore = (player: Player): number => {
    return (
      player.interclubanwesenheit * 0.20 +
      player.gewinnrateEinzel * 0.20 +
      player.gewinnrateDoppel * 0.20 +
      player.trainingsanwesenheit * 0.10 +
      player.spirit * 0.40
    );
  };

  // Get color for Gemschi Score (red to green gradient)
  const getGemschiScoreColor = (score: number): string => {
    // Clamp score between 0 and 100
    const clampedScore = Math.max(0, Math.min(100, score));
    
    // Calculate RGB values
    // Red component: 255 at 0%, 0 at 100%
    // Green component: 0 at 0%, 255 at 100%
    const red = Math.round(255 * (1 - clampedScore / 100));
    const green = Math.round(255 * (clampedScore / 100));
    const blue = 0;
    
    return `rgb(${red}, ${green}, ${blue})`;
  };

  const getGemschigradColor = (grad: Player['gemschigrad']) => {
    switch (grad) {
      case 'Ehrengemschi':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900';
      case 'Kuttengemschi':
        return 'bg-gradient-to-r from-blue-400 to-blue-600 text-blue-900';
      case 'Bandanagemschi':
        return 'bg-gradient-to-r from-green-400 to-green-600 text-green-900';
      case 'Gitzi':
        return 'bg-gradient-to-r from-purple-400 to-purple-600 text-purple-900';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <>
      <PageTitle>Spieler</PageTitle>

      <div className="w-full">
        <table className="w-full border-collapse bg-white rounded-lg shadow-sm overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-chnebel-red to-[#c4161e] text-white">
              <th className="px-2 md:px-4 lg:px-6 py-2 md:py-3 lg:py-4 text-left text-xs md:text-sm lg:text-base font-semibold">Name</th>
              <th className="px-2 md:px-4 lg:px-6 py-2 md:py-3 lg:py-4 text-left text-xs md:text-sm lg:text-base font-semibold">Gemschigrad</th>
              <th className="px-2 md:px-4 lg:px-6 py-2 md:py-3 lg:py-4 text-left text-xs md:text-sm lg:text-base font-semibold">Klassierung</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, index) => (
              <tr
                key={player.id}
                onClick={() => handlePlayerClick(player)}
                className={`
                  border-b border-gray-200 cursor-pointer transition-all duration-200
                  hover:bg-chnebel-gray hover:shadow-md
                  active:scale-[0.98]
                  ${index === sortedPlayers.length - 1 ? '' : 'border-b'}
                `}
              >
                <td className="px-2 md:px-4 lg:px-6 py-2 md:py-3 lg:py-4 text-xs md:text-sm lg:text-base text-chnebel-black font-medium">
                  <div className="flex flex-col">
                    <span className="flex items-center gap-1 md:gap-2">
                      <span className="break-words">{player.name}</span>
                      {getRoleEmoji(player.role) && <span className="text-yellow-500 text-xs md:text-sm lg:text-base flex-shrink-0">{getRoleEmoji(player.role)}</span>}
                    </span>
                    {player.alias && (
                      <span className="text-xs text-gray-500 italic break-words">"{player.alias}"</span>
                    )}
                  </div>
                </td>
                <td className="px-2 md:px-4 lg:px-6 py-2 md:py-3 lg:py-4">
                  <span className={`px-1.5 md:px-2 lg:px-3 py-0.5 md:py-1 rounded-full text-xs font-semibold ${getGemschigradColor(player.gemschigrad)}`}>
                    {player.gemschigrad}
                  </span>
                </td>
                <td className="px-2 md:px-4 lg:px-6 py-2 md:py-3 lg:py-4 text-xs md:text-sm lg:text-base text-chnebel-black font-semibold whitespace-nowrap">{player.klassierung}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Player Detail Modal */}
      {selectedPlayer && (
        <div
          className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-2 md:p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[95vh] md:max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-chnebel-red to-[#c4161e] text-white p-4 md:p-6 rounded-t-lg sticky top-0 z-10">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl md:text-2xl font-bold mb-2 flex items-center gap-2 break-words">
                    {selectedPlayer.name}
                    {getRoleEmoji(selectedPlayer.role) && <span className="text-yellow-300 text-lg md:text-xl">{getRoleEmoji(selectedPlayer.role)}</span>}
                  </h2>
                  {selectedPlayer.alias && (
                    <p className="text-base md:text-lg text-white/80 italic mb-2 break-words">"{selectedPlayer.alias}"</p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold bg-white/20 backdrop-blur-sm`}>
                      {selectedPlayer.gemschigrad}
                    </span>
                    <span className="px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold bg-white/20 backdrop-blur-sm">
                      {selectedPlayer.klassierung}
                    </span>
                    {(selectedPlayer.role === 'Captain' || selectedPlayer.role === 'CEO of Patchio') && (
                      <span className="px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold bg-white/20 backdrop-blur-sm">
                        {getRoleEmoji(selectedPlayer.role)} {selectedPlayer.role}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors flex-shrink-0"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 md:p-6">
              {/* Statistics */}
              <section>
                <h3 className="text-lg md:text-xl font-semibold text-chnebel-black mb-3 md:mb-4">Statistiken</h3>

                {/* Gemschi Score Components */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-chnebel-black">Interclubanwesenheit</span>
                      <span 
                        className="text-sm font-semibold"
                        style={{ color: getGemschiScoreColor(selectedPlayer.interclubanwesenheit) }}
                      >
                        {selectedPlayer.interclubanwesenheit.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">(20%)</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${selectedPlayer.interclubanwesenheit}%`,
                          backgroundColor: getGemschiScoreColor(selectedPlayer.interclubanwesenheit)
                        }}
                      />
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-chnebel-black">Gewinnrate Einzel</span>
                      <span 
                        className="text-sm font-semibold"
                        style={{ color: getGemschiScoreColor(selectedPlayer.gewinnrateEinzel) }}
                      >
                        {selectedPlayer.gewinnrateEinzel.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">(20%)</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${selectedPlayer.gewinnrateEinzel}%`,
                          backgroundColor: getGemschiScoreColor(selectedPlayer.gewinnrateEinzel)
                        }}
                      />
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-chnebel-black">Gewinnrate Doppel</span>
                      <span 
                        className="text-sm font-semibold"
                        style={{ color: getGemschiScoreColor(selectedPlayer.gewinnrateDoppel) }}
                      >
                        {selectedPlayer.gewinnrateDoppel.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">(20%)</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${selectedPlayer.gewinnrateDoppel}%`,
                          backgroundColor: getGemschiScoreColor(selectedPlayer.gewinnrateDoppel)
                        }}
                      />
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-chnebel-black">Trainingsanwesenheit</span>
                      <span 
                        className="text-sm font-semibold"
                        style={{ color: getGemschiScoreColor(selectedPlayer.trainingsanwesenheit) }}
                      >
                        {selectedPlayer.trainingsanwesenheit.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">(10%)</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${selectedPlayer.trainingsanwesenheit}%`,
                          backgroundColor: getGemschiScoreColor(selectedPlayer.trainingsanwesenheit)
                        }}
                      />
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 md:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-chnebel-black">Spirit</span>
                      <span 
                        className="text-sm font-semibold"
                        style={{ color: getGemschiScoreColor(selectedPlayer.spirit) }}
                      >
                        {selectedPlayer.spirit.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">(40%)</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${selectedPlayer.spirit}%`,
                          backgroundColor: getGemschiScoreColor(selectedPlayer.spirit)
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Gemschi Score Bar - Main Stat */}
                <div className="mt-4 md:mt-6 bg-gradient-to-br from-chnebel-gray to-gray-100 rounded-lg p-4 md:p-6 border-2 border-chnebel-red/20">
                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <span className="text-xl md:text-2xl font-bold text-chnebel-black">Gemschi Score</span>
                    <span 
                      className="text-xl md:text-2xl font-bold"
                      style={{ color: getGemschiScoreColor(calculateGemschiScore(selectedPlayer)) }}
                    >
                      {calculateGemschiScore(selectedPlayer).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-5 md:h-6 overflow-hidden shadow-inner">
                    <div
                      className="h-full rounded-full transition-all duration-500 shadow-lg"
                      style={{ 
                        width: `${calculateGemschiScore(selectedPlayer)}%`,
                        backgroundColor: getGemschiScoreColor(calculateGemschiScore(selectedPlayer))
                      }}
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


