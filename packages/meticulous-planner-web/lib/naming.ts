/**
 * Converts an English name to a lower-kebab-case technical identifier.
 * e.g. "Order Number" → "order-number", "Place Order" → "place-order"
 */
export function toTechnicalName(englishName: string): string {
  return englishName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Converts a kebab-case technical name to PascalCase.
 * e.g. "order-number" → "OrderNumber", "place-order" → "PlaceOrder"
 */
export function kebabToPascalCase(kebab: string): string {
  return kebab
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Converts a kebab-case technical name to camelCase.
 * e.g. "order-number" → "orderNumber", "place-order" → "placeOrder"
 */
export function kebabToCamelCase(kebab: string): string {
  const pascal = kebabToPascalCase(kebab);
  return pascal ? pascal.charAt(0).toLowerCase() + pascal.slice(1) : '';
}
