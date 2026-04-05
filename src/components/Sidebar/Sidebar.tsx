import { useState } from "react";
import { useAppStore } from "@/stores/appStore";
import SystemFolders from "./SystemFolders";
import FolderList from "./FolderList";
import NoteList from "./NoteList";
import TagSection from "./TagSection";
import { Plus, FolderPlus } from "lucide-react";

export default function Sidebar() {
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const createFolder = useAppStore((state) => state.createFolder);
  const createNote = useAppStore((state) => state.createNote);
  const selectedFolderId = useAppStore((state) => state.selectedFolderId);

  const handleCreateFolder = async () => {
    if (newFolderName.trim()) {
      await createFolder(newFolderName.trim(), null);
      setNewFolderName("");
      setShowNewFolderInput(false);
    }
  };

  const handleCreateNote = () => {
    createNote(selectedFolderId || "all-notes");
  };

  return (
    <aside className="w-70 h-full flex flex-col border-r border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
      {/* Quick Actions */}
      <div className="p-4 flex gap-2">
        <button
          onClick={handleCreateNote}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white text-sm rounded-button hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          新建笔记
        </button>
        <button
          onClick={() => setShowNewFolderInput(true)}
          className="p-2 rounded-button hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="新建文件夹"
        >
          <FolderPlus className="w-5 h-5 text-text-secondary dark:text-text-secondary-dark" />
        </button>
      </div>

      {/* New Folder Input */}
      {showNewFolderInput && (
        <div className="px-4 pb-2">
          <input
            type="text"
            placeholder="文件夹名称"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateFolder();
              if (e.key === "Escape") setShowNewFolderInput(false);
            }}
            onBlur={handleCreateFolder}
            autoFocus
            className="w-full px-3 py-2 text-sm rounded-input border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      )}

      {/* System Folders */}
      <div className="px-2">
        <SystemFolders />
      </div>

      {/* Custom Folders */}
      <div className="px-2 mt-2">
        <FolderList />
      </div>

      {/* Tags */}
      <TagSection />

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto mt-4 border-t border-border-light dark:border-border-dark">
        <NoteList />
      </div>
    </aside>
  );
}
