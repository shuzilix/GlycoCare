import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProgressDots } from '@/components/progress-dots';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { copy } from '@/constants/copy';
import { useUserProfile } from '@/context/UserProfileContext';
import { MaxContentWidth, Palette, Spacing } from '@/constants/theme';
import { DiabetesType } from '@/types/UserProfile';

export default function OnboardingComplete() {
  const { updateProfile } = useUserProfile();
  const { diabetesType, carbLimit } = useLocalSearchParams<{
    diabetesType: string;
    carbLimit: string;
  }>();

  const safeType = (diabetesType as DiabetesType) ?? 'type1';
  const safeCarbLimit = parseInt(carbLimit ?? '130', 10);

  async function handleStart() {
    await updateProfile({
      diabetesType: safeType,
      dailyCarbLimitG: safeCarbLimit,
      onboardingComplete: true,
    });
    router.replace('/');
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ProgressDots total={3} current={2} />

        <ThemedView style={styles.content}>
          <ThemedText type="subtitle" style={styles.title}>
            {copy.onboarding.complete.title}
          </ThemedText>
          <ThemedText type="default" themeColor="textSecondary" style={styles.subtitle}>
            {copy.onboarding.complete.subtitle}
          </ThemedText>

          <ThemedView type="backgroundElement" style={styles.summary}>
            <ThemedView type="backgroundElement" style={styles.summaryRow}>
              <ThemedText type="small" themeColor="textSecondary">
                {copy.onboarding.complete.diabetesTypeLabel}
              </ThemedText>
              <ThemedText type="default" style={styles.summaryValue}>
                {copy.onboarding.diabetesType.options[safeType].label}
              </ThemedText>
            </ThemedView>

            <ThemedView type="backgroundSelected" style={styles.divider} />

            <ThemedView type="backgroundElement" style={styles.summaryRow}>
              <ThemedText type="small" themeColor="textSecondary">
                {copy.onboarding.complete.carbLimitLabel}
              </ThemedText>
              <ThemedText type="default" style={styles.summaryValue}>
                {safeCarbLimit}
                {'  '}
                <ThemedText type="small" themeColor="textSecondary">
                  {copy.onboarding.complete.carbLimitUnit}
                </ThemedText>
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={handleStart}>
          <ThemedText type="default" style={styles.buttonLabel}>
            {copy.onboarding.complete.cta}
          </ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.four,
    gap: Spacing.four,
  },
  content: {
    flex: 1,
    gap: Spacing.four,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  summary: {
    borderRadius: Spacing.three,
    overflow: 'hidden',
    marginTop: Spacing.two,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  summaryValue: {
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginHorizontal: Spacing.three,
  },
  button: {
    backgroundColor: Palette.primary,
    borderRadius: Spacing.four,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonLabel: {
    color: Palette.primaryText,
    fontWeight: '600',
  },
});
