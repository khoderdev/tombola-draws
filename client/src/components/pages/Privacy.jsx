// import { useState } from 'react';
// import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

// export default function ContactUs() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     subject: '',
//     message: '',
//   });
//   const [status, setStatus] = useState({ type: '', message: '' });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setStatus({ type: 'success', message: 'Message sent successfully! We\'ll get back to you soon.' });
//     // Reset form
//     setFormData({ name: '', email: '', subject: '', message: '' });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="text-center mb-16">
//           <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
//             Get in Touch
//           </h1>
//           <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
//             Have questions about our draws? We're here to help and would love to hear from you.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Contact Information */}
//           <div className="lg:col-span-1">
//             <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-8">
//               <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-8">
//                 Contact Information
//               </h2>
//               <div className="space-y-6">
//                 <div className="flex items-start">
//                   <div className="flex-shrink-0">
//                     <FaEnvelope className="h-6 w-6 text-blue-500" />
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-base font-medium text-gray-900 dark:text-white">
//                       Email
//                     </p>
//                     <p className="text-base text-gray-600 dark:text-gray-300">
//                       support@tombola.com
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-start">
//                   <div className="flex-shrink-0">
//                     <FaPhone className="h-6 w-6 text-blue-500" />
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-base font-medium text-gray-900 dark:text-white">
//                       Phone
//                     </p>
//                     <p className="text-base text-gray-600 dark:text-gray-300">
//                       +1 (555) 123-4567
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-start">
//                   <div className="flex-shrink-0">
//                     <FaMapMarkerAlt className="h-6 w-6 text-blue-500" />
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-base font-medium text-gray-900 dark:text-white">
//                       Address
//                     </p>
//                     <p className="text-base text-gray-600 dark:text-gray-300">
//                       123 Tombola Street<br />
//                       Silicon Valley, CA 94025
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Contact Form */}
//           <div className="lg:col-span-2">
//             <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-8">
//               <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-8">
//                 Send us a Message
//               </h2>
//               {status.message && (
//                 <div className={`mb-6 p-4 rounded-lg ${
//                   status.type === 'success' ? 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-100'
//                 }`}>
//                   {status.message}
//                 </div>
//               )}
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//                   <div>
//                     <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                       Name
//                     </label>
//                     <input
//                       type="text"
//                       name="name"
//                       id="name"
//                       value={formData.name}
//                       onChange={handleChange}
//                       required
//                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white sm:text-sm"
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                       Email
//                     </label>
//                     <input
//                       type="email"
//                       name="email"
//                       id="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       required
//                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white sm:text-sm"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                     Subject
//                   </label>
//                   <input
//                     type="text"
//                     name="subject"
//                     id="subject"
//                     value={formData.subject}
//                     onChange={handleChange}
//                     required
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white sm:text-sm"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                     Message
//                   </label>
//                   <textarea
//                     name="message"
//                     id="message"
//                     rows="4"
//                     value={formData.message}
//                     onChange={handleChange}
//                     required
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white sm:text-sm"
//                   ></textarea>
//                 </div>
//                 <div>
//                   <button
//                     type="submit"
//                     className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
//                   >
//                     Send Message
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Privacy Policy
          </h1>

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Last updated: February 19, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Welcome to Tombola. We respect your privacy and are committed to
                protecting your personal data. This privacy policy will inform
                you about how we look after your personal data when you visit
                our website and tell you about your privacy rights and how the
                law protects you.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">
                2. Data We Collect
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We may collect, use, store and transfer different kinds of
                personal data about you which we have grouped together as
                follows:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
                <li>Identity Data: name, username, or similar identifier</li>
                <li>Contact Data: email address and telephone numbers</li>
                <li>
                  Technical Data: internet protocol (IP) address, browser type
                  and version, time zone setting and location
                </li>
                <li>
                  Transaction Data: details about payments and other draws you
                  have participated in
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">
                3. How We Use Your Data
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We will only use your personal data when the law allows us to.
                Most commonly, we will use your personal data in the following
                circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
                <li>To register you as a new customer</li>
                <li>To process and deliver your draw entries</li>
                <li>To manage our relationship with you</li>
                <li>
                  To improve our website, products/services, marketing, and
                  customer relationships
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">
                4. Data Security
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                We have put in place appropriate security measures to prevent
                your personal data from being accidentally lost, used, or
                accessed in an unauthorized way, altered, or disclosed. We limit
                access to your personal data to those employees, agents,
                contractors, and other third parties who have a business need to
                know.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">
                5. Your Legal Rights
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Under certain circumstances, you have rights under data
                protection laws in relation to your personal data, including the
                right to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
                <li>Request access to your personal data</li>
                <li>Request correction of your personal data</li>
                <li>Request erasure of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing your personal data</li>
                <li>Request transfer of your personal data</li>
                <li>Right to withdraw consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">
                6. Contact Us
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                If you have any questions about this privacy policy or our
                privacy practices, please contact us at:
              </p>
              <div className="mt-4 text-gray-600 dark:text-gray-300">
                <p>Email: privacy@tombola.com</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Address: 123 Tombola Street, Silicon Valley, CA 94025</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}