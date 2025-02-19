import React from "react";
import { Link, LinkProps } from "react-router-dom";

interface ButtonProps extends Omit<LinkProps, "to" | "className"> {
  children: React.ReactNode;
  className?: string;
  to?: string;
}

const Button: React.FC<ButtonProps> = ({ children, to = "", className, ...props }) => {
  return (
    <Link
      to={to}
      className={`
        flex w-fit justify-between items-center
        border-2 border-transparent rounded-xl
        px-4 py-1 transition-all duration-300 ease-in-out
        bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700
        cursor-pointer
        shadow-md hover:shadow-lg
        text-lg font-medium text-white
        relative overflow-hidden
        hover:bg-none hover:bg-transparent hover:text-blue-500 hover:border-blue-500
        active:scale-95 active:shadow-sm
        ${className || ""}
      `}
      {...props} 
    >
      {children}
    </Link>
  );
};

export default Button;