'use client';

import { useState } from 'react';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import { Plus, MoreHorizontal, Trash2 } from 'lucide-react';
import { useBoardStore } from '@/lib/boardStore';
import { List } from '@/lib/types';
import CardComponent from './CardComponent';

interface ListColumnProps {
  list: List;
  index: number;
}

export default function ListColumn({ list, index }: ListColumnProps) {
  const { addCard, updateListTitle, deleteList } = useBoardStore();
  const [addingCard, setAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(list.title);
  const [showMenu, setShowMenu] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
    data: {
      type: 'list',
      list,
    },
  });

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: `list-${list.id}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      addCard(list.id, newCardTitle.trim());
      setNewCardTitle('');
      setAddingCard(false);
    }
  };

  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddCard();
    if (e.key === 'Escape') {
      setNewCardTitle('');
      setAddingCard(false);
    }
  };

  const handleTitleSave = () => {
    if (titleValue.trim() && titleValue !== list.title) {
      updateListTitle(list.id, titleValue.trim());
    } else {
      setTitleValue(list.title);
    }
    setEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleTitleSave();
    if (e.key === 'Escape') {
      setTitleValue(list.title);
      setEditingTitle(false);
    }
  };

  const handleDeleteClick = () => {
    if (confirmDelete) {
      deleteList(list.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div
      ref={setSortableRef}
      style={style}
      className={`w-72 shrink-0 rounded-lg bg-[--color-surface] shadow-sm flex flex-col max-h-[calc(100vh-120px)] ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {/* List Header */}
      <div
        {...attributes}
        {...listeners}
        className="px-3 py-3 border-b border-[--color-border] flex items-center gap-2 cursor-grab active:cursor-grabbing"
      >
        {editingTitle ? (
          <input
            type="text"
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={handleTitleKeyDown}
            autoFocus
            className="flex-1 text-sm font-semibold bg-transparent border-b-2 border-[--color-accent] outline-none px-1 py-0.5"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingTitle(true);
            }}
            className="flex-1 text-sm font-semibold text-left hover:text-[--color-accent] cursor-text truncate"
          >
            {list.title}
          </button>
        )}

        <span className="text-xs text-[--color-text-secondary] font-medium">
          {list.cards.length}
        </span>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 rounded hover:bg-[--color-bg] text-[--color-text-secondary] hover:text-[--color-text-primary] transition-colors"
          >
            <MoreHorizontal size={16} />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-1 z-20 bg-[--color-surface] border border-[--color-border] rounded-md shadow-md py-1 min-w-[120px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    handleDeleteClick();
                  }}
                  className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
                    confirmDelete
                      ? 'text-[--color-danger] bg-red-50'
                      : 'text-[--color-text-secondary] hover:text-[--color-danger] hover:bg-red-50'
                  }`}
                >
                  <Trash2 size={14} />
                  {confirmDelete ? 'Confirm Delete?' : 'Delete List'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Cards */}
      <div
        ref={setDroppableRef}
        className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-2"
      >
        <SortableContext
          items={list.cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {list.cards.map((card) => (
            <CardComponent key={card.id} card={card} listId={list.id} />
          ))}
        </SortableContext>

        {list.cards.length === 0 && !addingCard && (
          <p className="text-sm text-[--color-text-secondary] text-center py-4 opacity-60">
            No cards yet
          </p>
        )}
      </div>

      {/* Add Card */}
      <div className="px-3 pb-3 pt-1">
        {addingCard ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={handleCardKeyDown}
              placeholder="Enter card title..."
              autoFocus
              rows={2}
              className="w-full resize-none rounded-md border border-[--color-border] px-3 py-2 text-sm outline-none focus:border-[--color-accent] focus:ring-1 focus:ring-[--color-accent]"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddCard}
                className="px-3 py-1.5 bg-[--color-accent] text-white text-sm font-medium rounded-md hover:bg-[--color-accent-hover] transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setNewCardTitle('');
                  setAddingCard(false);
                }}
                className="px-3 py-1.5 text-sm text-[--color-text-secondary] hover:text-[--color-text-primary] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAddingCard(true)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[--color-text-secondary] hover:text-[--color-accent] hover:bg-[--color-bg] rounded-md transition-colors"
          >
            <Plus size={16} />
            Add a card
          </button>
        )}
      </div>
    </div>
  );
}