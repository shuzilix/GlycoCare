import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { copy } from '@/constants/copy';
import { useUserProfile } from '@/context/UserProfileContext';
import { MaxContentWidth, Palette, Spacing } from '@/constants/theme';

export default function ProfileTabScreen() {
  const { profile } = useUserProfile();

  if (!profile) return null;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <ThemedView style={styles.content}>
            <ThemedText type="subtitle" style={styles.title}>
              Profile
            </ThemedText>

            <ThemedView type="backgroundElement" style={styles.card}>
              <ThemedView type="backgroundElement" style={styles.cardRow}>
                <ThemedText type="small" themeColor="textSecondary">
                  {copy.onboarding.complete.diabetesTypeLabel}
                </ThemedText>
                <ThemedText type="default" style={styles.cardValue}>
                  {copy.onboarding.diabetesType.options[profile.diabetesType].label}
                </ThemedText>
              </ThemedView>

              <ThemedView type="backgroundSelected" style={styles.divider} />

              <ThemedView type="backgroundElement" style={styles.cardRow}>
                <ThemedText type="small" themeColor="textSecondary">
                  {copy.onboarding.complete.carbLimitLabel}
                </ThemedText>
                <ThemedText type="default" style={styles.cardValue}>
                  {profile.dailyCarbLimitG}g{' '}
                  <ThemedText type="small" themeColor="textSecondary">
                    / day
                  </ThemedText>
                </ThemedText>
              </ThemedView>
            </ThemedView>

            <Pressable
              style={({ pressed }) => [styles.button, pressed && styles.pressed]}
              onPress={() => router.push('/onboarding')}>
              <ThemedText type="default" style={styles.buttonLabel}>
                Change settings
              </ThemedText>
            </Pressable>
          </ThemedView>
        </ScrollView>
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
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
    gap: Spacing.three,
  },
  title: {
    marginBottom: Spacing.two,
  },
  card: {
    borderRadius: Spacing.three,
    overflow: 'hidden',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  cardValue: {
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
    marginTop: Spacing.two,
  },
  buttonLabel: {
    color: Palette.primaryText,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
});
