import React, { useState } from 'react';
import { PageTitle } from '../components/PageTitle';
import { usePlayers } from '../contexts/PlayersContext';
import { useEvents, InterclubEvent } from '../contexts/EventsContext';

interface TrainingEvent {
  datum: string;
  zeit: string;
  ort: string;
}

export const Events: React.FC = () => {
  const { players } = usePlayers();
  const { events } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<InterclubEvent | null>(null);

  const interclubEvents = events;

  const getScoreColor = (score?: string) => {
    if (!score) return 'text-gray-600 bg-gray-100';
    
    const [ourScore, opponentScore] = score.split(':').map(Number);
    if (ourScore > opponentScore) {
      return 'text-green-800 bg-green-100';
    } else if (ourScore < opponentScore) {
      return 'text-red-800 bg-red-100';
    } else {
      return 'text-gray-600 bg-gray-100';
    }
  };

  const trainingEvents: TrainingEvent[] = [
    { datum: '08.01.2024', zeit: '18:00 - 20:00', ort: 'Halle A' },
    { datum: '10.01.2024', zeit: '19:00 - 21:00', ort: 'Halle B' },
    { datum: '15.01.2024', zeit: '18:00 - 20:00', ort: 'Halle A' },
    { datum: '17.01.2024', zeit: '19:00 - 21:00', ort: 'Halle B' },
    { datum: '22.01.2024', zeit: '18:00 - 20:00', ort: 'Halle A' },
  ];

  return (
    <>
      <PageTitle>Events</PageTitle>

      {/* Interclub Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-chnebel-black mb-6 flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          Interclub
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg shadow-sm overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-chnebel-red to-[#c4161e] text-white">
                <th className="px-6 py-4 text-left font-semibold">Datum</th>
                <th className="px-6 py-4 text-left font-semibold">Ort</th>
                <th className="px-6 py-4 text-left font-semibold">Gegner</th>
                <th className="px-6 py-4 text-left font-semibold">Score</th>
              </tr>
            </thead>
            <tbody>
              {interclubEvents.map((event, index) => (
                <tr
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className={`border-b border-gray-200 hover:bg-chnebel-gray/50 transition-colors cursor-pointer ${
                    index === interclubEvents.length - 1 ? '' : 'border-b'
                  }`}
                >
                  <td className="px-6 py-4 text-chnebel-black font-medium">{event.datum}</td>
                  <td className="px-6 py-4 text-chnebel-black">{event.ort}</td>
                  <td className="px-6 py-4 text-chnebel-black">{event.gegner}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(event.score)}`}>
                      {event.score || '-'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Training Section */}
      <section>
        <h2 className="text-2xl font-semibold text-chnebel-black mb-6 flex items-center gap-2">
          <span className="text-2xl">🏃</span>
          Training
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg shadow-sm overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-chnebel-red to-[#c4161e] text-white">
                <th className="px-6 py-4 text-left font-semibold">Datum</th>
                <th className="px-6 py-4 text-left font-semibold">Zeit</th>
                <th className="px-6 py-4 text-left font-semibold">Ort</th>
              </tr>
            </thead>
            <tbody>
              {trainingEvents.map((event, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-200 hover:bg-chnebel-gray/50 transition-colors ${
                    index === trainingEvents.length - 1 ? '' : 'border-b'
                  }`}
                >
                  <td className="px-6 py-4 text-chnebel-black font-medium">{event.datum}</td>
                  <td className="px-6 py-4 text-chnebel-black">{event.zeit}</td>
                  <td className="px-6 py-4 text-chnebel-black">{event.ort}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Interclub Event Detail Modal */}
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
                  <h2 className="text-2xl font-bold mb-2">{selectedEvent.gegner}</h2>
                  <div className="flex items-center gap-4 text-white/90">
                    <span>📅 {selectedEvent.datum}</span>
                    <span>📍 {selectedEvent.ort}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Match Status */}
              <section className="mb-6">
                <h3 className="text-xl font-semibold text-chnebel-black mb-3">Match Status</h3>
                    <div className={`px-4 py-3 rounded-lg ${
                      selectedEvent.status === 'Gespielt' ? 'bg-green-50 border-2 border-green-200' :
                      selectedEvent.status === 'Am Spielen' ? 'bg-yellow-50 border-2 border-yellow-200' :
                      'bg-gray-50 border-2 border-gray-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">
                          {selectedEvent.status === 'Gespielt' ? '✅' : selectedEvent.status === 'Am Spielen' ? '⏳' : '📅'}
                        </span>
                        <span className={`font-semibold ${
                          selectedEvent.status === 'Gespielt' ? 'text-green-800' :
                          selectedEvent.status === 'Am Spielen' ? 'text-yellow-800' :
                          'text-gray-800'
                        }`}>
                          {selectedEvent.status === 'Gespielt' ? 'Bereits gespielt' :
                           selectedEvent.status === 'Am Spielen' ? 'Am Spielen' :
                           'Offen'}
                        </span>
                      </div>
                    </div>
              </section>

                  {/* Total Score */}
                  {selectedEvent.status !== 'Offen' && (
                <section className="mb-6">
                  <h3 className="text-xl font-semibold text-chnebel-black mb-3">Gesamtscore</h3>
                  <div className="bg-chnebel-gray rounded-lg p-4">
                    <div className="flex items-center justify-center gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-chnebel-black">Chnebel Gemscheni</div>
                        <div className={`text-5xl font-bold mt-2 ${selectedEvent.totalScore.ourScore > selectedEvent.totalScore.opponentScore ? 'text-green-600' : selectedEvent.totalScore.ourScore < selectedEvent.totalScore.opponentScore ? 'text-red-600' : 'text-gray-600'}`}>
                          {selectedEvent.totalScore.ourScore}
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-400">:</div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-chnebel-black">{selectedEvent.gegner}</div>
                        <div className={`text-5xl font-bold mt-2 ${selectedEvent.totalScore.opponentScore > selectedEvent.totalScore.ourScore ? 'text-green-600' : selectedEvent.totalScore.opponentScore < selectedEvent.totalScore.ourScore ? 'text-red-600' : 'text-gray-600'}`}>
                          {selectedEvent.totalScore.opponentScore}
                        </div>
                      </div>
                    </div>
                    <div className="text-center text-sm text-gray-600 mt-3">
                      Maximum: 9 Punkte (6 Einzel, 3 Doppel)
                    </div>
                  </div>
                </section>
              )}

              {/* Attendees */}
              <section>
                <h3 className="text-xl font-semibold text-chnebel-black mb-3">
                  Teilnehmende Spieler ({selectedEvent.attendees.length})
                </h3>
                {selectedEvent.attendees.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-chnebel-gray border-b border-gray-300">
                          <th className="px-3 py-2 text-left text-sm font-semibold text-chnebel-black">Spieler</th>
                          <th className="px-3 py-2 text-center text-sm font-semibold text-chnebel-black">Einzel</th>
                          <th className="px-3 py-2 text-center text-sm font-semibold text-chnebel-black">Doppel</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEvent.attendees.map((attendee) => {
                          const player = players.find(p => p.id === attendee.playerId);
                          if (!player) return null;
                          
                          return (
                            <tr key={attendee.playerId} className="border-b border-gray-200 hover:bg-chnebel-gray/50">
                              <td className="px-3 py-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-chnebel-black text-sm">{player.name}</span>
                                  {player.alias && (
                                    <span className="text-xs text-gray-500 italic">"{player.alias}"</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-3 py-2 text-center">
                                {attendee.singlesPlayed === 1 ? (
                                  <span className={`text-sm font-semibold ${attendee.singlesWon === 1 ? 'text-green-600' : 'text-red-600'}`}>
                                    {attendee.singlesWon === 1 ? '✅' : '❌'}
                                  </span>
                                ) : (
                                  <span className="text-xs text-gray-400">-</span>
                                )}
                              </td>
                              <td className="px-3 py-2 text-center">
                                {attendee.doublesPlayed === 1 ? (
                                  <span className={`text-sm font-semibold ${attendee.doublesWon === 1 ? 'text-green-600' : 'text-red-600'}`}>
                                    {attendee.doublesWon === 1 ? '✅' : '❌'}
                                  </span>
                                ) : (
                                  <span className="text-xs text-gray-400">-</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-chnebel-gray rounded-lg p-4 text-center text-gray-500">
                    Noch keine Teilnehmer eingetragen
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

