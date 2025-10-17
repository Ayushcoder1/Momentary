import { getStorage } from '../storage/index.js';

export function startCleanupJob() {
  const intervalMs = 60 * 1000; // every minute
  const handle = setInterval(async () => {
    try {
      const deleted = await getStorage().cleanupExpired();
      if (deleted > 0) {
        // eslint-disable-next-line no-console
        console.log(`[cleanup] deleted ${deleted} expired item(s)`);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[cleanup] error', err);
    }
  }, intervalMs);
  return () => clearInterval(handle);
}




