import { promises as fs } from 'fs';
import path from 'path';
import { StorageProvider, StoredObjectMeta } from './types.js';
import { config } from '../config.js';

const META_FILE_NAME = 'meta.json';

function resolveKeyDir(key: string): string {
  return path.join(process.cwd(), config.localStoreDir, key);
}

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

export const fsProvider: StorageProvider = {
  async putObject({ key, body, contentType, expiresAtMs }) {
    const dir = resolveKeyDir(key);
    await ensureDir(dir);
    const dataPath = path.join(dir, 'data');
    const metaPath = path.join(dir, META_FILE_NAME);
    await fs.writeFile(dataPath, body);
    const meta: StoredObjectMeta = {
      key,
      contentType,
      size: body.byteLength,
      expiresAtMs,
    };
    await fs.writeFile(metaPath, JSON.stringify(meta, null, 2), 'utf-8');
  },

  async getObject(key) {
    const dir = resolveKeyDir(key);
    const dataPath = path.join(dir, 'data');
    const metaPath = path.join(dir, META_FILE_NAME);
    try {
      const [buf, metaRaw] = await Promise.all([
        fs.readFile(dataPath),
        fs.readFile(metaPath, 'utf-8'),
      ]);
      const meta: StoredObjectMeta = JSON.parse(metaRaw);
      if (Date.now() >= meta.expiresAtMs) {
        return null;
      }
      return { body: buf, contentType: meta.contentType, meta };
    } catch {
      return null;
    }
  },

  async deleteObject(key) {
    const dir = resolveKeyDir(key);
    await fs.rm(dir, { recursive: true, force: true });
  },

  async cleanupExpired() {
    const base = path.join(process.cwd(), config.localStoreDir);
    try {
      const entries = await fs.readdir(base, { withFileTypes: true });
      let deleted = 0;
      // Process directories sequentially to avoid unbounded parallel fs ops
      for (const e of entries) {
        if (!e.isDirectory()) continue;
        const dir = path.join(base, e.name);
        const metaPath = path.join(dir, META_FILE_NAME);
        try {
          const metaRaw = await fs.readFile(metaPath, 'utf-8');
          const meta: StoredObjectMeta = JSON.parse(metaRaw);
          if (Date.now() >= meta.expiresAtMs) {
            await fs.rm(dir, { recursive: true, force: true });
            deleted += 1;
          }
        } catch {
          // ignore unreadable folders
        }
      }
      return deleted;
    } catch {
      return 0;
    }
  },
};



