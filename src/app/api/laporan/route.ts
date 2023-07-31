import prisma from "@/lib/prisma"
import CurrentDateTime from "@/utils/currentdatetime";
import { Laporan } from "prisma/prisma-client";

export async function GET(request: Request) {
 try {
  const laporans = await prisma.laporan.findMany({
    select: { id: true, tanggal: true, userName: true, hamaName: true, cf: true },
    orderBy: [
      {
        tanggal: 'desc',
      }
    ],    
  })
  return new Response(JSON.stringify({
    responsecode : 1,
    responsemsg : 'success',
    responsedata : laporans,

  }))

 } catch (error) {
  console.log(error);
  
 }
}

export async function POST(request: Request) {
  const body: Laporan = await request.json();

 try {
  const laporan = await prisma.laporan.create({
        data: {
            tanggal: CurrentDateTime(),
            userName: body.userName,
            hamaName: body.hamaName,
            cf: body.cf
        }
    })
    
    const laporans = await prisma.laporan.findMany({
      select: { id: true, tanggal: true, userName: true, hamaName: true, cf: true },
      orderBy: [
        {
          tanggal: 'desc',
        }
      ],    
    })

    return new Response(JSON.stringify({
      responsecode : 1,
      responsemsg : 'success',
      responsedata : laporans,
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
