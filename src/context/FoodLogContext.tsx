import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

import { FoodItem, FoodLogEntry } from '@/types/FoodLog';
import { calcNetCarbs } from '@/utils/food';

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
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setEntries(JSON.parse(raw));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function addEntry(food: FoodItem, quantity: number) {
    const servingSizeG = food.servingSizeG ?? 100;
    const servingSizeEstimated = food.servingSizeG == null;
    const totalNetCarbsG = calcNetCarbs(food.carbsPer100g, servingSizeG, quantity);

    const entry: FoodLogEntry = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      food,
      quantity,
      totalNetCarbsG,
      servingSizeEstimated,
    };

    setEntries((prev) => {
      const next = [...prev, entry];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }

  async function removeEntry(id: string) {
    setEntries((prev) => {
      const next = prev.filter((e) => e.id !== id);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
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
