import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  activateSeason,
  createSeason,
  deleteSeasonSafely,
  listenSeasons,
  patchSeason,
} from '../storage/repositories/seasonsRepository';
import { Season } from '../types/season';

interface SeasonsContextType {
  seasons: Season[];
  activeSeason: Season | null;
  selectedSeasonId: string | null;
  selectedSeason: Season | null;
  loading: boolean;
  selectSeason: (seasonId: string) => void;
  addSeason: (name: string) => Promise<Season>;
  updateSeason: (id: string, updates: Partial<Omit<Season, 'id'>>) => Promise<void>;
  setActiveSeason: (id: string) => Promise<void>;
  removeSeason: (id: string) => Promise<void>;
}

const SeasonsContext = createContext<SeasonsContextType | undefined>(undefined);

export const useSeasons = () => {
  const context = useContext(SeasonsContext);
  if (!context) {
    throw new Error('useSeasons must be used within a SeasonsProvider');
  }
  return context;
};

export const SeasonsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(null);

  // Real-time listener
  useEffect(() => {
    const unsubscribe = listenSeasons((data) => {
      setSeasons(data);

      // Auto-select active season on first load
      if (loading) {
        const active = data.find(s => s.isActive);
        if (active) setSelectedSeasonId(active.id);
        else if (data.length > 0) setSelectedSeasonId(data[0].id);
        setLoading(false);
      }
    }, (error) => {
      console.error('Firestore seasons listener error:', error);
      setLoading(false);
    });
    return unsubscribe;
  }, [loading]);

  const activeSeason = seasons.find(s => s.isActive) || null;
  const selectedSeason = seasons.find(s => s.id === selectedSeasonId) || activeSeason;

  const selectSeason = useCallback((seasonId: string) => {
    setSelectedSeasonId(seasonId);
  }, []);

  const addSeason = useCallback(async (name: string): Promise<Season> => {
    return createSeason(name);
  }, []);

  const updateSeason = useCallback(async (id: string, updates: Partial<Omit<Season, 'id'>>) => {
    await patchSeason(id, updates);
  }, []);

  const setActiveSeason = useCallback(async (id: string) => {
    await activateSeason(id, seasons);
    // Switch to the newly activated season so downstream contexts reload data
    setSelectedSeasonId(id);
  }, [seasons]);

  const removeSeason = useCallback(async (id: string) => {
    await deleteSeasonSafely(id);
  }, []);

  return (
    <SeasonsContext.Provider
      value={{
        seasons,
        activeSeason,
        selectedSeasonId: selectedSeason?.id || null,
        selectedSeason,
        loading,
        selectSeason,
        addSeason,
        updateSeason,
        setActiveSeason,
        removeSeason,
      }}
    >
      {children}
    </SeasonsContext.Provider>
  );
};
