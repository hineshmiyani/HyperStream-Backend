/* eslint-disable no-console */
import dotenv from 'dotenv'

import { app } from '@/app'
import { connectPrisma } from '@/db/prisma'
import ENV from '@/env'

dotenv.config({
  path: './.env',
})

const PORT = ENV.PORT

connectPrisma()
  .then(() => {
    app.on('error', (error) => {
      // eslint-disable-next-line no-console
      console.log('ERROR: ', error)
      throw error
    })

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}!`)
    })
  })
  .catch((error) => {
    console.error('Failed to connect to Prisma! ERROR: ', error)
    process.exit(1)
  })
