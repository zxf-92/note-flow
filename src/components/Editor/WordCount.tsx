import { type Editor } from "@tiptap/react";
import { useEffect, useState } from "react";

interface WordCountProps {
  editor: Editor | null;
}

export default function WordCount({ editor }: WordCountProps) {
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const updateCounts = () => {
      const text = editor.getText();
      setCharCount(text.length);
      // Split by whitespace and filter out empty strings
      const words = text.split(/\s+/).filter((w) => w.length > 0);
      setWordCount(words.length);
    };

    updateCounts();
    editor.on("update", updateCounts);

    return () => {
      editor.off("update", updateCounts);
    };
  }, [editor]);

  return (
    <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark flex items-center gap-4 text-xs text-text-muted dark:text-text-muted-dark">
      <span>{wordCount} 字</span>
      <span>{charCount} 字符</span>
    </div>
  );
}
