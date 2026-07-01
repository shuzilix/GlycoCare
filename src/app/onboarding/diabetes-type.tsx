import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProgressDots } from '@/components/progress-dots';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { copy } from '@/constants/copy';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { DiabetesType } from '@/types/UserProfile';

const DIABETES_TYPES: DiabetesType[] = ['type1', 'type2', 'prediabetes', 'gestational'];

export default function OnboardingDiabetesType() {
  const theme = useTheme();
  const [selected, setSelected] = useState<DiabetesType | null>(null);

  function handleNext() {
    if (!selected) return;
    router.push({ pathname: '/onboarding/carb-limit', params: { diabetesType: selected } });
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ProgressDots total={4} current={1} />

        <ThemedView style={styles.content}>
          <ThemedText type="subtitle" style={styles.title}>
            {copy.onboarding.diabetesType.title}
          </ThemedText>

          <ThemedView style={styles.options}>
            {DIABETES_TYPES.map((type) => (
              <Pressable
                key={type}
                onPress={() => setSelected(type)}
                style={({ pressed }) => [
                  styles.card,
                  { backgroundColor: theme.backgroundElement },
                  selected === type && { backgroundColor: theme.backgroundSelected },
                  pressed && styles.cardPressed,
                ]}>
                <ThemedText type="default" style={styles.cardLabel}>
                  {copy.onboarding.diabetesType.options[type].label}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {copy.onboarding.diabetesType.options[type].description}
                </ThemedText>
              </Pressable>
            ))}
          </ThemedView>
        </ThemedView>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            !selected && styles.buttonDisabled,
            pressed && selected && styles.buttonPressed,
          ]}
          onPress={handleNext}
          disabled={!selected}>
          <ThemedText type="default" style={styles.buttonLabel}>
            {copy.onboarding.diabetesType.cta}
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
  },
  title: {
    textAlign: 'center',
  },
  options: {
    gap: Spacing.two,
  },
  card: {
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    gap: Spacing.one,
  },
  cardPressed: {
    opacity: 0.7,
  },
  cardLabel: {
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#3c87f7',
    borderRadius: Spacing.four,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonLabel: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
