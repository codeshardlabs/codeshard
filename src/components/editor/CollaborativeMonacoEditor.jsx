"use client";

import { useSocket } from "@/src/context/SocketContext";
import { Editor, useMonaco } from "@monaco-editor/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  SandpackStack,
  useSandpack,
  useSandpackClient,
} from "@codesandbox/sandpack-react";
import { FileTabs } from "@codesandbox/sandpack-react";
import { snakeCase } from "./MonacoEditor";
import { toast } from "sonner";

const CollaborativeMonacoEditor = ({ theme, roomId }) => {
  const editorRef = useRef(null);
  const {
    sendMessage,
    latestData,
    latestVisibleFiles,
    sendVisibleFiles,
    joinRoom,
  } = useSocket();
  const [isClient, setIsClient] = useState(false);
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);
  const monaco = useMonaco();
  const { sandpack } = useSandpack();
  const { files, activeFile, updateCurrentFile, visibleFiles, updateFile } =
    sandpack;

  const code = files[activeFile]?.code || "";

  useEffect(() => {
    if (!window) {
      console.log("not window");
      return;
    }
  });

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
    if (!roomId) return;
    joinRoom({
      roomId: roomId,
    });
  }, []);

  useEffect(() => {
    setIsClient(true);

    return () => {
      setIsClient(false);
    };
  }, []);

  useEffect(() => {
    if (latestVisibleFiles?.length > 0) {
      for (let file of latestVisibleFiles) {
        let newCode = latestData[file]?.code;
        if (newCode && files[file]?.code !== newCode) {
          updateFile(file, newCode, true);
          if (file === activeFile) {
            updateCurrentFile(newCode, true);
          }
        }
      }
    }
  }, [latestVisibleFiles]);

  useEffect(() => {
    if (visibleFiles?.length > 0) {
      if (
        !window.localStorage.getItem("visibleFiles") ||
        JSON.parse(window.localStorage.getItem("visibleFiles"))?.length !==
          visibleFiles.length
      )
        sendVisibleFiles({
          visibleFiles,
          roomId: roomId,
        });
      window.localStorage.setItem("visibleFiles", JSON.stringify(visibleFiles));
    }
  }, [visibleFiles]);

  useEffect(() => {
    if (!isClient || !editorRef.current || !roomId) {
      return;
    }

    let cleanup = () => {};

    const setupYjs = async () => {
      try {
        const { Doc } = await import("yjs");
        const { WebsocketProvider } = await import("y-websocket");
        const { MonacoBinding } = await import("y-monaco");

        const ydoc = new Doc();
        const ytext = ydoc.getText("monaco");

        const wsProvider = new WebsocketProvider(
          process.env.NEXT_PUBLIC_WS_ENDPOINT,
          roomId,
          ydoc,
        );

        const monacoBinding = new MonacoBinding(
          ytext,
          editorRef.current.getModel(),
          new Set([editorRef.current]),
          wsProvider.awareness,
        );

        cleanup = () => {
          monacoBinding.destroy();
          wsProvider.destroy();
          ydoc.destroy();
        };
      } catch (error) {
        console.error("Error setting up Yjs:", error);
        toast.error("Error setting up Yjs. Refresh and try again.");
      }
    };

    setupYjs();

    return () => cleanup();
  }, [editorRef, isClient, roomId]);

  const onEditorChange = useCallback((value) => {
    // setEditorData(value);
    updateCurrentFile(value, true);
    sendMessage({
      activeFile: activeFile,
      data: value,
      roomId: roomId,
    });
  });

  if (!isClient) {
    return null;
  }

  const jsTypes = ["js", "jsx"];
  const tsTypes = ["ts", "tsx"];
  const arr = activeFile?.split(".");
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
    <>
      <SandpackStack style={{ height: "100vh", margin: 0 }}>
        <FileTabs />
        <Editor
          key={activeFile}
          height={"100vh"}
          defaultLanguage="javascript"
          theme={
            theme === "vs-dark" || theme === "light"
              ? theme
              : isThemeLoaded
                ? theme
                : "vs-dark"
          }
          language={fileType}
          onChange={onEditorChange}
          defaultValue={code}
          value={latestData[activeFile]?.code || code}
          onMount={(editor) => (editorRef.current = editor)}
        />
      </SandpackStack>
    </>
  );
};

export default dynamic(() => Promise.resolve(CollaborativeMonacoEditor), {
  ssr: false,
});
