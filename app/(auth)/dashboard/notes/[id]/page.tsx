'use client'

import { Note } from '@/contexts/note-context'
import { convertStringToData } from '@/utils/convert-string-to-data'
import { useQuery } from '@tanstack/react-query'
import DOMPurify from 'dompurify';

export default function NotePage({ params }: { params: { id: string } }) {
    const id = params.id

    const { data } = useQuery({
        queryKey: ['note'], queryFn: async (): Promise<Note> => {
            try {
                const response = await fetch('/api/note/' + id, { method: 'GET' })
                return await response.json()
            } catch (error) {
                throw new Error('Error fetching note: ' + error)
            }
        }
    })

    if (!id || !data) {
        return null
    }

    const clean = DOMPurify.sanitize(data.content)

    return (
        <div className='max-w-4xl border rounded-lg shadow-lg mx-auto mt-10 p-5'>
            <div className='flex justify-between mb-5 border-b '>
                <span className='text-xl font-bold'>{data.user}</span>
                <span>{convertStringToData(data.createdAt)}</span>
                <span className='capitalize'>{data.privacy}</span>
            </div>
            <div className='p-10' dangerouslySetInnerHTML={{ __html: clean }}></div>
        </div>
    )
}