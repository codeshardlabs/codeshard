import cn from "@/src/utils";
import React from "react";

const Heart = ({ className }) => {
  return (
    <svg
      className={className}
      width="64px"
      height="64px"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path d="M19.3 5.71C18.841 5.246 18.2943 4.878 17.6917 4.627C17.0891 4.376 16.4426 4.248 15.79 4.25C15.1373 4.248 14.4909 4.376 13.8883 4.627C13.2857 4.878 12.739 5.246 12.28 5.71L12 6l-0.28 -0.28C10.7917 4.79182 9.53273 4.27037 8.22 4.27037C6.90726 4.27037 5.64829 4.79182 4.72 5.72C3.80386 6.65466 3.29071 7.91125 3.29071 9.22C3.29071 10.5288 3.80386 11.7854 4.72 12.72L11.49 19.51C11.6306 19.6505 11.8212 19.7294 12.02 19.7294C12.2187 19.7294 12.4094 19.6505 12.55 19.51L19.32 12.72C20.2365 11.7823 20.7479 10.5221 20.7442 9.21092C20.7405 7.89973 20.2218 6.64248 19.3 5.71Z"></path>
      </g>
    </svg>
  );
};

export default Heart;
