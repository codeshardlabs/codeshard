"use client";

import {
  SandpackProvider,
  SandpackPreview,
  SandpackFileExplorer,
  SandpackLayout,
  SandpackStack,
} from "@codesandbox/sandpack-react";

import { Toaster } from "sonner";

import { useEffect, useRef, useState } from "react";
import React from "react";
import { useModal } from "@/src/hooks/useModal";
import { makeFilesAndDependenciesUIStateLike } from "@/src/utils";
import { ScaleLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import Avatar from "react-avatar";
import Settings from "@/src/components/ui/icons/Settings";
import CollaborativeMonacoEditor from "./CollaborativeMonacoEditor";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

export default function CollaborativeSandpackEditor({
  id,
  shardDetails: initialShardDetails,
  template = "react",
  isNewShard,
  creator,
}) {
  const [shardDetails, setShardDetails] = useState(
    JSON.parse(initialShardDetails),
  );
  const [domLoaded, setDomLoaded] = useState(false);
  const [dependencies, setDependencies] = useState({});
  const [devDependencies, setDevDependencies] = useState({});
  const [files, setFiles] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  const [theme, setTheme] = useState("vs-dark");
  useModal(isModalOpen, setIsModalOpen, modalRef);
  const router = useRouter();

  console.log("room id: ", id);

  useEffect(() => {
    // check if new shard when component is mounted...
    if (isNewShard && id) {
      router.replace(`/room/${id}`);
    }
  }, []);

  useEffect(() => {
    if (initialShardDetails) {
      const data = JSON.parse(initialShardDetails);
      setShardDetails(data);
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
          <CollaborativeMonacoEditor
            creator={creator}
            roomId={id}
            theme={theme}
          />
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
  const { user, isSignedIn } = useAuth();
  const router = useRouter();
  const modalRef = useRef(null);
  const [isClicked, setIsClicked] = useState(false);
  useModal(isClicked, setIsClicked, modalRef);

  if (!isSignedIn) {
    toast.error("not signed in");
    return null;
  }

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

  return (
    <>
      <Toaster position="top-center" richColors />
      {isClicked && modal}
      <div className="w-[15%] flex flex-col ">
        <SandpackStack>
          <div className="flex gap-2 mb-4 p-1 items-center justify-left">
            <Settings
              onClick={() => {
                console.log("clicked on settings");
                setIsClicked(true);
              }}
              className={
                "size-4 hover:fill-slate-600 fill-white cursor-pointer"
              }
            />
            {session && (
              <button
                className="text-xs cursor-pointer"
                onClick={() => {
                  router.replace("/rooms-list");
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
