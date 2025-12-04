import React, { createContext, useContext, useState, useEffect } from 'react';
import { TenueData, Pendenz, TenueItem } from '../types/info';
import { Gemschigrad } from '../types/player';

interface InfoContextType {
  tenueData: TenueData;
  pendenzen: Pendenz[];
  updateTenue: (gemschigrad: Gemschigrad, items: TenueItem[]) => void;
  addPendenz: (title: string) => void;
  updatePendenz: (id: string, updates: Partial<Pendenz>) => void;
  removePendenz: (id: string) => void;
  addTenueItem: (gemschigrad: Gemschigrad, text: string) => void;
  updateTenueItem: (gemschigrad: Gemschigrad, id: string, text: string) => void;
  removeTenueItem: (gemschigrad: Gemschigrad, id: string) => void;
}

const InfoContext = createContext<InfoContextType | undefined>(undefined);

const defaultTenueData: TenueData = {
  Ehrengemschi: [
    { id: '1', text: 'Rotes Trikot mit Vereinslogo', order: 1 },
    { id: '2', text: 'Weisse Shorts oder Hosen', order: 2 },
    { id: '3', text: 'Rote Socken (optional)', order: 3 },
    { id: '4', text: 'Sportschuhe mit heller Sohle', order: 4 },
  ],
  Kuttengemschi: [
    { id: '1', text: 'Rotes Trikot mit Vereinslogo', order: 1 },
    { id: '2', text: 'Weisse Shorts oder Hosen', order: 2 },
    { id: '3', text: 'Rote Socken (optional)', order: 3 },
    { id: '4', text: 'Sportschuhe mit heller Sohle', order: 4 },
  ],
  Bandanagemschi: [
    { id: '1', text: 'Rotes Trikot mit Vereinslogo', order: 1 },
    { id: '2', text: 'Weisse Shorts oder Hosen', order: 2 },
    { id: '3', text: 'Rote Socken (optional)', order: 3 },
    { id: '4', text: 'Sportschuhe mit heller Sohle', order: 4 },
  ],
  Gitzi: [
    { id: '1', text: 'Rotes Trikot mit Vereinslogo', order: 1 },
    { id: '2', text: 'Weisse Shorts oder Hosen', order: 2 },
    { id: '3', text: 'Rote Socken (optional)', order: 3 },
    { id: '4', text: 'Sportschuhe mit heller Sohle', order: 4 },
  ],
};

const defaultPendenzen: Pendenz[] = [
  { id: '1', title: 'Jahresversammlung vorbereiten', done: true },
  { id: '2', title: 'Neue Trikots bestellen', done: false },
  { id: '3', title: 'Trainingstermine für Q2 festlegen', done: true },
  { id: '4', title: 'Interclub-Anmeldung abschicken', done: false },
  { id: '5', title: 'Hallenreservation für März bestätigen', done: true },
  { id: '6', title: 'Mitgliederbeiträge einziehen', done: false },
  { id: '7', title: 'Website aktualisieren', done: true },
  { id: '8', title: 'Neue Spieler registrieren', done: false },
];

export const useInfo = () => {
  const context = useContext(InfoContext);
  if (!context) {
    throw new Error('useInfo must be used within an InfoProvider');
  }
  return context;
};

export const InfoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenueData, setTenueData] = useState<TenueData>(() => {
    const stored = localStorage.getItem('tenueData');
    return stored ? JSON.parse(stored) : defaultTenueData;
  });

  const [pendenzen, setPendenzen] = useState<Pendenz[]>(() => {
    const stored = localStorage.getItem('pendenzen');
    return stored ? JSON.parse(stored) : defaultPendenzen;
  });

  useEffect(() => {
    localStorage.setItem('tenueData', JSON.stringify(tenueData));
  }, [tenueData]);

  useEffect(() => {
    localStorage.setItem('pendenzen', JSON.stringify(pendenzen));
  }, [pendenzen]);

  const updateTenue = (gemschigrad: Gemschigrad, items: TenueItem[]) => {
    setTenueData(prev => ({
      ...prev,
      [gemschigrad]: items,
    }));
  };

  const addTenueItem = (gemschigrad: Gemschigrad, text: string) => {
    setTenueData(prev => {
      const items = prev[gemschigrad];
      const newItem: TenueItem = {
        id: Date.now().toString(),
        text,
        order: items.length + 1,
      };
      return {
        ...prev,
        [gemschigrad]: [...items, newItem],
      };
    });
  };

  const updateTenueItem = (gemschigrad: Gemschigrad, id: string, text: string) => {
    setTenueData(prev => ({
      ...prev,
      [gemschigrad]: prev[gemschigrad].map(item =>
        item.id === id ? { ...item, text } : item
      ),
    }));
  };

  const removeTenueItem = (gemschigrad: Gemschigrad, id: string) => {
    setTenueData(prev => ({
      ...prev,
      [gemschigrad]: prev[gemschigrad]
        .filter(item => item.id !== id)
        .map((item, index) => ({ ...item, order: index + 1 })),
    }));
  };

  const addPendenz = (title: string) => {
    const newPendenz: Pendenz = {
      id: Date.now().toString(),
      title,
      done: false,
    };
    setPendenzen(prev => [...prev, newPendenz]);
  };

  const updatePendenz = (id: string, updates: Partial<Pendenz>) => {
    setPendenzen(prev =>
      prev.map(pendenz => (pendenz.id === id ? { ...pendenz, ...updates } : pendenz))
    );
  };

  const removePendenz = (id: string) => {
    setPendenzen(prev => prev.filter(pendenz => pendenz.id !== id));
  };

  return (
    <InfoContext.Provider
      value={{
        tenueData,
        pendenzen,
        updateTenue,
        addPendenz,
        updatePendenz,
        removePendenz,
        addTenueItem,
        updateTenueItem,
        removeTenueItem,
      }}
    >
      {children}
    </InfoContext.Provider>
  );
};

