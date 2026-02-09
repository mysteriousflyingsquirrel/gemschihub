import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import {
  AppEvent,
  createEmptySinglesGames,
  createEmptyDoublesGames,
  calculateTotalScore,
  deriveMatchStatus,
} from '../types/event';
import { useSeasons } from './SeasonsContext';

const COLLECTION = 'events';

interface EventsContextType {
  /** All events across all seasons. */
  allEvents: AppEvent[];
  /** Events for the currently selected season only. */
  events: AppEvent[];
  loading: boolean;
  addEvent: (event: Omit<AppEvent, 'id'>) => Promise<AppEvent>;
  updateEvent: (id: string, updates: Partial<AppEvent>) => Promise<void>;
  removeEvent: (id: string) => Promise<void>;
  getEvent: (id: string) => AppEvent | undefined;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { selectedSeasonId } = useSeasons();
  const [allEvents, setAllEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener
  useEffect(() => {
    const colRef = collection(db, COLLECTION);
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as AppEvent));
      setAllEvents(data);
      setLoading(false);
    }, (error) => {
      console.error('Firestore events listener error:', error);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Filter to selected season
  const events = useMemo(
    () => (selectedSeasonId ? allEvents.filter(e => e.seasonId === selectedSeasonId) : []),
    [allEvents, selectedSeasonId]
  );

  const addEvent = useCallback(async (eventData: Omit<AppEvent, 'id'>): Promise<AppEvent> => {
    const data = { ...eventData };
    // Initialize interclub data if type is Interclub and not provided
    if (data.type === 'Interclub' && !data.interclub) {
      data.interclub = {
        opponent: '',
        matchStatus: 'Offen',
        singlesGames: createEmptySinglesGames(),
        doublesGames: createEmptyDoublesGames(),
        totalScore: { ourScore: 0, opponentScore: 0 },
      };
    }
    const docRef = await addDoc(collection(db, COLLECTION), data);
    return { id: docRef.id, ...data } as AppEvent;
  }, []);

  const updateEvent = useCallback(async (id: string, updates: Partial<AppEvent>) => {
    // Recalculate interclub totals if games were updated
    const current = allEvents.find(e => e.id === id);
    if (current && updates.interclub) {
      const merged = { ...current.interclub!, ...updates.interclub };
      if (updates.interclub.singlesGames || updates.interclub.doublesGames) {
        const singles = merged.singlesGames;
        const doubles = merged.doublesGames;
        merged.totalScore = calculateTotalScore(singles, doubles);
        merged.matchStatus = deriveMatchStatus(singles, doubles);
      }
      updates = { ...updates, interclub: merged };
    }
    // Remove 'id' from updates to avoid writing it as a field
    const { id: _id, ...cleanUpdates } = updates as AppEvent;
    await updateDoc(doc(db, COLLECTION, id), cleanUpdates);
  }, [allEvents]);

  const removeEvent = useCallback(async (id: string) => {
    await deleteDoc(doc(db, COLLECTION, id));
  }, []);

  const getEvent = useCallback(
    (id: string) => allEvents.find(e => e.id === id),
    [allEvents]
  );

  return (
    <EventsContext.Provider value={{ allEvents, events, loading, addEvent, updateEvent, removeEvent, getEvent }}>
      {children}
    </EventsContext.Provider>
  );
};
