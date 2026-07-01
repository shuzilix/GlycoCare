export function localDateStr(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function calcNetCarbs(carbsPer100g: number, servingSizeG: number, quantity: number): number {
  return Math.round(((carbsPer100g / 100) * servingSizeG * quantity) * 10) / 10;
}
