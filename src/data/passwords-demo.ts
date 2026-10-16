// Public, synthetic fixtures. This UI demo is not a password store.
export type DemoCredential = {
  id: string;
  title: string;
  username: string;
  category: 'personal' | 'work';
  favorite: boolean;
  deleted: boolean;
};
export const samplePassword = 'Example-only!2026';
export const sampleAccounts = [
  { id: 'notion', title: 'Notion', username: 'demo@example.com', category: 'work' },
  { id: 'spotify', title: 'Spotify', username: 'music@example.com', category: 'personal' },
] as const;
export function initialCredentials(): DemoCredential[] {
  return [
    { id: 'google', title: 'Google', username: 'demo@example.com', category: 'personal', favorite: false, deleted: false },
    { id: 'github', title: 'GitHub', username: 'developer@example.com', category: 'work', favorite: true, deleted: false },
    { id: 'bank', title: 'הבנק שלי', username: 'account@example.com', category: 'personal', favorite: false, deleted: false },
  ];
}
export function filterCredentials(entries: DemoCredential[], query = '', category = 'all', favorites = false, trash = false) {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return entries.filter(entry => entry.deleted === trash && (category === 'all' || entry.category === category)
    && (!favorites || entry.favorite) && words.every(word => `${entry.title} ${entry.username}`.toLocaleLowerCase().includes(word)));
}
export function addSampleAccount(entries: DemoCredential[], id: string): DemoCredential[] {
  const sample = sampleAccounts.find(account => account.id === id);
  if (!sample || entries.some(entry => entry.id === id)) return entries;
  return [...entries, { ...sample, favorite: false, deleted: false }];
}
export function updateCredential(entries: DemoCredential[], id: string, change: Partial<Pick<DemoCredential, 'favorite' | 'deleted'>>) {
  return entries.map(entry => entry.id === id ? { ...entry, ...change } : entry);
}
