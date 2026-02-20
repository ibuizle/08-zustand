'use client';

import { useRouter } from 'next/navigation';
import { useNoteStore } from '@/lib/store/noteStore';
import css from './NoteForm.module.css';

export default function NoteForm() {
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const handleSubmit = async (formData: FormData) => {
    const note = {
      title: formData.get('title'),
      content: formData.get('content'),
      tag: formData.get('tag'),
    };

    await fetch('/api/notes', {
      method: 'POST',
      body: JSON.stringify(note),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    clearDraft();
    router.back();
  };

  return (
    <form action={handleSubmit} className={css.form}>
      <input
        name="title"
        value={draft.title}
        onChange={(e) => setDraft({ title: e.target.value })}
        placeholder="Title"
      />

      <textarea
        name="content"
        value={draft.content}
        onChange={(e) => setDraft({ content: e.target.value })}
        placeholder="Content"
      />

      <select
        name="tag"
        value={draft.tag}
        onChange={(e) => setDraft({ tag: e.target.value })}
      >
        <option value="Todo">Todo</option>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
      </select>

      <div>
        <button type="submit">Create</button>
        <button type="button" onClick={() => router.back()}>
          Cancel
        </button>
      </div>
    </form>
  );
}