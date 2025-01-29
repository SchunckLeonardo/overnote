'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ExternalLink, Pencil, Trash2 } from "lucide-react"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { extractTextFromHTML } from "@/utils/extract-text-from-html"
import { Note } from "@/contexts/note-context"
import { useNote } from "@/hooks/use-note"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function UserFeedNotes() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const { changeNote, changeNoteStatus } = useNote()

    const { data, error } = useQuery({
        queryKey: ['user-notes'], queryFn: async (): Promise<Note[]> => {
            const response = await fetch(`/api/note/user/${session?.user?.id}`)
            return await response.json()
        },
        notifyOnChangeProps: ['data', 'error']
    })

    function handleEdit(note: Note) {
        changeNoteStatus('edit')
        changeNote(note)
    }

    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async (note: Note) => {
            fetch(`/api/note/${note.id}`, {
                method: 'DELETE'
            }).then((res) => res.json()).catch((err) => console.error(err))
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['user-notes'] })
            queryClient.invalidateQueries({ queryKey: ['all-notes'] })
        }
    })

    if (status === 'unauthenticated' || error || !data) {
        return null
    }

    return (
        <ScrollArea className="h-[80%]">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Title</TableHead>
                        <TableHead>Privacy</TableHead>
                        <TableHead className="text-right">Tools</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map(note => {
                        return (
                            <TableRow key={note.id}>
                                <TableCell className="font-medium truncate max-w-6">{extractTextFromHTML(note.content)}</TableCell>
                                <TableCell className="capitalize">{note.privacy}</TableCell>
                                <TableCell className="space-x-2 flex flex-nowrap items-center justify-end">
                                    <button className="p-2 text-white bg-blue-500 rounded-lg hover:brightness-110" onClick={() => router.push('/dashboard/notes/' + note.id)}>
                                        <ExternalLink size={16} />
                                    </button>
                                    <button onClick={() => handleEdit(note)} className="p-2 text-white bg-yellow-500 rounded-lg hover:brightness-110">
                                        <Pencil size={16} />
                                    </button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <button className="p-2 text-white bg-red-500 rounded-lg hover:brightness-110">
                                                <Trash2 size={16} />
                                            </button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete your account
                                                    and remove your data from our servers.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => mutation.mutate(note)}>Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
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