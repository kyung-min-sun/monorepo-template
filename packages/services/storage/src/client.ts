import { createId } from "@paralleldrive/cuid2";
import { S3Client } from "bun";

export interface StorageConfig {
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  endpoint?: string;
  region?: string;
}

/**
 * StorageClient - A wrapper over Bun's built-in S3 client
 *
 * Uses Bun.s3 APIs for S3-compatible storage without external AWS dependencies.
 * Works with any S3-compatible provider (AWS S3, Cloudflare R2, MinIO, etc.)
 */
export class StorageClient {
  private s3: S3Client;
  private bucket: string;

  constructor(config: StorageConfig) {
    this.bucket = config.bucket;
    this.s3 = new S3Client({
      bucket: config.bucket,
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      endpoint: config.endpoint,
      region: config.region,
    });
  }

  /**
   * Get file contents by key
   */
  async get(key: string): Promise<Uint8Array | undefined> {
    const file = this.s3.file(key);
    const exists = await file.exists();
    if (!exists) {
      return undefined;
    }
    const arrayBuffer = await file.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  }

  /**
   * Get a presigned URL for the file
   */
  async getUrl(key: string, options?: { expiresIn?: number; filename?: string }): Promise<string> {
    const file = this.s3.file(key);
    const expiresIn = options?.expiresIn ?? 3600 * 24 * 7; // Default 7 days

    return file.presign({
      expiresIn,
      ...(options?.filename && {
        responseContentDisposition: this.buildContentDisposition(options.filename),
      }),
    });
  }

  /**
   * Save data and return the generated key
   */
  async save(data: Buffer | Uint8Array | string, contentType?: string): Promise<string> {
    const key = createId();
    const file = this.s3.file(key);

    await file.write(data, {
      type: contentType,
    });

    return key;
  }

  /**
   * Save data with a specific key
   */
  async put(key: string, data: Buffer | Uint8Array | string, contentType?: string): Promise<void> {
    const file = this.s3.file(key);
    await file.write(data, {
      type: contentType,
    });
  }

  /**
   * Delete a file by key
   */
  async delete(key: string): Promise<void> {
    const file = this.s3.file(key);
    await file.delete();
  }

  /**
   * Check if a file exists
   */
  async exists(key: string): Promise<boolean> {
    const file = this.s3.file(key);
    return file.exists();
  }

  /**
   * Build Content-Disposition header value with UTF-8 filename support
   */
  private buildContentDisposition(filename: string): string {
    const asciiFilename = filename.replace(/[^\x20-\x7E]/g, "");
    return `inline; filename="${asciiFilename}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
  }
}
