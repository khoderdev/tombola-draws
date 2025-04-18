import React, { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from '../Footer';

interface LayoutsProps {
  children: ReactNode;
}

const Layouts: React.FC<LayoutsProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-neutral-100 dark:bg-neutral-900 text-neutral-950 dark:text-neutral-200 overflow-x-hidden">
      <Navbar />
      <main className="min-h-[calc(100dvh-4rem)] w-full relative pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layouts;
