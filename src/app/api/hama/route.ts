import prisma from "@/lib/prisma"
import { Hama } from "prisma/prisma-client";
import NextCors from 'nextjs-cors';
import fs from "fs";



export async function GET(request: Request) {

 try {
  const hamas = await prisma.hama.findMany({
    select: { id: true, hamaCode: true, hamaName: true, evidences: true, image: true },
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

  }) , {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });

 } catch (error) {
  console.log(error);
  
 }
}

export async function POST(request: Request) {
  // const body: Hama = await request.json();

  const formData = await request.formData();

 try {

  const hamaExist = await prisma.hama.findFirst({
    where:{
        hamaCode: formData.get("hamaCode")?.toString()
    }
  })

  if (hamaExist) {
    return new Response(JSON.stringify({
      responsecode : 0,
      responsemsg : 'failed',
      responsedata : 'hama Code harus unik',
    }))
  }

  console.log(formData.get("hamaCode"));

  let image: string = ""

  if (formData.get("image") !== undefined) {
      const file = formData.get("image") as unknown as Blob;
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(`public/hamas/${file.name}`, buffer);
      image = file.name
  }

    const hama = await prisma.hama.create({
        data: {
            hamaCode: formData.get("hamaCode")?.toString(),
            hamaName: formData.get("hamaName")?.toString(),
            image: image
        }
    })
    
    const hamas = await prisma.hama.findMany({
      select: { id: true,hamaCode: true, hamaName: true, evidences: true, image: true },
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
