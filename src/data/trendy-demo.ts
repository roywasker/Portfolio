// Illustrative catalog only: no production products, accounts or payment data.
export const demoProducts = [
  { id: 'earbuds', name: 'Everyday earbuds', category: 'Gadgets', price: 6000, mark: '◉', description: 'A pocket-sized companion for music, calls and your daily commute.' },
  { id: 'speaker', name: 'Mini speaker', category: 'Gadgets', price: 4500, mark: '▥', description: 'A little sound for your desk, your kitchen or your next weekend away.' },
  { id: 'bag', name: 'Daily carry', category: 'Fashion & Style', price: 3500, mark: '▱', description: 'A simple everyday bag with room for the things you actually need.' },
] as const;
export type DemoCart = Record<string, number>;
export const money = (cents: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
export function setQuantity(cart: DemoCart, id: string, quantity: number): DemoCart {
  if (!demoProducts.some(product => product.id === id) || !Number.isFinite(quantity)) return cart;
  const next = { ...cart };
  if (quantity <= 0) delete next[id];
  else next[id] = Math.min(10, Math.max(1, Math.floor(quantity)));
  return next;
}
export const cartTotal = (cart: DemoCart) => demoProducts.reduce((sum, product) => sum + product.price * (cart[product.id] ?? 0), 0);
