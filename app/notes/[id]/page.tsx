import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from './NoteDetails.client';

interface Props {
  // 👇 Обов'язкова вимога Next.js 15: params має бути Promise
  params: Promise<{
    id: string;
  }>;
}

export default async function NoteDetailsPage(props: Props) {
  const queryClient = new QueryClient();
  
  // 👇 Отримуємо параметри через await відповідно до фідбеку
  const params = await props.params;
  const { id } = params;

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}