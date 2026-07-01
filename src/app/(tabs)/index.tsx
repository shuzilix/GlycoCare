import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DailyCarbSummary } from '@/components/DailyCarbSummary';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Palette, Spacing } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.header}>
          <ThemedText type="subtitle">GlycoCare</ThemedText>
          <Pressable
            onPress={() => router.push('/profile')}
            style={({ pressed }) => pressed && styles.pressed}>
            <ThemedText type="small" themeColor="textSecondary">
              Profile
            </ThemedText>
          </Pressable>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="small" themeColor="textSecondary" style={styles.sectionLabel}>
            TODAY
          </ThemedText>
          <DailyCarbSummary />
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="small" themeColor="textSecondary" style={styles.sectionLabel}>
            LOG FOOD
          </ThemedText>
          <Pressable
            style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
            onPress={() => router.push('/scan')}>
            <ThemedText type="default" style={styles.actionButtonLabel}>
              Scan barcode
            </ThemedText>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.actionButtonSecondary, pressed && styles.pressed]}
            onPress={() => router.push('/search')}>
            <ThemedText type="default" themeColor="textSecondary">
              Search by name
            </ThemedText>
          </Pressable>
        </ThemedView>
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
    paddingTop: Spacing.three,
    gap: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  section: {
    gap: Spacing.two,
  },
  sectionLabel: {
    letterSpacing: 0.8,
  },
  actionButton: {
    backgroundColor: Palette.primary,
    borderRadius: Spacing.four,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  actionButtonSecondary: {
    borderRadius: Spacing.four,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  actionButtonLabel: {
    color: Palette.primaryText,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
});
