import { PrismaClient } from "@prisma/client"


let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  // In development, use a global variable to prevent multiple instances during hot reloading
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient()
  }
  prisma = (global as any).prisma
}

export default prisma