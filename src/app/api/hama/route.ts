import prisma from "@/lib/prisma"
import { Hama } from "prisma/prisma-client";

export async function GET(request: Request) {
 try {
  const hamas = await prisma.hama.findMany({
    select: { id: true, hamaCode: true, hamaName: true, evidences: true },
    orderBy: [
      {
        hamaCode: 'asc',
      }
    ],    
  })
  return new Response(JSON.stringify({
    responsecode : 1,
    responsemsg : 'success',
    responsedata : hamas,

  }))

 } catch (error) {
  console.log(error);
  
 }
}

export async function POST(request: Request) {
  const body: Hama = await request.json();

 try {

  const hamaExist = await prisma.hama.findFirst({
    where:{
        hamaCode: body.hamaCode
    }
  })

  if (hamaExist) {
    return new Response(JSON.stringify({
      responsecode : 0,
      responsemsg : 'failed',
      responsedata : 'hama Code harus unik',
    }))
  }

    const hama = await prisma.hama.create({
        data: {
            hamaCode: body.hamaCode,
            hamaName: body.hamaName
        }
    })
    
    const hamas = await prisma.hama.findMany({
      select: { id: true,hamaCode: true, hamaName: true, evidences: true },
      orderBy: [
        {
          hamaCode: 'asc',
        }
      ],    
    })

    return new Response(JSON.stringify({
      responsecode : 1,
      responsemsg : 'success',
      responsedata : hamas,
    }))

 } catch (error) {
  console.log(error);

  return new Response(JSON.stringify({
    responsecode : 0,
    responsemsg : 'failed',
    responsedata : error,
  }))
  
 }

}
