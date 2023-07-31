import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from 'bcrypt'
import { User } from "prisma/prisma-client";

export async function GET(request: NextRequest, { params }: { params: { id: string } } ) {
    const id = params.id
    try {
        const user = await prisma.user.findFirst({
          select: { id: true, name: true, email: true, password: true, role: true },
            where:{id: Number.parseInt(id)}
        })

        if (!user) {
              return NextResponse.json({
                responsecode : 0,
                responsemsg : 'failed',
                responsedata : 'Data tidak ditemukan',
              });
        }

        return NextResponse.json({
            responsecode : 1,
            responsemsg : 'success',
            responsedata : user,
        });


    } catch (error) {
        console.log(error);
        
    }
  
  }

  export async function PATCH(request: NextRequest, { params }: { params: { id: string } } ) {
    const body: User = await request.json();
    
    const id = params.id
    try {
        const user = await prisma.user.findFirst({
          select: { id: true, name: true, email: true, password: true, role: true },  
          where:{id: Number.parseInt(id)}
        })

        if (!user) {
              return NextResponse.json({
                responsecode : 0,
                responsemsg : 'failed',
                responsedata : 'Data tidak ditemukan',
              });
        }

        let password = user.password
        if (body.password !== null || body.password !== '' || body.password !== undefined) {
            password = await bcrypt.hash(body.password!, 10)
        }

        const updateduser: User = await prisma.user.update({
            data: {
                name: body.name,
                email: body.email,
                password: password,
                role: body.role,
            },
            where: {
              id:Number.parseInt(id),
            },
          })

          const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, password: true, role: true },  
            orderBy: [
              {
                role: 'asc',
              },
              {
                name: 'asc'
              }
            ],    
          })

        return NextResponse.json({
            responsecode : 1,
            responsemsg : 'success',
            responsedata : users,
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
        const user = await prisma.user.findFirst({
          select: { id: true, name: true, email: true, password: true, role: true },  
            where:{id: Number.parseInt(id)}
        })

        if (!user) {
              return NextResponse.json({
                responsecode : 0,
                responsemsg : 'failed',
                responsedata : 'Data tidak ditemukan',
              });
        }

        const updateduser: User = await prisma.user.delete({
            where: {
              id: Number.parseInt(id),
            },
          })

          const users = await prisma.user.findMany({
          select: { id: true, name: true, email: true, password: true, role: true },  
            orderBy: [
              {
                role: 'asc',
              },
              {
                name: 'asc',
              }
            ],    
          })

        return NextResponse.json({
            responsecode : 1,
            responsemsg : 'success',
            responsedata : users,
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