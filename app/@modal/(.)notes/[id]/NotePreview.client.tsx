'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';

import Modal from '@/components/Modal/Modal';
import css from './NotePreview.module.css';

interface NotePreviewProps {
  id: string;
}

export default function NotePreview({ id }: NotePreviewProps) {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  return (
    <Modal isOpen onClose={handleClose}>
      {isLoading && (
        <div className={css.container}>
          <p>Loading note...</p>
        </div>
      )}

      {isError && (
        <div className={css.container}>
          <p>Failed to load note.</p>
        </div>
      )}

      {!isLoading && !isError && data && (
        <div
          className={css.container}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className={css.title}>{data.title}</h2>
          <p className={css.content}>{data.content}</p>
        </div>
      )}
    </Modal>
  );
}
