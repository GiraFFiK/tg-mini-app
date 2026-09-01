// hooks/useRefresh.ts
import { useState, useCallback, useRef } from "react";

export function useRefresh(refreshFn: () => Promise<void>) {
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const refreshingRef = useRef(false);

  const refresh = useCallback(async () => {
    if (refreshingRef.current) return;

    refreshingRef.current = true;
    setRefreshing(true);
    try {
      await refreshFn();
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      refreshingRef.current = false;
      setRefreshing(false);
    }
  }, [refreshFn]);

  return { refresh, refreshing, lastUpdated };
}
