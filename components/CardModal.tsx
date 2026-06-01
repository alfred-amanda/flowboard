'use client';

import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Card } from '@/lib/types';
import { useBoardStore } from '@/lib/boardStore';

interface CardModalProps {
  card: Card;
  listId: string;
  onClose: () => void;
}

export default function CardModal({ card, listId, onClose }: CardModalProps) {
  const { updateCard, deleteCard } = useBoardStore();
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSave = () => {
    if (title.trim()) {
      updateCard(listId, card.id, { title: title.trim(), description });
    }
    onClose();
  };

  const handleDelete = () => {
    if (confirmDelete) {
      deleteCard(listId, card.id);
      onClose();
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-[--color-surface] rounded-lg shadow-xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start gap-3 p-4 pb-0">
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            rows={2}
            className="flex-1 text-base font-semibold resize-none bg-transparent border-none outline-none leading-snug placeholder:text-[--color-text-secondary]"
            placeholder="Card title..."
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[--color-bg] text-[--color-text-secondary] hover:text-[--color-text-primary] transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Description */}
        <div className="p-4">
          <label className="text-xs font-medium text-[--color-text-secondary] uppercase tracking-wide mb-2 block">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description..."
            rows={4}
            className="w-full resize-none rounded-md border border-[--color-border] px-3 py-2 text-sm outline-none focus:border-[--color-accent] focus:ring-1 focus:ring-[--color-accent]"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 pt-2 border-t border-[--color-border]">
          <button
            onClick={handleDelete}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
              confirmDelete
                ? 'bg-[--color-danger] text-white'
                : 'text-[--color-danger] hover:bg-red-50'
            }`}
          >
            <Trash2 size={14} />
            {confirmDelete ? 'Confirm Delete?' : 'Delete'}
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-[--color-text-secondary] hover:text-[--color-text-primary] rounded-md hover:bg-[--color-bg] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium bg-[--color-accent] text-white rounded-md hover:bg-[--color-accent-hover] transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}