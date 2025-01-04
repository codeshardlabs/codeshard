import React from "react";

const File = ({ className, onClick }) => {
  return (
    <>
      <svg
        onClick={onClick}
        className={className}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <title>New File</title>
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M9 15h6" />
        <path d="M12 18v-6" />
      </svg>
    </>
  );
};

export default File;
