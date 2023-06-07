import { PrismaClient } from "prisma/prisma-client";
import prisma from '@/lib/prisma'
import * as bcrypt from 'bcrypt'
import { signJwtAccesToken } from "@/lib/jwt";

interface RequestBody{
    username: string;
    password: string;
}
export async function POST(request:Request) {
    const body: RequestBody = await request.json();
    
    const user = await prisma.user.findFirst({
        where: {
            email: body.username
        }
    })

    if (user && (await bcrypt.compare(body.password, user.password!))){
        const {password,createdAt,updatedAt, ...userWithoutPass} = user

        const accessToken = signJwtAccesToken(userWithoutPass)
        const result = {
            ...userWithoutPass, accessToken
        }

        return new Response(JSON.stringify(result))
    }else return new Response(JSON.stringify(null))
}