// import React from 'react';
// import { MdClose } from 'react-icons/md';
// import { Link } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';

// type MenuProps = {
//   menuOpen: boolean;
//   setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
// };

// const navLinks = [
//   { route: '/', title: 'Home' },
//   { route: '/about', title: 'About' },
//   { route: '/draws', title: 'Draws' },
//   { route: '/profile', title: 'Profile' },
//   { route: '/dashboard', title: 'Dashboard' },
// ];

// const primaryEasing = [0.83, 0, 0.17, 1];

// function Menu({ menuOpen, setMenuOpen }: MenuProps) {
//   return (
//     <AnimatePresence>
//       {menuOpen && (
//         <motion.section
//           initial={{ scaleY: 0, borderRadius: '0%' }}
//           animate={{
//             scaleY: 1,
//             borderRadius: '0%',
//             transition: { duration: 0.2, ease: primaryEasing },
//           }}
//           exit={{
//             scaleY: 0,
//             borderRadius: '0%',
//             transition: { delay: 0.3 },
//           }}
//           className='fixed top-0 left-0 w-full h-screen bg-neutral-900 text-white flex flex-col items-center justify-center z-50'
//         >
//           {/* Close Button */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.5 } }}
//             exit={{ opacity: 0 }}
//             className='absolute top-6 right-8 cursor-pointer'
//             onClick={() => setMenuOpen(false)}
//           >
//             <MdClose className='text-4xl transition hover:opacity-70' />
//           </motion.div>

//           {/* Navigation Links */}
//           <nav className='-mt-20'>
//             <ul className='space-y-10 text-center'>
//               {navLinks.map((link, i) => (
//                 <motion.li
//                   key={link.title}
//                   initial={{ y: '100%', opacity: 0 }}
//                   animate={{
//                     y: 0,
//                     opacity: 1,
//                     transition: { duration: 0.7, delay: 0.3 + i * 0.1 },
//                   }}
//                   exit={{ y: '100%', opacity: 0 }}
//                 >
//                   <Link
//                     to={link.route}
//                     className='text-5xl md:text-6xl font- uppercase tracking-tight transition hover:text-gray-300'
//                     onClick={() => setMenuOpen(false)}
//                   >
//                     {link.title}
//                   </Link>
//                 </motion.li>
//               ))}
//             </ul>
//           </nav>
//         </motion.section>
//       )}
//     </AnimatePresence>
//   );
// }

// export default Menu;
import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid'; // Import the XMarkIcon
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

type MenuProps = {
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const navLinks = [
  { route: '/', title: 'Home' },
  { route: '/about', title: 'About' },
  { route: '/draws', title: 'Draws' },
  { route: '/profile', title: 'Profile' },
  { route: '/dashboard', title: 'Dashboard' },
];

const primaryEasing = [0.83, 0, 0.17, 1];

function Menu({ menuOpen, setMenuOpen }: MenuProps) {
  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.section
          initial={{ scaleY: 0, borderRadius: '0%' }}
          animate={{
            scaleY: 1,
            borderRadius: '0%',
            transition: { duration: 0.2, ease: primaryEasing },
          }}
          exit={{
            scaleY: 0,
            borderRadius: '0%',
            transition: { delay: 0.3 },
          }}
          className='fixed top-0 left-0 w-full h-screen bg-neutral-900 text-white flex flex-col items-center justify-center z-50'
        >
          {/* Close Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.5 } }}
            exit={{ opacity: 0 }}
            className='absolute top-6 right-8 cursor-pointer'
            onClick={() => setMenuOpen(false)}
          >
            <XMarkIcon className='w-10 h-10 transition hover:opacity-70' /> {/* Use XMarkIcon */}
          </motion.div>

          {/* Navigation Links */}
          <nav className='-mt-20'>
            <ul className='space-y-10 text-center'>
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.title}
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    transition: { duration: 0.7, delay: 0.3 + i * 0.1 },
                  }}
                  exit={{ y: '100%', opacity: 0 }}
                >
                  <Link
                    to={link.route}
                    className='text-5xl md:text-6xl font- uppercase tracking-tight transition hover:text-gray-300'
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.title}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

export default Menu;