import Editor, { useMonaco } from "@monaco-editor/react";
import {
  SandpackStack,
  FileTabs,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { useCallback, useEffect, useState } from "react";

export function snakeCase(fname) {
  return fname.toLowerCase().replace(/[_() ]/g, "-");
}
export default function MonacoEditor({ theme, readOnly = false, shard = false, template }) {
  const { sandpack } = useSandpack();
  const { files, activeFile, updateCurrentFile } = sandpack;
  const monaco = useMonaco();
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);
  const [editor, setEditor] = useState();

  useEffect(() => {
    if (monaco && theme !== "vs-dark" && theme !== "light") {
      console.log(theme);
      import(`monaco-themes/themes/${theme}.json`)
        .then((data) => {
          monaco.editor.defineTheme(snakeCase(theme), data);
          setIsThemeLoaded(true);
        })
        .then((_) => monaco.editor.setTheme(snakeCase(theme)));
    }
  }, [monaco, theme]);

  useEffect(() => {
    if (editor) {
      editor.updateOptions({ readOnly });
    }
  }, [editor, readOnly]);

  const code = files[activeFile]?.code || "";
  const handleChange = useCallback((value) => {
    updateCurrentFile(value, true);
  });

  const handleMount = useCallback((node) => {
    // console.log(monaco)
    setEditor(node);

    node.onDidChangeModelContent(() => {
      if(!shard) {
        // save the files to local storage if user is not authenticated
        const filesToSave = {...files};
        filesToSave[activeFile] = node.getValue(); 
        console.log("filesToSave", filesToSave);
        localStorage.setItem(`try-editor-${template}`, JSON.stringify(filesToSave));
      }
    });
  });

  const jsTypes = ["js", "jsx"];
  const tsTypes = ["ts", "tsx"];
  const arr = activeFile.split(".");
  const ext = arr[arr.length - 1];
  const fileType = jsTypes.includes(ext)
    ? "javascript"
    : tsTypes.includes(ext)
      ? "typescript"
      : ext === "html"
        ? "html"
        : ext === "css"
          ? "css"
          : ext === "json"
            ? "json"
            : null;

  return (
    <SandpackStack style={{ height: "92vh", margin: 0 }}>
      <FileTabs />
      {/* {provider ? <Cursors yProvider={provider} /> : null} */}
      <div style={{ flex: 1, background: "#1e1e1e" }}>
        <Editor
          key={activeFile}
          width="100%"
          height="100%"
          language={fileType}
          theme={
            theme === "vs-dark" || theme === "light"
              ? theme
              : isThemeLoaded
                ? theme
                : "vs-dark"
          }
          defaultValue={code}
          onChange={handleChange}
          onMount={handleMount}
        />
      </div>
    </SandpackStack>
  );
}
