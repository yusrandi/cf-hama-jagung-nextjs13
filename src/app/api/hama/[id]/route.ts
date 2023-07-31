import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Hama } from "prisma/prisma-client";
import fs from "fs";

export async function GET(request: NextRequest, { params }: { params: { id: string } } ) {
    const id = params.id
    try {
        const hama = await prisma.hama.findFirst({
            select: { id: true, hamaCode: true, hamaName: true, evidences: true, image: true },
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
    // const body: Hama = await request.json();
    const formData = await request.formData();
    const id = params.id

    try {
        const hama = await prisma.hama.findFirst({
            select: { hamaCode: true, hamaName: true, evidences: true, image: true },
            where:{id: Number.parseInt(id)}
        })

        if (!hama) {
              return NextResponse.json({
                responsecode : 0,
                responsemsg : 'failed',
                responsedata : 'Data tidak ditemukan',
              });
        }
        console.log(formData.get("status"));
        let image: string = hama.image!

        if (formData.get("status") === "0") {
          console.log("0");
          image = hama.image!
        } else {
          console.log("!0");

          console.log("no undefined");
          const file = formData.get("image") as unknown as Blob;
          const buffer = Buffer.from(await file.arrayBuffer());
          fs.writeFileSync(`public/hamas/${file.name}`, buffer);
          image = file.name
          
        }

        const updatedhama: Hama = await prisma.hama.update({
            data: {
                hamaCode: formData.get("hamaCode")?.toString()!,
                hamaName: formData.get("hamaName")?.toString()!,
                image: image
            },
            where: {
              id:Number.parseInt(id),
            },
          })

          const hamas = await prisma.hama.findMany({
            select: { id: true, hamaName: true, hamaCode: true, evidences: true, image: true },
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
            select: { hamaCode: true, hamaName: true, evidences: true, image: true },
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
            select: { id: true,hamaCode: true, hamaName: true, evidences: true, image: true },
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