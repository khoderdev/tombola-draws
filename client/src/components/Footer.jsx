import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
              About
            </h3>
            <p className="mt-4 text-base text-neutral-600 dark:text-neutral-400">
              Tombola Draws is a digital platform for secure and transparent
              prize draws.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  to="/terms"
                  className="text-base text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-base text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-base text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
              Contact
            </h3>
            <ul className="mt-4 space-y-4">
              <li className="text-base text-neutral-600 dark:text-neutral-400">
                <a
                  href="mailto:support@tomboladraws.com"
                  className="hover:text-neutral-900 dark:hover:text-white"
                >
                  support@tomboladraws.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-neutral-200 dark:border-neutral-800 pt-8">
          <p className="text-base text-neutral-500 dark:text-neutral-400">
            &copy; {new Date().getFullYear()} Tombola Draws. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
