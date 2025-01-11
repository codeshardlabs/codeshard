import React from "react";

const HorizontalThreeDots = ({ className, onClick }) => {
  return (
    <svg
      className={className}
      onClick={onClick}
      fill="#000000"
      height="200px"
      width="200px"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <path
          className="cls-1"
          d="M8,6.5A1.5,1.5,0,1,1,6.5,8,1.5,1.5,0,0,1,8,6.5ZM.5,8A1.5,1.5,0,1,0,2,6.5,1.5,1.5,0,0,0,.5,8Zm12,0A1.5,1.5,0,1,0,14,6.5,1.5,1.5,0,0,0,12.5,8Z"
        ></path>{" "}
      </g>
    </svg>
  );
};

export default HorizontalThreeDots;
