import { NoteContext } from "@/contexts/note-context";
import { useContext } from "react";

export function useNote() {
    const context = useContext(NoteContext)
    return context
}