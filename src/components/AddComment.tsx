// components/AddComment.tsx
"use client" // This must be a client component if using interactivity

import { useState } from 'react';
import { addComment } from '@/app/_actions/actions';

export default function AddComment({
  addComment,
  postId,
  paramsId
}: {
  addComment: (content: string, postId: string, paramsId: string) => Promise<void>;
  postId: string;
  paramsId: string;
}) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      await addComment(content, postId, paramsId);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mb-8">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Add a comment..."
      />
      <button 
        type="submit"
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Submit Comment
      </button>
    </form>
  );
}