import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { Board, Card, List } from './types';

interface BoardState {
  board: Board;
  // Board actions
  setBoardTitle: (title: string) => void;
  // List actions
  addList: (title: string) => void;
  updateListTitle: (listId: string, title: string) => void;
  deleteList: (listId: string) => void;
  moveList: (fromIndex: number, toIndex: number) => void;
  // Card actions
  addCard: (listId: string, title: string) => void;
  updateCard: (listId: string, cardId: string, updates: Partial<Pick<Card, 'title' | 'description'>>) => void;
  deleteCard: (listId: string, cardId: string) => void;
  moveCard: (fromListId: string, toListId: string, fromIndex: number, toIndex: number) => void;
  // Initial state helper
  initializeBoard: () => void;
}

const DEFAULT_BOARD: Board = {
  id: nanoid(),
  title: 'My Board',
  lists: [
    {
      id: nanoid(),
      title: 'To Do',
      cards: [
        { id: nanoid(), title: 'First card', description: '', createdAt: Date.now() },
        { id: nanoid(), title: 'Second card', description: '', createdAt: Date.now() },
      ],
    },
    {
      id: nanoid(),
      title: 'In Progress',
      cards: [],
    },
    {
      id: nanoid(),
      title: 'Done',
      cards: [],
    },
  ],
};

export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
      board: DEFAULT_BOARD,

      initializeBoard: () => {
        const { board } = get();
        // Already initialized
        if (board.lists.length > 0) return;
        set({ board: DEFAULT_BOARD });
      },

      setBoardTitle: (title) =>
        set((state) => ({
          board: { ...state.board, title },
        })),

      addList: (title) =>
        set((state) => ({
          board: {
            ...state.board,
            lists: [
              ...state.board.lists,
              { id: nanoid(), title, cards: [] },
            ],
          },
        })),

      updateListTitle: (listId, title) =>
        set((state) => ({
          board: {
            ...state.board,
            lists: state.board.lists.map((list) =>
              list.id === listId ? { ...list, title } : list
            ),
          },
        })),

      deleteList: (listId) =>
        set((state) => ({
          board: {
            ...state.board,
            lists: state.board.lists.filter((list) => list.id !== listId),
          },
        })),

      moveList: (fromIndex, toIndex) =>
        set((state) => {
          const lists = [...state.board.lists];
          const [removed] = lists.splice(fromIndex, 1);
          lists.splice(toIndex, 0, removed);
          return { board: { ...state.board, lists } };
        }),

      addCard: (listId, title) =>
        set((state) => ({
          board: {
            ...state.board,
            lists: state.board.lists.map((list) =>
              list.id === listId
                ? {
                    ...list,
                    cards: [
                      ...list.cards,
                      { id: nanoid(), title, description: '', createdAt: Date.now() },
                    ],
                  }
                : list
            ),
          },
        })),

      updateCard: (listId, cardId, updates) =>
        set((state) => ({
          board: {
            ...state.board,
            lists: state.board.lists.map((list) =>
              list.id === listId
                ? {
                    ...list,
                    cards: list.cards.map((card) =>
                      card.id === cardId ? { ...card, ...updates } : card
                    ),
                  }
                : list
            ),
          },
        })),

      deleteCard: (listId, cardId) =>
        set((state) => ({
          board: {
            ...state.board,
            lists: state.board.lists.map((list) =>
              list.id === listId
                ? { ...list, cards: list.cards.filter((card) => card.id !== cardId) }
                : list
            ),
          },
        })),

      moveCard: (fromListId, toListId, fromIndex, toIndex) =>
        set((state) => {
          const lists = [...state.board.lists];
          const fromList = lists.find((l) => l.id === fromListId);
          const toList = lists.find((l) => l.id === toListId);
          if (!fromList || !toList) return state;

          const fromCards = [...fromList.cards];
          const [movedCard] = fromCards.splice(fromIndex, 1);

          const toCards = fromListId === toListId ? fromCards : [...toList.cards];
          toCards.splice(toIndex, 0, movedCard);

          return {
            board: {
              ...state.board,
              lists: lists.map((list) => {
                if (list.id === fromListId && list.id === toListId) {
                  return { ...list, cards: toCards };
                }
                if (list.id === fromListId) {
                  return { ...list, cards: fromCards };
                }
                if (list.id === toListId) {
                  return { ...list, cards: toCards };
                }
                return list;
              }),
            },
          };
        }),
    }),
    {
      name: 'flowboard_state',
    }
  )
);