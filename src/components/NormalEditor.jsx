"use client";
import { Editor } from "@monaco-editor/react";
import clsx from "clsx";
import { emmetCSS, emmetHTML, emmetJSX } from "emmet-monaco-es";
import { useCallback, useEffect, useState } from "react";

export default function NormalEditor({ setCode, lang, value, readOnly }) {
  const [editorRef, setEditorRef] = useState();

  useEffect(() => {
    if (!editorRef) {
      return;
    }

    editorRef.updateOptions({ readOnly });
  }, [editorRef, readOnly]);

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
      <div className="flex flex-col bg-black ">
        <div
          className={clsx(lang === "javascript" && "flex gap-2 items-center")}
        >
          <p className="text-black  w-fit p-1 text-sm px-2 my-2 rounded-md bg-green-500">
            {lang.toUpperCase()}
          </p>
          {/* select dependencies from here  */}
          <div>{lang === "javascript"}</div>
        </div>
        <Editor
          onMount={handleMount}
          onChange={handleChange}
          height="50vh"
          theme="vs-dark"
          defaultLanguage={lang}
          defaultValue={value}
        />
      </div>
    </div>
  );
}
