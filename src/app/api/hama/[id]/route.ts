import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Hama } from "prisma/prisma-client";
export async function GET(request: NextRequest, { params }: { params: { id: string } } ) {
    const id = params.id
    try {
        const hama = await prisma.hama.findFirst({
            select: { id: true, hamaCode: true, hamaName: true, evidences: true },
            where:{id: Number.parseInt(id)}
        })

        if (!hama) {
              return NextResponse.json({
                responsecode : 0,
                responsemsg : 'failed',
                responsedata : 'Data tidak ditemukan',
              });
        }

        return NextResponse.json({
            responsecode : 1,
            responsemsg : 'success',
            responsedata : hama,
        });


    } catch (error) {
        console.log(error);
        
    }
  
  }

  export async function PATCH(request: NextRequest, { params }: { params: { id: string } } ) {
    const body: Hama = await request.json();
    
    const id = params.id
    try {
        const hama = await prisma.hama.findFirst({
            select: { hamaCode: true, hamaName: true, evidences: true },
            where:{id: Number.parseInt(id)}
        })

        if (!hama) {
              return NextResponse.json({
                responsecode : 0,
                responsemsg : 'failed',
                responsedata : 'Data tidak ditemukan',
              });
        }

        const updatedhama: Hama = await prisma.hama.update({
            data: {
                hamaCode: body.hamaCode,
                hamaName: body.hamaName
            },
            where: {
              id:Number.parseInt(id),
            },
          })

          const hamas = await prisma.hama.findMany({
            select: { id: true, hamaName: true, hamaCode: true, evidences: true },
            orderBy: [
              {
                hamaCode: 'asc',
              }
            ],    
          })

        return NextResponse.json({
            responsecode : 1,
            responsemsg : 'success',
            responsedata : hamas,
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
        const hama = await prisma.hama.findFirst({
            select: { hamaCode: true, hamaName: true, evidences: true },
            where:{id: Number.parseInt(id)}
        })

        if (!hama) {
              return NextResponse.json({
                responsecode : 0,
                responsemsg : 'failed',
                responsedata : 'Data tidak ditemukan',
              });
        }

        const updatedhama: Hama = await prisma.hama.delete({
            where: {
              id: Number.parseInt(id),
            },
          })

          const hamas = await prisma.hama.findMany({
            select: { id: true,hamaCode: true, hamaName: true, evidences: true },
            orderBy: [
              {
                hamaCode: 'asc',
              }
            ],    
          })

        return NextResponse.json({
            responsecode : 1,
            responsemsg : 'success',
            responsedata : hamas,
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