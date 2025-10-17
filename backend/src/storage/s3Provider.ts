import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { fromEnv } from '@aws-sdk/credential-providers';
import { StorageProvider, StoredObjectMeta } from './types.js';
import { config } from '../config.js';
import { Readable } from 'stream';

function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

const s3 = new S3Client({
  region: config.s3Region,
  endpoint: config.s3Endpoint,
  credentials: fromEnv(),
  forcePathStyle: Boolean(config.s3Endpoint),
});

const META_PREFIX = 'meta/';
const DATA_PREFIX = 'data/';

export const s3Provider: StorageProvider = {
  async putObject({ key, body, contentType, expiresAtMs }) {
    const meta: StoredObjectMeta = { key, contentType, size: body.byteLength, expiresAtMs };
    await Promise.all([
      s3.send(new PutObjectCommand({ Bucket: config.uploadBucket, Key: `${DATA_PREFIX}${key}`, Body: body, ContentType: contentType })),
      s3.send(new PutObjectCommand({ Bucket: config.uploadBucket, Key: `${META_PREFIX}${key}.json`, Body: JSON.stringify(meta), ContentType: 'application/json' })),
    ]);
  },

  async getObject(key) {
    try {
      const metaRes = await s3.send(new GetObjectCommand({ Bucket: config.uploadBucket, Key: `${META_PREFIX}${key}.json` }));
      const metaBuf = await streamToBuffer(metaRes.Body as Readable);
      const meta: StoredObjectMeta = JSON.parse(metaBuf.toString('utf-8'));
      if (Date.now() >= meta.expiresAtMs) return null;
      const objRes = await s3.send(new GetObjectCommand({ Bucket: config.uploadBucket, Key: `${DATA_PREFIX}${key}` }));
      const body = await streamToBuffer(objRes.Body as Readable);
      return { body, contentType: meta.contentType, meta };
    } catch {
      return null;
    }
  },

  async deleteObject(key) {
    await Promise.all([
      s3.send(new DeleteObjectCommand({ Bucket: config.uploadBucket, Key: `${DATA_PREFIX}${key}` })),
      s3.send(new DeleteObjectCommand({ Bucket: config.uploadBucket, Key: `${META_PREFIX}${key}.json` })),
    ]);
  },

  async cleanupExpired() {
    // Brute-force: list meta objects and delete those expired
    let token: string | undefined;
    let deleted = 0;
    do {
      const list = await s3.send(new ListObjectsV2Command({ Bucket: config.uploadBucket, Prefix: META_PREFIX, ContinuationToken: token }));
      token = list.IsTruncated ? list.NextContinuationToken : undefined;
      const contents = list.Contents ?? [];
      for (const obj of contents) {
        if (!obj.Key) continue;
        try {
          const metaRes = await s3.send(new GetObjectCommand({ Bucket: config.uploadBucket, Key: obj.Key }));
          const metaBuf = await streamToBuffer(metaRes.Body as Readable);
          const meta: StoredObjectMeta = JSON.parse(metaBuf.toString('utf-8'));
          if (Date.now() >= meta.expiresAtMs) {
            const key = obj.Key.replace(META_PREFIX, '').replace(/\.json$/, '');
            await this.deleteObject(key);
            deleted += 1;
          }
        } catch {
          // ignore
        }
      }
    } while (token);
    return deleted;
  },
};



