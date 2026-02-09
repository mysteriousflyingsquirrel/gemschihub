import React, { useState } from 'react';
import { PageTitle } from '../components/PageTitle';
import { useSeasons } from '../contexts/SeasonsContext';
import { useEvents } from '../contexts/EventsContext';
import { usePlayers } from '../contexts/PlayersContext';
import { useAttendance } from '../contexts/AttendanceContext';
import { useSpirit } from '../contexts/SpiritContext';
import { useInfo } from '../contexts/InfoContext';
import { useAuth } from '../contexts/AuthContext';
import { AppEvent, EventType, SinglesGame, DoublesGame, createEmptySinglesGames, createEmptyDoublesGames } from '../types/event';
import { Gemschigrad, Klassierung, PlayerRole } from '../types/player';

const gemschigrads: Gemschigrad[] = ['Ehrengemschi', 'Kuttengemschi', 'Bandanagemschi', 'Gitzi'];
const klassierungen: Klassierung[] = ['N1', 'N2', 'N3', 'N4', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9'];
const playerRoles: PlayerRole[] = ['Spieler', 'Captain', 'CEO of Patchio'];
const eventTypes: EventType[] = ['Training', 'Interclub', 'Spirit'];

const CollapsibleSection: React.FC<{ title: string; icon: string; children: React.ReactNode }> = ({ title, icon, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <section className="bg-white rounded-lg p-6 shadow-sm">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between text-left mb-4">
        <h2 className="text-2xl font-semibold text-chnebel-black flex items-center gap-2">
          <span className="text-2xl">{icon}</span> {title}
        </h2>
        <svg className={`w-6 h-6 text-chnebel-black transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        {children}
      </div>
    </section>
  );
};

export const Admin: React.FC = () => {
  const { isAdmin } = useAuth();
  const { seasons, addSeason, setActiveSeason, removeSeason, selectedSeasonId } = useSeasons();
  const { events, addEvent, updateEvent, removeEvent } = useEvents();
  const { players, addPlayer, removePlayer } = usePlayers();
  const { getEventAttendees, setEventAttendance } = useAttendance();
  const { spirit, setPlayerSpirit } = useSpirit();
  const { tenueData, addTenueItem, updateTenueItem, removeTenueItem } = useInfo();

  // --- Season form ---
  const [newSeasonName, setNewSeasonName] = useState('');

  // --- Event form ---
  const [newEventType, setNewEventType] = useState<EventType>('Training');
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('18:00');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventOpponent, setNewEventOpponent] = useState('');

  // --- Player form ---
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerAlias, setNewPlayerAlias] = useState('');
  const [newPlayerRole, setNewPlayerRole] = useState<PlayerRole>('Spieler');
  const [newPlayerGrad, setNewPlayerGrad] = useState<Gemschigrad>('Gitzi');
  const [newPlayerKlass, setNewPlayerKlass] = useState<Klassierung>('R9');
  // --- Attendance modal ---
  const [attendanceEventId, setAttendanceEventId] = useState<string | null>(null);
  const [attendanceSelection, setAttendanceSelection] = useState<string[]>([]);

  // --- Results modal ---
  const [resultsEvent, setResultsEvent] = useState<AppEvent | null>(null);
  const [resultsStep, setResultsStep] = useState<1 | 2 | 3>(1);
  const [resultsSingles, setResultsSingles] = useState<SinglesGame[]>([]);
  const [resultsDoubles, setResultsDoubles] = useState<DoublesGame[]>([]);

  // --- Tenue editing ---
  const [editingTenue, setEditingTenue] = useState<{ grad: Gemschigrad; id: string } | null>(null);
  const [newTenueText, setNewTenueText] = useState<Record<string, string>>({});

  if (!isAdmin) {
    return <div className="p-8 text-center text-gray-500">Kein Zugriff. Bitte als Captain anmelden.</div>;
  }

  // --- Handlers ---
  const handleAddSeason = () => {
    if (!newSeasonName.trim()) return;
    addSeason(newSeasonName.trim());
    setNewSeasonName('');
  };

  const isEventFormValid = () => {
    if (!newEventTitle.trim() || !newEventDate || !newEventTime || !newEventLocation.trim() || !selectedSeasonId) return false;
    if (newEventType === 'Interclub' && !newEventOpponent.trim()) return false;
    return true;
  };

  const handleAddEvent = () => {
    if (!isEventFormValid()) return;
    const startDateTime = new Date(`${newEventDate}T${newEventTime}`).toISOString();
    const eventData: Omit<AppEvent, 'id'> = {
      seasonId: selectedSeasonId!,
      type: newEventType,
      title: newEventTitle.trim(),
      startDateTime,
      location: newEventLocation.trim(),
    };
    if (newEventType === 'Interclub') {
      eventData.interclub = {
        opponent: newEventOpponent.trim(),
        matchStatus: 'Offen',
        singlesGames: createEmptySinglesGames(),
        doublesGames: createEmptyDoublesGames(),
        totalScore: { ourScore: 0, opponentScore: 0 },
      };
    }
    addEvent(eventData);
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventLocation('');
    setNewEventOpponent('');
  };

  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) return;
    addPlayer({
      name: newPlayerName.trim(),
      alias: newPlayerAlias.trim() || undefined,
      role: newPlayerRole,
      gemschigrad: newPlayerGrad,
      klassierung: newPlayerKlass,
    });
    setNewPlayerName('');
    setNewPlayerAlias('');
    setNewPlayerRole('Spieler');
    setNewPlayerGrad('Gitzi');
    setNewPlayerKlass('R9');
  };

  const openAttendanceModal = (eventId: string) => {
    const existing = getEventAttendees(eventId).map(a => a.playerId);
    setAttendanceSelection(existing);
    setAttendanceEventId(eventId);
  };

  const saveAttendance = () => {
    if (!attendanceEventId || !selectedSeasonId) return;
    setEventAttendance(attendanceEventId, selectedSeasonId, attendanceSelection);
    setAttendanceEventId(null);
  };

  const openResultsModal = (event: AppEvent) => {
    setResultsEvent(event);
    setResultsStep(1);
    setResultsSingles(event.interclub?.singlesGames ? [...event.interclub.singlesGames] : createEmptySinglesGames());
    setResultsDoubles(event.interclub?.doublesGames ? [...event.interclub.doublesGames] : createEmptyDoublesGames());
  };

  const saveResults = () => {
    if (!resultsEvent?.interclub) return;
    updateEvent(resultsEvent.id, {
      interclub: {
        ...resultsEvent.interclub,
        singlesGames: resultsSingles,
        doublesGames: resultsDoubles,
      },
    });
    setResultsEvent(null);
  };

  return (
    <>
      <PageTitle>Admin</PageTitle>
      <div className="space-y-8">

        {/* === SEASONS === */}
        <CollapsibleSection title="Saisons verwalten" icon="📆">
          <div className="flex gap-2 mb-4">
            <input type="text" value={newSeasonName} onChange={e => setNewSeasonName(e.target.value)} placeholder="Neue Saison (z.B. Interclub 2025/2026)" className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-chnebel-red" />
            <button onClick={handleAddSeason} disabled={!newSeasonName.trim()} className="px-4 py-2 bg-chnebel-red text-white rounded font-semibold hover:bg-[#c4161e] disabled:opacity-50">+ Hinzufügen</button>
          </div>
          <div className="space-y-2">
            {seasons.map(s => (
              <div key={s.id} className="flex items-center gap-3 p-3 bg-chnebel-gray rounded-lg">
                <span className="flex-1 font-medium">{s.name}</span>
                {s.isActive ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Aktiv</span>
                ) : (
                  <button onClick={() => setActiveSeason(s.id)} className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold hover:bg-blue-200">Aktivieren</button>
                )}
                {!s.isActive && (
                  <button onClick={() => { if (window.confirm(`Saison "${s.name}" löschen?`)) removeSeason(s.id); }} className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600">🗑️</button>
                )}
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* === EVENTS === */}
        <CollapsibleSection title="Events verwalten" icon="📅">
          <div className="bg-chnebel-gray rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-4">Neues Event</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Typ</label>
                <select value={newEventType} onChange={e => setNewEventType(e.target.value as EventType)} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-chnebel-red">
                  {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titel *</label>
                <input type="text" value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)} placeholder="Event-Titel" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-chnebel-red" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Datum *</label>
                <input type="date" value={newEventDate} onChange={e => setNewEventDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-chnebel-red" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Uhrzeit *</label>
                <input type="time" value={newEventTime} onChange={e => setNewEventTime(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-chnebel-red" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ort *</label>
                <input type="text" value={newEventLocation} onChange={e => setNewEventLocation(e.target.value)} placeholder="Ort" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-chnebel-red" />
              </div>
              {newEventType === 'Interclub' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gegner *</label>
                  <input type="text" value={newEventOpponent} onChange={e => setNewEventOpponent(e.target.value)} placeholder="Gegner" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-chnebel-red" />
                </div>
              )}
              <div className="md:col-span-2">
                <button onClick={handleAddEvent} disabled={!isEventFormValid()} className="w-full px-4 py-2 bg-chnebel-red text-white rounded font-semibold hover:bg-[#c4161e] disabled:opacity-50">+ Event hinzufügen</button>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {events.map(event => (
              <div key={event.id} className="flex items-center gap-3 p-4 bg-chnebel-gray rounded-lg border border-gray-200">
                <div className="flex-1">
                  <div className="font-medium text-chnebel-black">{event.title}</div>
                  <div className="text-sm text-gray-500">{event.type} · {new Date(event.startDateTime).toLocaleDateString('de-CH')} · {event.location || '-'}</div>
                  {event.interclub && <div className="text-sm text-gray-500">vs. {event.interclub.opponent} · {event.interclub.matchStatus} · {event.interclub.totalScore.ourScore}:{event.interclub.totalScore.opponentScore}</div>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openAttendanceModal(event.id)} className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600" title="Anwesenheit">👥</button>
                  {event.interclub && (
                    <button onClick={() => openResultsModal(event)} className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600" title="Ergebnisse">📊</button>
                  )}
                  {event.interclub && (
                    <button
                      onClick={() => {
                        const link = prompt('Instagram Link:', event.interclub?.instagramLink || '');
                        if (link !== null && event.interclub) {
                          updateEvent(event.id, { interclub: { ...event.interclub, instagramLink: link || undefined } });
                        }
                      }}
                      className="px-3 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600"
                      title="Instagram Link"
                    >📸</button>
                  )}
                  <button onClick={() => { if (window.confirm(`Event "${event.title}" löschen?`)) removeEvent(event.id); }} className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600" title="Löschen">🗑️</button>
                </div>
              </div>
            ))}
            {events.length === 0 && <div className="text-gray-500 text-center py-4">Keine Events in dieser Saison</div>}
          </div>
        </CollapsibleSection>

        {/* === PLAYERS === */}
        <CollapsibleSection title="Spieler verwalten" icon="👥">
          <div className="bg-chnebel-gray rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-4">Neuen Spieler hinzufügen</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" value={newPlayerName} onChange={e => setNewPlayerName(e.target.value)} placeholder="Name" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-chnebel-red" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alias</label>
                <input type="text" value={newPlayerAlias} onChange={e => setNewPlayerAlias(e.target.value)} placeholder="Alias (optional)" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-chnebel-red" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rolle</label>
                <select value={newPlayerRole} onChange={e => setNewPlayerRole(e.target.value as PlayerRole)} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-chnebel-red">
                  {playerRoles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gemschigrad</label>
                <select value={newPlayerGrad} onChange={e => setNewPlayerGrad(e.target.value as Gemschigrad)} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-chnebel-red">
                  {gemschigrads.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Klassierung</label>
                <select value={newPlayerKlass} onChange={e => setNewPlayerKlass(e.target.value as Klassierung)} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-chnebel-red">
                  {klassierungen.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <button onClick={handleAddPlayer} disabled={!newPlayerName.trim()} className="w-full px-4 py-2 bg-chnebel-red text-white rounded font-semibold hover:bg-[#c4161e] disabled:opacity-50">+ Spieler hinzufügen</button>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {players.map(player => (
              <div key={player.id} className="flex items-center gap-3 p-4 bg-chnebel-gray rounded-lg border border-gray-200">
                <div className="flex-1">
                  <div className="font-medium text-chnebel-black">{player.name} {player.alias && <span className="text-gray-500 italic text-sm">"{player.alias}"</span>}</div>
                  <div className="text-sm text-gray-500">{player.role} · {player.gemschigrad} · {player.klassierung}</div>
                </div>
                <button onClick={() => { if (window.confirm(`Spieler "${player.name}" entfernen?`)) removePlayer(player.id); }} className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600">🗑️</button>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* === SPIRIT === */}
        <CollapsibleSection title="Spirit verwalten" icon="✨">
          {selectedSeasonId ? (
            <div className="space-y-3">
              {players.map(player => {
                const sv = spirit.find(s => s.playerId === player.id)?.value ?? 0;
                return (
                  <div key={player.id} className="flex items-center gap-4 p-3 bg-chnebel-gray rounded-lg">
                    <span className="font-medium flex-1">{player.name}</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sv}
                      onChange={e => setPlayerSpirit(player.id, selectedSeasonId, parseInt(e.target.value))}
                      className="w-32"
                    />
                    <span className="w-12 text-right font-semibold text-sm">{sv}%</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-4">Bitte eine Saison auswählen</div>
          )}
        </CollapsibleSection>

        {/* === TENUE === */}
        <CollapsibleSection title="Tenue verwalten" icon="👕">
          <div className="space-y-6">
            {gemschigrads.map(grad => (
              <div key={grad}>
                <h3 className="font-semibold text-lg mb-3">{grad}</h3>
                <div className="space-y-2 mb-3">
                  {tenueData[grad].map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-chnebel-gray rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-chnebel-red flex items-center justify-center text-white font-semibold text-sm">{item.order}</div>
                      {editingTenue?.grad === grad && editingTenue?.id === item.id ? (
                        <input
                          type="text"
                          defaultValue={item.text}
                          onBlur={e => { updateTenueItem(grad, item.id, e.target.value); setEditingTenue(null); }}
                          onKeyDown={e => { if (e.key === 'Enter') { updateTenueItem(grad, item.id, e.currentTarget.value); setEditingTenue(null); } if (e.key === 'Escape') setEditingTenue(null); }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                          autoFocus
                        />
                      ) : (
                        <span className="flex-1 cursor-pointer" onClick={() => setEditingTenue({ grad, id: item.id })}>{item.text}</span>
                      )}
                      <button onClick={() => { if (window.confirm('Löschen?')) removeTenueItem(grad, item.id); }} className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600">🗑️</button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTenueText[grad] || ''}
                    onChange={e => setNewTenueText({ ...newTenueText, [grad]: e.target.value })}
                    onKeyDown={e => { if (e.key === 'Enter' && newTenueText[grad]?.trim()) { addTenueItem(grad, newTenueText[grad].trim()); setNewTenueText({ ...newTenueText, [grad]: '' }); } }}
                    placeholder="Neues Item..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-chnebel-red"
                  />
                  <button
                    onClick={() => { if (newTenueText[grad]?.trim()) { addTenueItem(grad, newTenueText[grad].trim()); setNewTenueText({ ...newTenueText, [grad]: '' }); } }}
                    className="px-4 py-2 bg-chnebel-red text-white rounded font-semibold hover:bg-[#c4161e]"
                  >+</button>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      </div>

      {/* === ATTENDANCE MODAL === */}
      {attendanceEventId && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={() => setAttendanceEventId(null)}>
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-chnebel-red to-[#c4161e] text-white p-4 rounded-t-lg flex items-center justify-between">
              <h2 className="text-xl font-bold">Anwesenheit bearbeiten</h2>
              <button onClick={() => setAttendanceEventId(null)} className="text-white hover:bg-white/20 rounded-full p-1">✕</button>
            </div>
            <div className="p-4 space-y-2">
              {players.map(p => (
                <label key={p.id} className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer ${attendanceSelection.includes(p.id) ? 'border-chnebel-red bg-red-50' : 'border-gray-200'}`}>
                  <input type="checkbox" checked={attendanceSelection.includes(p.id)} onChange={e => { if (e.target.checked) setAttendanceSelection([...attendanceSelection, p.id]); else setAttendanceSelection(attendanceSelection.filter(id => id !== p.id)); }} className="w-5 h-5" />
                  <span className="font-medium">{p.name}</span>
                </label>
              ))}
            </div>
            <div className="p-4 border-t flex justify-end">
              <button onClick={saveAttendance} className="px-6 py-2 bg-chnebel-red text-white rounded font-semibold hover:bg-[#c4161e]">Speichern</button>
            </div>
          </div>
        </div>
      )}

      {/* === RESULTS MODAL (Interclub) === */}
      {resultsEvent && resultsEvent.interclub && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={() => setResultsEvent(null)}>
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-chnebel-red to-[#c4161e] text-white p-6 rounded-t-lg sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Ergebnisse: {resultsEvent.interclub!.opponent}</h2>
                  <div className="text-white/80 text-sm mt-1">
                    {new Date(resultsEvent.startDateTime).toLocaleDateString('de-CH')} · {resultsEvent.location}
                  </div>
                </div>
                <button onClick={() => setResultsEvent(null)} className="text-white hover:bg-white/20 rounded-full p-2">✕</button>
              </div>
              <div className="flex gap-2 mt-4">
                {[1, 2, 3].map(s => (
                  <div key={s} className={`flex-1 h-2 rounded ${resultsStep >= s ? 'bg-white' : 'bg-white/30'}`} />
                ))}
              </div>
            </div>

            <div className="p-6">
              {/* Step 1: Info */}
              {resultsStep === 1 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Schritt 1: Übersicht</h3>
                  <p className="text-gray-600 mb-4">Im nächsten Schritt können Sie die Einzelspiele (1-6) eingeben, danach die Doppelspiele (7-9).</p>
                  <p className="text-gray-600">Nur Spieler, die als anwesend markiert sind, können zugewiesen werden. Bitte stellen Sie sicher, dass die Anwesenheit korrekt erfasst ist.</p>
                </div>
              )}

              {/* Step 2: Singles */}
              {resultsStep === 2 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Einzelspiele (1-6)</h3>
                  <div className="space-y-4">
                    {resultsSingles.map((game, idx) => {
                      const attendees = getEventAttendees(resultsEvent.id);
                      return (
                        <div key={game.gameNumber} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold mb-3">Spiel {game.gameNumber}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Spieler</label>
                              <select value={game.playerId || ''} onChange={e => { const u = [...resultsSingles]; u[idx] = { ...u[idx], playerId: e.target.value || null }; setResultsSingles(u); }} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-chnebel-red">
                                <option value="">-- Spieler --</option>
                                {attendees.map(a => { const p = players.find(pl => pl.id === a.playerId); return p ? <option key={a.playerId} value={a.playerId}>{p.name}</option> : null; })}
                              </select>
                            </div>
                            {[1, 2, 3].map(setNum => (
                              <div key={setNum}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Satz {setNum}</label>
                                <div className="flex items-center gap-2">
                                  <input type="number" min="0" max="30" value={(game as any)[`set${setNum}`]?.ourScore ?? ''} onChange={e => { const u = [...resultsSingles]; const key = `set${setNum}` as 'set1'|'set2'|'set3'; u[idx] = { ...u[idx], [key]: { ourScore: parseInt(e.target.value) || 0, opponentScore: u[idx][key]?.opponentScore || 0 } }; setResultsSingles(u); }} className="w-full px-2 py-1 border border-gray-300 rounded text-sm" placeholder="0" />
                                  <span className="text-gray-400">:</span>
                                  <input type="number" min="0" max="30" value={(game as any)[`set${setNum}`]?.opponentScore ?? ''} onChange={e => { const u = [...resultsSingles]; const key = `set${setNum}` as 'set1'|'set2'|'set3'; u[idx] = { ...u[idx], [key]: { ourScore: u[idx][key]?.ourScore || 0, opponentScore: parseInt(e.target.value) || 0 } }; setResultsSingles(u); }} className="w-full px-2 py-1 border border-gray-300 rounded text-sm" placeholder="0" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Doubles */}
              {resultsStep === 3 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Doppelspiele (7-9)</h3>
                  <div className="space-y-4">
                    {resultsDoubles.map((game, idx) => {
                      const attendees = getEventAttendees(resultsEvent.id);
                      return (
                        <div key={game.gameNumber} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold mb-3">Spiel {game.gameNumber}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Spieler 1</label>
                              <select value={game.player1Id || ''} onChange={e => { const u = [...resultsDoubles]; u[idx] = { ...u[idx], player1Id: e.target.value || null }; setResultsDoubles(u); }} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-chnebel-red">
                                <option value="">-- Spieler --</option>
                                {attendees.map(a => { const p = players.find(pl => pl.id === a.playerId); return p ? <option key={a.playerId} value={a.playerId}>{p.name}</option> : null; })}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Spieler 2</label>
                              <select value={game.player2Id || ''} onChange={e => { const u = [...resultsDoubles]; u[idx] = { ...u[idx], player2Id: e.target.value || null }; setResultsDoubles(u); }} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-chnebel-red">
                                <option value="">-- Spieler --</option>
                                {attendees.map(a => { const p = players.find(pl => pl.id === a.playerId); return p ? <option key={a.playerId} value={a.playerId}>{p.name}</option> : null; })}
                              </select>
                            </div>
                            {[1, 2, 3].map(setNum => (
                              <div key={setNum}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Satz {setNum}</label>
                                <div className="flex items-center gap-2">
                                  <input type="number" min="0" max="30" value={(game as any)[`set${setNum}`]?.ourScore ?? ''} onChange={e => { const u = [...resultsDoubles]; const key = `set${setNum}` as 'set1'|'set2'|'set3'; u[idx] = { ...u[idx], [key]: { ourScore: parseInt(e.target.value) || 0, opponentScore: u[idx][key]?.opponentScore || 0 } }; setResultsDoubles(u); }} className="w-full px-2 py-1 border border-gray-300 rounded text-sm" placeholder="0" />
                                  <span className="text-gray-400">:</span>
                                  <input type="number" min="0" max="30" value={(game as any)[`set${setNum}`]?.opponentScore ?? ''} onChange={e => { const u = [...resultsDoubles]; const key = `set${setNum}` as 'set1'|'set2'|'set3'; u[idx] = { ...u[idx], [key]: { ourScore: u[idx][key]?.ourScore || 0, opponentScore: parseInt(e.target.value) || 0 } }; setResultsDoubles(u); }} className="w-full px-2 py-1 border border-gray-300 rounded text-sm" placeholder="0" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t sticky bottom-0 bg-white">
              <button onClick={resultsStep > 1 ? () => setResultsStep((resultsStep - 1) as 1 | 2 | 3) : () => setResultsEvent(null)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200">
                {resultsStep > 1 ? 'Zurück' : 'Abbrechen'}
              </button>
              {resultsStep < 3 ? (
                <button onClick={() => setResultsStep((resultsStep + 1) as 2 | 3)} className="px-6 py-2 bg-chnebel-red text-white rounded font-semibold hover:bg-[#c4161e]">Weiter</button>
              ) : (
                <button onClick={saveResults} className="px-6 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700">Speichern</button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
