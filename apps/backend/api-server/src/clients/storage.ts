import { StorageClient } from "@project-template/storage";

import { env } from "../env";

export const storage = new StorageClient({
  bucket: env.S3_BUCKET,
  accessKeyId: env.S3_ACCESS_KEY_ID,
  secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  endpoint: env.S3_ENDPOINT,
  region: env.S3_REGION,
});
