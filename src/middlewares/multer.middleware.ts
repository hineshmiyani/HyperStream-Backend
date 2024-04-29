import multer from 'multer'
import multerS3 from 'multer-s3'

import ENV from '@/env'
import { s3Client } from '@/services/s3Client.service'

const storage = multerS3({
  s3: s3Client,
  bucket: ENV.AWS_S3_BUCKET_NAME,
  metadata: function (_req, file, cb) {
    cb(null, { fieldName: file.fieldname })
  },
  key: function (_req, file, cb) {
    // Split the filename and remove the last part as the extension
    const parts = file.originalname?.split('.')

    const fileExtension = parts?.pop() || '' // Safely get the last element as the extension
    const fileName = parts?.join('.') || '' // Join the remaining parts with a dot

    cb(null, `${fileName}_${Date.now().toString()}.${fileExtension}`)
  },
})

const upload = multer({ storage })

export { upload }
