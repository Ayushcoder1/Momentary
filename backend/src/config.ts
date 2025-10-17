export type StorageDriver = 's3' | 'fs';

export const config = {
  port: Number(process.env.PORT) || 4000,
  storageDriver: (process.env.STORAGE_DRIVER as StorageDriver) || 'fs',
  uploadBucket: process.env.S3_BUCKET || '',
  s3Region: process.env.AWS_REGION || process.env.S3_REGION || 'us-east-1',
  s3Endpoint: process.env.S3_ENDPOINT,
  localStoreDir: process.env.LOCAL_STORE_DIR || 'data',
};



