import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { SpiritValue } from '../types/spirit';
import { useSeasons } from './SeasonsContext';

const COLLECTION = 'spirit';

interface SpiritContextType {
  /** All spirit values across all seasons. */
  allSpirit: SpiritValue[];
  /** Spirit values for the selected season only. */
  spirit: SpiritValue[];
  loading: boolean;
  /** Get spirit value for a specific player in the selected season. */
  getPlayerSpirit: (playerId: string) => number;
  /** Set spirit for a player in a given season. */
  setPlayerSpirit: (playerId: string, seasonId: string, value: number) => Promise<void>;
}

const SpiritContext = createContext<SpiritContextType | undefined>(undefined);

export const useSpirit = () => {
  const context = useContext(SpiritContext);
  if (!context) {
    throw new Error('useSpirit must be used within a SpiritProvider');
  }
  return context;
};

export const SpiritProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { selectedSeasonId } = useSeasons();
  const [allSpirit, setAllSpirit] = useState<SpiritValue[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener
  useEffect(() => {
    const colRef = collection(db, COLLECTION);
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as SpiritValue));
      setAllSpirit(data);
      setLoading(false);
    }, (error) => {
      console.error('Firestore spirit listener error:', error);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const spirit = useMemo(
    () => (selectedSeasonId ? allSpirit.filter(s => s.seasonId === selectedSeasonId) : []),
    [allSpirit, selectedSeasonId]
  );

  const getPlayerSpirit = useCallback(
    (playerId: string): number => {
      const found = spirit.find(s => s.playerId === playerId);
      return found?.value ?? 0;
    },
    [spirit]
  );

  const setPlayerSpirit = useCallback(
    async (playerId: string, seasonId: string, value: number) => {
      const clampedValue = Math.max(0, Math.min(100, value));
      // Use deterministic doc ID so upserts work naturally
      const docId = `${playerId}_${seasonId}`;
      await setDoc(doc(db, COLLECTION, docId), {
        playerId,
        seasonId,
        value: clampedValue,
      });
    },
    []
  );

  return (
    <SpiritContext.Provider value={{ allSpirit, spirit, loading, getPlayerSpirit, setPlayerSpirit }}>
      {children}
    </SpiritContext.Provider>
  );
};
