import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found | NoteHub',
  description: 'The requested page does not exist in NoteHub.',
  openGraph: {
    title: 'Page Not Found | NoteHub',
    description: 'The requested page does not exist in NoteHub.',
    url: 'https://notehub.app/not-found',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
      },
    ],
  },
};

export default function NotFound() {
  return <h1>404 - Page not found</h1>;
}