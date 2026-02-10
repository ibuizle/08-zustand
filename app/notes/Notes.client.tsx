'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes, fetchNoteById } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import css from './NotesPage.module.css';

const PER_PAGE = 12;

export default function NotesClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search }),
    placeholderData: (prev) => prev,
  });

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />
        <button className={css.button} onClick={() => setIsCreateModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading...</p>}
      
      {data && data.notes.length > 0 ? (
        <NoteList 
          notes={data.notes} 
          onDetailClick={(id) => setSelectedNoteId(id)} 
        />
      ) : (
        !isLoading && !isError && <p>No notes found</p>
      )}

      {data && data.totalPages > 1 && (
        <Pagination
          pageCount={data.totalPages}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      )}

      {isCreateModalOpen && (
        <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
          <NoteForm onClose={() => setIsCreateModalOpen(false)} />
        </Modal>
      )}

      {selectedNoteId && (
        <Modal isOpen={!!selectedNoteId} onClose={() => setSelectedNoteId(null)}>
          <NoteDetailsViewer id={selectedNoteId} />
        </Modal>
      )}
    </div>
  );
}

function NoteDetailsViewer({ id }: { id: string }) {
  const { data: note, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  if (isLoading) return <p>Loading note details...</p>;
  if (isError || !note) return <p>Error loading note.</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '10px' }}>{note.title}</h2>
      <div style={{ 
        background: '#f5f5f5', 
        padding: '10px', 
        borderRadius: '8px', 
        marginBottom: '10px',
        color: '#555' 
      }}>
        {note.tag && <span style={{ fontWeight: 'bold', marginRight: '10px' }}>#{note.tag}</span>}
        
        {/* 👇 Я закоментував цей рядок, щоб виправити помилку build */}
        {/* <span>{new Date(note.date).toLocaleDateString()}</span> */}
        
      </div>
      <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{note.content}</p>
    </div>
  );
}