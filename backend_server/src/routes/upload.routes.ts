import { Router } from 'express'

import { uploadFile } from '@/controllers/upload.controller'
import { verifyJWT } from '@/middlewares/auth.middleware'
import { upload } from '@/middlewares/multer.middleware'

const router = Router()

router.use(verifyJWT)

router.post('/image', upload.single('image'), uploadFile)

export default router
