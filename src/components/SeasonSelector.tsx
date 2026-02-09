import React from 'react';
import { useSeasons } from '../contexts/SeasonsContext';

export const SeasonSelector: React.FC = () => {
  const { seasons, selectedSeasonId, selectSeason } = useSeasons();

  if (seasons.length === 0) return null;

  return (
    <div className="px-3 py-2">
      <label className="block text-white/60 text-xs font-medium mb-1 px-1">Saison</label>
      <select
        value={selectedSeasonId || ''}
        onChange={(e) => selectSeason(e.target.value)}
        className="w-full px-3 py-2 bg-white/10 text-white border border-white/20 rounded-lg text-sm focus:outline-none focus:border-chnebel-red appearance-none cursor-pointer"
      >
        {seasons.map(season => (
          <option key={season.id} value={season.id} className="bg-chnebel-black text-white">
            {season.name} {season.isActive ? '(aktiv)' : ''}
          </option>
        ))}
      </select>
    </div>
  );
};
