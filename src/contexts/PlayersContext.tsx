import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Player, PlayerRole } from '../types/player';
import { storage } from '../storage/StorageService';

const STORAGE_KEY = 'gemschihub_players';

interface PlayersContextType {
  /** All players (including inactive). */
  allPlayers: Player[];
  /** Active players only. */
  players: Player[];
  addPlayer: (player: Omit<Player, 'id' | 'isActive' | 'profilePictureUrl'>) => Player;
  updatePlayer: (id: string, updates: Partial<Player>) => void;
  /** Soft-delete: sets isActive=false but preserves historical data. */
  removePlayer: (id: string) => void;
  getPlayer: (id: string) => Player | undefined;
}

const PlayersContext = createContext<PlayersContextType | undefined>(undefined);

const defaultPlayers: Player[] = [
  {
    id: 'p-1', name: 'Max Müller', role: 'CEO of Patchio', gemschigrad: 'Ehrengemschi',
    klassierung: 'R5', profilePictureUrl: null, introduction: 'Gründungsmitglied und Patch-Enthusiast.',
    email: 'max@example.com', joinDate: '2020-01-15', isActive: true,
  },
  {
    id: 'p-2', name: 'Anna Schmidt', alias: 'Schmidtli', role: 'Captain', gemschigrad: 'Kuttengemschi',
    klassierung: 'R6', profilePictureUrl: null, introduction: 'Unsere furchtlose Captain.',
    email: 'anna@example.com', joinDate: '2021-03-20', isActive: true,
  },
  {
    id: 'p-3', name: 'Thomas Weber', role: 'Spieler', gemschigrad: 'Bandanagemschi',
    klassierung: 'R7', profilePictureUrl: null, joinDate: '2019-06-10', isActive: true,
  },
  {
    id: 'p-4', name: 'Sarah Fischer', role: 'Spieler', gemschigrad: 'Gitzi',
    klassierung: 'R8', profilePictureUrl: null, joinDate: '2022-02-14', isActive: true,
  },
  {
    id: 'p-5', name: 'Michael Schneider', role: 'Spieler', gemschigrad: 'Ehrengemschi',
    klassierung: 'R5', profilePictureUrl: null, joinDate: '2018-09-05', isActive: true,
  },
  {
    id: 'p-6', name: 'Lisa Wagner', role: 'Spieler', gemschigrad: 'Kuttengemschi',
    klassierung: 'R6', profilePictureUrl: null, joinDate: '2021-11-18', isActive: true,
  },
  {
    id: 'p-7', name: 'David Becker', role: 'Spieler', gemschigrad: 'Bandanagemschi',
    klassierung: 'R7', profilePictureUrl: null, joinDate: '2020-07-22', isActive: true,
  },
  {
    id: 'p-8', name: 'Julia Hoffmann', role: 'Spieler', gemschigrad: 'Gitzi',
    klassierung: 'R9', profilePictureUrl: null, joinDate: '2023-01-08', isActive: true,
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
  const [allPlayers, setAllPlayers] = useState<Player[]>(() => {
    return storage.get<Player[]>(STORAGE_KEY) || defaultPlayers;
  });

  useEffect(() => {
    storage.set(STORAGE_KEY, allPlayers);
  }, [allPlayers]);

  const players = useMemo(() => allPlayers.filter(p => p.isActive), [allPlayers]);

  const addPlayer = useCallback((playerData: Omit<Player, 'id' | 'isActive' | 'profilePictureUrl'>): Player => {
    const newPlayer: Player = {
      ...playerData,
      id: `p-${Date.now()}`,
      isActive: true,
      profilePictureUrl: null,
    };

    setAllPlayers(prev => {
      let updated = prev;
      // Enforce single Captain
      if (newPlayer.role === 'Captain' || newPlayer.role === 'CEO of Patchio') {
        updated = prev.map(p =>
          p.role === newPlayer.role ? { ...p, role: 'Spieler' as PlayerRole } : p
        );
      }
      return [...updated, newPlayer];
    });
    return newPlayer;
  }, []);

  const updatePlayer = useCallback((id: string, updates: Partial<Player>) => {
    setAllPlayers(prev => {
      let result = prev;
      // Enforce single Captain/CEO
      if (updates.role && (updates.role === 'Captain' || updates.role === 'CEO of Patchio')) {
        result = prev.map(p => {
          if (p.id === id) return { ...p, ...updates };
          if (p.role === updates.role) return { ...p, role: 'Spieler' as PlayerRole };
          return p;
        });
      } else {
        result = prev.map(p => (p.id === id ? { ...p, ...updates } : p));
      }
      return result;
    });
  }, []);

  const removePlayer = useCallback((id: string) => {
    // Soft-delete: preserve for historical data
    setAllPlayers(prev => prev.map(p => (p.id === id ? { ...p, isActive: false } : p)));
  }, []);

  const getPlayer = useCallback(
    (id: string) => allPlayers.find(p => p.id === id),
    [allPlayers]
  );

  return (
    <PlayersContext.Provider value={{ allPlayers, players, addPlayer, updatePlayer, removePlayer, getPlayer }}>
      {children}
    </PlayersContext.Provider>
  );
};
