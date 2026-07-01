import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { copy } from '@/constants/copy';
import { BottomTabInset, Palette, Spacing } from '@/constants/theme';
import { useFoodLog } from '@/context/FoodLogContext';
import { FoodLogEntry } from '@/types/FoodLog';
import { localDateStr } from '@/utils/food';

interface DailyFoodLogProps {
  listHeader?: React.ReactElement;
}

function LogRow({ entry, onDelete }: { entry: FoodLogEntry; onDelete: () => void }) {
  const sizeG = entry.food.servingSizeG ?? 100;
  const totalG = Math.round(entry.quantity * sizeG);
  const servingWord =
    entry.quantity === 1 ? copy.foodResult.servingSingular : copy.foodResult.servingPlural;

  return (
    <ReanimatedSwipeable
      renderRightActions={() => (
        <Pressable style={styles.deleteAction} onPress={onDelete}>
          <ThemedText type="small" style={styles.deleteText}>
            {copy.tracker.deleteLabel}
          </ThemedText>
        </Pressable>
      )}
      friction={2}
      rightThreshold={40}>
      <ThemedView type="backgroundElement" style={styles.row}>
        <View style={styles.rowLeft}>
          <ThemedText type="default" numberOfLines={1}>
            {entry.food.name}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {`${entry.quantity} ${servingWord} · ${totalG}g`}
          </ThemedText>
        </View>
        <ThemedText type="small">
          {`~${entry.totalNetCarbsG}g ${copy.foodResult.netCarbsLabel}`}
        </ThemedText>
      </ThemedView>
    </ReanimatedSwipeable>
  );
}

export function DailyFoodLog({ listHeader }: DailyFoodLogProps) {
  const { entries, removeEntry } = useFoodLog();
  const today = localDateStr(Date.now());
  const todayEntries = entries.filter((e) => localDateStr(e.timestamp) === today);

  return (
    <FlatList
      data={todayEntries}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={listHeader}
      ListEmptyComponent={
        <ThemedView style={styles.emptyState}>
          <ThemedText type="default" themeColor="textSecondary" style={styles.emptyText}>
            {copy.tracker.emptyState}
          </ThemedText>
        </ThemedView>
      }
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => (
        <ThemedView style={styles.separator} />
      )}
      renderItem={({ item }) => (
        <LogRow entry={item} onDelete={() => removeEntry(item.id)} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: BottomTabInset + Spacing.three,
  },
  emptyState: {
    paddingTop: Spacing.five,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    justifyContent: 'space-between',
  },
  rowLeft: {
    flex: 1,
    gap: Spacing.one,
    marginRight: Spacing.two,
  },
  deleteAction: {
    backgroundColor: Palette.danger,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  deleteText: {
    color: Palette.dangerText,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: Spacing.four,
    backgroundColor: 'rgba(128,128,128,0.2)',
  },
});
