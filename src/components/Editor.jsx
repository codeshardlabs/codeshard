"use client";
import { Doc } from "yjs";
import LiveblocksProvider from "@liveblocks/yjs";
import { useOthers, useRoom } from "@/liveblocks.config";
import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import { useCallback, useEffect, useState } from "react";
import Cursors from "./Cursors";
import { emmetCSS, emmetHTML, emmetJSX } from "emmet-monaco-es";

const CollaborativeEditor = ({ setCode, lang }) => {
  const room = useRoom();
  const [provider, setProvider] = useState();
  const [editorRef, setEditorRef] = useState();

  useEffect(() => {
    let yProvider;
    let yDoc;
    let binding;

    if (editorRef) {
      yDoc = new Doc();
      const yText = yDoc.getText("monaco");
      yProvider = new LiveblocksProvider(room, yDoc);
      setProvider(yProvider);

      // Attach Yjs to Monaco
      binding = new MonacoBinding(
        yText,
        editorRef.getModel(),
        new Set([editorRef]),
        yProvider.awareness,
      );
    }

    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
      binding?.destroy();
    };
  }, [editorRef, room]);

  // set editor instance
  const handleMount = useCallback((editor) => {
    if (lang === "html") {
      emmetHTML(window.monaco);
    }

    if (lang === "css") {
      emmetCSS(window.monaco);
    }

    if (lang === "javascript") {
      emmetJSX(window.monaco);
    }
    setEditorRef(editor);
  });

  const handleChange = useCallback((value) => {
    setCode(value);
  });

  return (
    <div className="w-1/3">
      {/* {provider ? <Cursors yProvider={provider} /> : null} */}
      <Editor
        onMount={handleMount}
        onChange={handleChange}
        height="50vh"
        theme="vs-dark"
        defaultLanguage={lang}
        defaultValue=""
      />
    </div>
  );
};

export default CollaborativeEditor;
