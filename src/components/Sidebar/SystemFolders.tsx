import { useAppStore } from "@/stores/appStore";
import { Folder, Star, Trash2, Sparkles } from "lucide-react";

const systemFolders = [
  { id: "all-notes", icon: Folder, label: "全部笔记" },
  { id: "favorites", icon: Star, label: "收藏" },
  { id: "ai-notes", icon: Sparkles, label: "AI笔记" },
  { id: "recycle-bin", icon: Trash2, label: "回收站" },
];

export default function SystemFolders() {
  const selectedFolderId = useAppStore((state) => state.selectedFolderId);
  const setSelectedFolder = useAppStore((state) => state.setSelectedFolder);
  const notes = useAppStore((state) => state.notes);

  const getNoteCount = (folderId: string) => {
    switch (folderId) {
      case "all-notes":
        return notes.filter((n) => !n.isDeleted).length;
      case "favorites":
        return notes.filter((n) => n.isFavorite && !n.isDeleted).length;
      case "ai-notes":
        return notes.filter((n) => n.isAI && !n.isDeleted).length;
      case "recycle-bin":
        return notes.filter((n) => n.isDeleted).length;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-1">
      {systemFolders.map((folder) => {
        const Icon = folder.icon;
        const isSelected = selectedFolderId === folder.id;
        const count = getNoteCount(folder.id);

        return (
          <button
            key={folder.id}
            onClick={() => setSelectedFolder(folder.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-button text-sm transition-colors ${
              isSelected
                ? "bg-primary/10 text-primary dark:text-primary-light"
                : "text-text-secondary dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="flex-1 text-left">{folder.label}</span>
            <span
              className={`text-xs ${
                isSelected ? "text-primary dark:text-primary-light" : "text-text-muted dark:text-text-muted-dark"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
