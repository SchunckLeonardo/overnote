'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"
import { ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { extractTextFromHTML } from "@/utils/extract-text-from-html"
import { Note } from "@/contexts/note-context"

export function UsersNotes() {
    const router = useRouter()

    const { data, error } = useQuery({
        queryKey: ['all-notes'], queryFn: async (): Promise<Note[]> => {
            const response = await fetch('/api/note')
            return await response.json()
        },
        notifyOnChangeProps: ['data', 'error']
    })

    if (error || !data) {
        return null
    }

    return (
        <ScrollArea className="h-[80%]">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Title</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead className="text-right">Tools</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map(note => {
                        return (
                            <TableRow key={note.id}>
                                <TableCell className="font-medium truncate max-w-5">{extractTextFromHTML(note.content)}</TableCell>
                                <TableCell>{note.user}</TableCell>
                                <TableCell className="space-x-2 flex flex-nowrap items-center justify-end">
                                    <button className="p-2 text-white bg-blue-500 rounded-lg hover:brightness-110" onClick={() => router.push('/dashboard/notes/' + note.id)}>
                                        <ExternalLink size={16} />
                                    </button>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
            <ScrollBar orientation="vertical" />
        </ScrollArea>
    )
}