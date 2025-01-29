import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface ParamsData {
    id: string
}

interface RequestData {
    content: string
    privacy: string
    userId: string
}

export async function GET(req: NextRequest, { params }: { params: ParamsData }) {
    const id = params.id

    console.log(id)

    if (!id) {
        return NextResponse.json({ message: 'Note id is required' }, { status: 400 })
    }

    const note = await prisma.note.findUnique({
        where: {
            id
        },
        include: {
            user: {
                select: {
                    name: true
                }
            }
        }
    })

    if (!note) {
        return NextResponse.json({ message: 'Note not found' }, { status: 404 })
    }

    const noteWithUser = {
        ...note,
        user: note.user.name
    }

    return NextResponse.json(noteWithUser)
}

export async function PUT(req: NextRequest, { params }: { params: ParamsData }) {
    const id = params.id
    const data: RequestData = await req.json()

    if (!id || !data.content || !data.privacy || !data.userId) {
        return NextResponse.json({ message: 'Note id, content, privacy, and userId are required' }, { status: 400 })
    }

    try {
        await prisma.note.update({
            where: {
                id,
                userId: data.userId
            },
            data: {
                content: data.content,
                privacy: data.privacy,
            }
        })

        return NextResponse.json({ message: 'Note updated' })
    } catch (err) {
        return NextResponse.json({ message: 'Error updating note: ' + err }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: ParamsData }) {
    const id = params.id

    if (!id) {
        return NextResponse.json({ message: 'Note id is required' }, { status: 400 })
    }

    try {
        await prisma.note.delete({
            where: {
                id
            }
        })

        return NextResponse.json({ message: 'Note deleted' })
    } catch (err) {
        return NextResponse.json({ message: 'Error deleting note: ' + err }, { status: 500 })
    }
}