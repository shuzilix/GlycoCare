import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

import { UserProfile } from '@/types/UserProfile';

const STORAGE_KEY = '@glycocare_profile';

interface UserProfileContextValue {
  profile: UserProfile | null;
  loading: boolean;
  updateProfile: (partial: Partial<UserProfile>) => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) setProfile(JSON.parse(raw));
      setLoading(false);
    });
  }, []);

  async function updateProfile(partial: Partial<UserProfile>) {
    const next = { ...profile, ...partial } as UserProfile;
    setProfile(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return (
    <UserProfileContext.Provider value={{ profile, loading, updateProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error('useUserProfile must be used within UserProfileProvider');
  return ctx;
}
