export interface Note {
  id: string;
  title: string;
  content: string;
  plainText: string;
  folderId: string;
  tags: string[];
  isFavorite: boolean;
  isAI: boolean;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
  deletedAt: number | null;
}

export interface Folder {
  id: string;
  name: string;
  icon: string;
  parentId: string | null;
  order: number;
  isSystem: boolean;
  createdAt: number;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: number;
}

export type Theme = "light" | "dark" | "system";

export interface EditorMode {
  isFullscreen: boolean;
  isTypewriter: boolean;
}
