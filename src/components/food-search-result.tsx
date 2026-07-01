import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { copy } from '@/constants/copy';
import { Spacing } from '@/constants/theme';
import { FoodItem } from '@/types/FoodLog';

interface FoodSearchResultProps {
  item: FoodItem;
  onPress: () => void;
}

export function FoodSearchResult({ item, onPress }: FoodSearchResultProps) {
  const secondaryParts: string[] = [];
  if (item.brand) secondaryParts.push(item.brand.split(',')[0]);
  secondaryParts.push(`${item.carbsPer100g}g carbs ${copy.foodSearch.carbsLabel}`);
  if (item.servingSizeG != null) secondaryParts.push(`${item.servingSizeG}g serving`);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      <ThemedView type="backgroundElement" style={styles.inner}>
        <ThemedText type="default" numberOfLines={2}>
          {item.name}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
          {secondaryParts.join(' · ')}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.four,
  },
  pressed: {
    opacity: 0.7,
  },
  inner: {
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    gap: Spacing.one,
  },
});
