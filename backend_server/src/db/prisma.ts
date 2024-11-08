/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

const connectPrisma = async (): Promise<void> => {
  try {
    prisma = new PrismaClient()
    await prisma.$connect()

    console.log('Prisma connected successfully!')
  } catch (error) {
    console.error('Failed to connect to Prisma: ', error)
    process.exit(1)
  }
}

const disconnectPrisma = async (): Promise<void> => {
  try {
    await prisma?.$disconnect()

    console.log('Prisma disconnected successfully!')
  } catch (error) {
    console.error('Failed to disconnect from Prisma: ', error)
  }
}

export { prisma, connectPrisma, disconnectPrisma }
