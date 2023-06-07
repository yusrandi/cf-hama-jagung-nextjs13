import prisma from "@/lib/prisma"
import { Evidence } from "prisma/prisma-client";

export async function GET(request: Request) {
 try {
  const evidences = await prisma.evidence.findMany({
    select: { id: true, evidenceCode: true, evidenceName: true, evidenceBobot: true, hamaId: true, hama: true },
    orderBy: [
      {
        hamaId: 'asc',
      }
    ],    
  })
  return new Response(JSON.stringify({
    responsecode : 1,
    responsemsg : 'success',
    responsedata : evidences,

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

export async function POST(request: Request) {
  const body: Evidence = await request.json();
  console.log({body});
  

 try {

  const evidenceExist = await prisma.evidence.findFirst({
    where:{
        evidenceCode: body.evidenceCode
    }
  })

  if (evidenceExist) {
    return new Response(JSON.stringify({
      responsecode : 0,
      responsemsg : 'failed',
      responsedata : 'evidence Code harus unik',
    }))
  }

    const evidence = await prisma.evidence.create({
        data: {
            evidenceCode: body.evidenceCode,
            evidenceName: body.evidenceName,
            evidenceBobot: body.evidenceBobot,
            hamaId: body.hamaId
        }
    })
    
    const evidences = await prisma.evidence.findMany({
    select: { id: true, evidenceCode: true, evidenceName: true, evidenceBobot: true, hamaId: true, hama: true },

      orderBy: [
        {
          evidenceCode: 'asc',
        }
      ],    
    })

    return new Response(JSON.stringify({
      responsecode : 1,
      responsemsg : 'success',
      responsedata : evidences,
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
