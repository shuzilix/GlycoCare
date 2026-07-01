import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { copy } from '@/constants/copy';
import { Palette, Spacing } from '@/constants/theme';
import { useFoodLog } from '@/context/FoodLogContext';
import { useUserProfile } from '@/context/UserProfileContext';
import { localDateStr } from '@/utils/food';

const BAR_GREEN = '#4caf50';
const BAR_AMBER = '#f5a623';

export function DailyCarbSummary() {
  const { entries } = useFoodLog();
  const { profile } = useUserProfile();
  const [trackWidth, setTrackWidth] = useState(0);

  const limit = Math.max(profile?.dailyCarbLimitG ?? 130, 1);
  const today = localDateStr(Date.now());

  const rawConsumed = entries
    .filter((e) => localDateStr(e.timestamp) === today)
    .reduce((sum, e) => sum + e.totalNetCarbsG, 0);

  const consumed = Math.round(rawConsumed * 10) / 10;
  const ratio = consumed / limit;
  const clampedRatio = Math.min(ratio, 1);
  const isOver = consumed >= limit;
  const remaining = Math.round((limit - consumed) * 10) / 10;
  const over = Math.round((consumed - limit) * 10) / 10;
  const color = ratio >= 1 ? Palette.danger : ratio >= 0.75 ? BAR_AMBER : BAR_GREEN;

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="small" themeColor="textSecondary">
        {copy.tracker.dayLabel}
      </ThemedText>

      <View
        style={styles.barTrack}
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}>
        <View style={[styles.barFill, { width: trackWidth * clampedRatio, backgroundColor: color }]} />
      </View>

      <View style={styles.statsRow}>
        <ThemedText type="small">
          {`${consumed}g / ${limit}g ${copy.tracker.netCarbsLabel}`}
        </ThemedText>
        {isOver ? (
          <ThemedText type="small" style={styles.overText}>
            {`${over}g ${copy.tracker.overLimitLabel}`}
          </ThemedText>
        ) : (
          <ThemedText type="small" themeColor="textSecondary">
            {`${remaining}g ${copy.tracker.remainingLabel}`}
          </ThemedText>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    gap: Spacing.two,
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(128,128,128,0.2)',
    overflow: 'hidden',
  },
  barFill: {
    height: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overText: {
    color: Palette.danger,
  },
});
