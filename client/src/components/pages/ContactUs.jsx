import { useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({
      type: "success",
      message: "Message sent successfully! We'll get back to you soon.",
    });
    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have questions about our draws? We&apos;re here to help and would
            love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-8 flex flex-col justify-start space-y-8 h-full">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-8">
                Contact Information
              </h2>
              <div className="space-y-6 mt-0">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FaEnvelope className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      Email
                    </p>
                    <p className="text-base text-gray-600 dark:text-gray-300">
                      support@tombola.com
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FaPhone className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      Phone
                    </p>
                    <p className="text-base text-gray-600 dark:text-gray-300">
                      +1 (555) 123-4567
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FaMapMarkerAlt className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      Address
                    </p>
                    <p className="text-base text-gray-600 dark:text-gray-300">
                      123 Tombola Street
                      <br />
                      Silicon Valley, CA 94025
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-8">
                Send us a Message
              </h2>
              {status.message && (
                <div
                  className={`mb-6 p-4 rounded-lg ${
                    status.type === "success"
                      ? "bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-100"
                      : "bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-100"
                  }`}
                >
                  {status.message}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="appearance-none dark:text-neutral-100 relative text-neutral-800 block w-full px-3 py-2 dark:bg-neutral-700 placeholder-neutral-500 rounded-md outline-none focus:ring transition-all duration-300 focus:!ring-blue-500 focus:z-10 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="appearance-none dark:text-neutral-100 relative text-neutral-800 block w-full px-3 py-2 dark:bg-neutral-700 placeholder-neutral-500 rounded-md outline-none focus:ring transition-all duration-300 focus:!ring-blue-500 focus:z-10 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="appearance-none dark:text-neutral-100 relative text-neutral-800 block w-full px-3 py-2 dark:bg-neutral-700 placeholder-neutral-500 rounded-md outline-none focus:ring transition-all duration-300 focus:!ring-blue-500 focus:z-10 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="appearance-none dark:text-neutral-100 relative text-neutral-800 block w-full px-3 py-2 dark:bg-neutral-700 placeholder-neutral-500 rounded-md outline-none focus:ring transition-all duration-300 focus:!ring-blue-500 focus:z-10 sm:text-sm"
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
