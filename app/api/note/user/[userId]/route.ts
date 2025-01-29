import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    const userId = params.userId

    const notes = await prisma.note.findMany({
        where: {
            userId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return NextResponse.json(notes)
}