// hooks/useRefresh.ts
import { useState, useCallback } from "react";

export function useRefresh(refreshFn: () => Promise<void>) {
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refresh = useCallback(async () => {
    if (refreshing) return;

    setRefreshing(true);
    try {
      await refreshFn();
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshFn, refreshing]);

  return { refresh, refreshing, lastUpdated };
}
