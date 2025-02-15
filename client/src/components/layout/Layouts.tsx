import React, { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutsProps {
  children: ReactNode;
}

const Layouts: React.FC<LayoutsProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-neutral-100 dark:bg-neutral-900 text-neutral-950 dark:text-neutral-200 overflow-x-hidden">
      <header className="sticky top-0 z-40 w-full bg-neutral-100/75 dark:bg-neutral-900/75 backdrop-blur-md">
        <Navbar />
      </header>
      <main className="min-h-[calc(100dvh-4rem)] w-full relative">
        {children}
      </main>
    </div>
  );
};

export default Layouts;
