import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Player } from '../types/player';
import {
  createPlayer,
  listenPlayers,
  patchPlayer,
  softDeletePlayer,
  uploadPlayerPhoto,
} from '../storage/repositories/playersRepository';

interface PlayersContextType {
  /** All players (including inactive). */
  allPlayers: Player[];
  /** Active players only. */
  players: Player[];
  loading: boolean;
  addPlayer: (player: Omit<Player, 'id' | 'isActive' | 'profilePictureUrl'>) => Promise<Player>;
  updatePlayer: (id: string, updates: Partial<Player>) => Promise<void>;
  uploadPlayerProfilePicture: (id: string, file: File) => Promise<string>;
  /** Soft-delete: sets isActive=false but preserves historical data. */
  removePlayer: (id: string) => Promise<void>;
  getPlayer: (id: string) => Player | undefined;
}

const PlayersContext = createContext<PlayersContextType | undefined>(undefined);

export const usePlayers = () => {
  const context = useContext(PlayersContext);
  if (!context) {
    throw new Error('usePlayers must be used within a PlayersProvider');
  }
  return context;
};

export const PlayersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener
  useEffect(() => {
    const unsubscribe = listenPlayers((data) => {
      setAllPlayers(data);
      setLoading(false);
    }, (error) => {
      console.error('Firestore players listener error:', error);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const players = useMemo(() => allPlayers.filter(p => p.isActive), [allPlayers]);

  const addPlayer = useCallback(async (
    playerData: Omit<Player, 'id' | 'isActive' | 'profilePictureUrl'>
  ): Promise<Player> => {
    return createPlayer(playerData, allPlayers);
  }, [allPlayers]);

  const updatePlayer = useCallback(async (id: string, updates: Partial<Player>) => {
    await patchPlayer(id, updates, allPlayers);
  }, [allPlayers]);

  const removePlayer = useCallback(async (id: string) => {
    await softDeletePlayer(id);
  }, []);

  const uploadPlayerProfilePicture = useCallback(async (id: string, file: File): Promise<string> => {
    return uploadPlayerPhoto(id, file);
  }, []);

  const getPlayer = useCallback(
    (id: string) => allPlayers.find(p => p.id === id),
    [allPlayers]
  );

  return (
    <PlayersContext.Provider value={{
      allPlayers,
      players,
      loading,
      addPlayer,
      updatePlayer,
      uploadPlayerProfilePicture,
      removePlayer,
      getPlayer,
    }}>
      {children}
    </PlayersContext.Provider>
  );
};
