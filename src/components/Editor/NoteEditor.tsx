import { useEffect, useRef, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { useAppStore } from "@/stores/appStore";
import type { Note } from "@/types";
import EditorToolbar from "./EditorToolbar";
import TitleInput from "./TitleInput";
import WordCount from "./WordCount";

interface NoteEditorProps {
  note: Note;
}

export default function NoteEditor({ note }: NoteEditorProps) {
  const updateNote = useAppStore((state) => state.updateNote);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: "开始写作...",
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: note.content ? JSON.parse(note.content) : "",
    onUpdate: ({ editor }) => {
      // Auto-save with 3 second delay
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        const json = JSON.stringify(editor.getJSON());
        const text = editor.getText();
        updateNote(note.id, { content: json, plainText: text });
      }, 3000);
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm dark:prose-invert max-w-none focus:outline-none font-mono text-base",
      },
    },
  });

  // Update editor content when note changes
  useEffect(() => {
    if (editor && note.content) {
      const currentContent = JSON.stringify(editor.getJSON());
      if (currentContent !== note.content) {
        editor.commands.setContent(JSON.parse(note.content));
      }
    } else if (editor && !note.content) {
      editor.commands.setContent("");
    }
  }, [note.id, editor]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleTitleChange = useCallback(
    (newTitle: string) => {
      updateNote(note.id, { title: newTitle });
    },
    [note.id, updateNote]
  );

  const handleManualSave = useCallback(() => {
    if (editor && saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      const json = JSON.stringify(editor.getJSON());
      const text = editor.getText();
      updateNote(note.id, { content: json, plainText: text });
    }
  }, [editor, note.id, updateNote]);

  return (
    <div className="animate-fade-in">
      {/* Toolbar */}
      <EditorToolbar editor={editor} onManualSave={handleManualSave} />

      {/* Title */}
      <TitleInput
        value={note.title}
        onChange={handleTitleChange}
        onSave={handleManualSave}
      />

      {/* Editor */}
      <div className="mt-4 min-h-[400px]">
        <EditorContent editor={editor} className="min-h-[400px]" />
      </div>

      {/* Word Count */}
      <WordCount editor={editor} />
    </div>
  );
}
