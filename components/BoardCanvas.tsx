'use client';

import { useBoardStore } from '@/lib/boardStore';
import ListColumn from './ListColumn';

export default function BoardCanvas() {
  const { board } = useBoardStore();

  return (
    <div
      className="flex-1 overflow-x-auto p-6 bg-[--color-board-bg]"
      style={{ scrollBehavior: 'smooth' }}
    >
      <div className="flex gap-6 h-full items-start">
        {board.lists.map((list, index) => (
          <ListColumn key={list.id} list={list} index={index} />
        ))}
      </div>
    </div>
  );
}