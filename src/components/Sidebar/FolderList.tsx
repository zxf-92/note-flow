import { useState } from "react";
import { useAppStore } from "@/stores/appStore";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

export default function FolderList() {
  const folders = useAppStore((state) => state.folders);
  const selectedFolderId = useAppStore((state) => state.selectedFolderId);
  const setSelectedFolder = useAppStore((state) => state.setSelectedFolder);
  const renameFolder = useAppStore((state) => state.renameFolder);
  const deleteFolder = useAppStore((state) => state.deleteFolder);
  const notes = useAppStore((state) => state.notes);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const customFolders = folders.filter((f) => !f.isSystem);

  const getNoteCount = (folderId: string) => {
    return notes.filter((n) => n.folderId === folderId && !n.isDeleted).length;
  };

  const handleStartRename = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
    setMenuOpenId(null);
  };

  const handleRename = async () => {
    if (editingId && editingName.trim()) {
      await renameFolder(editingId, editingName.trim());
    }
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    await deleteFolder(id);
    setMenuOpenId(null);
    if (selectedFolderId === id) {
      setSelectedFolder(null);
    }
  };

  if (customFolders.length === 0) {
    return (
      <div className="py-2 px-3 text-xs text-text-muted dark:text-text-muted-dark">
        暂无自定义文件夹
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="px-3 py-1 text-xs font-medium text-text-muted dark:text-text-muted-dark uppercase">
        文件夹
      </div>
      {customFolders.map((folder) => {
        const isSelected = selectedFolderId === folder.id;
        const isEditing = editingId === folder.id;
        const count = getNoteCount(folder.id);

        return (
          <div key={folder.id} className="relative group">
            {isEditing ? (
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename();
                  if (e.key === "Escape") setEditingId(null);
                }}
                autoFocus
                className="w-full px-3 py-2 text-sm rounded-input border border-primary bg-background-light dark:bg-background-dark focus:outline-none"
              />
            ) : (
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-button text-sm cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-primary/10 text-primary dark:text-primary-light"
                    : "text-text-secondary dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onClick={() => setSelectedFolder(folder.id)}
                onDoubleClick={() => handleStartRename(folder.id, folder.name)}
              >
                <span>{folder.icon}</span>
                <span className="flex-1 truncate">{folder.name}</span>
                <span className="text-xs text-text-muted dark:text-text-muted-dark">
                  {count}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenId(menuOpenId === folder.id ? null : folder.id);
                  }}
                  className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <MoreVertical className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Context Menu */}
            {menuOpenId === folder.id && (
              <div className="absolute right-0 top-full mt-1 py-1 w-36 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card shadow-lg z-10">
                <button
                  onClick={() => handleStartRename(folder.id, folder.name)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Pencil className="w-3 h-3" />
                  重命名
                </button>
                <button
                  onClick={() => handleDelete(folder.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Trash2 className="w-3 h-3" />
                  删除
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
