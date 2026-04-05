import { useAppStore } from "@/stores/appStore";
import { X, Check } from "lucide-react";

interface TagSelectorProps {
  noteId: string;
  noteTags: string[];
  onClose: () => void;
}

export default function TagSelector({ noteId, noteTags, onClose }: TagSelectorProps) {
  const tags = useAppStore((state) => state.tags);
  const addTagToNote = useAppStore((state) => state.addTagToNote);
  const removeTagFromNote = useAppStore((state) => state.removeTagFromNote);

  const handleToggleTag = async (tagId: string) => {
    if (noteTags.includes(tagId)) {
      await removeTagFromNote(noteId, tagId);
    } else {
      await addTagToNote(noteId, tagId);
    }
  };

  return (
    <div className="absolute top-full left-0 mt-2 w-64 p-3 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card shadow-lg z-20 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">选择标签</span>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isSelected = noteTags.includes(tag.id);
          return (
            <button
              key={tag.id}
              onClick={() => handleToggleTag(tag.id)}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all duration-300 ${
                isSelected ? "ring-2 ring-offset-1" : "hover:opacity-80"
              }`}
              style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
            >
              {tag.name}
              {isSelected && <Check className="w-3 h-3" />}
            </button>
          );
        })}

        {tags.length === 0 && (
          <span className="text-xs text-text-muted">暂无标签，请先在侧边栏创建</span>
        )}
      </div>
    </div>
  );
}
