import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FoodSearchResult } from '@/components/food-search-result';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { copy } from '@/constants/copy';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { searchFoodByName } from '@/services/foodSearch';
import { FoodItem } from '@/types/FoodLog';

export default function SearchScreen() {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setError(false);
      setSearched(false);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(false);
      try {
        const items = await searchFoodByName(query.trim());
        setResults(items);
        setSearched(true);
      } catch {
        setError(true);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  function handlePress(item: FoodItem) {
    router.push({ pathname: '/food-result', params: { foodItem: JSON.stringify(item) } });
  }

  const showIdle = !query.trim() && !loading;
  const showEmpty = searched && !loading && !error && results.length === 0;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.inputWrapper}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.backgroundElement,
                color: theme.text,
              },
            ]}
            placeholder={copy.foodSearch.placeholder}
            placeholderTextColor={theme.textSecondary}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
        </ThemedView>

        {loading && (
          <ThemedView style={styles.centered}>
            <ActivityIndicator size="large" color="#3c87f7" />
          </ThemedView>
        )}

        {!loading && showIdle && (
          <ThemedView style={styles.centered}>
            <ThemedText type="default" themeColor="textSecondary" style={styles.centerText}>
              Search for a food by name
            </ThemedText>
          </ThemedView>
        )}

        {!loading && error && (
          <ThemedView style={styles.centered}>
            <ThemedText type="default" themeColor="textSecondary" style={styles.centerText}>
              {copy.foodSearch.error}
            </ThemedText>
          </ThemedView>
        )}

        {!loading && showEmpty && (
          <ThemedView style={styles.centered}>
            <ThemedText type="default" themeColor="textSecondary" style={styles.centerText}>
              {copy.foodSearch.emptyState}
            </ThemedText>
          </ThemedView>
        )}

        {!loading && !error && results.length > 0 && (
          <FlatList
            data={results}
            keyExtractor={(item, index) => `${item.barcode}-${index}`}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <FoodSearchResult item={item} onPress={() => handlePress(item)} />
            )}
          />
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
    paddingTop: Spacing.three,
  },
  inputWrapper: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
  },
  input: {
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset,
  },
  centerText: {
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: BottomTabInset + Spacing.three,
    gap: Spacing.two,
  },
});
