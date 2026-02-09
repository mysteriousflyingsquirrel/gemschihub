import React, { createContext, useContext, useState, useEffect } from 'react';
import { TenueData, TenueItem } from '../types/info';
import { Gemschigrad } from '../types/player';
import { storage } from '../storage/StorageService';

const STORAGE_KEY = 'gemschihub_tenue';

interface InfoContextType {
  tenueData: TenueData;
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
    { id: '5', text: 'Rotes Trikot mit Vereinslogo', order: 1 },
    { id: '6', text: 'Weisse Shorts oder Hosen', order: 2 },
    { id: '7', text: 'Rote Socken (optional)', order: 3 },
    { id: '8', text: 'Sportschuhe mit heller Sohle', order: 4 },
  ],
  Bandanagemschi: [
    { id: '9', text: 'Rotes Trikot mit Vereinslogo', order: 1 },
    { id: '10', text: 'Weisse Shorts oder Hosen', order: 2 },
    { id: '11', text: 'Rote Socken (optional)', order: 3 },
    { id: '12', text: 'Sportschuhe mit heller Sohle', order: 4 },
  ],
  Gitzi: [
    { id: '13', text: 'Rotes Trikot mit Vereinslogo', order: 1 },
    { id: '14', text: 'Weisse Shorts oder Hosen', order: 2 },
    { id: '15', text: 'Rote Socken (optional)', order: 3 },
    { id: '16', text: 'Sportschuhe mit heller Sohle', order: 4 },
  ],
};

export const useInfo = () => {
  const context = useContext(InfoContext);
  if (!context) {
    throw new Error('useInfo must be used within an InfoProvider');
  }
  return context;
};

export const InfoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenueData, setTenueData] = useState<TenueData>(() => {
    return storage.get<TenueData>(STORAGE_KEY) || defaultTenueData;
  });

  useEffect(() => {
    storage.set(STORAGE_KEY, tenueData);
  }, [tenueData]);

  const addTenueItem = (gemschigrad: Gemschigrad, text: string) => {
    setTenueData(prev => {
      const items = prev[gemschigrad];
      const newItem: TenueItem = {
        id: Date.now().toString(),
        text,
        order: items.length + 1,
      };
      return { ...prev, [gemschigrad]: [...items, newItem] };
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

  return (
    <InfoContext.Provider value={{ tenueData, addTenueItem, updateTenueItem, removeTenueItem }}>
      {children}
    </InfoContext.Provider>
  );
};
