import Dexie, { type Table } from "dexie";
import type { Note, Folder, Tag } from "@/types";

export class NoteFlowDB extends Dexie {
  notes!: Table<Note>;
  folders!: Table<Folder>;
  tags!: Table<Tag>;

  constructor() {
    super("NoteflowDB");
    this.version(1).stores({
      notes: "id, title, folderId, isFavorite, isDeleted, updatedAt, createdAt",
      folders: "id, parentId, order, isSystem",
      tags: "id, name, createdAt",
    });
  }
}

export const db = new NoteFlowDB();

// Initialize default folders
export async function initializeDefaultData() {
  const folderCount = await db.folders.count();
  if (folderCount === 0) {
    const now = Date.now();
    await db.folders.bulkAdd([
      {
        id: "all-notes",
        name: "全部笔记",
        icon: "📁",
        parentId: null,
        order: 0,
        isSystem: true,
        createdAt: now,
      },
      {
        id: "favorites",
        name: "收藏",
        icon: "⭐",
        parentId: null,
        order: 1,
        isSystem: true,
        createdAt: now,
      },
      {
        id: "recycle-bin",
        name: "回收站",
        icon: "🗑️",
        parentId: null,
        order: 2,
        isSystem: true,
        createdAt: now,
      },
    ]);
  }
}
