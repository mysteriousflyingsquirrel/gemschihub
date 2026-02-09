import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { SpiritValue } from '../types/spirit';
import { storage } from '../storage/StorageService';
import { useSeasons } from './SeasonsContext';

const STORAGE_KEY = 'gemschihub_spirit';

interface SpiritContextType {
  /** All spirit values across all seasons. */
  allSpirit: SpiritValue[];
  /** Spirit values for the selected season only. */
  spirit: SpiritValue[];
  /** Get spirit value for a specific player in the selected season. */
  getPlayerSpirit: (playerId: string) => number;
  /** Set spirit for a player in a given season. */
  setPlayerSpirit: (playerId: string, seasonId: string, value: number) => void;
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

  const [allSpirit, setAllSpirit] = useState<SpiritValue[]>(() => {
    return storage.get<SpiritValue[]>(STORAGE_KEY) || [];
  });

  useEffect(() => {
    storage.set(STORAGE_KEY, allSpirit);
  }, [allSpirit]);

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
    (playerId: string, seasonId: string, value: number) => {
      setAllSpirit(prev => {
        const existing = prev.find(s => s.playerId === playerId && s.seasonId === seasonId);
        if (existing) {
          return prev.map(s =>
            s.playerId === playerId && s.seasonId === seasonId
              ? { ...s, value: Math.max(0, Math.min(100, value)) }
              : s
          );
        }
        return [
          ...prev,
          {
            id: `spirit-${playerId}-${seasonId}`,
            playerId,
            seasonId,
            value: Math.max(0, Math.min(100, value)),
          },
        ];
      });
    },
    []
  );

  return (
    <SpiritContext.Provider value={{ allSpirit, spirit, getPlayerSpirit, setPlayerSpirit }}>
      {children}
    </SpiritContext.Provider>
  );
};
