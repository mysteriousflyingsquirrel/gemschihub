import React, { useState } from 'react';
import { PageTitle } from '../components/PageTitle';
import { useInfo } from '../contexts/InfoContext';
import { usePlayers } from '../contexts/PlayersContext';
import { useEvents, InterclubEvent, SinglesGame, DoublesGame } from '../contexts/EventsContext';
import { Gemschigrad, Klassierung, PlayerRole } from '../types/player';

const gemschigrads: Gemschigrad[] = ['Ehrengemschi', 'Kuttengemschi', 'Bandanagemschi', 'Gitzi'];
const klassierungen: Klassierung[] = ['N1', 'N2', 'N3', 'N4', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9'];
const playerRoles: PlayerRole[] = ['Spieler', 'Captain', 'CEO of Patchio'];

const getRoleEmoji = (role: PlayerRole): string => {
  switch (role) {
    case 'Captain':
      return '👑';
    case 'CEO of Patchio':
      return '🌮';
    default:
      return '';
  }
};

const getGemschigradColor = (grad: Gemschigrad) => {
  switch (grad) {
    case 'Ehrengemschi':
      return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900';
    case 'Kuttengemschi':
      return 'bg-gradient-to-r from-blue-400 to-blue-600 text-blue-900';
    case 'Bandanagemschi':
      return 'bg-gradient-to-r from-green-400 to-green-600 text-green-900';
    case 'Gitzi':
      return 'bg-gradient-to-r from-purple-400 to-purple-600 text-purple-900';
  }
};

export const Admin: React.FC = () => {
  const { tenueData, addTenueItem, updateTenueItem, removeTenueItem } = useInfo();
  const { players, addPlayer, updatePlayer, removePlayer } = usePlayers();
  const { events, addEvent, updateEvent, removeEvent } = useEvents();
  const [editingTenue, setEditingTenue] = useState<{ gemschigrad: Gemschigrad; id: string } | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [newTenueText, setNewTenueText] = useState<{ [key in Gemschigrad]?: string }>({});
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [openGemschigrad, setOpenGemschigrad] = useState<Gemschigrad | null>(null);
  
  // Event results modal state
  const [resultsModalEvent, setResultsModalEvent] = useState<InterclubEvent | null>(null);
  const [resultsStep, setResultsStep] = useState<1 | 2 | 3>(1);
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);
  const [singlesGamesData, setSinglesGamesData] = useState<SinglesGame[]>([]);
  const [doublesGamesData, setDoublesGamesData] = useState<DoublesGame[]>([]);
  
  // New player form state
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerAlias, setNewPlayerAlias] = useState('');
  const [newPlayerRole, setNewPlayerRole] = useState<PlayerRole>('Spieler');
  const [newPlayerGemschigrad, setNewPlayerGemschigrad] = useState<Gemschigrad>('Gitzi');
  const [newPlayerKlassierung, setNewPlayerKlassierung] = useState<Klassierung>('R9');
  const [newPlayerInvitationCode, setNewPlayerInvitationCode] = useState('');

  // New event form state
  const [newEventDatum, setNewEventDatum] = useState('');
  const [newEventOrt, setNewEventOrt] = useState('');
  const [newEventGegner, setNewEventGegner] = useState('');

  const isTenueExpanded = openSection === 'tenue';
  const isSpielerExpanded = openSection === 'spieler';
  const isEventsExpanded = openSection === 'events';

  const toggleSection = (section: 'tenue' | 'spieler' | 'events') => {
    setOpenSection(openSection === section ? null : section);
  };

  const toggleGemschigrad = (gemschigrad: Gemschigrad) => {
    setOpenGemschigrad(openGemschigrad === gemschigrad ? null : gemschigrad);
  };

  const handleAddTenueItem = (gemschigrad: Gemschigrad) => {
    const text = newTenueText[gemschigrad];
    if (text && text.trim()) {
      addTenueItem(gemschigrad, text.trim());
      setNewTenueText({ ...newTenueText, [gemschigrad]: '' });
    }
  };

  const handleUpdateTenueItem = (gemschigrad: Gemschigrad, id: string, text: string) => {
    updateTenueItem(gemschigrad, id, text);
    setEditingTenue(null);
  };


  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      addPlayer({
        name: newPlayerName.trim(),
        alias: newPlayerAlias.trim() || undefined,
        role: newPlayerRole,
        gemschigrad: newPlayerGemschigrad,
        klassierung: newPlayerKlassierung,
        email: undefined,
        phone: undefined,
        joinDate: undefined,
      });
      setNewPlayerName('');
      setNewPlayerAlias('');
      setNewPlayerRole('Spieler');
      setNewPlayerGemschigrad('Gitzi');
      setNewPlayerKlassierung('R9');
      setNewPlayerInvitationCode('');
    }
  };

  const handleUpdatePlayer = (id: string, field: string, value: any) => {
    updatePlayer(id, { [field]: value });
    if (field !== 'role') {
      setEditingPlayer(null);
    }
  };

  const handleAddEvent = () => {
    if (newEventDatum.trim() && newEventOrt.trim() && newEventGegner.trim()) {
      const emptySingles = Array.from({ length: 6 }, (_, i) => ({
        gameNumber: i + 1,
        playerId: null,
        set1: null,
        set2: null,
        set3: null,
      }));
      const emptyDoubles = Array.from({ length: 3 }, (_, i) => ({
        gameNumber: i + 7,
        player1Id: null,
        player2Id: null,
        set1: null,
        set2: null,
        set3: null,
      }));
      addEvent({
        datum: newEventDatum.trim(),
        ort: newEventOrt.trim(),
        gegner: newEventGegner.trim(),
        status: 'Offen',
        attendees: [],
        singlesGames: emptySingles,
        doublesGames: emptyDoubles,
        totalScore: { ourScore: 0, opponentScore: 0 },
        score: undefined,
      });
      setNewEventDatum('');
      setNewEventOrt('');
      setNewEventGegner('');
    }
  };

  const handleUpdateEvent = (id: string, field: string, value: any) => {
    updateEvent(id, { [field]: value });
    setEditingEvent(null);
  };

  const handleOpenResultsModal = (event: InterclubEvent) => {
    setResultsModalEvent(event);
    setResultsStep(1);
    setSelectedAttendees(event.attendees.map(a => a.playerId));
    // Initialize games data with empty games if not present
    const emptySingles = Array.from({ length: 6 }, (_, i) => ({
      gameNumber: i + 1,
      playerId: null,
      set1: null,
      set2: null,
      set3: null,
    }));
    const emptyDoubles = Array.from({ length: 3 }, (_, i) => ({
      gameNumber: i + 7,
      player1Id: null,
      player2Id: null,
      set1: null,
      set2: null,
      set3: null,
    }));
    setSinglesGamesData(event.singlesGames && event.singlesGames.length > 0 ? [...event.singlesGames] : emptySingles);
    setDoublesGamesData(event.doublesGames && event.doublesGames.length > 0 ? [...event.doublesGames] : emptyDoubles);
  };

  const handleCloseResultsModal = () => {
    setResultsModalEvent(null);
    setResultsStep(1);
    setSelectedAttendees([]);
    setSinglesGamesData([]);
    setDoublesGamesData([]);
  };

  const handleNextStep = () => {
    if (resultsStep === 1) {
      if (selectedAttendees.length === 0) {
        alert('Bitte wählen Sie mindestens einen Spieler aus.');
        return;
      }
      setResultsStep(2);
    } else if (resultsStep === 2) {
      setResultsStep(3);
    }
  };

  const handleSaveResults = () => {
    if (!resultsModalEvent) return;
    
    // Calculate attendees from games
    const attendeeMap = new Map<string, { singlesPlayed: 0 | 1; singlesWon: 0 | 1; doublesPlayed: 0 | 1; doublesWon: 0 | 1 }>();
    
    // Process singles games
    singlesGamesData.forEach(game => {
      if (game.playerId) {
        const winner = calculateGameWinner(game);
        if (!attendeeMap.has(game.playerId)) {
          attendeeMap.set(game.playerId, { singlesPlayed: 0, singlesWon: 0, doublesPlayed: 0, doublesWon: 0 });
        }
        const attendee = attendeeMap.get(game.playerId)!;
        attendee.singlesPlayed = 1;
        if (winner === 'our') attendee.singlesWon = 1;
      }
    });
    
    // Process doubles games
    doublesGamesData.forEach((game: DoublesGame) => {
      if (game.player1Id && game.player2Id) {
        const winner = calculateGameWinner(game);
        [game.player1Id, game.player2Id].forEach(playerId => {
          if (!attendeeMap.has(playerId)) {
            attendeeMap.set(playerId, { singlesPlayed: 0, singlesWon: 0, doublesPlayed: 0, doublesWon: 0 });
          }
          const attendee = attendeeMap.get(playerId)!;
          attendee.doublesPlayed = 1;
          if (winner === 'our') attendee.doublesWon = 1;
        });
      }
    });
    
    const attendees = Array.from(attendeeMap.entries()).map(([playerId, stats]) => ({
      playerId,
      ...stats,
    }));
    
    // Calculate total score
    let ourScore = 0;
    let opponentScore = 0;
    [...singlesGamesData, ...doublesGamesData].forEach((game: SinglesGame | DoublesGame) => {
      const winner = calculateGameWinner(game);
      if (winner === 'our') ourScore++;
      else if (winner === 'opponent') opponentScore++;
    });
    
    // Calculate status
    const allGames: (SinglesGame | DoublesGame)[] = [...singlesGamesData, ...doublesGamesData];
    const gamesWithResults = allGames.filter((g: SinglesGame | DoublesGame) => g.set1 !== null);
    let status: 'Offen' | 'Am Spielen' | 'Gespielt' = 'Offen';
    if (gamesWithResults.length === 0) status = 'Offen';
    else if (gamesWithResults.length < 9) status = 'Am Spielen';
    else status = 'Gespielt';
    
    updateEvent(resultsModalEvent.id, {
      attendees,
      singlesGames: singlesGamesData,
      doublesGames: doublesGamesData,
      totalScore: { ourScore, opponentScore },
      status,
      score: `${ourScore}:${opponentScore}`,
    });
    
    handleCloseResultsModal();
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

  const getStatusColor = (status: 'Offen' | 'Am Spielen' | 'Gespielt') => {
    switch (status) {
      case 'Offen':
        return 'bg-gray-100 text-gray-700';
      case 'Am Spielen':
        return 'bg-yellow-100 text-yellow-700';
      case 'Gespielt':
        return 'bg-green-100 text-green-700';
    }
  };

  return (
    <>
      <PageTitle>Admin</PageTitle>
      <div className="space-y-8">
        {/* Tenue Management */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <button
            onClick={() => toggleSection('tenue')}
            className="w-full flex items-center justify-between text-left mb-6"
          >
            <h2 className="text-2xl font-semibold text-chnebel-black flex items-center gap-2">
              <span className="text-2xl">👕</span>
              Tenue verwalten
            </h2>
            <svg
              className={`w-6 h-6 text-chnebel-black transition-transform duration-200 ${isTenueExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isTenueExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="space-y-8">
              {gemschigrads.map((gemschigrad) => (
                <div key={gemschigrad} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                  <button
                    onClick={() => toggleGemschigrad(gemschigrad)}
                    className="w-full flex items-center justify-between text-left mb-4"
                  >
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getGemschigradColor(gemschigrad)}`}>
                        {gemschigrad}
                      </span>
                    </h3>
                    <svg
                      className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${openGemschigrad === gemschigrad ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openGemschigrad === gemschigrad ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="space-y-2 mb-4">
                  {tenueData[gemschigrad].map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-chnebel-gray rounded-lg"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-chnebel-red flex items-center justify-center text-white font-semibold">
                        {item.order}
                      </div>
                      {editingTenue?.gemschigrad === gemschigrad && editingTenue?.id === item.id ? (
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="text"
                            defaultValue={item.text}
                            onBlur={(e) => handleUpdateTenueItem(gemschigrad, item.id, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleUpdateTenueItem(gemschigrad, item.id, e.currentTarget.value);
                              } else if (e.key === 'Escape') {
                                setEditingTenue(null);
                              }
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <span className="flex-1">{item.text}</span>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingTenue({ gemschigrad, id: item.id })}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                        >
                          ✏️ Bearbeiten
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Möchten Sie dieses Tenue-Item wirklich löschen?')) {
                              removeTenueItem(gemschigrad, item.id);
                            }
                          }}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                        >
                          🗑️ Löschen
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTenueText[gemschigrad] || ''}
                    onChange={(e) => setNewTenueText({ ...newTenueText, [gemschigrad]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddTenueItem(gemschigrad);
                      }
                    }}
                    placeholder="Neues Tenue-Item hinzufügen..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                  />
                  <button
                    onClick={() => handleAddTenueItem(gemschigrad)}
                    className="px-4 py-2 bg-chnebel-red text-white rounded hover:bg-[#c4161e] transition-colors font-semibold"
                  >
                    + Hinzufügen
                  </button>
                </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Events Management */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <button
            onClick={() => toggleSection('events')}
            className="w-full flex items-center justify-between text-left mb-6"
          >
            <h2 className="text-2xl font-semibold text-chnebel-black flex items-center gap-2">
              <span className="text-2xl">📅</span>
              Events verwalten
            </h2>
            <svg
              className={`w-6 h-6 text-chnebel-black transition-transform duration-200 ${isEventsExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isEventsExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            {/* Add New Event Form */}
            <div className="bg-chnebel-gray rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-chnebel-black mb-4">Neues Event hinzufügen</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Datum *</label>
                  <input
                    type="text"
                    value={newEventDatum}
                    onChange={(e) => setNewEventDatum(e.target.value)}
                    placeholder="DD.MM.YYYY"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ort *</label>
                  <input
                    type="text"
                    value={newEventOrt}
                    onChange={(e) => setNewEventOrt(e.target.value)}
                    placeholder="Ort"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gegner *</label>
                  <input
                    type="text"
                    value={newEventGegner}
                    onChange={(e) => setNewEventGegner(e.target.value)}
                    placeholder="Gegner"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    onClick={handleAddEvent}
                    disabled={!newEventDatum.trim() || !newEventOrt.trim() || !newEventGegner.trim()}
                    className="w-full px-4 py-2 bg-chnebel-red text-white rounded hover:bg-[#c4161e] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    + Event hinzufügen
                  </button>
                </div>
              </div>
            </div>

            {/* Events List */}
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-4 bg-chnebel-gray rounded-lg border border-gray-200"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                    {/* Datum */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Datum</label>
                      {editingEvent === `${event.id}-datum` ? (
                        <input
                          type="text"
                          defaultValue={event.datum}
                          onBlur={(e) => handleUpdateEvent(event.id, 'datum', e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleUpdateEvent(event.id, 'datum', e.currentTarget.value);
                            } else if (e.key === 'Escape') {
                              setEditingEvent(null);
                            }
                          }}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                          autoFocus
                        />
                      ) : (
                        <div
                          className="px-2 py-1 text-sm font-medium text-chnebel-black cursor-pointer hover:bg-white rounded"
                          onClick={() => setEditingEvent(`${event.id}-datum`)}
                        >
                          {event.datum}
                        </div>
                      )}
                    </div>

                    {/* Ort */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Ort</label>
                      {editingEvent === `${event.id}-ort` ? (
                        <input
                          type="text"
                          defaultValue={event.ort}
                          onBlur={(e) => handleUpdateEvent(event.id, 'ort', e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleUpdateEvent(event.id, 'ort', e.currentTarget.value);
                            } else if (e.key === 'Escape') {
                              setEditingEvent(null);
                            }
                          }}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                          autoFocus
                        />
                      ) : (
                        <div
                          className="px-2 py-1 text-sm font-medium text-chnebel-black cursor-pointer hover:bg-white rounded"
                          onClick={() => setEditingEvent(`${event.id}-ort`)}
                        >
                          {event.ort}
                        </div>
                      )}
                    </div>

                    {/* Gegner */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Gegner</label>
                      {editingEvent === `${event.id}-gegner` ? (
                        <input
                          type="text"
                          defaultValue={event.gegner}
                          onBlur={(e) => handleUpdateEvent(event.id, 'gegner', e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleUpdateEvent(event.id, 'gegner', e.currentTarget.value);
                            } else if (e.key === 'Escape') {
                              setEditingEvent(null);
                            }
                          }}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                          autoFocus
                        />
                      ) : (
                        <div
                          className="px-2 py-1 text-sm font-medium text-chnebel-black cursor-pointer hover:bg-white rounded"
                          onClick={() => setEditingEvent(`${event.id}-gegner`)}
                        >
                          {event.gegner}
                        </div>
                      )}
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                      <button
                        onClick={() => handleOpenResultsModal(event)}
                        className={`px-3 py-1 rounded text-xs font-semibold ${getStatusColor(event.status)} hover:opacity-80 transition-opacity`}
                      >
                        {event.status}
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (window.confirm(`Möchten Sie das Event "${event.gegner}" wirklich löschen?`)) {
                          removeEvent(event.id);
                        }
                      }}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Spieler Management */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <button
            onClick={() => toggleSection('spieler')}
            className="w-full flex items-center justify-between text-left mb-6"
          >
            <h2 className="text-2xl font-semibold text-chnebel-black flex items-center gap-2">
              <span className="text-2xl">👥</span>
              Spieler verwalten
            </h2>
            <svg
              className={`w-6 h-6 text-chnebel-black transition-transform duration-200 ${isSpielerExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isSpielerExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            {/* Add New Player Form */}
            <div className="bg-chnebel-gray rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-chnebel-black mb-4">Neuen Spieler hinzufügen</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    placeholder="Spielername"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alias</label>
                  <input
                    type="text"
                    value={newPlayerAlias}
                    onChange={(e) => setNewPlayerAlias(e.target.value)}
                    placeholder="Alias (optional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rolle</label>
                  <select
                    value={newPlayerRole}
                    onChange={(e) => setNewPlayerRole(e.target.value as PlayerRole)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                  >
                    {playerRoles.map((role) => (
                      <option key={role} value={role}>
                        {getRoleEmoji(role)} {role}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gemschigrad</label>
                  <select
                    value={newPlayerGemschigrad}
                    onChange={(e) => setNewPlayerGemschigrad(e.target.value as Gemschigrad)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                  >
                    {gemschigrads.map((grad) => (
                      <option key={grad} value={grad}>{grad}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Klassierung</label>
                  <select
                    value={newPlayerKlassierung}
                    onChange={(e) => setNewPlayerKlassierung(e.target.value as Klassierung)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                  >
                    {klassierungen.map((klass) => (
                      <option key={klass} value={klass}>{klass}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invitation Code (für später)</label>
                  <input
                    type="text"
                    value={newPlayerInvitationCode}
                    onChange={(e) => setNewPlayerInvitationCode(e.target.value)}
                    placeholder="Invitation Code"
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-chnebel-red bg-gray-100 text-gray-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    onClick={handleAddPlayer}
                    disabled={!newPlayerName.trim()}
                    className="w-full px-4 py-2 bg-chnebel-red text-white rounded hover:bg-[#c4161e] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    + Spieler hinzufügen
                  </button>
                </div>
              </div>
            </div>

            {/* Players List */}
            <div className="space-y-3">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center gap-3 p-4 bg-chnebel-gray rounded-lg border border-gray-200"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-3">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                      {editingPlayer === `${player.id}-name` ? (
                        <input
                          type="text"
                          defaultValue={player.name}
                          onBlur={(e) => handleUpdatePlayer(player.id, 'name', e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleUpdatePlayer(player.id, 'name', e.currentTarget.value);
                            } else if (e.key === 'Escape') {
                              setEditingPlayer(null);
                            }
                          }}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                          autoFocus
                        />
                      ) : (
                        <div
                          className="px-2 py-1 text-sm font-medium text-chnebel-black cursor-pointer hover:bg-white rounded"
                          onClick={() => setEditingPlayer(`${player.id}-name`)}
                        >
                          {player.name} {getRoleEmoji(player.role) && <span className="text-yellow-500">{getRoleEmoji(player.role)}</span>}
                        </div>
                      )}
                    </div>

                    {/* Alias */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Alias</label>
                      {editingPlayer === `${player.id}-alias` ? (
                        <input
                          type="text"
                          defaultValue={player.alias || ''}
                          onBlur={(e) => handleUpdatePlayer(player.id, 'alias', e.target.value || undefined)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleUpdatePlayer(player.id, 'alias', e.currentTarget.value || undefined);
                            } else if (e.key === 'Escape') {
                              setEditingPlayer(null);
                            }
                          }}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                          autoFocus
                        />
                      ) : (
                        <div
                          className="px-2 py-1 text-sm font-medium text-chnebel-black cursor-pointer hover:bg-white rounded"
                          onClick={() => setEditingPlayer(`${player.id}-alias`)}
                        >
                          {player.alias || '-'}
                        </div>
                      )}
                    </div>

                    {/* Rolle */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Rolle</label>
                      {editingPlayer === `${player.id}-role` ? (
                        <select
                          defaultValue={player.role}
                          onChange={(e) => handleUpdatePlayer(player.id, 'role', e.target.value as PlayerRole)}
                          onBlur={() => setEditingPlayer(null)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                          autoFocus
                        >
                          {playerRoles.map((role) => (
                            <option key={role} value={role}>
                              {getRoleEmoji(role)} {role}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div
                          className="px-2 py-1 text-sm font-semibold text-chnebel-black cursor-pointer hover:bg-white rounded"
                          onClick={() => setEditingPlayer(`${player.id}-role`)}
                        >
                          {getRoleEmoji(player.role) ? `${getRoleEmoji(player.role)} ${player.role}` : player.role}
                        </div>
                      )}
                    </div>

                    {/* Gemschigrad */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Gemschigrad</label>
                      {editingPlayer === `${player.id}-gemschigrad` ? (
                        <select
                          defaultValue={player.gemschigrad}
                          onChange={(e) => handleUpdatePlayer(player.id, 'gemschigrad', e.target.value as Gemschigrad)}
                          onBlur={() => setEditingPlayer(null)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                          autoFocus
                        >
                          {gemschigrads.map((grad) => (
                            <option key={grad} value={grad}>{grad}</option>
                          ))}
                        </select>
                      ) : (
                        <div
                          className="px-2 py-1 text-sm cursor-pointer hover:bg-white rounded"
                          onClick={() => setEditingPlayer(`${player.id}-gemschigrad`)}
                        >
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getGemschigradColor(player.gemschigrad)}`}>
                            {player.gemschigrad}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Klassierung */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Klassierung</label>
                      {editingPlayer === `${player.id}-klassierung` ? (
                        <select
                          defaultValue={player.klassierung}
                          onChange={(e) => handleUpdatePlayer(player.id, 'klassierung', e.target.value as Klassierung)}
                          onBlur={() => setEditingPlayer(null)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                          autoFocus
                        >
                          {klassierungen.map((klass) => (
                            <option key={klass} value={klass}>{klass}</option>
                          ))}
                        </select>
                      ) : (
                        <div
                          className="px-2 py-1 text-sm font-semibold text-chnebel-black cursor-pointer hover:bg-white rounded"
                          onClick={() => setEditingPlayer(`${player.id}-klassierung`)}
                        >
                          {player.klassierung}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (window.confirm(`Möchten Sie den Spieler "${player.name}" wirklich löschen?`)) {
                          removePlayer(player.id);
                        }
                      }}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Results Entry Modal */}
      {resultsModalEvent && (
        <div
          className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-2 md:p-4"
          onClick={handleCloseResultsModal}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[95vh] md:max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-chnebel-red to-[#c4161e] text-white p-4 md:p-6 rounded-t-lg sticky top-0 z-10">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl md:text-2xl font-bold mb-2">Ergebnisse eingeben</h2>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm md:text-base text-white/90">
                    <span>📅 {resultsModalEvent.datum}</span>
                    <span>📍 {resultsModalEvent.ort}</span>
                    <span className="break-words">vs. {resultsModalEvent.gegner}</span>
                  </div>
                </div>
                <button
                  onClick={handleCloseResultsModal}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors flex-shrink-0"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Step Indicator */}
              <div className="flex items-center gap-2 mt-3 md:mt-4">
                <div className={`flex-1 h-2 rounded ${resultsStep >= 1 ? 'bg-white' : 'bg-white/30'}`} />
                <div className={`flex-1 h-2 rounded ${resultsStep >= 2 ? 'bg-white' : 'bg-white/30'}`} />
                <div className={`flex-1 h-2 rounded ${resultsStep >= 3 ? 'bg-white' : 'bg-white/30'}`} />
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 md:p-6">
              {/* Step 1: Select Attendees */}
              {resultsStep === 1 && (
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-chnebel-black mb-3 md:mb-4">Spieler auswählen</h3>
                  <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">Wählen Sie die Spieler aus, die an diesem Event teilgenommen haben:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                    {players.map((player) => (
                      <label
                        key={player.id}
                        className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                          selectedAttendees.includes(player.id)
                            ? 'border-chnebel-red bg-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedAttendees.includes(player.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAttendees([...selectedAttendees, player.id]);
                            } else {
                              setSelectedAttendees(selectedAttendees.filter(id => id !== player.id));
                            }
                          }}
                          className="w-5 h-5 text-chnebel-red border-gray-300 rounded focus:ring-chnebel-red flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm md:text-base text-chnebel-black break-words">{player.name}</div>
                          {player.alias && <div className="text-xs md:text-sm text-gray-500 italic break-words">{player.alias}</div>}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Singles Games (1-6) */}
              {resultsStep === 2 && (
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-chnebel-black mb-3 md:mb-4">Einzelspiele (Spiel 1-6)</h3>
                  <div className="space-y-4 md:space-y-6">
                    {singlesGamesData.map((game: SinglesGame, index: number) => (
                      <div key={game.gameNumber} className="border border-gray-200 rounded-lg p-3 md:p-4">
                        <h4 className="font-semibold text-base md:text-lg text-chnebel-black mb-2 md:mb-3">Spiel {game.gameNumber}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Spieler</label>
                            <select
                              value={game.playerId || ''}
                              onChange={(e) => {
                                const updated = [...singlesGamesData];
                                updated[index].playerId = e.target.value || null;
                                setSinglesGamesData(updated);
                              }}
                              className="w-full px-2 md:px-3 py-2 text-sm md:text-base border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                            >
                              <option value="">-- Spieler wählen --</option>
                              {selectedAttendees.map(playerId => {
                                const player = players.find(p => p.id === playerId);
                                return player ? (
                                  <option key={playerId} value={playerId}>{player.name}</option>
                                ) : null;
                              })}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Gegner</label>
                            <input
                              type="text"
                              value={resultsModalEvent.gegner}
                              disabled
                              className="w-full px-2 md:px-3 py-2 text-sm md:text-base border border-gray-300 rounded bg-gray-100 text-gray-600"
                            />
                          </div>
                          {/* Set 1 */}
                          <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Satz 1</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                max="7"
                                value={game.set1?.ourScore || ''}
                                onChange={(e) => {
                                  const updated = [...singlesGamesData];
                                  updated[index].set1 = {
                                    ourScore: parseInt(e.target.value) || 0,
                                    opponentScore: updated[index].set1?.opponentScore || 0,
                                  };
                                  setSinglesGamesData(updated);
                                }}
                                className="w-full px-2 md:px-3 py-2 text-sm md:text-base border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                                placeholder="0"
                              />
                              <span className="text-gray-500 text-sm md:text-base">:</span>
                              <input
                                type="number"
                                min="0"
                                max="7"
                                value={game.set1?.opponentScore || ''}
                                onChange={(e) => {
                                  const updated = [...singlesGamesData];
                                  updated[index].set1 = {
                                    ourScore: updated[index].set1?.ourScore || 0,
                                    opponentScore: parseInt(e.target.value) || 0,
                                  };
                                  setSinglesGamesData(updated);
                                }}
                                className="w-full px-2 md:px-3 py-2 text-sm md:text-base border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                                placeholder="0"
                              />
                            </div>
                          </div>
                          {/* Set 2 */}
                          <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Satz 2</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                max="7"
                                value={game.set2?.ourScore || ''}
                                onChange={(e) => {
                                  const updated = [...singlesGamesData];
                                  updated[index].set2 = {
                                    ourScore: parseInt(e.target.value) || 0,
                                    opponentScore: updated[index].set2?.opponentScore || 0,
                                  };
                                  setSinglesGamesData(updated);
                                }}
                                className="w-full px-2 md:px-3 py-2 text-sm md:text-base border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                                placeholder="0"
                              />
                              <span className="text-gray-500 text-sm md:text-base">:</span>
                              <input
                                type="number"
                                min="0"
                                max="7"
                                value={game.set2?.opponentScore || ''}
                                onChange={(e) => {
                                  const updated = [...singlesGamesData];
                                  updated[index].set2 = {
                                    ourScore: updated[index].set2?.ourScore || 0,
                                    opponentScore: parseInt(e.target.value) || 0,
                                  };
                                  setSinglesGamesData(updated);
                                }}
                                className="w-full px-2 md:px-3 py-2 text-sm md:text-base border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                                placeholder="0"
                              />
                            </div>
                          </div>
                          {/* Set 3 (only if needed) */}
                          {((game.set1 && game.set1.ourScore !== game.set1.opponentScore) || 
                            (game.set2 && game.set2.ourScore !== game.set2.opponentScore)) && (
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Satz 3 (falls nötig)</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="0"
                                  max="7"
                                  value={game.set3?.ourScore || ''}
                                  onChange={(e) => {
                                    const updated = [...singlesGamesData];
                                    updated[index].set3 = {
                                      ourScore: parseInt(e.target.value) || 0,
                                      opponentScore: updated[index].set3?.opponentScore || 0,
                                    };
                                    setSinglesGamesData(updated);
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                                  placeholder="0"
                                />
                                <span className="text-gray-500">:</span>
                                <input
                                  type="number"
                                  min="0"
                                  max="7"
                                  value={game.set3?.opponentScore || ''}
                                  onChange={(e) => {
                                    const updated = [...singlesGamesData];
                                    updated[index].set3 = {
                                      ourScore: updated[index].set3?.ourScore || 0,
                                      opponentScore: parseInt(e.target.value) || 0,
                                    };
                                    setSinglesGamesData(updated);
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                                  placeholder="0"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Doubles Games (7-9) */}
              {resultsStep === 3 && (
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-chnebel-black mb-3 md:mb-4">Doppelspiele (Spiel 7-9)</h3>
                  <div className="space-y-4 md:space-y-6">
                    {doublesGamesData.map((game: DoublesGame, index: number) => (
                      <div key={game.gameNumber} className="border border-gray-200 rounded-lg p-3 md:p-4">
                        <h4 className="font-semibold text-base md:text-lg text-chnebel-black mb-2 md:mb-3">Spiel {game.gameNumber}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Spieler 1</label>
                            <select
                              value={game.player1Id || ''}
                              onChange={(e) => {
                                const updated = [...doublesGamesData];
                                updated[index].player1Id = e.target.value || null;
                                setDoublesGamesData(updated);
                              }}
                              className="w-full px-2 md:px-3 py-2 text-sm md:text-base border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                            >
                              <option value="">-- Spieler wählen --</option>
                              {selectedAttendees.map(playerId => {
                                const player = players.find(p => p.id === playerId);
                                return player ? (
                                  <option key={playerId} value={playerId}>{player.name}</option>
                                ) : null;
                              })}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Spieler 2</label>
                            <select
                              value={game.player2Id || ''}
                              onChange={(e) => {
                                const updated = [...doublesGamesData];
                                updated[index].player2Id = e.target.value || null;
                                setDoublesGamesData(updated);
                              }}
                              className="w-full px-2 md:px-3 py-2 text-sm md:text-base border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                            >
                              <option value="">-- Spieler wählen --</option>
                              {selectedAttendees.map(playerId => {
                                const player = players.find(p => p.id === playerId);
                                return player ? (
                                  <option key={playerId} value={playerId}>{player.name}</option>
                                ) : null;
                              })}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Gegner</label>
                            <input
                              type="text"
                              value={resultsModalEvent.gegner}
                              disabled
                              className="w-full px-2 md:px-3 py-2 text-sm md:text-base border border-gray-300 rounded bg-gray-100 text-gray-600"
                            />
                          </div>
                          {/* Set 1 */}
                          <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Satz 1</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                max="7"
                                value={game.set1?.ourScore || ''}
                                onChange={(e) => {
                                  const updated = [...doublesGamesData];
                                  updated[index].set1 = {
                                    ourScore: parseInt(e.target.value) || 0,
                                    opponentScore: updated[index].set1?.opponentScore || 0,
                                  };
                                  setDoublesGamesData(updated);
                                }}
                                className="w-full px-2 md:px-3 py-2 text-sm md:text-base border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                                placeholder="0"
                              />
                              <span className="text-gray-500 text-sm md:text-base">:</span>
                              <input
                                type="number"
                                min="0"
                                max="7"
                                value={game.set1?.opponentScore || ''}
                                onChange={(e) => {
                                  const updated = [...doublesGamesData];
                                  updated[index].set1 = {
                                    ourScore: updated[index].set1?.ourScore || 0,
                                    opponentScore: parseInt(e.target.value) || 0,
                                  };
                                  setDoublesGamesData(updated);
                                }}
                                className="w-full px-2 md:px-3 py-2 text-sm md:text-base border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                                placeholder="0"
                              />
                            </div>
                          </div>
                          {/* Set 2 */}
                          <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Satz 2</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                max="7"
                                value={game.set2?.ourScore || ''}
                                onChange={(e) => {
                                  const updated = [...doublesGamesData];
                                  updated[index].set2 = {
                                    ourScore: parseInt(e.target.value) || 0,
                                    opponentScore: updated[index].set2?.opponentScore || 0,
                                  };
                                  setDoublesGamesData(updated);
                                }}
                                className="w-full px-2 md:px-3 py-2 text-sm md:text-base border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                                placeholder="0"
                              />
                              <span className="text-gray-500 text-sm md:text-base">:</span>
                              <input
                                type="number"
                                min="0"
                                max="7"
                                value={game.set2?.opponentScore || ''}
                                onChange={(e) => {
                                  const updated = [...doublesGamesData];
                                  updated[index].set2 = {
                                    ourScore: updated[index].set2?.ourScore || 0,
                                    opponentScore: parseInt(e.target.value) || 0,
                                  };
                                  setDoublesGamesData(updated);
                                }}
                                className="w-full px-2 md:px-3 py-2 text-sm md:text-base border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                                placeholder="0"
                              />
                            </div>
                          </div>
                          {/* Set 3 (only if needed) */}
                          {((game.set1 && game.set1.ourScore !== game.set1.opponentScore) || 
                            (game.set2 && game.set2.ourScore !== game.set2.opponentScore)) && (
                            <div className="md:col-span-2">
                              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Satz 3 (falls nötig)</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="0"
                                  max="7"
                                  value={game.set3?.ourScore || ''}
                                  onChange={(e) => {
                                    const updated = [...doublesGamesData];
                                    updated[index].set3 = {
                                      ourScore: parseInt(e.target.value) || 0,
                                      opponentScore: updated[index].set3?.opponentScore || 0,
                                    };
                                    setDoublesGamesData(updated);
                                  }}
                                  className="w-full px-2 md:px-3 py-2 text-sm md:text-base border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                                  placeholder="0"
                                />
                                <span className="text-gray-500 text-sm md:text-base">:</span>
                                <input
                                  type="number"
                                  min="0"
                                  max="7"
                                  value={game.set3?.opponentScore || ''}
                                  onChange={(e) => {
                                    const updated = [...doublesGamesData];
                                    updated[index].set3 = {
                                      ourScore: updated[index].set3?.ourScore || 0,
                                      opponentScore: parseInt(e.target.value) || 0,
                                    };
                                    setDoublesGamesData(updated);
                                  }}
                                  className="w-full px-2 md:px-3 py-2 text-sm md:text-base border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                                  placeholder="0"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex items-center justify-between mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200 gap-2">
                <button
                  onClick={resultsStep > 1 ? () => setResultsStep((resultsStep - 1) as 1 | 2 | 3) : handleCloseResultsModal}
                  className="px-3 md:px-4 py-2 text-sm md:text-base text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                >
                  {resultsStep > 1 ? 'Zurück' : 'Abbrechen'}
                </button>
                <div className="flex gap-2">
                  {resultsStep < 3 ? (
                    <button
                      onClick={handleNextStep}
                      className="px-4 md:px-6 py-2 text-sm md:text-base bg-chnebel-red text-white rounded hover:bg-[#c4161e] transition-colors font-semibold"
                    >
                      Weiter
                    </button>
                  ) : (
                    <button
                      onClick={handleSaveResults}
                      className="px-4 md:px-6 py-2 text-sm md:text-base bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-semibold"
                    >
                      Speichern
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
