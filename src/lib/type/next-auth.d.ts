import NextAuth from 'next-auth'
import { Role } from 'prisma/prisma-client'

declare module 'next-auth' {
    interface Session{
        user: {
            id: number
            name: string
            email: string
            role: Role
            accessToken: string 
        }
    }
} 