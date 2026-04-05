import TopBar from "./TopBar";
import Sidebar from "../Sidebar/Sidebar";
import MainContent from "./MainContent";

export default function AppLayout() {
  return (
    <div className="h-full flex flex-col bg-background-light dark:bg-background-dark">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
}
