import { Request, Response, Router } from 'express'

import { HttpStatusCodes } from '@/constants/httpStatusCodes'
import { ApiResponse } from '@/utils/ApiResponse'

const router = Router()

router.get('/', (_req: Request, res: Response) => {
  res
    .status(HttpStatusCodes.OK)
    .json(new ApiResponse({ message: 'Health Check: Server is running properly.' }))
})

export default router
