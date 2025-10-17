import express from 'express';
import multer from 'multer';
import { z } from 'zod';
import { getStorage } from '../storage/index.js';
import mime from 'mime';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

const ttlMinutesSchema = z.union([z.literal(10), z.literal(20), z.literal(30)]);

function generateCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 4; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const ttlMinutes = ttlMinutesSchema.parse(Number(req.body.ttlMinutes));
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'file is required' });
    const code = generateCode();
    const contentType = file.mimetype || mime.getType(file.originalname) || 'application/octet-stream';
    const expiresAtMs = Date.now() + ttlMinutes * 60 * 1000;
    await getStorage().putObject({ key: code, body: file.buffer, contentType, expiresAtMs });
    return res.json({ code, expiresAt: new Date(expiresAtMs).toISOString() });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
});

router.get('/:code', async (req, res) => {
  const code = String(req.params.code || '').toUpperCase();
  const result = await getStorage().getObject(code);
  if (!result) return res.status(404).json({ error: 'Not found or expired' });
  res.setHeader('Content-Type', result.contentType);
  res.setHeader('Content-Length', String(result.meta.size));
  return res.send(result.body);
});

export default router;




