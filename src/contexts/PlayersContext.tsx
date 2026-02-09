import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Player, PlayerRole } from '../types/player';

const COLLECTION = 'players';

interface PlayersContextType {
  /** All players (including inactive). */
  allPlayers: Player[];
  /** Active players only. */
  players: Player[];
  loading: boolean;
  addPlayer: (player: Omit<Player, 'id' | 'isActive' | 'profilePictureUrl'>) => Promise<Player>;
  updatePlayer: (id: string, updates: Partial<Player>) => Promise<void>;
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
    const colRef = collection(db, COLLECTION);
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Player));
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
    // Enforce single Captain/CEO: demote existing if needed
    if (playerData.role === 'Captain' || playerData.role === 'CEO of Patchio') {
      const batch = writeBatch(db);
      for (const p of allPlayers) {
        if (p.role === playerData.role) {
          batch.update(doc(db, COLLECTION, p.id), { role: 'Spieler' as PlayerRole });
        }
      }
      await batch.commit();
    }

    const data = {
      ...playerData,
      isActive: true,
      profilePictureUrl: null,
    };
    const docRef = await addDoc(collection(db, COLLECTION), data);
    return { id: docRef.id, ...data } as Player;
  }, [allPlayers]);

  const updatePlayer = useCallback(async (id: string, updates: Partial<Player>) => {
    // Enforce single Captain/CEO
    if (updates.role && (updates.role === 'Captain' || updates.role === 'CEO of Patchio')) {
      const batch = writeBatch(db);
      for (const p of allPlayers) {
        if (p.id !== id && p.role === updates.role) {
          batch.update(doc(db, COLLECTION, p.id), { role: 'Spieler' as PlayerRole });
        }
      }
      batch.update(doc(db, COLLECTION, id), updates);
      await batch.commit();
    } else {
      await updateDoc(doc(db, COLLECTION, id), updates);
    }
  }, [allPlayers]);

  const removePlayer = useCallback(async (id: string) => {
    // Soft-delete: preserve for historical data
    await updateDoc(doc(db, COLLECTION, id), { isActive: false });
  }, []);

  const getPlayer = useCallback(
    (id: string) => allPlayers.find(p => p.id === id),
    [allPlayers]
  );

  return (
    <PlayersContext.Provider value={{ allPlayers, players, loading, addPlayer, updatePlayer, removePlayer, getPlayer }}>
      {children}
    </PlayersContext.Provider>
  );
};
