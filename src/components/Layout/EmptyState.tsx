import { FileText, Plus } from "lucide-react";
import { useAppStore } from "@/stores/appStore";

export default function EmptyState() {
  const createNote = useAppStore((state) => state.createNote);

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <FileText className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark mb-2">
        开始你的创作
      </h2>
      <p className="text-text-secondary dark:text-text-secondary-dark mb-6 max-w-md">
        选择左侧文件夹或点击下方按钮创建新笔记，捕捉你的每一个想法。
      </p>
      <button
        onClick={() => createNote()}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-button hover:opacity-90 transition-opacity"
      >
        <Plus className="w-4 h-4" />
        新建笔记
      </button>
    </div>
  );
}
