import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Season } from '../types/season';

const COLLECTION = 'seasons';

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
    const colRef = collection(db, COLLECTION);
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Season));
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
    const newData = {
      name,
      isActive: false,
      createdAt: new Date().toISOString(),
    };
    const docRef = await addDoc(collection(db, COLLECTION), newData);
    return { id: docRef.id, ...newData };
  }, []);

  const updateSeason = useCallback(async (id: string, updates: Partial<Omit<Season, 'id'>>) => {
    await updateDoc(doc(db, COLLECTION, id), updates);
  }, []);

  const setActiveSeason = useCallback(async (id: string) => {
    // Deactivate all others, activate the chosen one
    const batch = writeBatch(db);
    for (const season of seasons) {
      batch.update(doc(db, COLLECTION, season.id), { isActive: season.id === id });
    }
    await batch.commit();
  }, [seasons]);

  const removeSeason = useCallback(async (id: string) => {
    await deleteDoc(doc(db, COLLECTION, id));
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
