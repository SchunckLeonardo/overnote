'use client'

import { Toggle } from "./ui/toggle"
import { AlignCenter, AlignLeft, AlignRight, BoldIcon, Code, Globe, GlobeLock, Heading3, Images, ItalicIcon, Link, List, Minus, Quote, ShieldCheck, Strikethrough, UnderlineIcon, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Editor } from "@tiptap/react"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"
import { useNote } from "@/hooks/use-note"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useCallback, useState } from "react"

interface ToolBarProps {
    editor: Editor
    onChangePrivacy: (privacy: string) => void
    onSubmit: () => void
    onUpdate: () => void
    privacy: string
}

export function ToolBar({ editor, onChangePrivacy, onSubmit, onUpdate, privacy }: ToolBarProps) {
    const { noteStatus, changeNoteStatus, changeNote } = useNote()
    const [imageUrl, setImageUrl] = useState<string>("")
    const [linkHref, setLinkHref] = useState<string>("")
    const [selectedText, setSelectedText] = useState<string>("")

    const handleLinkPopoverOpen = useCallback(() => {
        const { from, to } = editor.state.selection
        const text = editor.state.doc.textBetween(from, to)
        setSelectedText(text)
    }, [editor])

    function handlerStopEdit() {
        changeNoteStatus('create')
        changeNote(undefined)
        editor.commands.clearContent()
    }

    function handleAddImage() {
        editor.chain().focus().setImage({ src: imageUrl }).run()
        setImageUrl("")
    }

    const handleAddLink = useCallback(() => {
        if (selectedText) {
            editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .setLink({ href: linkHref })
                .run()
        } else {
            editor.chain().focus().insertContent(`<a href="${linkHref}">${linkHref}</a>`).run()
        }
        setLinkHref("")
    }, [editor, linkHref, selectedText])

    return (
        <ScrollArea className="max-w-full border-b border-b-slate-400">
            <div className='w-full items-center flex gap-2 mb-4 my-2 pb-2'>
                <Toggle
                    variant="outline"
                    pressed={editor.isActive('bold')}
                    onPressedChange={() => editor.chain().focus().toggleBold().run()}
                >
                    <BoldIcon size={16} />
                </Toggle>
                <Toggle
                    variant="outline"
                    pressed={editor.isActive('italic')}
                    onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                >
                    <ItalicIcon size={16} />
                </Toggle>
                <Toggle
                    variant="outline"
                    pressed={editor.isActive('strike')}
                    onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                >
                    <Strikethrough size={16} />
                </Toggle>
                <Toggle
                    variant="outline"
                    pressed={editor.isActive('underline')}
                    onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                >
                    <UnderlineIcon size={16} />
                </Toggle>
                <Toggle
                    variant="outline"
                    pressed={editor.isActive('code')}
                    onPressedChange={() => editor.chain().focus().toggleCode().run()}
                >
                    <Code size={16} />
                </Toggle>
                <span className="w-px h-7 bg-slate-600/30"></span>
                <Toggle
                    variant="outline"
                    pressed={editor.isActive('heading', { level: 3 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                >
                    <Heading3 size={16} />
                </Toggle>
                <Toggle
                    variant="outline"
                    pressed={editor.isActive('bulletList')}
                    onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <List size={16} />
                </Toggle>
                <Toggle
                    variant="outline"
                    pressed={editor.isActive('blockquote')}
                    onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                >
                    <Quote size={16} />
                </Toggle>
                <Toggle
                    variant="outline"
                    pressed={false}
                    onPressedChange={() => editor.chain().focus().setHorizontalRule().run()}
                >
                    <Minus size={16} />
                </Toggle>
                <span className="w-px h-7 bg-slate-600/30"></span>
                <Toggle
                    variant="outline"
                    pressed={false}
                    onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
                >
                    <AlignLeft size={16} />
                </Toggle>
                <Toggle
                    variant="outline"
                    pressed={false}
                    onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
                >
                    <AlignCenter size={16} />
                </Toggle>
                <Toggle
                    variant="outline"
                    pressed={false}
                    onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
                >
                    <AlignRight size={16} />
                </Toggle>
                <span className="w-px h-7 bg-slate-600/30"></span>
                <Popover>
                    <PopoverTrigger asChild>
                        <Toggle
                            variant="outline"
                            pressed={false}
                        >
                            <Images size={16} />
                        </Toggle>
                    </PopoverTrigger>
                    <PopoverContent>
                        <label className="flex gap-2 items-center">
                            <input className="p-2" type="text" placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                            <button className="p-2 bg-sky-500 text-white rounded-lg" onClick={() => handleAddImage()}>Add</button>
                        </label>
                    </PopoverContent>
                </Popover>
                <Popover>
                    <PopoverTrigger asChild>
                        <Toggle pressed={false} variant="outline" onClick={handleLinkPopoverOpen}>
                            <Link size={16} />
                        </Toggle>
                    </PopoverTrigger>
                    <PopoverContent>
                        <label className="flex gap-2 items-center">
                            <input
                                className="p-2"
                                type="text"
                                placeholder="Link URL"
                                value={linkHref}
                                onChange={(e) => setLinkHref(e.target.value)}
                            />
                            <button
                                className="p-2 bg-sky-500 text-white rounded-lg"
                                onClick={handleAddLink}
                            >
                                Add
                            </button>
                        </label>
                    </PopoverContent>
                </Popover>
                <div className="flex items-center gap-2 ml-auto w-1/4">
                    <span className="flex gap-1 items-center text-sm text-zinc-400/80">
                        Autosave <ShieldCheck size={16} />
                    </span>
                    <Select value={privacy} onValueChange={(value) => onChangePrivacy(value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Privacy" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="public">
                                <span className='flex items-center gap-2'>Public <Globe size={16} /></span>
                            </SelectItem>
                            <SelectItem value="private">
                                <span className='flex items-center gap-2'>Private <GlobeLock size={16} /></span>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    {noteStatus === 'create' ? (
                        <button onClick={() => onSubmit()} className='py-1 px-2 w-min h-full bg-emerald-500 rounded-lg text-white hover:brightness-110'>Save</button>
                    ) : (
                        <button onClick={() => onUpdate()} className='py-1 px-2 w-min h-full bg-yellow-500 rounded-lg text-white hover:brightness-110'>Update</button>
                    )}
                    {noteStatus === 'edit' && (
                        <button className="p-1 rounded-full bg-slate-300 hover:brightness-110" onClick={() => handlerStopEdit()}>
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    )
}