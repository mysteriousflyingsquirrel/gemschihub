import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { AttendanceRecord } from '../types/attendance';
import { useSeasons } from './SeasonsContext';
import {
  deleteEventAttendance,
  listenAttendance,
  replaceEventAttendance,
} from '../storage/repositories/attendanceRepository';

interface AttendanceContextType {
  /** All attendance across all seasons. */
  allAttendance: AttendanceRecord[];
  /** Attendance for the selected season only. */
  attendance: AttendanceRecord[];
  loading: boolean;
  /** Get attendees for a specific event. */
  getEventAttendees: (eventId: string) => AttendanceRecord[];
  /** Get all events a player attended in the selected season. */
  getPlayerAttendance: (playerId: string) => AttendanceRecord[];
  /** Set attendance for an event (replaces previous). */
  setEventAttendance: (eventId: string, seasonId: string, playerIds: string[]) => Promise<void>;
  /** Remove all attendance for an event (e.g. when deleting event). */
  removeEventAttendance: (eventId: string) => Promise<void>;
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
  const [allAttendance, setAllAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener
  useEffect(() => {
    const unsubscribe = listenAttendance((data) => {
      setAllAttendance(data);
      setLoading(false);
    }, (error) => {
      console.error('Firestore attendance listener error:', error);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

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
    async (eventId: string, seasonId: string, playerIds: string[]) => {
      await replaceEventAttendance(eventId, seasonId, playerIds);
    },
    []
  );

  const removeEventAttendance = useCallback(async (eventId: string) => {
    await deleteEventAttendance(eventId);
  }, []);

  return (
    <AttendanceContext.Provider
      value={{
        allAttendance,
        attendance,
        loading,
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
