// // lib/prisma.ts
// import { PrismaClient } from '@prisma/client'

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined
// }

// class AuthenticatedPrismaClient extends PrismaClient {
//   constructor(userId?: string) {
//     super()
    
//     if (userId) {
//       // Add RLS-like middleware
//       this.$use(async (params: any, next: any) => {
//         // Only apply to models that need user isolation
//         const userScopedModels = ['Invoice', 'Client'] // Add other models as needed
        
//         if (userScopedModels.includes(params.model || '')) {
//           if (params.action === 'findUnique' || params.action === 'findFirst') {
//             params.args.where = { ...params.args.where, userId }
//           } else if (params.action === 'findMany') {
//             params.args.where = params.args.where ? { ...params.args.where, userId } : { userId }
//           } else if (['update', 'updateMany', 'delete', 'deleteMany'].includes(params.action)) {
//             params.args.where = { ...params.args.where, userId }
//           } else if (params.action === 'create') {
//             params.args.data = { ...params.args.data, userId }
//           }
//         }
        
//         return next(params)
//       })
//     }
//   }
// }

// // For server-side usage with authenticated user
// export function createUserPrisma(userId: string) {
//   return new AuthenticatedPrismaClient(userId)
// }

// // For unauthenticated or admin usage
// export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// export default prisma



// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// For unauthenticated or admin usage
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// For server-side usage with authenticated user
export function createUserPrisma(userId: string) {
  const userPrisma = prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const userScopedModels = ['Invoice', 'Client']
          
          if (!userScopedModels.includes(model || '')) {
            return query(args)
          }

          // Use type assertions for specific operations
          const operationArgs = args as any
          
          if (['findUnique', 'findFirst', 'findMany', 'update', 'updateMany', 'delete', 'deleteMany'].includes(operation)) {
            if (operationArgs.where) {
              operationArgs.where = { ...operationArgs.where, userId }
            } else {
              operationArgs.where = { userId }
            }
          } else if (operation === 'create') {
            if (operationArgs.data) {
              operationArgs.data = { ...operationArgs.data, userId }
            }
          }
          
          return query(operationArgs)
        },
      },
    },
  })

  return userPrisma
}

export default prisma