import prisma from "@/lib/prisma"
import * as bcrypt from 'bcrypt'


export async function GET(request: Request) {
 try {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, password: true, role: true },
    orderBy: [
      {
        role: 'asc',
      }
    ],    
  })
  return new Response(JSON.stringify({
    responsecode : 1,
    responsemsg : 'success',
    responsedata : users,

  }))

 } catch (error) {
  console.log(error);
  
 }
}

interface RequestBody{
    name: string;
    email: string;
    password: string;
    role: string;
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
        responsemsg : 'User Telah Terdaftar',
        responsedata : [],

    }), {status: 400})

    const user = await prisma.user.create({
        data: {
            name: body.name,
            email: body.email,
            password: await bcrypt.hash(body.password, 10),
        }
    })

    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, password: true, role: true },
      orderBy: [
        {
          role: 'asc',
        }
      ],    
    })
    return new Response(JSON.stringify({
      responsecode : 1,
      responsemsg : 'success',
      responsedata : users,
  
    }))
}
