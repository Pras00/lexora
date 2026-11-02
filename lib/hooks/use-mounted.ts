import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * Hydration-safe hook that returns true only on client after mount.
 * Uses useSyncExternalStore to avoid setState cascading re-renders in effects.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}

