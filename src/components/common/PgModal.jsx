import { useModal } from "@/src/hooks/useModal";
import { templates } from "@/src/lib/utils";
import { useRef, useState } from "react";


let PgModal = (isPgModalOpen) => {
      const pgModalRef = useRef();
       const [pgModalOpen, setPgModalOpen] = useState(isPgModalOpen);
      useModal(pgModalOpen, setPgModalOpen, pgModalRef);
    
    
    return (
    <>
      <dialog
        onClose={() => setPgModalOpen(false)}
        className={clsx(
          "flex flex-col gap-5 w-[90%] h-[75vh absolute left-3 top-12 z-40 p-4 py-8   bg-[#090C08]",
          styles.container,
        )}
        ref={pgModalRef}
      >
        <button
          onClick={() => setPgModalOpen(false)}
          className="self-end border border-transparent p-1 hover:opacity-60 hover:border-white hover:rounded-md"
        >
          <Close className="fill-black size-4" />
        </button>
        <div className="grid grid-cols-5 gap-16">
          {templates.map((template) => {
            return (
              <Link
                className="text-white border text-xl p-2 cursor-pointer hover:opacity-65"
                href={(function () {
                  const roomRoute = `/room/new-room?template=${template}`;
                  const shardRoute = `/shard/template/${template}`;
                  const tryEditorRoute = `/try-editor/${template}`;
                  const routeToPushTo = userId
                    ? roomOpen
                      ? roomRoute
                      : shardRoute
                    : tryEditorRoute;
                  // router.push(routeToPushTo);
                  return routeToPushTo;
                })()}
                key={template}
              >
                {template}
              </Link>
            );
          })}
        </div>
      </dialog>
    </>
  );}

  export default PgModal;