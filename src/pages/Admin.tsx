import React, { useState } from 'react';
import { PageTitle } from '../components/PageTitle';
import { useInfo } from '../contexts/InfoContext';
import { usePlayers } from '../contexts/PlayersContext';
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
  const [editingTenue, setEditingTenue] = useState<{ gemschigrad: Gemschigrad; id: string } | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);
  const [newTenueText, setNewTenueText] = useState<{ [key in Gemschigrad]?: string }>({});
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [openGemschigrad, setOpenGemschigrad] = useState<Gemschigrad | null>(null);
  
  // New player form state
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerAlias, setNewPlayerAlias] = useState('');
  const [newPlayerRole, setNewPlayerRole] = useState<PlayerRole>('Spieler');
  const [newPlayerGemschigrad, setNewPlayerGemschigrad] = useState<Gemschigrad>('Gitzi');
  const [newPlayerKlassierung, setNewPlayerKlassierung] = useState<Klassierung>('R9');
  const [newPlayerInvitationCode, setNewPlayerInvitationCode] = useState('');

  const isTenueExpanded = openSection === 'tenue';
  const isSpielerExpanded = openSection === 'spieler';

  const toggleSection = (section: 'tenue' | 'spieler') => {
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
    </>
  );
};
