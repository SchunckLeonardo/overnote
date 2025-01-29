'use client'

import { TipTap } from "@/components/tiptap";
import { UserFeedNotes } from "@/components/user-feed-notes";
import { UsersNotes } from "@/components/users-notes";
import { NoteProvider } from "@/contexts/note-context";
import { NotebookPen, Users } from "lucide-react";

export default function Page() {
  return (
      <NoteProvider >
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 w-[90vw] mx-auto">
          <div className="grid auto-rows-min gap-4 lg:grid-cols-3 ">
            <div className="aspect-video rounded-xl bg-muted/50 space-y-3 h-full overflow-hidden p-4">
              <span className="text-xl flex gap-2 items-center w-full justify-center">
                <NotebookPen size={18} className="text-emerald-500" />
                Your notes
              </span>
              <UserFeedNotes />
            </div>
            <div className="aspect-video rounded-xl bg-muted/50 space-y-3 h-full overflow-hidden p-4">
              <span className="text-xl flex gap-2 items-center w-full justify-center">
                <Users size={18} className="text-emerald-500" />
                Users notes
              </span>
              <UsersNotes />
            </div>
            <div className="aspect-video rounded-xl bg-muted/50 h-full" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min border border-slate-400 w-full">
            <TipTap />
          </div>
        </div>
      </NoteProvider>
  );
}
