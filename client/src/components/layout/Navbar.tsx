import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import DarkLightSwitch from "./ThemeToggle";
import Menu from "./Menu";
import { useAuth, User } from "../../context/AuthContext";
import Button from "../Button";

export default function Navbar() {
  const { user, logout } = useAuth() as unknown as {
    user: User | null;
    logout: () => void;
  };
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const SCROLL_THRESHOLD = 50;
  const THROTTLE_TIME = 100; // ms

  useMotionValueEvent(scrollY, "change", (latest) => {
    const now = Date.now();
    if (now - lastScrollTime.current < THROTTLE_TIME) return;

    const scrollDifference = latest - lastScrollY.current;
    const isScrollingDown = scrollDifference > 0;
    const isScrollingUp = scrollDifference < 0;
    const isSignificantScroll = Math.abs(scrollDifference) > 10;

    setIsAtTop(latest < 10);

    if (isSignificantScroll) {
      if (isScrollingDown && !hidden && latest > SCROLL_THRESHOLD) {
        setHidden(true);
      } else if (isScrollingUp && hidden) {
        setHidden(false);
      }
    }

    lastScrollTime.current = now;
    lastScrollY.current = latest;
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  const navVariants = {
    visible: {
      y: 0,
      opacity: 1,
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
        opacity: { duration: 0.2 },
      },
    },
    hidden: {
      y: "-100%",
      opacity: 0,
      boxShadow: "none",
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
        opacity: { duration: 0.2 },
      },
    },
  };

  const handleAvatarClick = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <motion.nav
      variants={navVariants}
      animate={hidden ? "hidden" : "visible"}
      initial="visible"
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-200 ${isAtTop
          ? "bg-transparent"
          : "bg-neutral-100/85 dark:bg-neutral-900/85 backdrop-blur-md"
        }`}
    >
      <div className=" px-4 sm:px-6 lg:px-8 shadow dark:shadow-neutral-800 sticky top-0 z-40 w-full">
        <div className="flex max-w-7xl items-center justify-between h-16 mx-auto">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="font-extrabold text-4xl">
              Tombola
            </Link>
          </div>

          {/* Right Side: Links, Avatar, Dark Mode Toggle, and Menu Button */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Draws Link */}
            <Link className="btn !hidden sm:!block" to="/draws">Draws</Link>
            {/* Avatar Dropdown */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                {/* Avatar Button */}
                <button
                  onClick={handleAvatarClick}
                  className="flex items-center gap-2  rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-neutral-500"
                >
                  <img
                    src={
                      user.avatar ||
                      "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                    }
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                </button>

                {/* Dropdown Menu with Transition */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="absolute -right-20 mt-2 w-48 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-900 rounded-md shadow-lg"
                    >
                      <div className="p-2">
                        <p className="text-sm font-bold text-neutral-900 dark:text-gray-200">
                          {user && "name" in user ? user.name : "Guest"}{" "}
                          {/* Use user's name */}
                        </p>
                        <Link
                          to="/profile"
                          className="block text-sm text-blue-500 hover:underline p-2"
                        >
                          View Profile
                        </Link>
                        {/* Admin Link (Conditional) */}
                        {user && "role" in user && user.role === "admin" && (
                          <Link
                            to="/admin"
                            className="block text-sm text-blue-500 hover:underline p-2"
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={logout}
                          className="w-full text-sm bg-red-500 hover:bg-red-600 p-2 rounded-md"
                        >
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="hover:bg-red-700 px-3 py-2 rounded-md"
              >
                Login
              </Link>
            )}

            {/* Dark Mode Toggle */}
            <DarkLightSwitch />

            {/* Animated Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative w-10 h-10 flex items-center justify-center rounded-md focus:outline-none"
              aria-label="Toggle Menu"
            >
              <motion.div
                className="w-6 h-6 flex flex-col justify-center items-center"
                animate={menuOpen ? "open" : "closed"}
              >
                <motion.span
                  className="w-6 h-0.5 bg-current block absolute mb-1"
                  variants={{
                    closed: { rotate: 0, y: -4 },
                    open: { rotate: 45, y: 0 },
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="w-6 h-0.5 bg-current block absolute mb-0.5"
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 },
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="w-6 h-0.5 bg-current block absolute"
                  variants={{
                    closed: { rotate: 0, y: 4 },
                    open: { rotate: -45, y: 0 },
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Component */}
      <Menu setMenuOpen={setMenuOpen} menuOpen={menuOpen} />
    </motion.nav>
  );
}
