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
import { useEffect, useRef, useState } from "react";
import File from "../ui/icons/File";

import React from "react";
import Package from "../ui/icons/Package";
import Block from "../ui/icons/Block";
import { useModal } from "@/src/hooks/useModal";
import MonacoEditor from "./MonacoEditor.jsx";
import Button from "../ui/Button";
import { makeRequestToCodingAssistant, saveShard } from "@/src/lib/actions";
import { ScaleLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import Avatar from "react-avatar";
import Settings from "../ui/icons/Settings";
import { useAuth, useUser } from "@clerk/nextjs";
import { isJson, makeFilesAndDependenciesUIStateLike } from "@/src/lib/utils";
import ReactMarkdown from "react-markdown";

export default function SandpackEditor({
  id,
  shardDetails: initialShardDetails,
  shard = false,
  template = "react",
  room = false,
  readOnly = false,
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
    if (initialShardDetails && isJson(initialShardDetails)) {
      const data = JSON.parse(initialShardDetails);
      const [f, dep, devDep] = makeFilesAndDependenciesUIStateLike(
        data.files ?? [],
        data.dependencies ?? [],
      );
      setFiles(f);
      setDependencies(dep);
      setDevDependencies(devDep);
      setShardDetails(data);
    }  else if(localStorage.getItem(`try-editor-${template}`)) {
      const data = JSON.parse(localStorage.getItem(`try-editor-${template}`));
      console.log("data", data);
      const finalData = {
        files: {},
        dependencies: {},
        devDependencies: {},
      };

      finalData.files = data ?? {};
      setFiles(finalData.files ?? {});
      setDependencies(finalData.dependencies ?? {});
      setDevDependencies(data.devDependencies ?? {});
      setShardDetails(finalData);
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
        <div className="flex justify-center items-center h-[80vh]">
          <ScaleLoader />
        </div>
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
          {
            !readOnly && <SandpackSidebar
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
          }
          
          <MonacoEditor theme={theme} readOnly={readOnly} shard={shard} template={template} />
          <SandpackPreview
            showOpenInCodeSandbox={false}
            showOpenNewtab={true}
            style={{ height: "92vh" }}
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
  const { user, isSignedIn } = useUser();
  const { userId } = useAuth();
  const router = useRouter();
  const modalRef = useRef(null);
  const [isClicked, setIsClicked] = useState(false);
  useModal(isClicked, setIsClicked, modalRef);
  const [onSaveClick, setOnSaveClick] = useState(false);
  const [queryOutput, setQueryOutput] = useState("");

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
          className="bg-[#1F1F25] text-gray-200 rounded-md border border-gray-700 focus:outline-none focus:border-gray-500 hover:border-gray-500 transition-colors cursor-pointer"
          value={theme}
        >
          <option value="vs-dark" className="bg-[#1F1F25] text-gray-200 hover:bg-gray-700">vs-dark</option>
          <option value="light" className="bg-[#1F1F25] text-gray-200 hover:bg-gray-700">light</option>
          {themes.map((theme) => {
            return (
              <option key={theme} value={theme} className="bg-[#1F1F25] text-gray-200 hover:bg-gray-700">
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
      console.log("files", files);
      console.log("dependencies", dependencies);
      console.log("devDependencies", devDependencies);
      const { data, error } = await saveShard(
        userId, 
        id,
        {
          files,
          dependencies,
          devDependencies
        }
      );
      setOnSaveClick(false);
      if (error) {
        toast.dismiss(loadingId);
        toast.error("Could not save shard. Try Again!");
        return;
      } else if (data) {
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
        {userId && (
          <SandpackStack>
            <div className="flex gap-2 mb-4 p-1 items-center justify-left">
              <File
                onClick={() => {
                  const fileName = prompt("Enter File Name: ");
                  if (fileName) addNewFile(fileName);
                }}
                className={
                  "size-5 cursor-pointer"
                }
              />
              <Package
                onClick={() => {
                  const dependencyName = prompt("Add new dependency");
                  if (dependencyName) addNewDependency(dependencyName);
                }}
                className={
                  "size-5 cursor-pointer"
                }
              />
              <Block
                onClick={() => {
                  const dependencyName = prompt("Add new dev. dependency");
                  if (dependencyName) addNewDevDependency(dependencyName);
                }}
                className={
                  "size-5 cursor-pointer"
                }
              />
              <Settings
                onClick={() => {
                  console.log("clicked on settings");
                  setIsClicked(true);
                }}
                className={
                  "size-5 fill-white cursor-pointer transition-colors"
                }
              />
              <Button
                className="font-[500] text-sm border border-gray-700 p-1 rounded-md bg-[#1F1F25] text-white hover:bg-gray-700"
                onClick={() => {
                  setOnSaveClick(true);
                }}
              >
                Save
              </Button>
              <button
                className="text-xs cursor-pointer"
                onClick={() => {
                  router.replace("/your-work");
                }}
              >
                <Avatar
                  className="text-xs"
                  name={user.fullName}
                  size="30"
                  round={true}
                />
              </button>
            </div>
            <div> 
              
            </div>
            
          </SandpackStack>
        )}

        <SandpackFileExplorer style={{ height: queryOutput ? "19vh" : userId ? "80vh" : "92vh" }} />

        {
          userId && (
            <SandpackStack className="absolute right-0 bottom-0 w-[400px]">
          <div className={`${queryOutput ? "h-[500px]" : "hidden"} overflow-y-auto border border-gray-700 rounded-md p-2  text-white`}>
              <ReactMarkdown>{queryOutput}</ReactMarkdown>
          </div>
          <div className="flex gap-2 items-center p-2">
            <input 
              type="text"
              placeholder="Ask coding assistant..."
              className="w-full p-2 rounded-md bg-[#1F1F25] text-white border border-gray-700 focus:outline-none focus:border-gray-500"
            />
            <button
              className="bg-[#1F1F25] hover:bg-gray-700 text-white p-2 rounded-md border border-gray-700"
              onClick={() => {
                const query = document.querySelector("input").value;
                let loadingId = toast.loading("Processing...");
                makeRequestToCodingAssistant(userId, id, query).then((res) => {
                  if(res?.data){
                    toast.success("Request processed successfully");
                    setQueryOutput(res.data?.content ?? "");
                    document.querySelector("input").value = "";
                  }
                  else if(res?.error){
                    toast.error(res.error?.message ?? "Error occurred while making request to coding assistant");
                  }
                }).catch((err) => {
                  console.log("Error occurred in makeRequestToCodingAssistant", err);
                  toast.error("Error occurred while making request to coding assistant");
                }).finally(() => {
                  toast.dismiss(loadingId);
                });
              }}
            >
              Send
            </button>
          </div>
        </SandpackStack>
          )
        }
        
      </div>
    </>
  );
}
