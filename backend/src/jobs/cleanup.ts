import { getStorage } from '../storage/index.js';

export function startCleanupJob() {
  // Allow override via env to tune behavior in different environments
  const raw = process.env.CLEANUP_INTERVAL_MS;
  const intervalMs = Math.max(10_000, Number(raw) || 60_000); // default: 60s, min: 10s

  let running = false;
  const handle = setInterval(async () => {
    if (running) return; // prevent overlapping runs on slow volumes/buckets
    running = true;
    try {
      const deleted = await getStorage().cleanupExpired();
      if (deleted > 0) {
        // eslint-disable-next-line no-console
        console.log(`[cleanup] deleted ${deleted} expired item(s)`);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[cleanup] error', err);
    } finally {
      running = false;
    }
  }, intervalMs);
  return () => clearInterval(handle);
}








