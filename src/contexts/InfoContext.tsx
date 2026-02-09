import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  doc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { TenueData, TenueItem } from '../types/info';
import { Gemschigrad } from '../types/player';

const DOC_PATH = 'settings/tenue';

interface InfoContextType {
  tenueData: TenueData;
  loading: boolean;
  addTenueItem: (gemschigrad: Gemschigrad, text: string) => Promise<void>;
  updateTenueItem: (gemschigrad: Gemschigrad, id: string, text: string) => Promise<void>;
  removeTenueItem: (gemschigrad: Gemschigrad, id: string) => Promise<void>;
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
  const [tenueData, setTenueData] = useState<TenueData>(defaultTenueData);
  const [loading, setLoading] = useState(true);

  // Real-time listener on a single document
  useEffect(() => {
    const docRef = doc(db, ...DOC_PATH.split('/') as [string, string]);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setTenueData(snapshot.data() as TenueData);
      }
      // If doc doesn't exist yet, keep defaults
      setLoading(false);
    }, (error) => {
      console.error('Firestore tenue listener error:', error);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  /** Persist the full tenue data to Firestore. */
  const persist = async (data: TenueData) => {
    const docRef = doc(db, ...DOC_PATH.split('/') as [string, string]);
    await setDoc(docRef, data);
  };

  const addTenueItem = async (gemschigrad: Gemschigrad, text: string) => {
    const items = tenueData[gemschigrad];
    const newItem: TenueItem = {
      id: Date.now().toString(),
      text,
      order: items.length + 1,
    };
    const updated = { ...tenueData, [gemschigrad]: [...items, newItem] };
    setTenueData(updated);
    await persist(updated);
  };

  const updateTenueItem = async (gemschigrad: Gemschigrad, id: string, text: string) => {
    const updated = {
      ...tenueData,
      [gemschigrad]: tenueData[gemschigrad].map(item =>
        item.id === id ? { ...item, text } : item
      ),
    };
    setTenueData(updated);
    await persist(updated);
  };

  const removeTenueItem = async (gemschigrad: Gemschigrad, id: string) => {
    const updated = {
      ...tenueData,
      [gemschigrad]: tenueData[gemschigrad]
        .filter(item => item.id !== id)
        .map((item, index) => ({ ...item, order: index + 1 })),
    };
    setTenueData(updated);
    await persist(updated);
  };

  return (
    <InfoContext.Provider value={{ tenueData, loading, addTenueItem, updateTenueItem, removeTenueItem }}>
      {children}
    </InfoContext.Provider>
  );
};
