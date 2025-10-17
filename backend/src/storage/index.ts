import { config } from '../config.js';
import { StorageProvider } from './types.js';
import { fsProvider } from './fsProvider.js';
import { s3Provider } from './s3Provider.js';

export function getStorage(): StorageProvider {
  if (config.storageDriver === 's3') return s3Provider;
  return fsProvider;
}



