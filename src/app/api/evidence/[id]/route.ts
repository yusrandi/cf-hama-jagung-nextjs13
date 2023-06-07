import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Evidence } from "prisma/prisma-client";
export async function GET(request: NextRequest, { params }: { params: { id: string } } ) {
    const id = params.id
    try {
        const evidence = await prisma.evidence.findFirst({
        select: { id: true, evidenceCode: true, evidenceName: true, evidenceBobot: true, hamaId: true, hama: true },

            where:{id: Number.parseInt(id)}
        })

        if (!evidence) {
              return NextResponse.json({
                responsecode : 0,
                responsemsg : 'failed',
                responsedata : 'Data tidak ditemukan',
              });
        }

        return NextResponse.json({
            responsecode : 1,
            responsemsg : 'success',
            responsedata : evidence,
        });


    } catch (error) {
        console.log(error);
        
    }
  
  }

  export async function PATCH(request: NextRequest, { params }: { params: { id: string } } ) {
    const body: Evidence = await request.json();
    
    const id = params.id
    try {
        const evidence = await prisma.evidence.findFirst({
            select: { id: true, evidenceCode: true, evidenceName: true, evidenceBobot: true, hamaId: true, hama: true },

            where:{id: Number.parseInt(id)}
        })

        if (!evidence) {
              return NextResponse.json({
                responsecode : 0,
                responsemsg : 'failed',
                responsedata : 'Data tidak ditemukan',
              });
        }

        const updatedevidence: Evidence = await prisma.evidence.update({
            data: {
                evidenceCode: body.evidenceCode,
                evidenceName: body.evidenceName,
                evidenceBobot: body.evidenceBobot,
                hamaId: body.hamaId
            },
            where: {
              id:Number.parseInt(id),
            },
          })

          const evidences = await prisma.evidence.findMany({
            select: { id: true, evidenceCode: true, evidenceName: true, evidenceBobot: true, hamaId: true, hama: true },

            orderBy: [
              {
                evidenceCode: 'asc',
              }
            ],    
          })

        return NextResponse.json({
            responsecode : 1,
            responsemsg : 'success',
            responsedata : evidences,
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
        const evidence = await prisma.evidence.findFirst({
            select: { id: true, evidenceCode: true, evidenceName: true, evidenceBobot: true, hamaId: true, hama: true },
            where:{id: Number.parseInt(id)}
        })

        if (!evidence) {
              return NextResponse.json({
                responsecode : 0,
                responsemsg : 'failed',
                responsedata : 'Data tidak ditemukan',
              });
        }

        const deleteDevidence: Evidence = await prisma.evidence.delete({
            where: {
              id: Number.parseInt(id),
            },
          })

          const evidences = await prisma.evidence.findMany({
            select: { id: true, evidenceCode: true, evidenceName: true, evidenceBobot: true, hamaId: true, hama: true },
            orderBy: [
              {
                evidenceCode: 'asc',
              }
            ],    
          })

        return NextResponse.json({
            responsecode : 1,
            responsemsg : 'success',
            responsedata : evidences,
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