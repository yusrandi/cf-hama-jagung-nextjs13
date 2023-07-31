import prisma from "@/lib/prisma";
import CurrentDateTime from "@/utils/currentdatetime";
import { NextRequest, NextResponse } from "next/server";
import { Laporan } from "prisma/prisma-client";
export async function GET(request: NextRequest, { params }: { params: { id: string } } ) {
    const id = params.id
    try {
        const laporan = await prisma.laporan.findFirst({
            select: { id: true, tanggal: true, userName: true, hamaName: true, cf: true },
            where:{id: Number.parseInt(id)}
        })

        if (!laporan) {
              return NextResponse.json({
                responsecode : 0,
                responsemsg : 'failed',
                responsedata : 'Data tidak ditemukan',
              });
        }

        return NextResponse.json({
            responsecode : 1,
            responsemsg : 'success',
            responsedata : laporan,
        });


    } catch (error) {
        console.log(error);
        
    }
  
  }

  export async function PATCH(request: NextRequest, { params }: { params: { id: string } } ) {
    const body: Laporan = await request.json();
    const id = params.id
    try {
        const laporan = await prisma.laporan.findFirst({
            select: { id: true, tanggal: true, userName: true, hamaName: true, cf: true },
            where:{id: Number.parseInt(id)}
        })

        if (!laporan) {
              return NextResponse.json({
                responsecode : 0,
                responsemsg : 'failed',
                responsedata : 'Data tidak ditemukan',
              });
        }

        const updatedlaporan: Laporan = await prisma.laporan.update({
            data: {
                tanggal: CurrentDateTime(),
                userName: body.userName,
                hamaName: body.hamaName,
                cf: body.cf
            },
            where: {
              id:Number.parseInt(id),
            },
          })

          const laporans = await prisma.laporan.findMany({
            select: { id: true, tanggal: true, userName: true, hamaName: true, cf: true },
            orderBy: [
              {
                tanggal: 'desc',
              }
            ],    
          })

        return NextResponse.json({
            responsecode : 1,
            responsemsg : 'success',
            responsedata : laporans,
        });


    } catch (error) {
        console.log(error);
        return NextResponse.json({
          responsecode : 0,
          responsemsg : 'failed',
          responsedata : error,
      });
        
    }
  
  }
  
  export async function DELETE(request: Request, { params }: { params: { id: string } } ) {
    const id = params.id
    try {
        const laporan = await prisma.laporan.findFirst({
            select: { id: true, tanggal: true, userName: true, hamaName: true, cf: true },
            where:{id: Number.parseInt(id)}
        })

        if (!laporan) {
              return NextResponse.json({
                responsecode : 0,
                responsemsg : 'failed',
                responsedata : 'Data tidak ditemukan',
              });
        }

        const updatedlaporan: Laporan = await prisma.laporan.delete({
            where: {
              id: Number.parseInt(id),
            },
          })

          const laporans = await prisma.laporan.findMany({
            select: { id: true, tanggal: true, userName: true, hamaName: true, cf: true },
            orderBy: [
              {
                tanggal: 'desc',
              }
            ],    
          })

        return NextResponse.json({
            responsecode : 1,
            responsemsg : 'success',
            responsedata : laporans,
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            responsecode : 0,
            responsemsg : 'failed',
            responsedata : error,
        });
    }
  
  }