import axios from 'axios';
import { Note } from '@/types/note';

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const API_URL = 'https://notehub-public.goit.study/api';

const api = axios.create({
  baseURL: API_URL,
});

if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
} else {
  console.error('API Token not found inside .env file!');
}

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export type CreateNoteParams = Pick<Note, 'title' | 'content' | 'tag'>;

export const fetchNotes = async ({ page, perPage, search = '' }: FetchNotesParams): Promise<FetchNotesResponse> => {
  const { data } = await api.get<FetchNotesResponse>('/notes', {
    params: {
      page,
      perPage,
      search,
    },
  });
  return data;
};

export const createNote = async (note: CreateNoteParams): Promise<Note> => {
  const { data } = await api.post<Note>('/notes', note);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};

// 👇 Ця функція обов'язкова за ТЗ для сторінки [id]
export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};