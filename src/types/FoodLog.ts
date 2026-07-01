export interface FoodItem {
  barcode: string;
  name: string;
  brand?: string;
  carbsPer100g: number;
  servingSizeG?: number;
}

export interface FoodLogEntry {
  id: string;
  timestamp: number;
  food: FoodItem;
  quantity: number;
  totalNetCarbsG: number;
  servingSizeEstimated: boolean;
}
