import React from 'react';
import { PageTitle } from '../components/PageTitle';

interface InterclubEvent {
  datum: string;
  ort: string;
  gegner: string;
  score?: string; // Format: "3:2" or undefined if no score yet
}

interface TrainingEvent {
  datum: string;
  zeit: string;
  ort: string;
}

export const Events: React.FC = () => {
  const interclubEvents: InterclubEvent[] = [
    { datum: '15.01.2024', ort: 'Zürich', gegner: 'GC Zürich', score: '3:2' },
    { datum: '22.01.2024', ort: 'Bern', gegner: 'BC Bern', score: '1:4' },
    { datum: '05.02.2024', ort: 'Basel', gegner: 'TC Basel' },
    { datum: '12.02.2024', ort: 'Luzern', gegner: 'SC Luzern', score: '4:1' },
    { datum: '19.02.2024', ort: 'Genf', gegner: 'GC Genève' },
  ];

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
                  key={index}
                  className={`border-b border-gray-200 hover:bg-chnebel-gray/50 transition-colors ${
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
    </>
  );
};

