import React from "react";
import Settings from "./ui/icons/Settings";
import ArrowDown from "./ui/icons/ArrowDown";

const Card = ({ lang, content }) => {
  return (
    <div className="bg-[#1D1E22] p-4 rounded-lg text-sm flex-col flex gap-2  h-[50%]">
      {/* code top */}
      <div className="flex items-center justify-between h-[]">
        <div className="flex items-center gap-2">
          <span>
            <Settings className="fill-[#474A54] size-4" />
          </span>
          <h3>{lang}</h3>
        </div>
        <span>
          <ArrowDown className="fill-[#474A54] size-4" />
        </span>
      </div>
      {/* code content */}
      <div>
        <p className="text-xs font-thin font-mono">{content}</p>
      </div>
    </div>
  );
};

export default Card;
