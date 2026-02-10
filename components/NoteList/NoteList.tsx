'use client';

import React from 'react';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Note as NoteType } from '@/types/note';
import { deleteNote } from '@/lib/api';
// Використовуємо ваш існуючий файл стилів
import s from './NoteList.module.css';

interface NoteListProps {
  notes: NoteType[];
}

const NoteList: React.FC<NoteListProps> = ({ notes }) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  return (
    <ul className={s.list}>
      {notes.map((note) => (
        <li key={note.id} className={s.listItem}>
          {/* ВАЖЛИВО: Переконайтеся, що класи .title, .content, .tag 
              є у вашому файлі NoteList.module.css. 
              Якщо вони були в Note.module.css, їх треба скопіювати в NoteList.module.css
          */}
          <h3 className={s.title}>{note.title}</h3>
          <p className={s.content}>{note.content}</p>
          
          <div className={s.footer}>
            <span className={s.tag}>#{note.tag}</span>
            
            <div className={s.actions}>
              {/* Використовуємо Link для навігації за ТЗ */}
              <Link href={`/notes/${note.id}`} className={s.link}>
                View Details
              </Link>

              {/* Кнопка видалення за ТЗ */}
              <button 
                className={s.button} 
                onClick={() => mutate(note.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;