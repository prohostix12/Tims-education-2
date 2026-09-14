"use client";

import { useRef, useEffect, useState } from "react";
import styles from "../../app/admin/courses/sslc-plus-two/content-cards/sslc-cards.module.css";

interface EditorProps {
  value: string;
  onChange: (htmlValue: string) => void;
}

export default function RichTextHighlightEditor({ value, onChange }: EditorProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const isInternalUpdate = useRef(false);
  const [selectedTextSnippet, setSelectedTextSnippet] = useState("");

  // Sync value into contentEditable element when value changes externally
  useEffect(() => {
    if (contentRef.current && !isInternalUpdate.current) {
      if (contentRef.current.innerHTML !== value) {
        contentRef.current.innerHTML = value || "";
      }
    }
    isInternalUpdate.current = false;
  }, [value]);

  const handleInput = () => {
    if (contentRef.current) {
      isInternalUpdate.current = true;
      onChange(contentRef.current.innerHTML);
    }
  };

  const handleSelectionChange = () => {
    const sel = window.getSelection();
    if (sel && sel.toString().trim().length > 0) {
      setSelectedTextSnippet(sel.toString().trim());
    } else {
      setSelectedTextSnippet("");
    }
  };

  const execCmd = (command: string, arg: string | undefined = undefined) => {
    document.execCommand(command, false, arg);
    handleInput();
  };

  // Custom Highlight Handler
  const toggleHighlight = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      alert("Please select some text in the description field below first, then click 'Yellow Highlight'.");
      return;
    }

    const range = sel.getRangeAt(0);

    // Check if selection is already inside a highlight element
    let parent = range.commonAncestorContainer as HTMLElement | null;
    if (parent && parent.nodeType === Node.TEXT_NODE) {
      parent = parent.parentElement;
    }

    const existingMark = parent?.closest("mark, span[class*='yellowHighlight']");

    if (existingMark) {
      // Remove highlight (unwrap)
      const parentNode = existingMark.parentNode;
      while (existingMark.firstChild) {
        parentNode?.insertBefore(existingMark.firstChild, existingMark);
      }
      parentNode?.removeChild(existingMark);
    } else {
      // Wrap selection in mark element with yellow highlight class
      const mark = document.createElement("mark");
      mark.className = styles.yellowHighlight;
      try {
        range.surroundContents(mark);
      } catch {
        // Fallback for multi-node selections
        const fragment = range.extractContents();
        mark.appendChild(fragment);
        range.insertNode(mark);
      }
    }

    sel.removeAllRanges();
    handleInput();
  };

  const clearFormatting = () => {
    execCmd("removeFormat");
    if (contentRef.current) {
      // Also strip inline marks
      const marks = contentRef.current.querySelectorAll("mark, span[class*='yellowHighlight']");
      marks.forEach((m) => {
        const parent = m.parentNode;
        while (m.firstChild) parent?.insertBefore(m.firstChild, m);
        parent?.removeChild(m);
      });
      handleInput();
    }
  };

  return (
    <div>
      <div className={styles.editorToolbar}>
        <button
          type="button"
          className={styles.toolBtn}
          onClick={() => execCmd("bold")}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          className={styles.toolBtn}
          onClick={() => execCmd("italic")}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          className={styles.toolBtn}
          onClick={() => execCmd("underline")}
          title="Underline (Ctrl+U)"
        >
          <u>U</u>
        </button>
        <div style={{ width: "1px", height: "20px", background: "#cbd5e1", margin: "0 4px" }} />
        <button
          type="button"
          className={`${styles.toolBtn} ${styles.highlightToolBtn}`}
          onClick={toggleHighlight}
          title="Highlight selected text with yellow theme style"
        >
          <span style={{ fontSize: "1.05rem" }}>🖍️</span> Yellow Highlight
        </button>
        <button
          type="button"
          className={styles.toolBtn}
          onClick={clearFormatting}
          title="Clear formatting"
          style={{ marginLeft: "auto", fontSize: "0.78rem" }}
        >
          🧹 Clear
        </button>
      </div>

      <div
        ref={contentRef}
        className={styles.wysiwygArea}
        contentEditable
        onInput={handleInput}
        onMouseUp={handleSelectionChange}
        onKeyUp={handleSelectionChange}
        aria-label="Description rich text editor"
        suppressContentEditableWarning
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.4rem" }}>
        <span className={styles.fieldHelper}>
          Select any word or sentence above and click <strong>Yellow Highlight</strong>.
        </span>
        {selectedTextSnippet && (
          <span style={{ fontSize: "0.75rem", color: "#E91D24", fontWeight: 700 }}>
            Selected: &quot;{selectedTextSnippet.slice(0, 25)}
            {selectedTextSnippet.length > 25 ? "..." : ""}&quot;
          </span>
        )}
      </div>
    </div>
  );
}
