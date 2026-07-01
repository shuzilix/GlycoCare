import { FoodItem } from '@/types/FoodLog';

const SEARCH_URL = 'https://world.openfoodfacts.org/cgi/search.pl';

export async function searchFoodByName(query: string): Promise<FoodItem[]> {
  const params = new URLSearchParams({
    search_terms: query,
    json: 'true',
    page_size: '10',
    fields: 'code,product_name,brands,nutriments,serving_size,serving_quantity',
  });

  const res = await fetch(`${SEARCH_URL}?${params}`);
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);

  const data = await res.json();

  return (data.products ?? [])
    .filter(
      (p: Record<string, unknown>) =>
        p.product_name &&
        (p.nutriments as Record<string, unknown>)?.carbohydrates_100g != null
    )
    .map((p: Record<string, unknown>): FoodItem => {
      const nutriments = p.nutriments as Record<string, number>;
      return {
        barcode: (p.code as string) ?? '',
        name: p.product_name as string,
        brand: (p.brands as string | undefined) || undefined,
        carbsPer100g: Math.round((nutriments.carbohydrates_100g ?? 0) * 10) / 10,
        servingSizeG: (p.serving_quantity as number | undefined) ?? undefined,
      };
    });
}
