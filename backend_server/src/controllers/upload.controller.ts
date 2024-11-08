import { Request, Response } from 'express'

import { HttpStatusCodes } from '@/constants/httpStatusCodes'
import { ApiResponse } from '@/utils/ApiResponse'
import { asyncHandler } from '@/utils/asyncHandler'

const uploadFile = asyncHandler((req: Request, res: Response) => {
  const image = req.file

  res
    .status(HttpStatusCodes.OK)
    .json(new ApiResponse({ data: image, message: 'File uploaded successfully.' }))
})

export { uploadFile }
