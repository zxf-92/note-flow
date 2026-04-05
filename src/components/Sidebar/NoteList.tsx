import { useAppStore } from "@/stores/appStore";
import { Star } from "lucide-react";
import { formatDistanceToNow } from "@/utils/date";

export default function NoteList() {
  const notes = useAppStore((state) => state.notes);
  const currentNoteId = useAppStore((state) => state.currentNoteId);
  const setCurrentNote = useAppStore((state) => state.setCurrentNote);
  const selectedFolderId = useAppStore((state) => state.selectedFolderId);
  const selectedTagId = useAppStore((state) => state.selectedTagId);
  const searchQuery = useAppStore((state) => state.searchQuery);
  const toggleFavorite = useAppStore((state) => state.toggleFavorite);

  // Filter notes based on selected folder, tag, and search
  let filteredNotes = notes.filter((n) => !n.isDeleted);

  if (selectedFolderId === "favorites") {
    filteredNotes = filteredNotes.filter((n) => n.isFavorite);
  } else if (selectedFolderId === "recycle-bin") {
    filteredNotes = notes.filter((n) => n.isDeleted);
  } else if (selectedFolderId === "ai-notes") {
    filteredNotes = filteredNotes.filter((n) => n.isAI);
  } else if (selectedFolderId && selectedFolderId !== "all-notes") {
    filteredNotes = filteredNotes.filter((n) => n.folderId === selectedFolderId);
  }

  // Filter by selected tag
  if (selectedTagId) {
    filteredNotes = filteredNotes.filter((n) => n.tags.includes(selectedTagId));
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredNotes = filteredNotes.filter(
      (n) =>
        n.title.toLowerCase().includes(query) ||
        n.plainText.toLowerCase().includes(query)
    );
  }

  // Sort by updated time
  filteredNotes.sort((a, b) => b.updatedAt - a.updatedAt);

  if (filteredNotes.length === 0) {
    return (
      <div className="py-8 px-4 text-center text-sm text-text-muted dark:text-text-muted-dark">
        {searchQuery ? "未找到匹配的笔记" : "暂无笔记"}
      </div>
    );
  }

  return (
    <div className="p-2 space-y-1">
      {filteredNotes.map((note) => (
        <div
          key={note.id}
          onClick={() => setCurrentNote(note.id)}
          className={`group p-3 rounded-card cursor-pointer transition-all ${
            currentNoteId === note.id
              ? "bg-primary/10 border border-primary/30"
              : "hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent"
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="flex-1 font-medium text-sm text-text-primary dark:text-text-primary-dark truncate">
              {note.title || "无标题笔记"}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(note.id);
              }}
              className={`p-1 rounded transition-colors ${
                note.isFavorite
                  ? "text-yellow-500"
                  : "text-text-muted dark:text-text-muted-dark opacity-0 group-hover:opacity-100"
              }`}
            >
              <Star className={`w-4 h-4 ${note.isFavorite ? "fill-current" : ""}`} />
            </button>
          </div>
          <p className="mt-1 text-xs text-text-muted dark:text-text-muted-dark line-clamp-2">
            {note.plainText || "空白笔记"}
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs text-text-muted dark:text-text-muted-dark">
            <span>{formatDistanceToNow(note.updatedAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
