import { useState } from "react";
import { useAppStore } from "@/stores/appStore";
import { Tag, Plus, X } from "lucide-react";

const TAG_COLORS = [
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#22C55E",
  "#06B6D4",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
];

export default function TagSection() {
  const tags = useAppStore((state) => state.tags);
  const selectedTagId = useAppStore((state) => state.selectedTagId);
  const setSelectedTag = useAppStore((state) => state.setSelectedTag);
  const createTag = useAppStore((state) => state.createTag);
  const deleteTag = useAppStore((state) => state.deleteTag);
  const notes = useAppStore((state) => state.notes);

  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0]);

  const getTagCount = (tagId: string) => {
    return notes.filter((n) => n.tags.includes(tagId) && !n.isDeleted).length;
  };

  const handleCreateTag = async () => {
    if (newTagName.trim()) {
      await createTag(newTagName.trim(), selectedColor);
      setNewTagName("");
      setShowNewTagInput(false);
      setSelectedColor(TAG_COLORS[0]);
    }
  };

  return (
    <div className="px-2 mt-4 border-t border-border-light dark:border-border-dark pt-4">
      <div className="px-3 py-1 flex items-center justify-between">
        <span className="text-xs font-medium text-text-muted dark:text-text-muted-dark uppercase">
          标签
        </span>
        <button
          onClick={() => setShowNewTagInput(true)}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-3 h-3 text-text-muted dark:text-text-muted-dark" />
        </button>
      </div>

      {/* New Tag Input */}
      {showNewTagInput && (
        <div className="px-3 py-2 space-y-2 animate-slide-in">
          <input
            type="text"
            placeholder="标签名称"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateTag();
              if (e.key === "Escape") setShowNewTagInput(false);
            }}
            autoFocus
            className="w-full px-3 py-2 text-sm rounded-input border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex flex-wrap gap-1">
            {TAG_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-5 h-5 rounded-full transition-transform ${
                  selectedColor === color ? "ring-2 ring-offset-1 scale-110" : ""
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreateTag}
              className="flex-1 px-3 py-1 bg-primary text-white text-xs rounded-button hover:brightness-110 transition-all duration-300"
            >
              创建
            </button>
            <button
              onClick={() => setShowNewTagInput(false)}
              className="px-3 py-1 text-xs rounded-button hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* Tag List */}
      <div className="space-y-1 mt-2">
        {tags.map((tag) => {
          const isSelected = selectedTagId === tag.id;
          const count = getTagCount(tag.id);

          return (
            <div key={tag.id} className="relative group">
              <button
                onClick={() => setSelectedTag(isSelected ? null : tag.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-button text-sm transition-all duration-300 ${
                  isSelected
                    ? "bg-primary/10 text-primary dark:text-primary-light"
                    : "text-text-secondary dark:text-text-secondary-dark hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Tag className="w-3 h-3" style={{ color: tag.color }} />
                <span className="flex-1 text-left truncate">{tag.name}</span>
                <span className="text-xs text-text-muted">{count}</span>
              </button>

              {/* Delete button on hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTag(tag.id);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
              >
                <X className="w-3 h-3 text-red-500" />
              </button>
            </div>
          );
        })}

        {tags.length === 0 && !showNewTagInput && (
          <div className="py-2 px-3 text-xs text-text-muted dark:text-text-muted-dark">
            暂无标签
          </div>
        )}
      </div>
    </div>
  );
}
