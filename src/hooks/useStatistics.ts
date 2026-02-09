import { useMemo } from 'react';
import { useEvents } from '../contexts/EventsContext';
import { useAttendance } from '../contexts/AttendanceContext';
import { useSpirit } from '../contexts/SpiritContext';
import { usePlayers } from '../contexts/PlayersContext';
import { useSeasons } from '../contexts/SeasonsContext';
import { calculateGameWinner } from '../types/event';

export interface PlayerSeasonStats {
  playerId: string;
  interclubAttendanceRate: number; // 0-100
  trainingAttendanceRate: number; // 0-100
  spiritEventAttendanceRate: number; // 0-100
  singlesPlayed: number;
  singlesWon: number;
  singlesWinRate: number; // 0-100
  doublesPlayed: number;
  doublesWon: number;
  doublesWinRate: number; // 0-100
  spiritValue: number; // 0-100
  gemschiScore: number; // composite 0-100
}

export interface TeamSeasonStats {
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  matchesDraw: number;
  totalOurPoints: number;
  totalOpponentPoints: number;
  averageGemschiScore: number;
}

/**
 * Compute all statistics from seasonal inputs.
 * Statistics are NEVER stored — always derived.
 */
export function useStatistics() {
  const { selectedSeasonId } = useSeasons();
  const { events } = useEvents();
  const { attendance } = useAttendance();
  const { spirit } = useSpirit();
  const { players } = usePlayers();

  const interclubEvents = useMemo(
    () => events.filter(e => e.type === 'Interclub'),
    [events]
  );
  const trainingEvents = useMemo(
    () => events.filter(e => e.type === 'Training'),
    [events]
  );
  const spiritEvents = useMemo(
    () => events.filter(e => e.type === 'Spirit'),
    [events]
  );

  const playerStats = useMemo((): PlayerSeasonStats[] => {
    if (!selectedSeasonId) return [];

    return players.map(player => {
      // Attendance rates
      const playerAttendance = attendance.filter(a => a.playerId === player.id);
      const interclubAttended = playerAttendance.filter(a =>
        interclubEvents.some(e => e.id === a.eventId)
      ).length;
      const trainingAttended = playerAttendance.filter(a =>
        trainingEvents.some(e => e.id === a.eventId)
      ).length;
      const spiritAttended = playerAttendance.filter(a =>
        spiritEvents.some(e => e.id === a.eventId)
      ).length;

      const interclubAttendanceRate = interclubEvents.length > 0
        ? (interclubAttended / interclubEvents.length) * 100
        : 0;
      const trainingAttendanceRate = trainingEvents.length > 0
        ? (trainingAttended / trainingEvents.length) * 100
        : 0;
      const spiritEventAttendanceRate = spiritEvents.length > 0
        ? (spiritAttended / spiritEvents.length) * 100
        : 0;

      // Match results from interclub games
      let singlesPlayed = 0;
      let singlesWon = 0;
      let doublesPlayed = 0;
      let doublesWon = 0;

      for (const event of interclubEvents) {
        if (!event.interclub) continue;

        for (const game of event.interclub.singlesGames) {
          if (game.playerId === player.id && game.set1) {
            singlesPlayed++;
            if (calculateGameWinner(game) === 'our') singlesWon++;
          }
        }

        for (const game of event.interclub.doublesGames) {
          if ((game.player1Id === player.id || game.player2Id === player.id) && game.set1) {
            doublesPlayed++;
            if (calculateGameWinner(game) === 'our') doublesWon++;
          }
        }
      }

      const singlesWinRate = singlesPlayed > 0 ? (singlesWon / singlesPlayed) * 100 : 0;
      const doublesWinRate = doublesPlayed > 0 ? (doublesWon / doublesPlayed) * 100 : 0;

      // Spirit value
      const spiritVal = spirit.find(s => s.playerId === player.id)?.value ?? 0;

      // Gemschi Score: weighted composite
      const gemschiScore =
        interclubAttendanceRate * 0.20 +
        singlesWinRate * 0.10 +
        doublesWinRate * 0.10 +
        trainingAttendanceRate * 0.10 +
        spiritEventAttendanceRate * 0.10 +
        spiritVal * 0.40;

      return {
        playerId: player.id,
        interclubAttendanceRate,
        trainingAttendanceRate,
        spiritEventAttendanceRate,
        singlesPlayed,
        singlesWon,
        singlesWinRate,
        doublesPlayed,
        doublesWon,
        doublesWinRate,
        spiritValue: spiritVal,
        gemschiScore,
      };
    });
  }, [players, attendance, interclubEvents, trainingEvents, spiritEvents, spirit, selectedSeasonId]);

  const teamStats = useMemo((): TeamSeasonStats => {
    let matchesPlayed = 0;
    let matchesWon = 0;
    let matchesLost = 0;
    let matchesDraw = 0;
    let totalOurPoints = 0;
    let totalOpponentPoints = 0;

    for (const event of interclubEvents) {
      if (!event.interclub || event.interclub.matchStatus === 'Offen') continue;
      matchesPlayed++;
      const { ourScore, opponentScore } = event.interclub.totalScore;
      totalOurPoints += ourScore;
      totalOpponentPoints += opponentScore;
      if (event.interclub.matchStatus === 'Gespielt') {
        if (ourScore > opponentScore) matchesWon++;
        else if (ourScore < opponentScore) matchesLost++;
        else matchesDraw++;
      }
    }

    const totalGemschi = playerStats.reduce((sum, ps) => sum + ps.gemschiScore, 0);
    const averageGemschiScore = playerStats.length > 0 ? totalGemschi / playerStats.length : 0;

    return {
      matchesPlayed,
      matchesWon,
      matchesLost,
      matchesDraw,
      totalOurPoints,
      totalOpponentPoints,
      averageGemschiScore,
    };
  }, [interclubEvents, playerStats]);

  return { playerStats, teamStats, getPlayerStats: (id: string) => playerStats.find(s => s.playerId === id) };
}
