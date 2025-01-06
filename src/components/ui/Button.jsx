"use client";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const Button = ({ children, className, onClick, type = "primary" }) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      className={twMerge(
        clsx(
          "text-sm px-2 py-2 rounded-md   flex items-center justify-center gap-2",
          type === "primary" &&
            "bg-white text-black hover:bg-slate-300 border border-transparent",
          type === "outline" &&
            "border text-white hover:text-[#47cf73] hover:border-[#47cf73]",
          className,
        ),
      )}
    >
      {children}
    </button>
  );
};

export default Button;
