import React from 'react';
import { Note as NoteType } from '@/types/note';
import Note from '../Note/Note';
import s from './NoteList.module.css';

interface NoteListProps {
  notes: NoteType[];
}

const NoteList: React.FC<NoteListProps> = ({ notes }) => {
  return (
    <ul className={s.list}>
      {notes.map((note) => (
        <li key={note.id} className={s.listItem}>
           <Note note={note} />
        </li>
      ))}
    </ul>
  );
};

export default NoteList;