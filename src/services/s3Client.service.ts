import { S3Client } from '@aws-sdk/client-s3'

import ENV from '@/env'

// Initialize S3 client
const s3Client = new S3Client({
  region: ENV.AWS_REGION,
  credentials: {
    accessKeyId: ENV.AWS_ACCESS_KEY_ID,
    secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY,
  },
})

export { s3Client }
