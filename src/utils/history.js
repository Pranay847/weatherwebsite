export const HISTORY_KEY = 'weather_search_history_v1';

export function loadHistory() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveHistory(list) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  } catch (e) {
    // ignore
  }
}

export function addToHistory(city, max = 10) {
  if (!city) return loadHistory();
  const normalized = city.trim();
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
