/**
 * @module lib/loaderState
 *
 * sessionStorage flag для BlueprintLoader. Перший вхід у сесії → full
 * intro (cube draw + grain + wordmark + typewriter, ~1.4s skippable).
 * Повторні mounts у тій самій сесії → 300ms fade-only без timeline.
 *
 * Key умисно version-suffixed: при ребренді/реструктурі loader-у зміна
 * '_v1' → '_v2' інвалідує всі активні сесії і всі користувачі побачать
 * нове intro один раз. Без overhead'у date-based TTL.
 *
 * SSR-safe: useEffect-only consumers (BlueprintLoader). Прямий доступ
 * до window.sessionStorage не виконується під час hydration.
 */
const STORAGE_KEY = 'vugoda_loader_seen_v1';

export function hasSeenLoader(): boolean {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    // Storage заборонений (incognito iframe тощо) — fall back to "seen"
    // щоб не блокувати UX повторюваним loader-ом на кожен mount.
    return true;
  }
}

export function markLoaderSeen(): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, '1');
  } catch {
    // no-op
  }
}
