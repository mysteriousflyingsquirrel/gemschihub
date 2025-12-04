import React, { createContext, useContext, useState, useEffect } from 'react';
import { Player, PlayerRole } from '../types/player';

interface PlayersContextType {
  players: Player[];
  addPlayer: (player: Omit<Player, 'id' | 'matchesPlayed' | 'matchesWon' | 'matchesLost' | 'winRate' | 'interclubanwesenheit' | 'gewinnrateEinzel' | 'gewinnrateDoppel' | 'trainingsanwesenheit' | 'spirit'>) => void;
  updatePlayer: (id: string, updates: Partial<Player>) => void;
  removePlayer: (id: string) => void;
}

const PlayersContext = createContext<PlayersContextType | undefined>(undefined);

const defaultPlayers: Player[] = [
  {
    id: '1',
    name: 'Max Müller',
    gemschigrad: 'Ehrengemschi',
    klassierung: 'R5',
    email: 'max.mueller@example.com',
    phone: '+41 79 123 45 67',
    joinDate: '2020-01-15',
    matchesPlayed: 45,
    matchesWon: 32,
    matchesLost: 13,
    winRate: 71.1,
    role: 'CEO of Patchio' as PlayerRole,
    interclubanwesenheit: 95,
    gewinnrateEinzel: 75,
    gewinnrateDoppel: 68,
    trainingsanwesenheit: 88,
    spirit: 92,
  },
  {
    id: '2',
    name: 'Anna Schmidt',
    gemschigrad: 'Kuttengemschi',
    klassierung: 'R6',
    email: 'anna.schmidt@example.com',
    phone: '+41 79 234 56 78',
    joinDate: '2021-03-20',
    matchesPlayed: 38,
    matchesWon: 24,
    matchesLost: 14,
    winRate: 63.2,
    role: 'Captain' as PlayerRole,
    interclubanwesenheit: 82,
    gewinnrateEinzel: 65,
    gewinnrateDoppel: 61,
    trainingsanwesenheit: 75,
    spirit: 85,
  },
  {
    id: '3',
    name: 'Thomas Weber',
    gemschigrad: 'Bandanagemschi',
    klassierung: 'R7',
    email: 'thomas.weber@example.com',
    phone: '+41 79 345 67 89',
    joinDate: '2019-06-10',
    matchesPlayed: 52,
    matchesWon: 28,
    matchesLost: 24,
    winRate: 53.8,
    role: 'Spieler' as PlayerRole,
    interclubanwesenheit: 70,
    gewinnrateEinzel: 55,
    gewinnrateDoppel: 52,
    trainingsanwesenheit: 65,
    spirit: 78,
  },
  {
    id: '4',
    name: 'Sarah Fischer',
    gemschigrad: 'Gitzi',
    klassierung: 'R8',
    email: 'sarah.fischer@example.com',
    phone: '+41 79 456 78 90',
    joinDate: '2022-02-14',
    matchesPlayed: 28,
    matchesWon: 15,
    matchesLost: 13,
    winRate: 53.6,
    role: 'Spieler' as PlayerRole,
    interclubanwesenheit: 60,
    gewinnrateEinzel: 54,
    gewinnrateDoppel: 53,
    trainingsanwesenheit: 58,
    spirit: 70,
  },
  {
    id: '5',
    name: 'Michael Schneider',
    gemschigrad: 'Ehrengemschi',
    klassierung: 'R5',
    email: 'michael.schneider@example.com',
    phone: '+41 79 567 89 01',
    joinDate: '2018-09-05',
    matchesPlayed: 67,
    matchesWon: 48,
    matchesLost: 19,
    winRate: 71.6,
    role: 'Spieler' as PlayerRole,
    interclubanwesenheit: 90,
    gewinnrateEinzel: 72,
    gewinnrateDoppel: 71,
    trainingsanwesenheit: 85,
    spirit: 88,
  },
  {
    id: '6',
    name: 'Lisa Wagner',
    gemschigrad: 'Kuttengemschi',
    klassierung: 'R6',
    email: 'lisa.wagner@example.com',
    phone: '+41 79 678 90 12',
    joinDate: '2021-11-18',
    matchesPlayed: 41,
    matchesWon: 26,
    matchesLost: 15,
    winRate: 63.4,
    role: 'Spieler' as PlayerRole,
    interclubanwesenheit: 78,
    gewinnrateEinzel: 64,
    gewinnrateDoppel: 63,
    trainingsanwesenheit: 72,
    spirit: 82,
  },
  {
    id: '7',
    name: 'David Becker',
    gemschigrad: 'Bandanagemschi',
    klassierung: 'R7',
    email: 'david.becker@example.com',
    phone: '+41 79 789 01 23',
    joinDate: '2020-07-22',
    matchesPlayed: 35,
    matchesWon: 18,
    matchesLost: 17,
    winRate: 51.4,
    role: 'Spieler' as PlayerRole,
    interclubanwesenheit: 65,
    gewinnrateEinzel: 52,
    gewinnrateDoppel: 51,
    trainingsanwesenheit: 62,
    spirit: 75,
  },
  {
    id: '8',
    name: 'Julia Hoffmann',
    gemschigrad: 'Gitzi',
    klassierung: 'R9',
    email: 'julia.hoffmann@example.com',
    phone: '+41 79 890 12 34',
    joinDate: '2023-01-08',
    matchesPlayed: 19,
    matchesWon: 8,
    matchesLost: 11,
    winRate: 42.1,
    role: 'Spieler' as PlayerRole,
    interclubanwesenheit: 55,
    gewinnrateEinzel: 42,
    gewinnrateDoppel: 42,
    trainingsanwesenheit: 50,
    spirit: 65,
  },
  {
    id: '9',
    name: 'Stefan Bauer',
    gemschigrad: 'Ehrengemschi',
    klassierung: 'R5',
    email: 'stefan.bauer@example.com',
    phone: '+41 79 901 23 45',
    joinDate: '2019-04-12',
    matchesPlayed: 59,
    matchesWon: 42,
    matchesLost: 17,
    winRate: 71.2,
    role: 'Spieler' as PlayerRole,
    interclubanwesenheit: 88,
    gewinnrateEinzel: 71,
    gewinnrateDoppel: 71,
    trainingsanwesenheit: 82,
    spirit: 90,
  },
  {
    id: '10',
    name: 'Nina Zimmermann',
    gemschigrad: 'Kuttengemschi',
    klassierung: 'R6',
    email: 'nina.zimmermann@example.com',
    phone: '+41 79 012 34 56',
    joinDate: '2022-05-30',
    matchesPlayed: 31,
    matchesWon: 19,
    matchesLost: 12,
    winRate: 61.3,
    role: 'Spieler' as PlayerRole,
    interclubanwesenheit: 75,
    gewinnrateEinzel: 62,
    gewinnrateDoppel: 61,
    trainingsanwesenheit: 70,
    spirit: 80,
  },
];

export const usePlayers = () => {
  const context = useContext(PlayersContext);
  if (!context) {
    throw new Error('usePlayers must be used within a PlayersProvider');
  }
  return context;
};

export const PlayersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>(() => {
    const stored = localStorage.getItem('players');
    return stored ? JSON.parse(stored) : defaultPlayers;
  });

  useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players));
  }, [players]);

  const addPlayer = (playerData: Omit<Player, 'id' | 'matchesPlayed' | 'matchesWon' | 'matchesLost' | 'winRate' | 'interclubanwesenheit' | 'gewinnrateEinzel' | 'gewinnrateDoppel' | 'trainingsanwesenheit' | 'spirit'>) => {
    setPlayers(prev => {
      // If setting to Captain or CEO of Patchio, remove that role from other players
      if (playerData.role === 'Captain' || playerData.role === 'CEO of Patchio') {
        const updatedPlayers = prev.map(player => {
          if (player.role === playerData.role) {
            return { ...player, role: 'Spieler' as PlayerRole };
          }
          return player;
        });
        const newPlayer: Player = {
          ...playerData,
          id: Date.now().toString(),
          matchesPlayed: 0,
          matchesWon: 0,
          matchesLost: 0,
          winRate: 0,
          interclubanwesenheit: 0,
          gewinnrateEinzel: 0,
          gewinnrateDoppel: 0,
          trainingsanwesenheit: 0,
          spirit: 0,
        };
        return [...updatedPlayers, newPlayer];
      }
      const newPlayer: Player = {
        ...playerData,
        id: Date.now().toString(),
        matchesPlayed: 0,
        matchesWon: 0,
        matchesLost: 0,
        winRate: 0,
        interclubanwesenheit: 0,
        gewinnrateEinzel: 0,
        gewinnrateDoppel: 0,
        trainingsanwesenheit: 0,
        spirit: 0,
      };
      return [...prev, newPlayer];
    });
  };

  const updatePlayer = (id: string, updates: Partial<Player>) => {
    setPlayers(prev => {
      // If updating role, ensure uniqueness
      if (updates.role) {
        const newRole = updates.role;
        // If setting to Captain or CEO of Patchio, remove that role from other players
        if (newRole === 'Captain' || newRole === 'CEO of Patchio') {
          return prev.map(player => {
            if (player.id === id) {
              return { ...player, ...updates };
            }
            // Remove the role from other players if they have it
            if (player.role === newRole) {
              return { ...player, role: 'Spieler' as PlayerRole };
            }
            return player;
          });
        }
      }
      return prev.map(player => (player.id === id ? { ...player, ...updates } : player));
    });
  };

  const removePlayer = (id: string) => {
    setPlayers(prev => prev.filter(player => player.id !== id));
  };

  return (
    <PlayersContext.Provider value={{ players, addPlayer, updatePlayer, removePlayer }}>
      {children}
    </PlayersContext.Provider>
  );
};

