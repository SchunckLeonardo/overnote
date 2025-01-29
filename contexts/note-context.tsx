import { createContext, useState } from "react";

export interface Note {
    id: number
    content: string
    privacy: string
    user: string
    createdAt: string
    updatedAt: string
}

interface NoteContextType {
    note: Note | undefined
    changeNote: (note: Note | undefined) => void
    noteStatus: string
    changeNoteStatus: (status: string) => void
}

export const NoteContext = createContext({} as NoteContextType)

export function NoteProvider({ children }: { children: React.ReactNode }) {
    const [note, setNote] = useState<Note | undefined>()
    const [noteStatus, setNoteStatus] = useState('create')

    function changeNote(note: Note | undefined) {
        setNote(note)
    }

    function changeNoteStatus(status: string) {
        setNoteStatus(status)
    }

    return (
        <NoteContext.Provider value={{ note, changeNote, noteStatus, changeNoteStatus }}>
            {children}
        </NoteContext.Provider>
    )
}