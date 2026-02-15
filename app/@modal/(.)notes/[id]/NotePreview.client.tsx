'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';

import Modal from '@/components/Modal/Modal';

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
      {isLoading && <p>Loading note...</p>}

      {isError && <p>Failed to load note.</p>}

      {!isLoading && !isError && data && (
        <div onClick={(e) => e.stopPropagation()}>
          <h2>{data.title}</h2>
          <p>{data.content}</p>
        </div>
      )}
    </Modal>
  );
}
