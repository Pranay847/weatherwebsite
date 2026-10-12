export const HISTORY_KEY = 'weather_search_history_v1';

export function loadHistory() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    // Drop anything that isn't a { city: string } entry so a corrupted or
    // older-format value can't crash callers that read e.city.
    return Array.isArray(parsed)
      ? parsed.filter((e) => e && typeof e.city === 'string')
      : [];
  } catch {
    return [];
  }
}

export function saveHistory(list) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function addToHistory(city, max = 10) {
  const normalized = typeof city === 'string' ? city.trim() : '';
  if (!normalized) return loadHistory();
  const existing = loadHistory();
  const filtered = existing.filter((e) => e.city.trim().toLowerCase() !== normalized.toLowerCase());
  filtered.unshift({ city: normalized, at: Date.now() });
  if (filtered.length > max) filtered.length = max;
  saveHistory(filtered);
  return filtered;
}

export function clearHistory() {
  saveHistory([]);
  return [];
}
