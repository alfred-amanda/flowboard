'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { Card } from '@/lib/types';
import CardModal from './CardModal';

interface CardComponentProps {
  card: Card;
  listId: string;
}

export default function CardComponent({ card, listId }: CardComponentProps) {
  const [open, setOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: 'card',
      card,
      listId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => setOpen(true)}
        className={`bg-[--color-surface] border border-[--color-border] rounded-md shadow-sm group flex items-start gap-2 hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${
          isDragging ? 'opacity-50 shadow-lg rotate-2 scale-105 z-50' : ''
        }`}
      >
        <GripVertical
          size={14}
          className="text-[--color-text-secondary] opacity-0 group-hover:opacity-100 transition-opacity mt-2.5 shrink-0 cursor-grab"
        />
        <div className="flex-1 py-2.5 pr-2.5">
          <p className="text-sm text-[--color-text-primary] leading-snug line-clamp-3">
            {card.title}
          </p>
          {card.description && (
            <p className="text-xs text-[--color-text-secondary] mt-1.5 line-clamp-2">
              {card.description}
            </p>
          )}
        </div>
      </div>

      {open && (
        <CardModal
          card={card}
          listId={listId}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}