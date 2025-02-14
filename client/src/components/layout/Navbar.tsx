// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import DarkLightSwitch from "./ThemeToggle";
// import Menu from "./Menu";
// import { useAuth } from "../../context/AuthContext";

// export default function Navbar() {
//   const { user, logout } = useAuth();
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const navVariants = {
//     initial: { y: "-100%", opacity: 0 },
//     animate: {
//       y: 0,
//       opacity: 1,
//       transition: { duration: 0.5, ease: [0.64, 0, 0.78, 0] },
//     },
//   };

//   const handleAvatarClick = () => {
//     setDropdownOpen((prev) => !prev);
//   };

//   return (
//     <motion.nav
//       variants={navVariants}
//       initial="initial"
//       animate="animate"
//       className="bg-indigo-600"
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <div className="flex items-center">
//             <Link to="/" className="text-white font-bold text-xl">
//               Tombola Draws
//             </Link>
//           </div>

//           {/* Right Side: Links, Avatar, Dark Mode Toggle, and Menu Button */}
//           <div className="flex items-center space-x-4">
//             {/* Draws Link */}
//             <Link
//               to="/draws"
//               className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md"
//             >
//               Draws
//             </Link>

//             {/* Avatar Dropdown */}
//             {user ? (
//               <div className="relative">
//                 {/* Avatar Button */}
//                 <button
//                   onClick={handleAvatarClick}
//                   className="flex items-center gap-2 p-2 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition"
//                 >
//                   <img
//                     src={user.avatar || "/tree.png"} // Use user's avatar or default
//                     alt="User Avatar"
//                     className="w-6 h-6 rounded-full"
//                   />
//                 </button>

//                 {/* Dropdown Menu */}
//                 {dropdownOpen && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-900 rounded-md shadow-lg">
//                     <div className="p-2">
//                       <p className="text-sm font-bold text-neutral-900 dark:text-gray-200">
//                         {user.name} {/* Use user's name */}
//                       </p>
//                       <Link
//                         to="/profile"
//                         className="block text-sm text-blue-500 hover:underline p-2"
//                       >
//                         View Profile
//                       </Link>
//                       {/* Admin Link (Conditional) */}
//                       {user?.role === "admin" && (
//                         <Link
//                           to="/admin"
//                           className="block text-sm text-blue-500 hover:underline p-2"
//                         >
//                           Admin Dashboard
//                         </Link>
//                       )}
//                       <button
//                         onClick={logout}
//                         className="w-full text-sm text-white bg-red-500 hover:bg-red-600 p-2 rounded-md"
//                       >
//                         Logout
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <Link
//                 to="/login"
//                 className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md"
//               >
//                 Login
//               </Link>
//             )}

//             {/* Dark Mode Toggle */}
//             <DarkLightSwitch />

//             {/* Menu Button */}
//             <button
//               onClick={() => setMenuOpen(true)}
//               className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md"
//             >
//               Menu
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Menu Component */}
//       <Menu setMenuOpen={setMenuOpen} menuOpen={menuOpen} />
//     </motion.nav>
//   );
// }



import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DarkLightSwitch from "./ThemeToggle";
import Menu from "./Menu";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown

  const navVariants = {
    initial: { y: "-100%", opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.64, 0, 0.78, 0] },
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
      initial="initial"
      animate="animate"
      className="bg-indigo-600"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-white font-bold text-xl">
              Tombola Draws
            </Link>
          </div>

          {/* Right Side: Links, Avatar, Dark Mode Toggle, and Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Draws Link */}
            <Link
              to="/draws"
              className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md"
            >
              Draws
            </Link>

            {/* Avatar Dropdown */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                {/* Avatar Button */}
                <button
                  onClick={handleAvatarClick}
                  className="flex items-center gap-2 p-2 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                >
                  <img
                    src={user.avatar || "/tree.png"} // Use user's avatar or default
                    alt="User Avatar"
                    className="w-6 h-6 rounded-full"
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-900 rounded-md shadow-lg">
                    <div className="p-2">
                      <p className="text-sm font-bold text-neutral-900 dark:text-gray-200">
                        {user.name} {/* Use user's name */}
                      </p>
                      <Link
                        to="/profile"
                        className="block text-sm text-blue-500 hover:underline p-2"
                      >
                        View Profile
                      </Link>
                      {/* Admin Link (Conditional) */}
                      {user?.role === "admin" && (
                        <Link
                          to="/admin"
                          className="block text-sm text-blue-500 hover:underline p-2"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="w-full text-sm text-white bg-red-500 hover:bg-red-600 p-2 rounded-md"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md"
              >
                Login
              </Link>
            )}

            {/* Dark Mode Toggle */}
            <DarkLightSwitch />

            {/* Menu Button */}
            <button
              onClick={() => setMenuOpen(true)}
              className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md"
            >
              Menu
            </button>
          </div>
        </div>
      </div>

      {/* Menu Component */}
      <Menu setMenuOpen={setMenuOpen} menuOpen={menuOpen} />
    </motion.nav>
  );
}