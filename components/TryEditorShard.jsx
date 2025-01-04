"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setPrev, setShard } from "@/src/store/slices/shard";
import NormalEditor from "./NormalEditor";

export default function TryEditorShard({}) {
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  const iframeRef = useRef();

  useEffect(() => {
    setHtml(localStorage.getItem("html") ?? "");
    setCss(localStorage.getItem("css") ?? "");
    setJs(localStorage.getItem("js") ?? "");
  }, []);

  const outputDoc = `
<html lang="en">
<body>${html}</body>
<style>${css}</style>
<script>${js}</script>
</html>`;

  useEffect(() => {
    localStorage.setItem("html", html);
    localStorage.setItem("css", css);
    localStorage.setItem("js", js);
  }, [html, css, js]);

  // console.log(html, css, js);

  return (
    <>
      {/* <button>Save</button> */}
      <div className="flex justify-center">
        <NormalEditor
          readOnly={false}
          setCode={setHtml}
          lang="html"
          value={html}
        />
        <NormalEditor
          readOnly={false}
          setCode={setCss}
          lang="css"
          value={css}
        />
        <NormalEditor
          readOnly={false}
          setCode={setJs}
          lang="javascript"
          value={js}
        />
      </div>

      <div style={{ height: "42vh", overflow: "auto" }} className="bg-white">
        <iframe
          className="bg-white"
          ref={iframeRef}
          srcDoc={outputDoc}
          title="output"
          sandbox="allow-scripts"
          height="100%"
          width="100%"
        />
      </div>
    </>
  );
}
