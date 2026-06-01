'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';

import { Plus } from 'lucide-react';
import TopNav from '@/components/TopNav';
import BoardCanvas from '@/components/BoardCanvas';
import ListColumn from '@/components/ListColumn';
import CardComponent from '@/components/CardComponent';
import { useBoardStore } from '@/lib/boardStore';
import { Card, List } from '@/lib/types';

export default function HomePage() {
  const { board, addList, moveCard, moveList } = useBoardStore();
  const [activeItem, setActiveItem] = useState<{ type: 'card' | 'list'; data: Card | List } | null>(null);
  const [addingList, setAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current;

    if (activeData?.type === 'card') {
      setActiveItem({ type: 'card', data: activeData.card });
    } else if (activeData?.type === 'list') {
      setActiveItem({ type: 'list', data: activeData.list });
    }
  };

  const handleDragOver = (event: { active: any; over: any }) => {
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.type !== 'card') return;

    // Find source list
    const activeListId = activeData?.listId;
    let overListId = overData?.listId;

    // If dropping over a list container (not a card)
    if (overData?.type === 'list') {
      overListId = over.id as string;
    }

    if (!overListId || activeListId === overListId) return;

    // Move card to new list (at the end)
    const overList = board.lists.find((l) => l.id === overListId);
    if (!overList) return;

    const activeList = board.lists.find((l) => l.id === activeListId);
    if (!activeList) return;

    const activeCardIndex = activeList.cards.findIndex((c) => c.id === active.id);
    moveCard(activeListId, overListId, activeCardIndex, overList.cards.length);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Handle list reordering
    if (activeData?.type === 'list' && overData?.type === 'list') {
      const oldIndex = board.lists.findIndex((l) => l.id === active.id);
      const newIndex = board.lists.findIndex((l) => l.id === over.id);
      if (oldIndex !== newIndex) {
        moveList(oldIndex, newIndex);
      }
      return;
    }

    // Handle card reordering within same list
    if (activeData?.type === 'card' && overData?.type === 'card') {
      const activeListId = activeData.listId;
      const overListId = overData.listId;

      if (activeListId !== overListId) return; // Already handled in dragOver

      const list = board.lists.find((l) => l.id === activeListId);
      if (!list) return;

      const oldIndex = list.cards.findIndex((c) => c.id === active.id);
      const newIndex = list.cards.findIndex((c) => c.id === over.id);

      if (oldIndex !== newIndex) {
        moveCard(activeListId, activeListId, oldIndex, newIndex);
      }
    }
  };

  const handleAddList = () => {
    if (newListTitle.trim()) {
      addList(newListTitle.trim());
      setNewListTitle('');
      setAddingList(false);
    }
  };

  const handleListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddList();
    if (e.key === 'Escape') {
      setNewListTitle('');
      setAddingList(false);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen flex flex-col bg-[--color-bg]">
        <TopNav />
        <BoardCanvas />

        {/* Add List Button */}
        <div className="shrink-0 px-6 pb-6">
          {addingList ? (
            <div className="bg-[--color-surface] rounded-lg p-3 shadow-sm border border-[--color-border] w-72">
              <input
                type="text"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                onKeyDown={handleListKeyDown}
                placeholder="Enter list title..."
                autoFocus
                className="w-full px-3 py-2 text-sm border border-[--color-border] rounded-md outline-none focus:border-[--color-accent]"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleAddList}
                  className="px-3 py-1.5 bg-[--color-accent] text-white text-sm font-medium rounded-md hover:bg-[--color-accent-hover]"
                >
                  Add List
                </button>
                <button
                  onClick={() => {
                    setNewListTitle('');
                    setAddingList(false);
                  }}
                  className="px-3 py-1.5 text-sm text-[--color-text-secondary] hover:text-[--color-text-primary]"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddingList(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[--color-surface] border border-[--color-border] rounded-lg text-sm font-medium text-[--color-text-secondary] hover:text-[--color-accent] hover:border-[--color-accent] transition-colors shadow-sm"
            >
              <Plus size={16} />
              Add List
            </button>
          )}
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeItem?.type === 'card' && (
            <div className="bg-[--color-surface] border border-[--color-accent] rounded-md p-3 shadow-xl rotate-3 scale-105 w-72">
              <p className="text-sm text-[--color-text-primary] leading-snug">
                {(activeItem.data as Card).title}
              </p>
            </div>
          )}
          {activeItem?.type === 'list' && (
            <div className="bg-[--color-surface] border border-[--color-accent] rounded-lg shadow-xl rotate-2 scale-105 w-72 max-h-48 overflow-hidden">
              <div className="px-3 py-2 border-b border-[--color-border]">
                <p className="text-sm font-semibold">{(activeItem.data as List).title}</p>
              </div>
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
}