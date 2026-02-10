'use client';

import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { deleteNote } from '@/lib/api';
import { Note as NoteType } from '@/types/note';
import s from './Note.module.css';

interface NoteProps {
  note: NoteType;
}

const Note: React.FC<NoteProps> = ({ note }) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error) => {
      console.error('Error deleting note:', error);
      alert('Failed to delete note');
    },
  });

  return (
    <div className={s.card}>
      <h3 className={s.title}>{note.title}</h3>
      <p className={s.content}>{note.content}</p>
      
      <div className={s.footer}>
        <span className={s.tag}>{note.tag}</span>
        
        <div className={s.actions}>
           {/* 👇 Посилання згідно з ТЗ */}
           <Link href={`/notes/${note.id}`} className={s.link}>
             View details
           </Link>

           <button 
             className={s.button}
             onClick={() => mutate(note.id)} 
             disabled={isPending}
             type="button"
           >
             {isPending ? '...' : 'Delete'}
           </button>
        </div>
      </div>
    </div>
  );
};

export default Note;