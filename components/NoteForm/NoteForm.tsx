'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createNote, type CreateNoteParams } from '@/lib/api';
import { useNoteStore } from '@/lib/store/noteStore';
import type { NoteTag } from '@/types/note';

import css from './NoteForm.module.css';

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const mutation = useMutation({
    mutationFn: (note: CreateNoteParams) => createNote(note),
  });

  const handleSubmit = async (formData: FormData) => {
    const title = String(formData.get('title') ?? '').trim();
    const content = String(formData.get('content') ?? '').trim();
    const tag = String(formData.get('tag') ?? 'Todo') as NoteTag;

    const note: CreateNoteParams = {
      title,
      content,
      tag,
    };

    try {
      await mutation.mutateAsync(note);

      clearDraft();
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
      router.back();
    } catch {
      // помилку показуємо через mutation.isError
    }
  };

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraft({ title: e.target.value });
  };

  const onContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft({ content: e.target.value });
  };

  const onTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDraft({ tag: e.target.value });
  };

  return (
    <form action={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label>
          Title
          <input
            className={css.input}
            name="title"
            value={draft.title}
            onChange={onTitleChange}
            placeholder="Title"
          />
        </label>
      </div>

      <div className={css.formGroup}>
        <label>
          Content
          <textarea
            className={css.textarea}
            name="content"
            value={draft.content}
            onChange={onContentChange}
            placeholder="Content"
          />
        </label>
      </div>

      <div className={css.formGroup}>
        <label>
          Tag
          <select
            className={css.select}
            name="tag"
            value={draft.tag}
            onChange={onTagChange}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </select>
        </label>
      </div>

      {mutation.isError && <p className={css.error}>Failed to create note</p>}

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={() => router.back()}>
          Cancel
        </button>

        <button type="submit" className={css.submitButton} disabled={mutation.isPending}>
          {mutation.isPending ? 'Creating...' : 'Create'}
        </button>
      </div>
    </form>
  );
}