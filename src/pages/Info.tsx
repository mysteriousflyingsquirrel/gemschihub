import React from 'react';
import { PageTitle } from '../components/PageTitle';
import { useInfo } from '../contexts/InfoContext';
import { Gemschigrad } from '../types/player';

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

export const Info: React.FC = () => {
  const { tenueData } = useInfo();
  const gemschigrads: Gemschigrad[] = ['Ehrengemschi', 'Kuttengemschi', 'Bandanagemschi', 'Gitzi'];

  return (
    <>
      <PageTitle>Info</PageTitle>
      <div className="space-y-4 md:space-y-6">
        <section className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
          <h2 className="text-xl md:text-2xl font-semibold text-chnebel-black mb-3 md:mb-4">Willkommen bei Chnebel Gemscheni</h2>
          <p className="text-sm md:text-base text-chnebel-black leading-relaxed">
            Dies ist die interne Anwendung für Chnebel Gemscheni. Hier finden Sie alle wichtigen Informationen,
            Events, Spieler und weitere relevante Inhalte.
          </p>
        </section>

        {/* Tenue Section */}
        <section className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
          <h2 className="text-xl md:text-2xl font-semibold text-chnebel-black mb-4 md:mb-6 flex items-center gap-2">
            <span className="text-xl md:text-2xl">👕</span>
            Tenue
          </h2>
          <div className="space-y-4 md:space-y-6 text-chnebel-black">
            {gemschigrads.map((gemschigrad, index) => (
              <div key={gemschigrad} className={index > 0 ? 'border-t border-gray-200 pt-4 md:pt-6' : ''}>
                <h3 className="font-semibold text-base md:text-lg mb-3 md:mb-4 flex items-center gap-2">
                  <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${getGemschigradColor(gemschigrad)}`}>
                    {gemschigrad}
                  </span>
                </h3>
                <div className="space-y-2">
                  {tenueData[gemschigrad].map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-chnebel-gray rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full bg-chnebel-red flex items-center justify-center text-white text-xs md:text-sm font-semibold">
                        {item.order}
                      </div>
                      <span className="flex-1 text-sm md:text-base">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

