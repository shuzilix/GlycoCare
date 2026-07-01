import { Redirect } from 'expo-router';

import AppTabs from '@/components/app-tabs';
import { useUserProfile } from '@/context/UserProfileContext';

export default function TabsLayout() {
  const { profile, loading } = useUserProfile();

  if (loading) return null;
  if (!profile?.onboardingComplete) return <Redirect href="/onboarding" />;

  return <AppTabs />;
}
