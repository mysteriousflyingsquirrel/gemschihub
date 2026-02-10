import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageTitle } from '../components/PageTitle';
import { SectionTitle } from '../components/SectionTitle';
import { useInfo } from '../contexts/InfoContext';
import { useStatistics } from '../hooks/useStatistics';
import { useSeasons } from '../contexts/SeasonsContext';
import { useEvents } from '../contexts/EventsContext';
import { Gemschigrad } from '../types/player';
import { deriveEventStatus, getEventStartDate, formatEventDateDisplay } from '../types/event';

const getGemschigradColor = (grad: Gemschigrad) => {
  switch (grad) {
    case 'Ehrengemschi': return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900';
    case 'Kuttengemschi': return 'bg-gradient-to-r from-blue-400 to-blue-600 text-blue-900';
    case 'Bandanagemschi': return 'bg-gradient-to-r from-green-400 to-green-600 text-green-900';
    case 'Gitzi': return 'bg-gradient-to-r from-purple-400 to-purple-600 text-purple-900';
  }
};

const getGemschigradBorder = (grad: Gemschigrad) => {
  switch (grad) {
    case 'Ehrengemschi': return 'border-yellow-400';
    case 'Kuttengemschi': return 'border-blue-400';
    case 'Bandanagemschi': return 'border-green-400';
    case 'Gitzi': return 'border-purple-400';
  }
};

const getEventTypeIcon = (type: string) => {
  switch (type) {
    case 'Interclub': return '🏆';
    case 'Training': return '🏃';
    case 'Spirit': return '🎉';
    default: return '📅';
  }
};

/** Countdown hook: returns { days, hours, minutes, seconds } until a target date */
function useCountdown(targetDate: Date) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const diff = Math.max(0, targetDate.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, total: diff };
}

export const Info: React.FC = () => {
  const { tenueData } = useInfo();
  const { teamStats } = useStatistics();
  const { selectedSeason } = useSeasons();
  const { events } = useEvents();
  const gemschigrads: Gemschigrad[] = ['Ehrengemschi', 'Kuttengemschi', 'Bandanagemschi', 'Gitzi'];

  // Find live (ongoing) events
  const liveEvents = useMemo(
    () => events.filter(e => deriveEventStatus(e) === 'Ongoing'),
    [events]
  );

  // Find next upcoming event
  const nextEvent = useMemo(() => {
    const upcoming = events
      .filter(e => deriveEventStatus(e) === 'Upcoming')
      .sort((a, b) => getEventStartDate(a).getTime() - getEventStartDate(b).getTime());
    return upcoming[0] || null;
  }, [events]);

  const nextEventDate = useMemo(
    () => nextEvent ? getEventStartDate(nextEvent) : new Date(),
    [nextEvent]
  );

  const countdown = useCountdown(nextEventDate);

  // Win rate for visual bar
  const totalMatches = teamStats.matchesWon + teamStats.matchesLost + teamStats.matchesDraw;
  const winPct = totalMatches > 0 ? (teamStats.matchesWon / totalMatches) * 100 : 0;
  const lossPct = totalMatches > 0 ? (teamStats.matchesLost / totalMatches) * 100 : 0;
  const drawPct = totalMatches > 0 ? (teamStats.matchesDraw / totalMatches) * 100 : 0;

  return (
    <>
      <PageTitle>Info</PageTitle>
      <div className="space-y-6">

        {/* ── Live Event Banner ── */}
        {liveEvents.length > 0 && (
          <section className="event-live rounded-lg overflow-hidden border-2 bg-green-50">
            {liveEvents.map(event => (
              <Link
                key={event.id}
                to="/events"
                className="block p-4 no-underline hover:bg-green-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl flex-shrink-0">{getEventTypeIcon(event.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-green-800 text-lg">{event.title}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-500 text-white animate-pulse">
                        ● LIVE
                      </span>
                    </div>
                    <div className="text-sm text-green-700 mt-0.5 flex items-center gap-3 flex-wrap">
                      <span>{formatEventDateDisplay(event)}</span>
                      {event.location && <span>📍 {event.location}</span>}
                      {event.interclub && (
                        <span className="font-semibold">
                          Score: {event.interclub.totalScore.ourScore}:{event.interclub.totalScore.opponentScore}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-green-400 text-2xl flex-shrink-0">›</span>
                </div>
              </Link>
            ))}
          </section>
        )}

        {/* ── Next Event Countdown ── */}
        {nextEvent && (
          <section className="bg-white rounded-lg shadow-sm overflow-hidden">
            <SectionTitle>Nächster Event</SectionTitle>
            <Link to="/events" className="block p-6 no-underline hover:bg-chnebel-gray/30 transition-colors">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Countdown boxes */}
                <div className="flex gap-2 flex-shrink-0">
                  {[
                    { value: countdown.days, label: 'Tage' },
                    { value: countdown.hours, label: 'Std' },
                    { value: countdown.minutes, label: 'Min' },
                    { value: countdown.seconds, label: 'Sek' },
                  ].map(({ value, label }) => (
                    <div key={label} className="bg-chnebel-black rounded-lg px-3 py-2 text-center min-w-[3.5rem]">
                      <div className="text-2xl font-bold text-white font-mono tabular-nums">
                        {String(value).padStart(2, '0')}
                      </div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</div>
                    </div>
                  ))}
                </div>
                {/* Event info */}
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <span className="text-xl">{getEventTypeIcon(nextEvent.type)}</span>
                    <span className="font-semibold text-chnebel-black text-lg truncate">{nextEvent.title}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1 flex items-center gap-3 justify-center sm:justify-start flex-wrap">
                    <span>{formatEventDateDisplay(nextEvent)}</span>
                    {nextEvent.location && <span>📍 {nextEvent.location}</span>}
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* ── Team Stats ── */}
        {selectedSeason && (
          <section className="bg-white rounded-lg shadow-sm overflow-hidden">
            <SectionTitle>Team-Statistiken ({selectedSeason.name})</SectionTitle>
            <div className="p-6 space-y-5">
              {/* Stat numbers */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-chnebel-gray rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-chnebel-black">{teamStats.matchesPlayed}</div>
                  <div className="text-sm text-gray-600">Spiele</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-700">{teamStats.matchesWon}</div>
                  <div className="text-sm text-gray-600">Siege</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-red-700">{teamStats.matchesLost}</div>
                  <div className="text-sm text-gray-600">Niederlagen</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-blue-700">{teamStats.averageGemschiScore.toFixed(0)}</div>
                  <div className="text-sm text-gray-600">Ø Gemschi Score</div>
                </div>
              </div>

              {/* Win/Loss visual bar */}
              {totalMatches > 0 && (
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{teamStats.matchesWon}S / {teamStats.matchesDraw}U / {teamStats.matchesLost}N</span>
                    <span>{winPct.toFixed(0)}% Siegquote</span>
                  </div>
                  <div className="h-4 rounded-full overflow-hidden flex bg-gray-200">
                    {winPct > 0 && (
                      <div
                        className="bg-green-500 transition-all duration-500"
                        style={{ width: `${winPct}%` }}
                        title={`${teamStats.matchesWon} Siege`}
                      />
                    )}
                    {drawPct > 0 && (
                      <div
                        className="bg-yellow-400 transition-all duration-500"
                        style={{ width: `${drawPct}%` }}
                        title={`${teamStats.matchesDraw} Unentschieden`}
                      />
                    )}
                    {lossPct > 0 && (
                      <div
                        className="bg-red-400 transition-all duration-500"
                        style={{ width: `${lossPct}%` }}
                        title={`${teamStats.matchesLost} Niederlagen`}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Tenue ── */}
        <section className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-chnebel-red px-5 py-3">
            <h2 className="text-lg font-bold text-white tracking-wide">Tenue</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
            {gemschigrads.map((gemschigrad) => (
              <div key={gemschigrad} className={`rounded-lg border-2 ${getGemschigradBorder(gemschigrad)} overflow-hidden`}>
                <div className={`px-4 py-2 ${getGemschigradColor(gemschigrad)}`}>
                  <span className="text-sm font-bold">{gemschigrad}</span>
                </div>
                <ol className="space-y-1.5 text-sm text-chnebel-black p-3">
                  {tenueData[gemschigrad].map((item) => (
                    <li key={item.id} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-chnebel-red text-white text-xs flex items-center justify-center font-semibold flex-shrink-0 mt-0.5">
                        {item.order}
                      </span>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        {/* ── Quick Links ── */}
        <section className="bg-white rounded-lg shadow-sm overflow-hidden">
          <SectionTitle>Quicklinks</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4">
          {[
            { path: '/events', icon: '📅', label: 'Events' },
            { path: '/spieler', icon: '👥', label: 'Spieler' },
            { path: '/verfassung', icon: '📜', label: 'Verfassung' },
            { path: '/patchsystem', icon: '🔧', label: 'Patchsystem' },
          ].map(item => (
            <Link
              key={item.path}
              to={item.path}
              className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center gap-2 no-underline hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all border border-gray-100"
            >
              <span className="text-3xl">{item.icon}</span>
              <span className="text-sm font-semibold text-chnebel-black">{item.label}</span>
            </Link>
          ))}
          </div>
        </section>

        {/* ── Social Media ── */}
        <section className="bg-white rounded-lg shadow-sm overflow-hidden">
          <SectionTitle>Social Media</SectionTitle>
          <a
            href="https://www.instagram.com/chnebel_gemscheni/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 no-underline hover:bg-chnebel-gray/30 transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                 style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}>
              <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-chnebel-black text-base">@chnebel_gemscheni</div>
              <div className="text-sm text-gray-500">Folg uns auf Instagram</div>
            </div>
            <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-xl flex-shrink-0">›</span>
          </a>
          <div className="border-t border-gray-100" />
          <a
            href="https://www.facebook.com/ChnebelGemscheni/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 no-underline hover:bg-chnebel-gray/30 transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#1877F2]">
              <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-chnebel-black text-base">Chnebel Gemscheni</div>
              <div className="text-sm text-gray-500">Folg uns auf Facebook</div>
            </div>
            <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-xl flex-shrink-0">›</span>
          </a>
        </section>

        {/* ── iOS PWA hint ── */}
        <section className="bg-blue-50 rounded-lg p-4 shadow-sm border border-blue-200">
          <p className="text-sm text-blue-800">
            📱 <strong>Tipp:</strong> Für Push-Benachrichtigungen auf iOS, füge GemschiHub zum Home-Bildschirm hinzu (Share → Zum Home-Bildschirm). Erfordert iOS 16.4+.
          </p>
        </section>
      </div>
    </>
  );
};
