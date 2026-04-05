import { Search, Settings, Moon, Sun, FileText, Sparkles } from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { useState, useEffect } from "react";

export default function TopBar() {
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);
  const searchQuery = useAppStore((state) => state.searchQuery);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);

  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery]);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getThemeIcon = () => {
    if (theme === "dark") return <Moon className="w-5 h-5" />;
    return <Sun className="w-5 h-5" />;
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
      <div className="flex items-center gap-3">
        <FileText className="w-7 h-7 text-primary" />
        <h1 className="text-xl font-bold text-text-primary dark:text-text-primary-dark">
          NoteFlow
        </h1>
      </div>

      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted dark:text-text-muted-dark" />
          <input
            type="text"
            placeholder="搜索笔记..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full h-9 pl-10 pr-4 rounded-input bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => console.log("AI助手 (后续集成)")}
          className="flex items-center gap-2 px-3 py-2 bg-primary text-white text-sm rounded-button hover:brightness-110 transition-all duration-300"
          title="AI助手"
        >
          <Sparkles className="w-4 h-4" />
          <span>AI助手</span>
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-button hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={`当前主题: ${theme === "light" ? "浅色" : theme === "dark" ? "深色" : "跟随系统"}`}
        >
          {getThemeIcon()}
        </button>
        <button className="p-2 rounded-button hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Settings className="w-5 h-5 text-text-secondary dark:text-text-secondary-dark" />
        </button>
      </div>
    </header>
  );
}
