"use client";

import Button from "@/components/ui/Button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPrev, setShard } from "@/src/store/slices/shard";
import { setModal } from "@/src/store/slices/modal";
import ObjectID from "bson-objectid";
import Pencil from "@/components/ui/icons/Pencil";
import Cloud from "@/components/ui/icons/Cloud";
import Start from "@/components/ui/icons/Start";
import Close from "@/components/ui/icons/Close";
import Share from "@/components/ui/icons/Share";
import CopyLink from "@/components/ui/icons/Link";
import { writeToClipboard } from "@/src/utils";
import Avatar from "react-avatar";
import { Toaster, toast } from "sonner";
import { handleRouteShift } from "@/src/lib/actions";

const ShardNavbar = ({ roomId, shardDetails, readOnly }) => {
  const { data } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("Untitled");
  const [startEditing, setStartEditing] = useState(false);
  const dispatch = useDispatch();
  const shardState = useSelector((state) => state.shard.current);
  const prevState = useSelector((state) => state.shard.prev);
  const modal = useRef();
  const isModalOpen = useSelector((state) => state.modal.isOpen);
  const [linkCopied, setLinkcopied] = useState(false);

  useEffect(() => {
    const handleBodyClick = (e) => {
      console.log("body clicked");
      if (isModalOpen && modal.current && !modal.current.contains(e.target)) {
        dispatch(setModal(false));
      }
    };

    document.body.addEventListener("click", handleBodyClick);

    return () => {
      document.body.removeEventListener("click", handleBodyClick);
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (shardDetails) {
      setTitle(shardDetails.title);
    }
  }, [shardDetails]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const isSaved = JSON.stringify(shardState) === JSON.stringify(prevState);
      if (!isSaved) {
        const confirmationMessage =
          "You have unsaved changes. Are you sure you want to leave?";
        e.returnValue = confirmationMessage;
        return confirmationMessage;
      }

      if (isSaved) {
        console.log("saved and tab closed successfully...");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [router, shardState, prevState]);

  useEffect(() => {
    dispatch(setShard({ title }));
  }, [title]);

  const editTitle = () => {
    setStartEditing(true);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      setStartEditing(false);
    }
  };

  const openModal = () => {
    console.log("modal opened");
    dispatch(setModal(true));
  };

  const handleSave = async () => {
    console.log("Save Clicked");

    if (prevState !== shardState) {
      dispatch(setPrev({ ...shardState }));
      const saveShard = async () => {
        const myPromise = await fetch(`/api/shard/${roomId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(shardState),
        });

        return myPromise;
      };

      toast.promise(saveShard, {
        loading: "Saving...",
        success: () => {
          return `Saved Successfully`;
        },
        error: "Could not save Shard",
      });
    }
  };

  const copyLinkHandler = () => {
    writeToClipboard(roomId);
    toast.info("Link Copied Successfully");
  };

  return (
    <div
      onKeyDown={!readOnly ? handleEnter : null}
      className="bg-[#010101] flex p-4 py-2  justify-between items-center"
    >
      <div className="flex items-center gap-4">
        {startEditing ? (
          <>
            <input
              className="bg-transparent outline-none caret-white text-xl w-[50vw]"
              value={title}
              readOnly={readOnly}
              onChange={(e) => setTitle(e.target.value)}
            />
          </>
        ) : (
          <h1 className="flex items-center gap text-xl">
            {title}
            {!readOnly && (
              <Pencil
                onClick={editTitle}
                className="cursor-pointer fill-white size-6 hover:fill-slate-500"
              />
            )}
          </h1>
        )}
        <Toaster position="top-center" richColors />
      </div>
      <div className="flex items-center gap-4">
        <button
          className="cursor-pointer hover:text-slate-300"
          onClick={() => {
            if (!readOnly) {
              const isSaved =
                JSON.stringify(shardState) === JSON.stringify(prevState);
              if (!isSaved) {
                const wantToLeave = confirm(
                  "You have unsaved changes. Are you sure you want to leave?",
                );
                if (wantToLeave) {
                  router.push("/your-work");
                }

                return;
              }

              if (isSaved) {
                console.log("saved and tab closed successfully...");
                handleRouteShift();
              }
            }

            if (readOnly) {
              router.push(
                `/${shardDetails.creator.toLowerCase().split(" ").join("-")}`,
              );
            }
          }}
        >
          <Avatar
            name={readOnly ? shardDetails?.creator : data?.user?.name}
            round={true}
            size="40"
          />
        </button>
        <button
          onClick={openModal}
          className="text-white flex items-center gap-2 hover:text-slate-300"
        >
          {" "}
          <Share className="size-4 text-white" /> Share
        </button>
        {isModalOpen && (
          <dialog
            ref={modal}
            onClose={() => dispatch(setModal(false))}
            className="mt-[90vh] z-50 grid items-center bg-[#1E1F26] rounded-lg p-8 py-12 text-white gap-4 border border-emerald-600"
          >
            <div className="relative flex flex-col items-center gap-4">
              <h1 className="text-[#47cf73] text-lg">Sharable Link</h1>
              <div className="flex flex-col items-center gap-4">
                <p className=""> Export as read-only link.</p>
                <Button onClick={copyLinkHandler}>
                  {" "}
                  <CopyLink className="size-4" /> Export to Link
                </Button>
              </div>
            </div>
            <button
              className="absolute right-0 top-0 m-2 text-xl"
              onClick={() => dispatch(setModal(false))}
            >
              <Close className="size-4 fill-white" />
            </button>
          </dialog>
        )}
        {!readOnly && (
          <Button onClick={handleSave}>
            <Cloud className="size-4" />
            SAVE
          </Button>
        )}
      </div>
    </div>
  );
};

export default ShardNavbar;
