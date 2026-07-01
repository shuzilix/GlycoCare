import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { copy } from '@/constants/copy';
import { useFoodLog } from '@/context/FoodLogContext';
import { useUserProfile } from '@/context/UserProfileContext';
import { MaxContentWidth, Palette, Spacing } from '@/constants/theme';
import { FoodItem } from '@/types/FoodLog';
import { calcNetCarbs, localDateStr } from '@/utils/food';

const MIN_QTY = 0.5;
const MAX_QTY = 10;
const STEP = 0.5;

type ScreenState =
  | { status: 'loading' }
  | { status: 'found'; food: FoodItem }
  | { status: 'not_found' }
  | { status: 'error' };

export default function FoodResultScreen() {
  const { barcode, foodItem: foodItemParam } = useLocalSearchParams<{
    barcode?: string;
    foodItem?: string;
  }>();
  const { addEntry, entries } = useFoodLog();
  const { profile } = useUserProfile();
  const [state, setState] = useState<ScreenState>({ status: 'loading' });
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);

    if (foodItemParam) {
      setState({ status: 'found', food: JSON.parse(foodItemParam) as FoodItem });
      return;
    }

    if (!barcode) {
      setState({ status: 'not_found' });
      return;
    }

    let cancelled = false;
    setState({ status: 'loading' });

    fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;

        if (json.status !== 1 || !json.product?.nutriments) {
          setState({ status: 'not_found' });
          return;
        }

        const p = json.product;
        const carbsPer100g = p.nutriments['carbohydrates_100g'] ?? p.nutriments['carbohydrates'];

        if (carbsPer100g == null) {
          setState({ status: 'not_found' });
          return;
        }

        const food: FoodItem = {
          barcode,
          name: p.product_name || p.product_name_en || 'Unknown product',
          brand: p.brands || undefined,
          carbsPer100g: Math.round(carbsPer100g * 10) / 10,
          servingSizeG: p.serving_quantity ?? undefined,
        };

        setState({ status: 'found', food });
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error' });
      });

    return () => {
      cancelled = true;
    };
  }, [barcode, foodItemParam]);

  function handleLog() {
    if (state.status !== 'found') return;
    addEntry(state.food, quantity);
    router.back();
  }

  function adjustQuantity(delta: number) {
    setQuantity((q) => {
      const next = Math.round((q + delta) * 10) / 10;
      return Math.max(MIN_QTY, Math.min(MAX_QTY, next));
    });
  }

  const limit = profile?.dailyCarbLimitG;
  const today = localDateStr(Date.now());
  const consumedToday = entries
    .filter((e) => localDateStr(e.timestamp) === today)
    .reduce((sum, e) => sum + e.totalNetCarbsG, 0);
  const remainingToday =
    limit != null ? Math.round((limit - consumedToday) * 10) / 10 : null;

  const totalNetCarbsG =
    state.status === 'found'
      ? calcNetCarbs(
          state.food.carbsPer100g,
          state.food.servingSizeG ?? 100,
          quantity
        )
      : 0;
  const servingSizeEstimated = state.status === 'found' && state.food.servingSizeG == null;
  const servingLabel =
    quantity === 1 ? copy.foodResult.servingSingular : copy.foodResult.servingPlural;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {state.status === 'loading' && (
          <ThemedView style={styles.centered}>
            <ActivityIndicator size="large" color={Palette.primary} />
            <ThemedText type="default" themeColor="textSecondary">
              {copy.foodResult.loading}
            </ThemedText>
          </ThemedView>
        )}

        {state.status === 'found' && (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <ThemedView style={styles.content}>
              {state.food.brand && (
                <ThemedText type="small" themeColor="textSecondary" style={styles.brand}>
                  {state.food.brand.split(',')[0]}
                </ThemedText>
              )}
              <ThemedText type="subtitle" style={styles.productName}>
                {state.food.name}
              </ThemedText>

              <ThemedView type="backgroundElement" style={styles.card}>
                <ThemedView type="backgroundElement" style={styles.cardRow}>
                  <ThemedText type="small" themeColor="textSecondary">
                    {copy.foodResult.carbLabel}
                  </ThemedText>
                  <ThemedText type="default" style={styles.cardValue}>
                    {state.food.carbsPer100g}g
                  </ThemedText>
                </ThemedView>

                {state.food.servingSizeG != null && (
                  <>
                    <ThemedView type="backgroundSelected" style={styles.divider} />
                    <ThemedView type="backgroundElement" style={styles.cardRow}>
                      <ThemedText type="small" themeColor="textSecondary">
                        {copy.foodResult.servingLabel}
                      </ThemedText>
                      <ThemedText type="default" style={styles.cardValue}>
                        {state.food.servingSizeG}g
                      </ThemedText>
                    </ThemedView>
                  </>
                )}

                {remainingToday != null && (
                  <>
                    <ThemedView type="backgroundSelected" style={styles.divider} />
                    <ThemedView type="backgroundElement" style={styles.cardRow}>
                      <ThemedText type="small" themeColor="textSecondary">
                        {copy.foodResult.dailyRemainingLabel}
                      </ThemedText>
                      <ThemedText type="default" style={styles.cardValue}>
                        {remainingToday}g
                      </ThemedText>
                    </ThemedView>
                  </>
                )}
              </ThemedView>
            </ThemedView>
          </ScrollView>
        )}

        {(state.status === 'not_found' || state.status === 'error') && (
          <ThemedView style={styles.centered}>
            <ThemedText type="subtitle" style={styles.centerText}>
              {state.status === 'not_found'
                ? copy.foodResult.notFoundTitle
                : copy.foodResult.errorTitle}
            </ThemedText>
            <ThemedText type="default" themeColor="textSecondary" style={styles.centerText}>
              {state.status === 'not_found'
                ? copy.foodResult.notFoundSubtitle
                : copy.foodResult.errorSubtitle}
            </ThemedText>
            <Pressable
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
              onPress={state.status === 'not_found' ? router.back : () => router.back()}>
              <ThemedText type="default">
                {state.status === 'not_found'
                  ? copy.foodResult.scanAgainCta
                  : copy.foodResult.retryCta}
              </ThemedText>
            </Pressable>
          </ThemedView>
        )}

        {state.status === 'found' && (
          <ThemedView style={styles.actions}>
            <ThemedView type="backgroundElement" style={styles.quantityRow}>
              <Pressable
                onPress={() => adjustQuantity(-STEP)}
                disabled={quantity <= MIN_QTY}
                style={({ pressed }) => [
                  styles.quantityButton,
                  quantity <= MIN_QTY && styles.quantityButtonDisabled,
                  pressed && quantity > MIN_QTY && styles.buttonPressed,
                ]}>
                <ThemedText type="subtitle">−</ThemedText>
              </Pressable>

              <ThemedText type="default" style={styles.quantityLabel}>
                {quantity} {servingLabel}
              </ThemedText>

              <Pressable
                onPress={() => adjustQuantity(STEP)}
                disabled={quantity >= MAX_QTY}
                style={({ pressed }) => [
                  styles.quantityButton,
                  quantity >= MAX_QTY && styles.quantityButtonDisabled,
                  pressed && quantity < MAX_QTY && styles.buttonPressed,
                ]}>
                <ThemedText type="subtitle">+</ThemedText>
              </Pressable>
            </ThemedView>

            <ThemedText type="small" themeColor="textSecondary" style={styles.carbEstimate}>
              ~{totalNetCarbsG}g {copy.foodResult.netCarbsLabel}
              {servingSizeEstimated ? ` · ${copy.foodResult.servingSizeEstimated}` : ''}
            </ThemedText>

            <Pressable
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
              onPress={handleLog}>
              <ThemedText type="default" style={styles.buttonLabel}>
                {copy.foodResult.logCta}
              </ThemedText>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
              onPress={() => router.back()}>
              <ThemedText type="default" themeColor="textSecondary">
                {copy.foodResult.dismissCta}
              </ThemedText>
            </Pressable>
          </ThemedView>
        )}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  centerText: {
    textAlign: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
    paddingBottom: Spacing.three,
  },
  content: {
    gap: Spacing.three,
  },
  brand: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  productName: {
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
  actions: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.two,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  quantityButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonDisabled: {
    opacity: 0.3,
  },
  quantityLabel: {
    fontWeight: '600',
    minWidth: 100,
    textAlign: 'center',
  },
  carbEstimate: {
    textAlign: 'center',
    paddingBottom: Spacing.one,
  },
  button: {
    backgroundColor: Palette.primary,
    borderRadius: Spacing.four,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  secondaryButton: {
    borderRadius: Spacing.four,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonLabel: {
    color: Palette.primaryText,
    fontWeight: '600',
  },
});
