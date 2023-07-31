import prisma from "@/lib/prisma"
import { Evidence } from "prisma/prisma-client";
import fs from "fs";

export async function GET(request: Request) {
 try {
  const evidences = await prisma.evidence.findMany({
    select: { id: true, evidenceCode: true, evidenceName: true, evidenceBobot: true, hamaId: true, hama: true, image: true },
    orderBy: [
      {
        hamaId: 'asc',
      },
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

export async function POST(request: Request) {
  // const body: Evidence = await request.json();
  const formData = await request.formData();
 try {

  const evidenceExist = await prisma.evidence.findFirst({
    where:{
        evidenceCode: formData.get("evidenceCode")?.toString()
    }
  })

  if (evidenceExist) {
    return new Response(JSON.stringify({
      responsecode : 0,
      responsemsg : 'failed',
      responsedata : 'evidence Code harus unik',
    }))
  }

  console.log(formData.get("evidenceCode"));

  let image: string = ""

  if (formData.get("image") !== undefined) {
      const file = formData.get("image") as unknown as Blob;
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(`public/evidences/${file.name}`, buffer);

      image = file.name
  }
    const evidence = await prisma.evidence.create({
        data: {
            evidenceCode: formData.get("evidenceCode")?.toString()!,
            evidenceName: formData.get("evidenceName")?.toString()!,
            evidenceBobot: formData.get("evidenceBobot")?.toString()!,
            hamaId: Number(formData.get("hamaId")?.toString()!),
            image: image
        }
    })

    const evidences = await prisma.evidence.findMany({
    select: { id: true, evidenceCode: true, evidenceName: true, evidenceBobot: true, hamaId: true, hama: true, image: true },
    orderBy: [
      {
        hamaId: 'asc',
      },
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
