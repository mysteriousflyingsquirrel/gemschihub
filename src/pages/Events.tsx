import React, { useState, useMemo } from 'react';
import { PageTitle } from '../components/PageTitle';
import { useEvents } from '../contexts/EventsContext';
import { usePlayers } from '../contexts/PlayersContext';
import { useAttendance } from '../contexts/AttendanceContext';
import { AppEvent, deriveEventStatus, calculateGameWinner, getEventStartDate, formatEventDateDisplay } from '../types/event';

const getScoreColor = (ourScore: number, opponentScore: number) => {
  if (ourScore > opponentScore) return 'text-green-800 bg-green-100';
  if (ourScore < opponentScore) return 'text-red-800 bg-red-100';
  return 'text-gray-600 bg-gray-100';
};

const getEventTypeIcon = (type: string) => {
  switch (type) {
    case 'Interclub': return '🏆';
    case 'Training': return '🏃';
    case 'Spirit': return '🎉';
    default: return '📅';
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Upcoming': return { text: 'Bevorstehend', color: 'bg-blue-100 text-blue-800' };
    case 'Ongoing': return { text: 'Laufend', color: 'bg-yellow-100 text-yellow-800' };
    case 'Completed': return { text: 'Abgeschlossen', color: 'bg-gray-100 text-gray-600' };
    default: return { text: status, color: 'bg-gray-100 text-gray-600' };
  }
};

const getMatchStatusBadge = (status: string) => {
  switch (status) {
    case 'Offen': return { icon: '📅', color: 'bg-gray-50 border-gray-200 text-gray-800' };
    case 'Am Spielen': return { icon: '⏳', color: 'bg-yellow-50 border-yellow-200 text-yellow-800' };
    case 'Gespielt': return { icon: '✅', color: 'bg-green-50 border-green-200 text-green-800' };
    default: return { icon: '📅', color: 'bg-gray-50 border-gray-200 text-gray-800' };
  }
};

export const Events: React.FC = () => {
  const { events } = useEvents();
  const { getPlayer } = usePlayers();
  const { getEventAttendees } = useAttendance();
  const [selectedEvent, setSelectedEvent] = useState<AppEvent | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'Interclub' | 'Training' | 'Spirit'>('all');

  const filteredEvents = useMemo(() => {
    const filtered = activeTab === 'all' ? events : events.filter(e => e.type === activeTab);
    // Sort ascending: oldest first, newest last
    return [...filtered].sort((a, b) => getEventStartDate(a).getTime() - getEventStartDate(b).getTime());
  }, [events, activeTab]);

  // Find the next upcoming event (first event whose start is in the future)
  const nextEventId = useMemo(() => {
    const now = new Date().getTime();
    const upcoming = filteredEvents.find(e => getEventStartDate(e).getTime() > now);
    return upcoming?.id || null;
  }, [filteredEvents]);

  const eventAttendees = selectedEvent ? getEventAttendees(selectedEvent.id) : [];

  return (
    <>
      <PageTitle>Events</PageTitle>

      {/* Tab Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['all', 'Interclub', 'Training', 'Spirit'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === tab
                ? 'bg-chnebel-red text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab === 'all' ? '📋 Alle' : `${getEventTypeIcon(tab)} ${tab}`}
          </button>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="w-full border-collapse bg-white rounded-lg shadow-sm overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-chnebel-red to-[#c4161e] text-white">
              <th className="px-6 py-4 text-left font-semibold">Datum</th>
              <th className="px-6 py-4 text-left font-semibold">Event</th>
              <th className="px-6 py-4 text-left font-semibold">Ort</th>
              <th className="px-6 py-4 text-left font-semibold">Status</th>
              {activeTab === 'all' || activeTab === 'Interclub' ? (
                <th className="px-6 py-4 text-left font-semibold">Score</th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event) => {
              const status = deriveEventStatus(event);
              const statusBadge = getStatusBadge(status);
              const isNext = event.id === nextEventId;
              return (
                <tr
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className={`border-b border-gray-200 transition-colors cursor-pointer ${
                    isNext
                      ? 'bg-chnebel-red/10 border-l-4 border-l-chnebel-red hover:bg-chnebel-red/20 font-semibold'
                      : 'hover:bg-chnebel-gray/50'
                  }`}
                >
                  <td className="px-6 py-4 text-chnebel-black">{formatEventDateDisplay(event)}</td>
                  <td className="px-6 py-4 text-chnebel-black font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getEventTypeIcon(event.type)}</span>
                      {event.title}
                      {isNext && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-chnebel-red text-white uppercase tracking-wide">
                          Next
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-chnebel-black">{event.location || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.color}`}>
                      {statusBadge.text}
                    </span>
                  </td>
                  {(activeTab === 'all' || activeTab === 'Interclub') && (
                    <td className="px-6 py-4">
                      {event.interclub ? (
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(event.interclub.totalScore.ourScore, event.interclub.totalScore.opponentScore)}`}>
                          {event.interclub.totalScore.ourScore}:{event.interclub.totalScore.opponentScore}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
            {filteredEvents.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Keine Events in dieser Saison
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filteredEvents.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
            Keine Events in dieser Saison
          </div>
        )}
        {filteredEvents.map((event) => {
          const status = deriveEventStatus(event);
          const statusBadge = getStatusBadge(status);
          const isNext = event.id === nextEventId;
          return (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className={`bg-white rounded-lg shadow-sm border-2 p-4 cursor-pointer active:scale-[0.98] transition-all ${
                isNext ? 'border-chnebel-red bg-chnebel-red/5' : 'border-gray-200'
              }`}
            >
              {/* Row 1: Icon + Name */}
              <div className="flex items-center gap-2 min-w-0 mb-1">
                <span className="text-xl flex-shrink-0">{getEventTypeIcon(event.type)}</span>
                <span className="font-medium text-chnebel-black truncate">{event.title}</span>
                {isNext && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-chnebel-red text-white uppercase tracking-wide flex-shrink-0">
                    Next
                  </span>
                )}
              </div>
              {/* Row 2: Date + Status */}
              <div className="flex items-center justify-between gap-2 mb-1 text-sm text-gray-600">
                <span>{formatEventDateDisplay(event)}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${statusBadge.color}`}>
                  {statusBadge.text}
                </span>
              </div>
              {/* Row 3: Location + Score */}
              <div className="flex items-center justify-between gap-2 text-sm text-gray-600">
                <span>{event.location ? `📍 ${event.location}` : ''}</span>
                {event.interclub ? (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getScoreColor(event.interclub.totalScore.ourScore, event.interclub.totalScore.opponentScore)}`}>
                    {event.interclub.totalScore.ourScore}:{event.interclub.totalScore.opponentScore}
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-chnebel-red to-[#c4161e] text-white p-6 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-white/80 mb-1">{getEventTypeIcon(selectedEvent.type)} {selectedEvent.type}</div>
                  <h2 className="text-2xl font-bold mb-2">{selectedEvent.title}</h2>
                  <div className="flex items-center gap-4 text-white/90 text-sm">
                    <span>📅 {formatEventDateDisplay(selectedEvent)}</span>
                    {selectedEvent.location && <span>📍 {selectedEvent.location}</span>}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                  aria-label="Schliessen"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Interclub-specific content */}
              {selectedEvent.interclub && (
                <>
                  {/* Match Status */}
                  <section className="mb-6">
                    <div className="bg-chnebel-red px-4 py-2 rounded-lg mb-3">
                      <h3 className="text-sm font-bold text-white tracking-wide">Match Status</h3>
                    </div>
                    {(() => {
                      const ms = getMatchStatusBadge(selectedEvent.interclub!.matchStatus);
                      return (
                        <div className={`px-4 py-3 rounded-lg border-2 ${ms.color}`}>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{ms.icon}</span>
                            <span className="font-semibold">{selectedEvent.interclub!.matchStatus}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </section>

                  {/* Total Score */}
                  {selectedEvent.interclub.matchStatus !== 'Offen' && (
                    <section className="mb-6">
                      <div className="bg-chnebel-red px-4 py-2 rounded-lg mb-3">
                        <h3 className="text-sm font-bold text-white tracking-wide">Gesamtscore</h3>
                      </div>
                      <div className="bg-chnebel-gray rounded-lg p-4">
                        <div className="flex items-center justify-center gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-chnebel-black">Chnebel Gemscheni</div>
                            <div className={`text-5xl font-bold mt-2 ${selectedEvent.interclub.totalScore.ourScore > selectedEvent.interclub.totalScore.opponentScore ? 'text-green-600' : selectedEvent.interclub.totalScore.ourScore < selectedEvent.interclub.totalScore.opponentScore ? 'text-red-600' : 'text-gray-600'}`}>
                              {selectedEvent.interclub.totalScore.ourScore}
                            </div>
                          </div>
                          <div className="text-3xl font-bold text-gray-400">:</div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-chnebel-black">{selectedEvent.interclub.opponent}</div>
                            <div className={`text-5xl font-bold mt-2 ${selectedEvent.interclub.totalScore.opponentScore > selectedEvent.interclub.totalScore.ourScore ? 'text-green-600' : selectedEvent.interclub.totalScore.opponentScore < selectedEvent.interclub.totalScore.ourScore ? 'text-red-600' : 'text-gray-600'}`}>
                              {selectedEvent.interclub.totalScore.opponentScore}
                            </div>
                          </div>
                        </div>
                        <div className="text-center text-sm text-gray-600 mt-3">
                          Maximum: 9 Punkte (6 Einzel, 3 Doppel)
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Singles Results */}
                  {selectedEvent.interclub.matchStatus !== 'Offen' && (
                    <section className="mb-6">
                      <div className="bg-chnebel-red px-4 py-2 rounded-lg mb-3">
                        <h3 className="text-sm font-bold text-white tracking-wide">Einzelspiele</h3>
                      </div>
                      <div className="space-y-2">
                        {selectedEvent.interclub.singlesGames.map(game => {
                          if (!game.playerId || !game.set1) return null;
                          const player = getPlayer(game.playerId);
                          const winner = calculateGameWinner(game);
                          return (
                            <div key={game.gameNumber} className="flex items-center gap-3 p-3 bg-chnebel-gray rounded-lg">
                              <span className="font-semibold text-sm w-6">{game.gameNumber}.</span>
                              <span className="flex-1 font-medium">{player?.name || 'Unbekannt'}</span>
                              <span className={`text-sm font-semibold ${winner === 'our' ? 'text-green-600' : winner === 'opponent' ? 'text-red-600' : 'text-gray-500'}`}>
                                {winner === 'our' ? '✅' : winner === 'opponent' ? '❌' : '-'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  {/* Doubles Results */}
                  {selectedEvent.interclub.matchStatus !== 'Offen' && (
                    <section className="mb-6">
                      <div className="bg-chnebel-red px-4 py-2 rounded-lg mb-3">
                        <h3 className="text-sm font-bold text-white tracking-wide">Doppelspiele</h3>
                      </div>
                      <div className="space-y-2">
                        {selectedEvent.interclub.doublesGames.map(game => {
                          if (!game.player1Id || !game.player2Id || !game.set1) return null;
                          const p1 = getPlayer(game.player1Id);
                          const p2 = getPlayer(game.player2Id);
                          const winner = calculateGameWinner(game);
                          return (
                            <div key={game.gameNumber} className="flex items-center gap-3 p-3 bg-chnebel-gray rounded-lg">
                              <span className="font-semibold text-sm w-6">{game.gameNumber}.</span>
                              <span className="flex-1 font-medium">{p1?.name || '?'} / {p2?.name || '?'}</span>
                              <span className={`text-sm font-semibold ${winner === 'our' ? 'text-green-600' : winner === 'opponent' ? 'text-red-600' : 'text-gray-500'}`}>
                                {winner === 'our' ? '✅' : winner === 'opponent' ? '❌' : '-'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  )}

                </>
              )}

              {/* Instagram Link (all event types) */}
              {selectedEvent.instagramLink && (
                <section className="mb-6">
                  <a
                    href={selectedEvent.instagramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    📸 Event Recap auf Instagram
                  </a>
                </section>
              )}

              {/* Attendance (all event types) */}
              <section>
                <div className="bg-chnebel-red px-4 py-2 rounded-lg mb-3">
                  <h3 className="text-sm font-bold text-white tracking-wide">Anwesende ({eventAttendees.length})</h3>
                </div>
                {eventAttendees.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {eventAttendees.map(att => {
                      const player = getPlayer(att.playerId);
                      if (!player) return null;
                      return (
                        <span
                          key={att.id}
                          className="px-3 py-1.5 bg-chnebel-gray rounded-full text-sm font-medium text-chnebel-black"
                        >
                          {player.name}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-chnebel-gray rounded-lg p-4 text-center text-gray-500">
                    Noch keine Anwesenheit eingetragen
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
