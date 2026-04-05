import { useEffect } from "react";
import { useAppStore } from "@/stores/appStore";
import AppLayout from "@/components/Layout/AppLayout";

function App() {
  const initialize = useAppStore((state) => state.initialize);
  const isInitialized = useAppStore((state) => state.isInitialized);
  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    initialize().catch((err) => {
      console.error("初始化失败:", err);
    });
  }, [initialize]);

  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else if (theme === "light") {
      document.body.classList.remove("dark");
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    }
  }, [theme]);

  if (!isInitialized) {
    return (
      <div className="h-full flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="animate-pulse text-primary">加载中...</div>
      </div>
    );
  }

  return <AppLayout />;
}

export default App;
