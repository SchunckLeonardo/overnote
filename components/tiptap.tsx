'use client'

import { useEditor, EditorContent } from '@tiptap/react'

import { Blockquote, BulletList, CodeMark, HardBreak, Heading, HorizontalRul, ImageExtension, LinkExtension, StarterKit, TextAlign, Underline } from '@/lib/tiptap-extensions'

import { ToolBar } from './toolbar'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNote } from '@/hooks/use-note'


export function TipTap() {
    const queryClient = useQueryClient()

    const extensions = [
        StarterKit,
        Underline,
        Heading.configure({
            HTMLAttributes: {
                class: 'text-xl font-bold',
                levels: [3]
            }
        }),
        BulletList.configure({
            HTMLAttributes: {
                class: 'list-disc pl-4'
            }
        }),
        CodeMark.configure({
            HTMLAttributes: {
                class: 'bg-slate-300/30 text-red-400 p-1 rounded-lg'
            }
        }),
        Blockquote.configure({
            HTMLAttributes: {
                class: 'border-l-4 border-slate-300/30 pl-2 border-l-slate-400'
            }
        }),
        HorizontalRul.configure({
            HTMLAttributes: {
                class: 'my-4 border-t border-slate-200'
            }
        }),
        TextAlign.configure({
            types: ['heading', 'paragraph'],
            alignments: ['left', 'center', 'right'],
            defaultAlignment: 'left'
        }),
        HardBreak.configure({
            keepMarks: false,
        }),
        ImageExtension,
        LinkExtension.configure({
            HTMLAttributes: {
                class: 'text-blue-500 underline'
            },
            defaultProtocol: 'https'
        })
    ]

    const [content, setContent] = useState(() => {
        const autoSaveContent = localStorage.getItem('content') as string
        return autoSaveContent ?? "<h3>What are you thinking today? 📝</h3>"
    })
    const { note, changeNoteStatus, changeNote } = useNote()

    const editor = useEditor({
        extensions,
        content,
        editorProps: {
            attributes: {
                class: "min-h-96 h-full w-full outline-none p-1",
            }
        }
    })

    useEffect(() => {
        if (note) {
            setContent(note.content)
            setPrivacy(note.privacy)
            editor?.commands.setContent(note.content)
        }
    }, [note, editor])

    const mutation = useMutation({
        mutationFn: async () => {
            const response = await fetch('/api/note', {
                method: 'POST',
                body: JSON.stringify({
                    content: content,
                    privacy: privacy,
                    userId: session?.user?.id
                })
            })

            localStorage.removeItem('content')
            setContent("<h3>What are you thinking today? 📝</h3>")
            editor?.commands.clearContent()

            return await response.json()
        },
        onSettled: () => {
            if (privacy === 'public') {
                queryClient.invalidateQueries({ queryKey: ['user-notes'] })
                queryClient.invalidateQueries({ queryKey: ['all-notes'] })
            } else {
                queryClient.invalidateQueries({ queryKey: ['user-notes'] })
            }
        }
    })

    const mutationUpdate = useMutation({
        mutationFn: async () => {
            const response = await fetch('/api/note/' + note?.id, {
                method: 'PUT',
                body: JSON.stringify({
                    content: content,
                    privacy: privacy,
                    userId: session?.user?.id
                })
            })

            localStorage.removeItem('content')
            setContent("<h3>What are you thinking today? 📝</h3>")
            changeNoteStatus('create')
            changeNote(undefined)
            editor?.commands.clearContent()

            return await response.json()
        },
        onSettled: () => {
            if (privacy === 'public') {
                queryClient.invalidateQueries({ queryKey: ['user-notes'] })
                queryClient.invalidateQueries({ queryKey: ['all-notes'] })
            } else {
                queryClient.invalidateQueries({ queryKey: ['user-notes'] })
                queryClient.invalidateQueries({ queryKey: ['all-notes'] })
            }
        }
    })

    const [privacy, setPrivacy] = useState('public')

    const { data: session, status } = useSession()

    if (!editor || status === 'unauthenticated') {
        return null
    }

    editor.on('update', () => {
        setContent(editor.getHTML())
        localStorage.setItem('content', editor.getHTML())
    })

    return (
        <div className='rounded-xl p-4 h-full w-full overflow-hidden'>
            <ToolBar onUpdate={mutationUpdate.mutate} onChangePrivacy={setPrivacy} privacy={privacy} onSubmit={mutation.mutate} editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}