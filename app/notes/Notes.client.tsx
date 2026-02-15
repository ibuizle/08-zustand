'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import css from './NotesPage.module.css';

export default function NotesClient() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setCurrentPage(1);
    setSearch(value);
  }, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', currentPage, search],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: 12,
        search,
      }),
    staleTime: 1000 * 60,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data) return <p>Error loading notes</p>;

  return (
    <div className={css.app}>
      <SearchBox onSearch={debouncedSearch} />

      <NoteList notes={data.notes} />

      <Pagination
        pageCount={data.totalPages}
        currentPage={currentPage}
        onPageChange={({ selected }) => setCurrentPage(selected + 1)}
      />
    </div>
  );
}
