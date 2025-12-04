import React, { createContext, useContext, useState, useEffect } from 'react';

export interface EventAttendee {
  playerId: string;
  singlesPlayed: 0 | 1;
  singlesWon: 0 | 1;
  doublesPlayed: 0 | 1;
  doublesWon: 0 | 1;
}

export interface GameScore {
  ourScore: number;
  opponentScore: number;
}

export interface SinglesGame {
  gameNumber: number; // 1-6
  playerId: string | null;
  set1: GameScore | null;
  set2: GameScore | null;
  set3: GameScore | null;
}

export interface DoublesGame {
  gameNumber: number; // 7-9
  player1Id: string | null;
  player2Id: string | null;
  set1: GameScore | null;
  set2: GameScore | null;
  set3: GameScore | null;
}

export type EventStatus = 'Offen' | 'Am Spielen' | 'Gespielt';

export interface InterclubEvent {
  id: string;
  datum: string;
  ort: string;
  gegner: string;
  score?: string; // Format: "3:2" or undefined if no score yet
  status: EventStatus;
  attendees: EventAttendee[];
  singlesGames: SinglesGame[]; // Games 1-6
  doublesGames: DoublesGame[]; // Games 7-9
  totalScore: {
    ourScore: number; // 0-9
    opponentScore: number; // 0-9
  };
}

interface EventsContextType {
  events: InterclubEvent[];
  addEvent: (event: Omit<InterclubEvent, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<InterclubEvent>) => void;
  removeEvent: (id: string) => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

const createEmptySinglesGames = (): SinglesGame[] => {
  return Array.from({ length: 6 }, (_, i) => ({
    gameNumber: i + 1,
    playerId: null,
    set1: null,
    set2: null,
    set3: null,
  }));
};

const createEmptyDoublesGames = (): DoublesGame[] => {
  return Array.from({ length: 3 }, (_, i) => ({
    gameNumber: i + 7,
    player1Id: null,
    player2Id: null,
    set1: null,
    set2: null,
    set3: null,
  }));
};

const calculateGameWinner = (game: SinglesGame | DoublesGame): 'our' | 'opponent' | null => {
  if (!game.set1) return null;
  
  let ourWins = 0;
  let opponentWins = 0;
  
  if (game.set1) {
    if (game.set1.ourScore > game.set1.opponentScore) ourWins++;
    else if (game.set1.opponentScore > game.set1.ourScore) opponentWins++;
  }
  if (game.set2) {
    if (game.set2.ourScore > game.set2.opponentScore) ourWins++;
    else if (game.set2.opponentScore > game.set2.ourScore) opponentWins++;
  }
  if (game.set3) {
    if (game.set3.ourScore > game.set3.opponentScore) ourWins++;
    else if (game.set3.opponentScore > game.set3.ourScore) opponentWins++;
  }
  
  if (ourWins >= 2) return 'our';
  if (opponentWins >= 2) return 'opponent';
  return null;
};

const calculateTotalScore = (singlesGames: SinglesGame[], doublesGames: DoublesGame[]): { ourScore: number; opponentScore: number } => {
  let ourScore = 0;
  let opponentScore = 0;
  
  [...singlesGames, ...doublesGames].forEach(game => {
    const winner = calculateGameWinner(game);
    if (winner === 'our') ourScore++;
    else if (winner === 'opponent') opponentScore++;
  });
  
  return { ourScore, opponentScore };
};

const calculateStatus = (singlesGames: SinglesGame[], doublesGames: DoublesGame[]): EventStatus => {
  const allGames = [...singlesGames, ...doublesGames];
  const gamesWithResults = allGames.filter(g => g.set1 !== null);
  
  if (gamesWithResults.length === 0) return 'Offen';
  if (gamesWithResults.length < 9) return 'Am Spielen';
  return 'Gespielt';
};

const defaultEvents: InterclubEvent[] = [
  {
    id: '1',
    datum: '15.01.2024',
    ort: 'Zürich',
    gegner: 'GC Zürich',
    score: '5:4',
    status: 'Gespielt',
    totalScore: { ourScore: 5, opponentScore: 4 },
    attendees: [
      { playerId: '1', singlesPlayed: 1, singlesWon: 1, doublesPlayed: 1, doublesWon: 1 },
      { playerId: '2', singlesPlayed: 1, singlesWon: 1, doublesPlayed: 0, doublesWon: 0 },
      { playerId: '3', singlesPlayed: 1, singlesWon: 0, doublesPlayed: 1, doublesWon: 1 },
      { playerId: '5', singlesPlayed: 1, singlesWon: 1, doublesPlayed: 0, doublesWon: 0 },
      { playerId: '6', singlesPlayed: 0, singlesWon: 0, doublesPlayed: 1, doublesWon: 0 },
      { playerId: '9', singlesPlayed: 1, singlesWon: 1, doublesPlayed: 0, doublesWon: 0 },
    ],
    singlesGames: createEmptySinglesGames(),
    doublesGames: createEmptyDoublesGames(),
  },
  {
    id: '2',
    datum: '22.01.2024',
    ort: 'Bern',
    gegner: 'BC Bern',
    score: '2:7',
    status: 'Gespielt',
    totalScore: { ourScore: 2, opponentScore: 7 },
    attendees: [
      { playerId: '2', singlesPlayed: 1, singlesWon: 0, doublesPlayed: 1, doublesWon: 0 },
      { playerId: '3', singlesPlayed: 1, singlesWon: 0, doublesPlayed: 1, doublesWon: 0 },
      { playerId: '4', singlesPlayed: 1, singlesWon: 1, doublesPlayed: 0, doublesWon: 0 },
      { playerId: '7', singlesPlayed: 1, singlesWon: 1, doublesPlayed: 0, doublesWon: 0 },
      { playerId: '10', singlesPlayed: 0, singlesWon: 0, doublesPlayed: 1, doublesWon: 0 },
    ],
    singlesGames: createEmptySinglesGames(),
    doublesGames: createEmptyDoublesGames(),
  },
  {
    id: '3',
    datum: '05.02.2024',
    ort: 'Basel',
    gegner: 'TC Basel',
    status: 'Offen',
    totalScore: { ourScore: 0, opponentScore: 0 },
    attendees: [],
    singlesGames: createEmptySinglesGames(),
    doublesGames: createEmptyDoublesGames(),
  },
  {
    id: '4',
    datum: '12.02.2024',
    ort: 'Luzern',
    gegner: 'SC Luzern',
    score: '6:3',
    status: 'Gespielt',
    totalScore: { ourScore: 6, opponentScore: 3 },
    attendees: [
      { playerId: '1', singlesPlayed: 1, singlesWon: 1, doublesPlayed: 1, doublesWon: 1 },
      { playerId: '2', singlesPlayed: 1, singlesWon: 1, doublesPlayed: 0, doublesWon: 0 },
      { playerId: '5', singlesPlayed: 1, singlesWon: 1, doublesPlayed: 0, doublesWon: 0 },
      { playerId: '6', singlesPlayed: 1, singlesWon: 1, doublesPlayed: 1, doublesWon: 1 },
      { playerId: '9', singlesPlayed: 1, singlesWon: 1, doublesPlayed: 0, doublesWon: 0 },
      { playerId: '10', singlesPlayed: 0, singlesWon: 0, doublesPlayed: 1, doublesWon: 1 },
    ],
    singlesGames: createEmptySinglesGames(),
    doublesGames: createEmptyDoublesGames(),
  },
  {
    id: '5',
    datum: '19.02.2024',
    ort: 'Genf',
    gegner: 'GC Genève',
    status: 'Offen',
    totalScore: { ourScore: 0, opponentScore: 0 },
    attendees: [],
    singlesGames: createEmptySinglesGames(),
    doublesGames: createEmptyDoublesGames(),
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
  const [events, setEvents] = useState<InterclubEvent[]>(() => {
    const stored = localStorage.getItem('interclubEvents');
    return stored ? JSON.parse(stored) : defaultEvents;
  });

  useEffect(() => {
    localStorage.setItem('interclubEvents', JSON.stringify(events));
  }, [events]);

  const addEvent = (eventData: Omit<InterclubEvent, 'id'>) => {
    const newEvent: InterclubEvent = {
      ...eventData,
      id: Date.now().toString(),
      singlesGames: eventData.singlesGames || createEmptySinglesGames(),
      doublesGames: eventData.doublesGames || createEmptyDoublesGames(),
      status: eventData.status || 'Offen',
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (id: string, updates: Partial<InterclubEvent>) => {
    setEvents(prev =>
      prev.map(event => {
        if (event.id === id) {
          const updated = { ...event, ...updates };
          // Recalculate total score and status if games were updated
          if (updates.singlesGames || updates.doublesGames) {
            const singles = updates.singlesGames || event.singlesGames;
            const doubles = updates.doublesGames || event.doublesGames;
            updated.totalScore = calculateTotalScore(singles, doubles);
            updated.status = calculateStatus(singles, doubles);
            updated.score = `${updated.totalScore.ourScore}:${updated.totalScore.opponentScore}`;
          }
          return updated;
        }
        return event;
      })
    );
  };

  const removeEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  return (
    <EventsContext.Provider value={{ events, addEvent, updateEvent, removeEvent }}>
      {children}
    </EventsContext.Provider>
  );
};

