import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { AttendanceRecord } from '../types/attendance';
import { storage } from '../storage/StorageService';
import { useSeasons } from './SeasonsContext';

const STORAGE_KEY = 'gemschihub_attendance';

interface AttendanceContextType {
  /** All attendance across all seasons. */
  allAttendance: AttendanceRecord[];
  /** Attendance for the selected season only. */
  attendance: AttendanceRecord[];
  /** Get attendees for a specific event. */
  getEventAttendees: (eventId: string) => AttendanceRecord[];
  /** Get all events a player attended in the selected season. */
  getPlayerAttendance: (playerId: string) => AttendanceRecord[];
  /** Set attendance for an event (replaces previous). */
  setEventAttendance: (eventId: string, seasonId: string, playerIds: string[]) => void;
  /** Remove all attendance for an event (e.g. when deleting event). */
  removeEventAttendance: (eventId: string) => void;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { selectedSeasonId } = useSeasons();

  const [allAttendance, setAllAttendance] = useState<AttendanceRecord[]>(() => {
    return storage.get<AttendanceRecord[]>(STORAGE_KEY) || [];
  });

  useEffect(() => {
    storage.set(STORAGE_KEY, allAttendance);
  }, [allAttendance]);

  const attendance = useMemo(
    () => (selectedSeasonId ? allAttendance.filter(a => a.seasonId === selectedSeasonId) : []),
    [allAttendance, selectedSeasonId]
  );

  const getEventAttendees = useCallback(
    (eventId: string) => allAttendance.filter(a => a.eventId === eventId),
    [allAttendance]
  );

  const getPlayerAttendance = useCallback(
    (playerId: string) => attendance.filter(a => a.playerId === playerId),
    [attendance]
  );

  const setEventAttendance = useCallback(
    (eventId: string, seasonId: string, playerIds: string[]) => {
      setAllAttendance(prev => {
        // Remove old attendance for this event
        const without = prev.filter(a => a.eventId !== eventId);
        // Add new
        const newRecords: AttendanceRecord[] = playerIds.map(playerId => ({
          id: `att-${eventId}-${playerId}`,
          eventId,
          seasonId,
          playerId,
        }));
        return [...without, ...newRecords];
      });
    },
    []
  );

  const removeEventAttendance = useCallback((eventId: string) => {
    setAllAttendance(prev => prev.filter(a => a.eventId !== eventId));
  }, []);

  return (
    <AttendanceContext.Provider
      value={{
        allAttendance,
        attendance,
        getEventAttendees,
        getPlayerAttendance,
        setEventAttendance,
        removeEventAttendance,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};
