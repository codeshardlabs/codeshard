import React, { useState } from "react";

const Stop = ({ className }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <svg
      className={className}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      viewBox="-0.5 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M17 3.42004H7C4.79086 3.42004 3 5.2109 3 7.42004V17.42C3 19.6292 4.79086 21.42 7 21.42H17C19.2091 21.42 21 19.6292 21 17.42V7.42004C21 5.2109 19.2091 3.42004 17 3.42004Z"
          stroke="white"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </g>
    </svg>
  );
};

export default Stop;
