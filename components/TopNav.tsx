'use client';

import { useState } from 'react';
import { useBoardStore } from '@/lib/boardStore';

export default function TopNav() {
  const { board, setBoardTitle } = useBoardStore();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(board.title);

  const handleSave = () => {
    if (title.trim()) {
      setBoardTitle(title.trim());
    } else {
      setTitle(board.title);
    }
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setTitle(board.title);
      setEditing(false);
    }
  };

  return (
    <nav className="h-14 px-6 flex items-center border-b border-[--color-border] bg-[--color-surface] shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <span className="text-lg font-semibold text-[--color-accent]">Flowboard</span>
        <div className="w-px h-5 bg-[--color-border]" />
      </div>

      {/* Board Title */}
      <div className="ml-4">
        {editing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
            className="text-base font-medium bg-transparent border-b-2 border-[--color-accent] outline-none px-1 py-0.5 w-48"
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="text-base font-medium hover:text-[--color-accent] transition-colors cursor-text"
          >
            {board.title}
          </button>
        )}
      </div>
    </nav>
  );
}