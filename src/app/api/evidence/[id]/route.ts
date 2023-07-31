import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Evidence } from "prisma/prisma-client";
import fs from "fs";


export async function GET(request: NextRequest, { params }: { params: { id: string } } ) {
    const id = params.id
    try {
        const evidence = await prisma.evidence.findFirst({
          select: { id: true, evidenceCode: true, evidenceName: true, evidenceBobot: true, hamaId: true, hama: true, image: true },
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
    // const body: Evidence = await request.json();
    const formData = await request.formData();
    const id = params.id

    try {
        const evidence = await prisma.evidence.findFirst({
            select: { id: true, evidenceCode: true, evidenceName: true, evidenceBobot: true, hamaId: true, hama: true, image: true },

            where:{id: Number.parseInt(id)}
        })

        if (!evidence) {
              return NextResponse.json({
                responsecode : 0,
                responsemsg : 'failed',
                responsedata : 'Data tidak ditemukan',
              });
        }

        console.log(formData.get("status"));

        let image: string = evidence.image!

        if (formData.get("status") === "0") {
          console.log("0");
          image = evidence.image!

          
        } else {
          console.log("!0");

          console.log("no undefined");
          const file = formData.get("image") as unknown as Blob;
          const buffer = Buffer.from(await file.arrayBuffer());
          fs.writeFileSync(`public/evidences/${file.name}`, buffer);
    
          image = file.name
          
        }
        const updatedevidence: Evidence = await prisma.evidence.update({
            data: {
                evidenceCode: formData.get("evidenceCode")?.toString()!,
                evidenceName: formData.get("evidenceName")?.toString()!,
                evidenceBobot: formData.get("evidenceBobot")?.toString()!,
                hamaId: Number(formData.get("hamaId")?.toString()!),
                image: image
            },
            where: {
              id:Number.parseInt(id),
            },
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