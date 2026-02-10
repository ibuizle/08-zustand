import React from 'react';
import { Note as NoteType } from '@/types/note';
import Note from '../Note/Note';
import s from './NoteList.module.css';

interface NoteListProps {
  notes: NoteType[];
  onDetailClick: (id: string) => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, onDetailClick }) => {
  return (
    <ul className={s.list}>
      {notes.map((note) => (
        <li key={note.id} className={s.listItem}>
           <Note note={note} onDetailClick={onDetailClick} />
        </li>
      ))}
    </ul>
  );
};

export default NoteList;