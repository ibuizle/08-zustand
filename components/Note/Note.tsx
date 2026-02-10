'use client';

import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '@/lib/api';
import { Note as NoteType } from '@/types/note';

// 👇 ОСЬ ГОЛОВНА ЗМІНА: Імпортуємо стилі з папки NoteList
import s from '../NoteList/NoteList.module.css';

interface NoteProps {
  note: NoteType;
  onDetailClick: (id: string) => void;
}

const Note: React.FC<NoteProps> = ({ note, onDetailClick }) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error) => {
      console.error('Error deleting note:', error);
      alert('Failed to delete note');
    },
  });

  return (
    // 👇 Використовуємо фрагмент <>, бо рамка і тінь вже є у батьківського <li> в NoteList
    <> 
      <h3 className={s.title}>{note.title}</h3>
      <p className={s.content}>{note.content}</p>
      
      <div className={s.footer}>
        <span className={s.tag}>{note.tag}</span>
        
        <div style={{ display: 'flex', gap: '8px' }}>
           {/* 👇 Кнопка View Details (синя) */}
           <button 
             className={s.link} 
             onClick={() => onDetailClick(note.id)}
             type="button"
           >
             View details
           </button>

           {/* 👇 Кнопка Delete (червона) */}
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
    </>
  );
};

export default Note;