import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  AppEvent,
  createEmptySinglesGames,
  createEmptyDoublesGames,
  calculateTotalScore,
  deriveMatchStatus,
} from '../types/event';
import {
  createEvent,
  getEventAttendancePlayerIds,
  listenEvents,
  patchEvent,
  removeEventCascade,
} from '../storage/repositories/eventsRepository';
import { useSeasons } from './SeasonsContext';

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
    const unsubscribe = listenEvents((incoming) => {
      const migrated = incoming.map((event) => {
        const raw = { ...event } as any;
        // Migrate legacy interclub.instagramLink to top-level
        if (raw.interclub?.instagramLink && !raw.instagramLink) {
          raw.instagramLink = raw.interclub.instagramLink;
          delete raw.interclub.instagramLink;
        }
        // Migrate legacy startDateTime (ISO string) to new date/time fields
        if (raw.startDateTime && !raw.startDate) {
          const dt = new Date(raw.startDateTime);
          const y = dt.getFullYear();
          const mo = String(dt.getMonth() + 1).padStart(2, '0');
          const da = String(dt.getDate()).padStart(2, '0');
          raw.startDate = `${y}-${mo}-${da}`;
          const hh = String(dt.getHours()).padStart(2, '0');
          const mm = String(dt.getMinutes()).padStart(2, '0');
          raw.startTime = `${hh}:${mm}`;
          raw.allDay = false;
          delete raw.startDateTime;
        }
        // Ensure allDay has a default
        if (raw.allDay === undefined) {
          raw.allDay = !raw.startTime;
        }
        return raw as AppEvent;
      });
      setAllEvents(migrated);
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
    return createEvent(data as Omit<AppEvent, 'id'>);
  }, []);

  const updateEvent = useCallback(async (id: string, updates: Partial<AppEvent>) => {
    // Recalculate interclub totals if games were updated
    const current = allEvents.find(e => e.id === id);
    if (current && updates.interclub) {
      const merged = { ...current.interclub!, ...updates.interclub };

      // Enforce participation integrity at write path:
      // only players marked as attending this event may be assigned to games.
      const assignedPlayers = new Set<string>();
      (merged.singlesGames || []).forEach((g) => {
        if (g.playerId) assignedPlayers.add(g.playerId);
      });
      (merged.doublesGames || []).forEach((g) => {
        if (g.player1Id) assignedPlayers.add(g.player1Id);
        if (g.player2Id) assignedPlayers.add(g.player2Id);
      });
      if (assignedPlayers.size > 0) {
        const attendees = await getEventAttendancePlayerIds(id);
        const invalid = [...assignedPlayers].filter((pid) => !attendees.has(pid));
        if (invalid.length > 0) {
          throw new Error('Nur als anwesend markierte Spieler dürfen Interclub-Spielen zugewiesen werden.');
        }
      }

      if (updates.interclub.singlesGames || updates.interclub.doublesGames) {
        const singles = merged.singlesGames;
        const doubles = merged.doublesGames;
        merged.totalScore = calculateTotalScore(singles, doubles);
        merged.matchStatus = deriveMatchStatus(singles, doubles);
      }
      updates = { ...updates, interclub: merged };
    }
    // Remove 'id' from updates to avoid writing it as a field
    await patchEvent(id, updates);
  }, [allEvents]);

  const removeEvent = useCallback(async (id: string) => {
    await removeEventCascade(id);
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
