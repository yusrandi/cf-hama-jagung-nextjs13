import prisma from "@/lib/prisma"
import * as bcrypt from 'bcrypt'


interface RequestBody{
    name: string;
    email: string;
    password: string;
}
export async function POST(request:Request) {

    const body: RequestBody = await request.json();

    const userExist = await prisma.user.findFirst({
        where:{
            email: body.email
        }
    })

    
    if (userExist) return new Response(JSON.stringify({
        responsecode : 0,
        responsemsg : 'User Not Found',
        responsedata : {},

    }), {status: 400})

    const user = await prisma.user.create({
        data: {
            name: body.name,
            email: body.email,
            password: await bcrypt.hash(body.password, 10),
        }
    })

    const {password, createdAt,updatedAt, ...result} = user
    return new Response(JSON.stringify(result))
}