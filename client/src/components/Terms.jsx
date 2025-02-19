import React from "react";
import { motion } from "framer-motion";

export default function Terms() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <motion.div
        className="max-w-4xl mx-auto px-4 py-12 sm:py-16 lg:py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-8 text-center"
          {...fadeIn}
        >
          Terms and Conditions
        </motion.h1>

        <div className="space-y-12 text-neutral-700 dark:text-neutral-300">
          <motion.section
            className="bg-white dark:bg-neutral-800 rounded-2xl p-6 sm:p-8 shadow-sm"
            {...fadeIn}
          >
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-6 flex items-center">
              <span className="text-blue-500 dark:text-blue-400 mr-3">1.</span>
              Introduction
            </h2>
            <p className="text-lg leading-relaxed">
              Welcome to Tombola Draws. These terms and conditions govern your
              use of our platform and the participation in our digital draws. By
              using our service, you agree to these terms in full.
            </p>
          </motion.section>

          <motion.section
            className="bg-white dark:bg-neutral-800 rounded-2xl p-6 sm:p-8 shadow-sm"
            {...fadeIn}
          >
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-6 flex items-center">
              <span className="text-blue-500 dark:text-blue-400 mr-3">2.</span>
              Eligibility
            </h2>
            <ul className="space-y-4">
              {[
                "You must be at least 18 years old to participate in draws.",
                "You must have a valid account to purchase tickets.",
                "You must provide accurate and complete information when registering.",
                "Participation may be restricted in certain jurisdictions.",
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3 mt-0.5">
                    <svg
                      className="h-4 w-4 text-blue-500 dark:text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <span className="text-lg leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.section
            className="bg-white dark:bg-neutral-800 rounded-2xl p-6 sm:p-8 shadow-sm"
            {...fadeIn}
          >
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-6 flex items-center">
              <span className="text-blue-500 dark:text-blue-400 mr-3">3.</span>
              Draw Rules
            </h2>
            <ul className="space-y-4">
              {[
                "All draws are conducted digitally using our secure random selection system.",
                "Each ticket has an equal chance of winning.",
                "Draw times and dates are final once announced.",
                "Winners will be notified via email and announced on the platform.",
                "Unclaimed prizes will be forfeited after 30 days.",
              ].map((item, index) => (
                <li key={index} className="flex items-start group">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3 mt-0.5 transition-colors group-hover:bg-blue-200 dark:group-hover:bg-blue-800">
                    <svg
                      className="h-4 w-4 text-blue-500 dark:text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <span className="text-lg leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.section
            className="bg-white dark:bg-neutral-800 rounded-2xl p-6 sm:p-8 shadow-sm"
            {...fadeIn}
          >
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-6 flex items-center">
              <span className="text-blue-500 dark:text-blue-400 mr-3">4.</span>
              Tickets and Payments
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  title: "Clear Pricing",
                  description:
                    "Ticket prices are clearly displayed before purchase.",
                },
                {
                  title: "Final Sales",
                  description:
                    "All sales are final - no refunds unless required by law.",
                },
                {
                  title: "Non-transferable",
                  description:
                    "Tickets are non-transferable and non-resellable.",
                },
                {
                  title: "Secure Payments",
                  description:
                    "Payment processing is handled securely through our platform.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-neutral-50 dark:bg-neutral-700 rounded-xl p-6  border border-neutral-200 dark:border-neutral-700"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center mb-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-3">
                      <svg
                        className="w-5 h-5 text-blue-500 dark:text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={
                            index === 0
                              ? "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2"
                              : index === 1
                              ? "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16"
                              : index === 2
                              ? "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                              : "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          }
                        />
                      </svg>
                    </span>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-300 ml-11">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            className="bg-white dark:bg-neutral-800 rounded-2xl p-6 sm:p-8 shadow-sm"
            {...fadeIn}
          >
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-6 flex items-center">
              <span className="text-blue-500 dark:text-blue-400 mr-3">5.</span>
              Prize Collection
            </h2>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6">
              <p className="text-blue-800 dark:text-blue-200 font-medium">
                Important: All prizes must be claimed within 30 days of the draw
                date.
              </p>
            </div>
            <ul className="space-y-4">
              {[
                "Winners must claim prizes within 30 days of the draw.",
                "Valid identification may be required to claim prizes.",
                "Digital prizes will be delivered electronically.",
                "Physical prizes will be shipped to the winner's registered address.",
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3 mt-0.5">
                    <svg
                      className="h-4 w-4 text-blue-500 dark:text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  <span className="text-lg leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.section
            className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg"
            {...fadeIn}
          >
            <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
            <p className="text-lg mb-6">
              For questions about these terms or our platform, please contact
              our support team.
            </p>
            <a
              href="mailto:support@tomboladraws.com"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              support@tomboladraws.com
            </a>
          </motion.section>

          <motion.section className="text-center pt-8" {...fadeIn}>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Last updated: February 18, 2025
            </p>
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
}
