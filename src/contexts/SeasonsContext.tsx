import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Season } from '../types/season';
import { storage } from '../storage/StorageService';

const STORAGE_KEY = 'gemschihub_seasons';

interface SeasonsContextType {
  seasons: Season[];
  activeSeason: Season | null;
  selectedSeasonId: string | null;
  selectedSeason: Season | null;
  selectSeason: (seasonId: string) => void;
  addSeason: (name: string) => Season;
  updateSeason: (id: string, updates: Partial<Omit<Season, 'id'>>) => void;
  setActiveSeason: (id: string) => void;
  removeSeason: (id: string) => void;
}

const SeasonsContext = createContext<SeasonsContextType | undefined>(undefined);

const defaultSeasons: Season[] = [
  {
    id: 'season-2024-2025',
    name: 'Interclub Saison 2024/2025',
    isActive: true,
    createdAt: '2024-09-01T00:00:00.000Z',
  },
];

export const useSeasons = () => {
  const context = useContext(SeasonsContext);
  if (!context) {
    throw new Error('useSeasons must be used within a SeasonsProvider');
  }
  return context;
};

export const SeasonsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [seasons, setSeasons] = useState<Season[]>(() => {
    return storage.get<Season[]>(STORAGE_KEY) || defaultSeasons;
  });

  const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(() => {
    const active = (storage.get<Season[]>(STORAGE_KEY) || defaultSeasons).find(s => s.isActive);
    return active?.id || null;
  });

  useEffect(() => {
    storage.set(STORAGE_KEY, seasons);
  }, [seasons]);

  const activeSeason = seasons.find(s => s.isActive) || null;
  const selectedSeason = seasons.find(s => s.id === selectedSeasonId) || activeSeason;

  const selectSeason = useCallback((seasonId: string) => {
    setSelectedSeasonId(seasonId);
  }, []);

  const addSeason = useCallback((name: string): Season => {
    const newSeason: Season = {
      id: `season-${Date.now()}`,
      name,
      isActive: false,
      createdAt: new Date().toISOString(),
    };
    setSeasons(prev => [...prev, newSeason]);
    return newSeason;
  }, []);

  const updateSeason = useCallback((id: string, updates: Partial<Omit<Season, 'id'>>) => {
    setSeasons(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const setActiveSeason = useCallback((id: string) => {
    setSeasons(prev =>
      prev.map(s => ({
        ...s,
        isActive: s.id === id,
      }))
    );
  }, []);

  const removeSeason = useCallback((id: string) => {
    setSeasons(prev => prev.filter(s => s.id !== id));
  }, []);

  return (
    <SeasonsContext.Provider
      value={{
        seasons,
        activeSeason,
        selectedSeasonId: selectedSeason?.id || null,
        selectedSeason,
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
