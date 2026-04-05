import { useAppStore } from "@/stores/appStore";
import NoteEditor from "@/components/Editor/NoteEditor";
import EmptyState from "./EmptyState";

export default function MainContent() {
  const currentNoteId = useAppStore((state) => state.currentNoteId);
  const notes = useAppStore((state) => state.notes);

  const currentNote = notes.find((n) => n.id === currentNoteId);

  if (!currentNote) {
    return <EmptyState />;
  }

  return (
    <main className="flex-1 overflow-auto bg-background-light dark:bg-background-dark">
      <div className="max-w-3xl mx-auto py-8 px-6">
        <NoteEditor note={currentNote} />
      </div>
    </main>
  );
}
