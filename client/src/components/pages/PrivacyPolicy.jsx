// export default function PrivacyPolicy() {
//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-8">
//           <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
//             Privacy Policy
//           </h1>

//           <div className="prose dark:prose-invert max-w-none">
//             <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
//               Last updated: February 19, 2025
//             </p>

//             <section className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
//                 1. Introduction
//               </h2>
//               <p className="text-gray-600 dark:text-gray-300">
//                 Welcome to Tombola. We respect your privacy and are committed to
//                 protecting your personal data. This privacy policy will inform
//                 you about how we look after your personal data when you visit
//                 our website and tell you about your privacy rights and how the
//                 law protects you.
//               </p>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
//                 2. Data We Collect
//               </h2>
//               <p className="text-gray-600 dark:text-gray-300 mb-4">
//                 We may collect, use, store and transfer different kinds of
//                 personal data about you which we have grouped together as
//                 follows:
//               </p>
//               <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
//                 <li>Identity Data: name, username, or similar identifier</li>
//                 <li>Contact Data: email address and telephone numbers</li>
//                 <li>
//                   Technical Data: internet protocol (IP) address, browser type
//                   and version, time zone setting and location
//                 </li>
//                 <li>
//                   Transaction Data: details about payments and other draws you
//                   have participated in
//                 </li>
//               </ul>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
//                 3. How We Use Your Data
//               </h2>
//               <p className="text-gray-600 dark:text-gray-300 mb-4">
//                 We will only use your personal data when the law allows us to.
//                 Most commonly, we will use your personal data in the following
//                 circumstances:
//               </p>
//               <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
//                 <li>To register you as a new customer</li>
//                 <li>To process and deliver your draw entries</li>
//                 <li>To manage our relationship with you</li>
//                 <li>
//                   To improve our website, products/services, marketing, and
//                   customer relationships
//                 </li>
//               </ul>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
//                 4. Data Security
//               </h2>
//               <p className="text-gray-600 dark:text-gray-300">
//                 We have put in place appropriate security measures to prevent
//                 your personal data from being accidentally lost, used, or
//                 accessed in an unauthorized way, altered, or disclosed. We limit
//                 access to your personal data to those employees, agents,
//                 contractors, and other third parties who have a business need to
//                 know.
//               </p>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
//                 5. Your Legal Rights
//               </h2>
//               <p className="text-gray-600 dark:text-gray-300 mb-4">
//                 Under certain circumstances, you have rights under data
//                 protection laws in relation to your personal data, including the
//                 right to:
//               </p>
//               <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
//                 <li>Request access to your personal data</li>
//                 <li>Request correction of your personal data</li>
//                 <li>Request erasure of your personal data</li>
//                 <li>Object to processing of your personal data</li>
//                 <li>Request restriction of processing your personal data</li>
//                 <li>Request transfer of your personal data</li>
//                 <li>Right to withdraw consent</li>
//               </ul>
//             </section>

//             <section className="mb-8">
//               <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
//                 6. Contact Us
//               </h2>
//               <p className="text-gray-600 dark:text-gray-300">
//                 If you have any questions about this privacy policy or our
//                 privacy practices, please contact us at:
//               </p>
//               <div className="mt-4 text-gray-600 dark:text-gray-300">
//                 <p>Email: privacy@tombola.com</p>
//                 <p>Phone: +1 (555) 123-4567</p>
//                 <p>Address: 123 Tombola Street, Silicon Valley, CA 94025</p>
//               </div>
//             </section>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React from 'react';

const PrivacyPolicy = () => {
	return (
		<div className='bg-neutral-50 dark:bg-neutral-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-4xl mx-auto bg-white dark:bg-neutral-800 shadow-lg rounded-lg p-6 sm:p-8'>
				{/* Header */}
				<h1 className='text-3xl sm:text-4xl font-bold text-center text-neutral-900 dark:text-white mb-8'>
					Privacy Policy
				</h1>

				{/* Introduction */}
				<section className='mb-8'>
					<h2 className='text-2xl font-semibold text-neutral-900 dark:text-white mb-4'>
						Introduction
					</h2>
					<p className='text-neutral-600 dark:text-neutral-300 leading-relaxed'>
						Welcome to our Privacy Policy page. Your privacy is important to us,
						and we are committed to protecting your personal data. This policy
						explains how we collect, use, and safeguard your information when you
						use our services.
					</p>
				</section>

				{/* Data Collection */}
				<section className='mb-8'>
					<h2 className='text-2xl font-semibold text-neutral-900 dark:text-white mb-4'>
						Data Collection
					</h2>
					<p className='text-neutral-600 dark:text-neutral-300 leading-relaxed'>
						We collect information that you provide directly to us, such as your
						name, email address, and phone number. We may also collect data
						automatically, including your IP address, browser type, and usage
						patterns.
					</p>
				</section>

				{/* Data Usage */}
				<section className='mb-8'>
					<h2 className='text-2xl font-semibold text-neutral-900 dark:text-white mb-4'>
						How We Use Your Data
					</h2>
					<p className='text-neutral-600 dark:text-neutral-300 leading-relaxed'>
						We use your data to:
					</p>
					<ul className='list-disc list-inside text-neutral-600 dark:text-neutral-300 mt-2 space-y-2'>
						<li>Provide and improve our services.</li>
						<li>Communicate with you about updates and offers.</li>
						<li>Analyze usage patterns to enhance user experience.</li>
						<li>Ensure the security of our platform.</li>
					</ul>
				</section>

				{/* Data Sharing */}
				<section className='mb-8'>
					<h2 className='text-2xl font-semibold text-neutral-900 dark:text-white mb-4'>
						Data Sharing
					</h2>
					<p className='text-neutral-600 dark:text-neutral-300 leading-relaxed'>
						We do not sell or share your personal data with third parties except:
					</p>
					<ul className='list-disc list-inside text-neutral-600 dark:text-neutral-300 mt-2 space-y-2'>
						<li>With your explicit consent.</li>
						<li>To comply with legal obligations.</li>
						<li>To protect our rights and property.</li>
					</ul>
				</section>

				{/* User Rights */}
				<section className='mb-8'>
					<h2 className='text-2xl font-semibold text-neutral-900 dark:text-white mb-4'>
						Your Rights
					</h2>
					<p className='text-neutral-600 dark:text-neutral-300 leading-relaxed'>
						You have the right to:
					</p>
					<ul className='list-disc list-inside text-neutral-600 dark:text-neutral-300 mt-2 space-y-2'>
						<li>Access and request a copy of your data.</li>
						<li>Request correction or deletion of your data.</li>
						<li>Object to the processing of your data.</li>
						<li>Withdraw consent at any time.</li>
					</ul>
				</section>

				{/* Security */}
				<section className='mb-8'>
					<h2 className='text-2xl font-semibold text-neutral-900 dark:text-white mb-4'>
						Security
					</h2>
					<p className='text-neutral-600 dark:text-neutral-300 leading-relaxed'>
						We implement industry-standard security measures to protect your
						data from unauthorized access, alteration, or disclosure. However, no
						method of transmission over the internet is 100% secure.
					</p>
				</section>

				{/* Changes to This Policy */}
				<section className='mb-8'>
					<h2 className='text-2xl font-semibold text-neutral-900 dark:text-white mb-4'>
						Changes to This Policy
					</h2>
					<p className='text-neutral-600 dark:text-neutral-300 leading-relaxed'>
						We may update this Privacy Policy from time to time. Any changes will
						be posted on this page, and we will notify you of significant
						updates.
					</p>
				</section>

				{/* Contact Information */}
				<section>
					<h2 className='text-2xl font-semibold text-neutral-900 dark:text-white mb-4'>
						Contact Us
					</h2>
					<p className='text-neutral-600 dark:text-neutral-300 leading-relaxed'>
						If you have any questions about this Privacy Policy, please contact
						us at:
					</p>
					<p className='text-neutral-600 dark:text-neutral-300 mt-2'>
						Email:{' '}
						<a
							href='mailto:privacy@example.com'
							className='text-blue-500 hover:underline'
						>
							privacy@example.com
						</a>
					</p>
				</section>
			</div>
		</div>
	);
};

export default PrivacyPolicy;