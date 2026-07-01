import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

import { FoodItem, FoodLogEntry } from '@/types/FoodLog';

const STORAGE_KEY = '@glycocare_food_log';

interface FoodLogContextValue {
  entries: FoodLogEntry[];
  loading: boolean;
  addEntry: (food: FoodItem, quantity: number) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
}

const FoodLogContext = createContext<FoodLogContextValue | null>(null);

export function FoodLogProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<FoodLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) setEntries(JSON.parse(raw));
      setLoading(false);
    });
  }, []);

  async function addEntry(food: FoodItem, quantity: number) {
    const servingSizeG = food.servingSizeG ?? 100;
    const servingSizeEstimated = food.servingSizeG == null;
    const totalNetCarbsG =
      Math.round(((food.carbsPer100g / 100) * servingSizeG * quantity) * 10) / 10;

    const entry: FoodLogEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      food,
      quantity,
      totalNetCarbsG,
      servingSizeEstimated,
    };
    const next = [...entries, entry];
    setEntries(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  async function removeEntry(id: string) {
    const next = entries.filter((e) => e.id !== id);
    setEntries(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return (
    <FoodLogContext.Provider value={{ entries, loading, addEntry, removeEntry }}>
      {children}
    </FoodLogContext.Provider>
  );
}

export function useFoodLog() {
  const ctx = useContext(FoodLogContext);
  if (!ctx) throw new Error('useFoodLog must be used within FoodLogProvider');
  return ctx;
}
