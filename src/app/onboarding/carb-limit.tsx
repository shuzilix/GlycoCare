import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { PanResponder, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProgressDots } from '@/components/progress-dots';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { copy } from '@/constants/copy';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { DiabetesType } from '@/types/UserProfile';

const MIN = 50;
const MAX = 250;
const THUMB_SIZE = 28;

const RECOMMENDED: Record<DiabetesType, number> = {
  type1: 130,
  type2: 100,
  prediabetes: 130,
  gestational: 175,
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export default function OnboardingCarbLimit() {
  const theme = useTheme();
  const { diabetesType } = useLocalSearchParams<{ diabetesType: string }>();
  const safeType = (diabetesType as DiabetesType) ?? 'type1';

  const [carbLimit, setCarbLimit] = useState(() => RECOMMENDED[safeType] ?? 130);
  const [trackWidth, setTrackWidth] = useState(0);

  const trackWidthRef = useRef(0);
  const initialPctRef = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const w = trackWidthRef.current;
        if (!w) return;
        const pct = clamp(evt.nativeEvent.locationX / w, 0, 1);
        initialPctRef.current = pct;
        setCarbLimit(Math.round(MIN + pct * (MAX - MIN)));
      },
      onPanResponderMove: (_, gs) => {
        const w = trackWidthRef.current;
        if (!w) return;
        const newPct = clamp(initialPctRef.current + gs.dx / w, 0, 1);
        setCarbLimit(Math.round(MIN + newPct * (MAX - MIN)));
      },
    })
  ).current;

  function handleNext() {
    router.push({
      pathname: '/onboarding/complete',
      params: { diabetesType: safeType, carbLimit: String(carbLimit) },
    });
  }

  const thumbPct = (carbLimit - MIN) / (MAX - MIN);
  const thumbLeft = trackWidth > 0 ? trackWidth * thumbPct - THUMB_SIZE / 2 : 0;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ProgressDots total={4} current={2} />

        <ThemedView style={styles.content}>
          <ThemedText type="subtitle" style={styles.title}>
            {copy.onboarding.carbLimit.title}
          </ThemedText>
          <ThemedText type="default" themeColor="textSecondary" style={styles.subtitle}>
            {copy.onboarding.carbLimit.subtitle}
          </ThemedText>

          <ThemedView style={styles.valueRow}>
            <ThemedText type="title" style={styles.valueText}>
              {carbLimit}
            </ThemedText>
            <ThemedText type="subtitle" themeColor="textSecondary">
              g
            </ThemedText>
          </ThemedView>

          <ThemedView
            type="backgroundElement"
            style={styles.sliderContainer}
            {...panResponder.panHandlers}
            onLayout={(e) => {
              const w = e.nativeEvent.layout.width;
              trackWidthRef.current = w;
              setTrackWidth(w);
            }}>
            <View style={[styles.sliderFill, { width: trackWidth * thumbPct }]} />
            <View
              style={[
                styles.sliderThumb,
                { left: thumbLeft, borderColor: theme.background },
              ]}
            />
          </ThemedView>

          <ThemedView style={styles.rangeRow}>
            <ThemedText type="small" themeColor="textSecondary">
              {MIN}g
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {copy.onboarding.carbLimit.recommendedLabel}:{' '}
              <ThemedText type="smallBold">{RECOMMENDED[safeType]}g</ThemedText>
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {MAX}g
            </ThemedText>
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.disclaimer}>
            <ThemedText type="small" themeColor="textSecondary" style={styles.disclaimerText}>
              {copy.onboarding.carbLimit.disclaimer}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={handleNext}>
          <ThemedText type="default" style={styles.buttonLabel}>
            {copy.onboarding.carbLimit.cta}
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
    gap: Spacing.three,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.three,
  },
  valueText: {
    lineHeight: 52,
  },
  sliderContainer: {
    height: THUMB_SIZE + Spacing.four,
    borderRadius: Spacing.two,
    justifyContent: 'center',
    paddingHorizontal: THUMB_SIZE / 2,
  },
  sliderFill: {
    position: 'absolute',
    left: THUMB_SIZE / 2,
    height: 4,
    backgroundColor: '#3c87f7',
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#3c87f7',
    borderWidth: 2,
  },
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  disclaimer: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
    marginTop: Spacing.two,
  },
  disclaimerText: {
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3c87f7',
    borderRadius: Spacing.four,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonLabel: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
