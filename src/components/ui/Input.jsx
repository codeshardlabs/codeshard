import React from "react";

const Input = (props) => {
  return (
    <>
      <input
        className="outline-none  caret-white text-white bg-[#252830] p-2 rounded-md"
        {...props}
      />
    </>
  );
};

export default Input;
