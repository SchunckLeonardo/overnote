import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

type RequestData = {
    content: string
    privacy: string
    userId: string
}

export async function POST(req: NextRequest) {
    const data: RequestData = await req.json()

    console.log(data)

    if (!data.content || !data.privacy || !data.userId) {
        return NextResponse.json({ message: 'Content, privacy, and userId are required' }, { status: 400 })
    }

    try {
        await prisma.note.create({
            data: {
                content: data.content,
                privacy: data.privacy,
                userId: data.userId
            }
        })

        return NextResponse.json({ message: 'Note created' }, { status: 201 })
    } catch (err) {
        return NextResponse.json({ message: 'Error creating note: ' + err }, { status: 500 })
    }
}

export async function GET() {
    const notes = await prisma.note.findMany({
        where: {
            privacy: {
                equals: 'public'
            }
        }, include: {
            user: {
                select: {
                    name: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const notesWithUser = notes.map(note => {
        return {
            id: note.id,
            content: note.content,
            privacy: note.privacy,
            user: note.user.name
        }
    })

    return NextResponse.json(notesWithUser)
}