import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  AppEvent,
  createEmptySinglesGames,
  createEmptyDoublesGames,
  calculateTotalScore,
  deriveMatchStatus,
} from '../types/event';
import { storage } from '../storage/StorageService';
import { useSeasons } from './SeasonsContext';

const STORAGE_KEY = 'gemschihub_events';

interface EventsContextType {
  /** All events across all seasons. */
  allEvents: AppEvent[];
  /** Events for the currently selected season only. */
  events: AppEvent[];
  addEvent: (event: Omit<AppEvent, 'id'>) => AppEvent;
  updateEvent: (id: string, updates: Partial<AppEvent>) => void;
  removeEvent: (id: string) => void;
  getEvent: (id: string) => AppEvent | undefined;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

const defaultEvents: AppEvent[] = [
  {
    id: 'evt-1',
    seasonId: 'season-2024-2025',
    type: 'Interclub',
    title: 'Interclub vs. GC Zürich',
    startDateTime: '2024-01-15T18:00:00.000Z',
    location: 'Zürich',
    interclub: {
      opponent: 'GC Zürich',
      matchStatus: 'Gespielt',
      singlesGames: createEmptySinglesGames(),
      doublesGames: createEmptyDoublesGames(),
      totalScore: { ourScore: 5, opponentScore: 4 },
    },
  },
  {
    id: 'evt-2',
    seasonId: 'season-2024-2025',
    type: 'Interclub',
    title: 'Interclub vs. BC Bern',
    startDateTime: '2024-01-22T18:00:00.000Z',
    location: 'Bern',
    interclub: {
      opponent: 'BC Bern',
      matchStatus: 'Gespielt',
      singlesGames: createEmptySinglesGames(),
      doublesGames: createEmptyDoublesGames(),
      totalScore: { ourScore: 2, opponentScore: 7 },
    },
  },
  {
    id: 'evt-3',
    seasonId: 'season-2024-2025',
    type: 'Training',
    title: 'Training Montag',
    startDateTime: '2024-01-08T18:00:00.000Z',
    location: 'Halle A',
  },
  {
    id: 'evt-4',
    seasonId: 'season-2024-2025',
    type: 'Spirit',
    title: 'Bierversammlung',
    startDateTime: '2024-01-20T19:00:00.000Z',
    location: 'Vereinslokal',
  },
];

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { selectedSeasonId } = useSeasons();

  const [allEvents, setAllEvents] = useState<AppEvent[]>(() => {
    return storage.get<AppEvent[]>(STORAGE_KEY) || defaultEvents;
  });

  useEffect(() => {
    storage.set(STORAGE_KEY, allEvents);
  }, [allEvents]);

  // Filter to selected season
  const events = useMemo(
    () => (selectedSeasonId ? allEvents.filter(e => e.seasonId === selectedSeasonId) : []),
    [allEvents, selectedSeasonId]
  );

  const addEvent = useCallback((eventData: Omit<AppEvent, 'id'>): AppEvent => {
    const newEvent: AppEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
    };
    // Initialize interclub data if type is Interclub and not provided
    if (newEvent.type === 'Interclub' && !newEvent.interclub) {
      newEvent.interclub = {
        opponent: '',
        matchStatus: 'Offen',
        singlesGames: createEmptySinglesGames(),
        doublesGames: createEmptyDoublesGames(),
        totalScore: { ourScore: 0, opponentScore: 0 },
      };
    }
    setAllEvents(prev => [...prev, newEvent]);
    return newEvent;
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<AppEvent>) => {
    setAllEvents(prev =>
      prev.map(event => {
        if (event.id !== id) return event;
        const updated = { ...event, ...updates };
        // Recalculate interclub totals if games were updated
        if (updated.interclub && (updates.interclub?.singlesGames || updates.interclub?.doublesGames)) {
          const singles = updated.interclub.singlesGames;
          const doubles = updated.interclub.doublesGames;
          updated.interclub = {
            ...updated.interclub,
            totalScore: calculateTotalScore(singles, doubles),
            matchStatus: deriveMatchStatus(singles, doubles),
          };
        }
        return updated;
      })
    );
  }, []);

  const removeEvent = useCallback((id: string) => {
    setAllEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  const getEvent = useCallback(
    (id: string) => allEvents.find(e => e.id === id),
    [allEvents]
  );

  return (
    <EventsContext.Provider value={{ allEvents, events, addEvent, updateEvent, removeEvent, getEvent }}>
      {children}
    </EventsContext.Provider>
  );
};
