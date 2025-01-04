"use client";

import {
  SandpackProvider,
  SandpackPreview,
  SandpackFileExplorer,
  SandpackLayout,
  // SandpackCodeEditor,
  SandpackStack,
  useSandpack,
} from "@codesandbox/sandpack-react";

import { Toaster, toast } from "sonner";

import { useEffect, useRef, useState, useCallback } from "react";
import File from "./ui/icons/File";

import React from "react";
import Package from "./ui/icons/Package";
import Block from "./ui/icons/Block";
import { useModal } from "@/src/customHooks/useModal";
import MonacoEditor from "./MonacoEditor.jsx";
import Button from "./ui/Button";
import { saveTemplateToDB } from "@/src/lib/actions";
import { makeFilesAndDependenciesUIStateLike } from "@/src/utils";
import { ScaleLoader } from "react-spinners";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Avatar from "react-avatar";
import Settings from "./ui/icons/Settings";

export default function SandpackEditor({
  id,
  shardDetails: initialShardDetails,
  template = "react",
  room = false,
}) {
  const [shardDetails, setShardDetails] = useState(null);
  const [domLoaded, setDomLoaded] = useState(false);
  const [dependencies, setDependencies] = useState({});
  const [devDependencies, setDevDependencies] = useState({});
  const [files, setFiles] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  const [theme, setTheme] = useState("vs-dark");
  useModal(isModalOpen, setIsModalOpen, modalRef);

  useEffect(() => {
    if (initialShardDetails) {
      const data = JSON.parse(initialShardDetails);
      console.log(data);
      const [f, dep, devDep] = makeFilesAndDependenciesUIStateLike(
        data.files,
        data.dependencies,
      );
      setFiles(f);
      setDependencies(dep);
      setDevDependencies(devDep);
      setShardDetails(data);
    } else {
      setFiles({});
      setShardDetails(null);
      setDependencies({});
      setDevDependencies({});
    }
  }, [initialShardDetails]);

  useEffect(() => {
    if (!domLoaded) {
      setDomLoaded(true);
    }
  }, [domLoaded]);

  if (!domLoaded) {
    return (
      <>
        <ScaleLoader />
      </>
    );
  }
  const addNewFile = (fileName, fileCode = "") => {
    const filePath = `/${fileName}`;

    if (fileName !== "") {
      setFiles((prev) => {
        return {
          ...prev,
          [`${filePath}`]: fileCode,
        };
      });
    }
  };

  const addNewDependency = (dependencyName) => {
    if (dependencyName !== "") {
      setDependencies((prev) => {
        return {
          ...prev,
          [`${dependencyName}`]: "latest",
        };
      });
    }
  };

  const addNewDevDependency = (dependencyName) => {
    if (dependencyName !== "") {
      setDevDependencies((prev) => {
        return {
          ...prev,
          [`${dependencyName}`]: "latest",
        };
      });
    }
  };

  console.log(files);
  return (
    <>
      <SandpackProvider
        files={files}
        template={template}
        theme={"dark"}
        customSetup={{
          dependencies,
          devDependencies,
        }}
      >
        <SandpackLayout>
          <SandpackSidebar
            id={id}
            theme={theme}
            setTheme={setTheme}
            template={template}
            addNewFile={addNewFile}
            dependencies={dependencies}
            devDependencies={devDependencies}
            addNewDependency={addNewDependency}
            addNewDevDependency={addNewDevDependency}
          />
          <MonacoEditor theme={theme} />
          <SandpackPreview
            showOpenInCodeSandbox={false}
            showOpenNewtab={true}
            style={{ height: "100vh" }}
          />
        </SandpackLayout>
      </SandpackProvider>
    </>
  );
}

const themes = [
  "Active4D",
  "All Hallows Eve",
  "Amy",
  "Birds of Paradise",
  "Blackboard",
  "Brilliance Black",
  "Brilliance Dull",
  "Chrome DevTools",
  "Clouds Midnight",
  "Clouds",
  "Cobalt",
  "Cobalt2",
  "Dawn",
  "Dominion Day",
  "Dracula",
  "Dreamweaver",
  "Eiffel",
  "Espresso Libre",
  "GitHub Dark",
  "GitHub Light",
  "GitHub",
  "IDLE",
  "Katzenmilch",
  "Kuroir Theme",
  "LAZY",
  "MagicWB (Amiga)",
  "Merbivore Soft",
  "Merbivore",
  "Monokai Bright",
  "Monokai",
  "Night Owl",
  "Nord",
  "Oceanic Next",
  "Pastels on Dark",
  "Slush and Poppies",
  "Solarized-dark",
  "Solarized-light",
  "SpaceCadet",
  "Sunburst",
  "Textmate (Mac Classic)",
  "Tomorrow-Night-Blue",
  "Tomorrow-Night-Bright",
  "Tomorrow-Night-Eighties",
  "Tomorrow-Night",
  "Tomorrow",
  "Twilight",
  "Upstream Sunburst",
  "Vibrant Ink",
  "Xcode_default",
  "Zenburnesque",
  "iPlastic",
  "idleFingers",
  "krTheme",
  "monoindustrial",
  "themelist",
];

function SandpackSidebar({
  addNewFile,
  theme,
  setTheme,
  dependencies,
  devDependencies,
  addNewDependency,
  addNewDevDependency,
  id,
}) {
  const { sandpack } = useSandpack();
  const { data: session } = useSession();
  const router = useRouter();
  const modalRef = useRef(null);
  const [isClicked, setIsClicked] = useState(false);
  useModal(isClicked, setIsClicked, modalRef);
  const [onSaveClick, setOnSaveClick] = useState(false);

  useEffect(() => {
    if (onSaveClick) {
      handleSave();
    }
  }, [onSaveClick]);

  const { files } = sandpack;

  let modal = (
    <>
      <div ref={modalRef} className="absolute z-10 left-2 top-9">
        <select
          name="Themes"
          id="themes"
          onChange={(e) => {
            setTheme(e.target.value);
          }}
          className="bg-white text-black rounded-md py-1"
          value={theme}
        >
          <option value="vs-dark">vs-dark</option>
          <option value="light">light</option>
          {themes.map((theme) => {
            return (
              <option key={theme} value={theme}>
                {theme}
              </option>
            );
          })}
        </select>
      </div>
    </>
  );

  const handleSave = async () => {
    let loadingId = null;
    try {
      // const userName = session?.name;
      loadingId = toast.loading("Saving...");
      const { status } = await saveTemplateToDB(
        id,
        files,
        dependencies,
        devDependencies,
      );
      setOnSaveClick(false);
      if (status === 500) {
        toast.dismiss(loadingId);
        toast.error("Could not save shard. Try Again!");
        return;
      } else if (status === 200) {
        // window.alert("Shard Updated Successfully")
        toast.dismiss(loadingId);
        toast.info("Shard saved successfully");
        router.push(`/shard/${id}`);
      }
    } catch (error) {
      console.log("error occurred", error);
    } finally {
      toast.dismiss(loadingId);
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      {isClicked && modal}
      <div className="w-[15%] flex flex-col ">
        <SandpackStack>
          <div className="flex gap-2 mb-4 p-1 items-center justify-left">
            {/* <p className="text-lg pr-4 pl-2 font-['Josh', sans-serif]">{template}</p> */}
            <File
              onClick={() => {
                const fileName = prompt("Enter File Name: ");
                if (fileName) addNewFile(fileName);
              }}
              className={
                "size-4 fill-white hover:fill-slate-600 cursor-pointer"
              }
            />
            <Package
              onClick={() => {
                const dependencyName = prompt("Add new dependency");
                if (dependencyName) addNewDependency(dependencyName);
              }}
              className={
                "size-4 fill-white hover:fill-slate-600 cursor-pointer"
              }
            />
            <Block
              onClick={() => {
                const dependencyName = prompt("Add new dev. dependency");
                if (dependencyName) addNewDevDependency(dependencyName);
              }}
              className={
                "cursor-pointer hover:fill-slate-600 fill-white size-4"
              }
            />
            <Settings
              onClick={() => {
                console.log("clicked on settings");
                setIsClicked(true);
              }}
              className={
                "size-4 hover:fill-slate-600 fill-white cursor-pointer"
              }
            />
            {id && (
              <Button
                className="font-[500] text-sm border p-1 rounded-md"
                onClick={() => {
                  setOnSaveClick(true);
                }}
              >
                Save
              </Button>
            )}
            {session && (
              <button
                className="text-xs cursor-pointer"
                onClick={() => {
                  router.replace("/your-work");
                }}
              >
                <Avatar
                  className="text-xs"
                  name={session?.user?.name}
                  size="30"
                  round={true}
                />
              </button>
            )}
          </div>
        </SandpackStack>
        <SandpackFileExplorer style={{ height: "92vh" }} />
      </div>
    </>
  );
}
