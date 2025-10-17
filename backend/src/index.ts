import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import filesRouter from './routes/files.js';
import { startCleanupJob } from './jobs/cleanup.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/files', filesRouter);

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

const port = Number(process.env.PORT) || 4000;
const stopCleanup = startCleanupJob();
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`TempShare backend listening on http://localhost:${port}`);
});

process.on('SIGINT', () => {
  stopCleanup();
  process.exit(0);
});


