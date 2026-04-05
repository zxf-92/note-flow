import { create } from "zustand";
import { db, initializeDefaultData } from "@/db";
import type { Note, Folder, Tag, Theme } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface AppState {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;

  // Folders
  folders: Folder[];
  loadFolders: () => Promise<void>;
  createFolder: (name: string, parentId: string | null, icon?: string) => Promise<Folder>;
  renameFolder: (id: string, name: string) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;

  // Notes
  notes: Note[];
  currentNoteId: string | null;
  loadNotes: () => Promise<void>;
  createNote: (folderId?: string) => Promise<Note>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  restoreNote: (id: string) => Promise<void>;
  permanentlyDeleteNote: (id: string) => Promise<void>;
  setCurrentNote: (id: string | null) => void;
  toggleFavorite: (id: string) => Promise<void>;

  // UI State
  selectedFolderId: string | null;
  setSelectedFolder: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Tags
  tags: Tag[];
  selectedTagId: string | null;
  loadTags: () => Promise<void>;
  createTag: (name: string, color: string) => Promise<Tag>;
  deleteTag: (id: string) => Promise<void>;
  setSelectedTag: (id: string | null) => void;
  addTagToNote: (noteId: string, tagId: string) => Promise<void>;
  removeTagFromNote: (noteId: string, tagId: string) => Promise<void>;

  // Initialization
  isInitialized: boolean;
  initialize: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Theme
  theme: "light",
  setTheme: (theme) => {
    set({ theme });
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else if (theme === "light") {
      document.body.classList.remove("dark");
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    }
  },

  // Folders
  folders: [],
  loadFolders: async () => {
    const folders = await db.folders.orderBy("order").toArray();
    set({ folders });
  },
  createFolder: async (name, parentId, icon = "📁") => {
    const now = Date.now();
    const folders = get().folders;
    const maxOrder = folders.reduce((max, f) => Math.max(max, f.order), -1);
    const folder: Folder = {
      id: uuidv4(),
      name,
      icon,
      parentId,
      order: maxOrder + 1,
      isSystem: false,
      createdAt: now,
    };
    await db.folders.add(folder);
    await get().loadFolders();
    return folder;
  },
  renameFolder: async (id, name) => {
    await db.folders.update(id, { name });
    await get().loadFolders();
  },
  deleteFolder: async (id) => {
    // Move all notes in this folder to all-notes
    await db.notes.where("folderId").equals(id).modify({ folderId: "all-notes" });
    // Delete child folders
    await db.folders.where("parentId").equals(id).delete();
    await db.folders.delete(id);
    await get().loadFolders();
    await get().loadNotes();
  },

  // Notes
  notes: [],
  currentNoteId: null,
  loadNotes: async () => {
    const notes = await db.notes.orderBy("updatedAt").reverse().toArray();
    set({ notes });
  },
  createNote: async (folderId = "all-notes") => {
    const now = Date.now();
    const note: Note = {
      id: uuidv4(),
      title: "无标题笔记",
      content: "",
      plainText: "",
      folderId,
      tags: [],
      isFavorite: false,
      isAI: false,
      createdAt: now,
      updatedAt: now,
      isDeleted: false,
      deletedAt: null,
    };
    await db.notes.add(note);
    await get().loadNotes();
    set({ currentNoteId: note.id });
    return note;
  },
  updateNote: async (id, updates) => {
    await db.notes.update(id, { ...updates, updatedAt: Date.now() });
    await get().loadNotes();
  },
  deleteNote: async (id) => {
    await db.notes.update(id, { isDeleted: true, deletedAt: Date.now() });
    if (get().currentNoteId === id) {
      set({ currentNoteId: null });
    }
    await get().loadNotes();
  },
  restoreNote: async (id) => {
    await db.notes.update(id, { isDeleted: false, deletedAt: null });
    await get().loadNotes();
  },
  permanentlyDeleteNote: async (id) => {
    await db.notes.delete(id);
    if (get().currentNoteId === id) {
      set({ currentNoteId: null });
    }
    await get().loadNotes();
  },
  setCurrentNote: (id) => set({ currentNoteId: id }),
  toggleFavorite: async (id) => {
    const note = await db.notes.get(id);
    if (note) {
      await db.notes.update(id, { isFavorite: !note.isFavorite });
      await get().loadNotes();
    }
  },

  // UI State
  selectedFolderId: null,
  setSelectedFolder: (id) => set({ selectedFolderId: id }),
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Tags
  tags: [],
  selectedTagId: null,
  loadTags: async () => {
    const tags = await db.tags.orderBy("createdAt").toArray();
    set({ tags });
  },
  createTag: async (name, color) => {
    const tag: Tag = {
      id: uuidv4(),
      name,
      color,
      createdAt: Date.now(),
    };
    await db.tags.add(tag);
    await get().loadTags();
    return tag;
  },
  deleteTag: async (id) => {
    // Remove tag from all notes
    const notesWithTag = await db.notes.filter((n) => n.tags.includes(id)).toArray();
    for (const note of notesWithTag) {
      await db.notes.update(note.id, { tags: note.tags.filter((t) => t !== id) });
    }
    await db.tags.delete(id);
    await get().loadTags();
    await get().loadNotes();
  },
  setSelectedTag: (id) => set({ selectedTagId: id }),
  addTagToNote: async (noteId, tagId) => {
    const note = await db.notes.get(noteId);
    if (note && !note.tags.includes(tagId)) {
      await db.notes.update(noteId, { tags: [...note.tags, tagId] });
      await get().loadNotes();
    }
  },
  removeTagFromNote: async (noteId, tagId) => {
    const note = await db.notes.get(noteId);
    if (note) {
      await db.notes.update(noteId, { tags: note.tags.filter((t) => t !== tagId) });
      await get().loadNotes();
    }
  },

  // Initialization
  isInitialized: false,
  initialize: async () => {
    try {
      await initializeDefaultData();
      await get().loadFolders();
      await get().loadTags();
      await get().loadNotes();
      set({ isInitialized: true });
    } catch (error) {
      console.error("初始化错误:", error);
      // Still set initialized to true so app can render
      set({ isInitialized: true });
    }
  },
}));
