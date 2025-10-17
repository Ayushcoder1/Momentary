export interface StoredObjectMeta {
  key: string;
  contentType: string;
  size: number;
  // epoch ms when object expires
  expiresAtMs: number;
}

export interface StorageProvider {
  putObject: (params: {
    key: string;
    body: Buffer;
    contentType: string;
    expiresAtMs: number;
  }) => Promise<void>;

  getObject: (key: string) => Promise<{ body: Buffer; contentType: string; meta: StoredObjectMeta } | null>;

  deleteObject: (key: string) => Promise<void>;

  // Remove any expired objects. Returns number deleted.
  cleanupExpired: () => Promise<number>;
}



