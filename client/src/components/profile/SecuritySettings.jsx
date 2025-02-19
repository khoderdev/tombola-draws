import { useState } from "react";
import { profileService } from "../../services/api";

export default function SecuritySettings() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      await profileService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setSuccess("Password changed successfully");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Password Update Section */}
      <div className="grid gap-8">
        <div className="md:col-span-1">
          <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white">
            Password
          </h3>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Update your password to keep your account secure.
          </p>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="overflow-hidden max-w-md">
              <div className="px-6 py-6 bg-white dark:bg-neutral-800 space-y-6">
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    >
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      id="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      required
                      className="mt-2 block w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg shadow-sm focus:ring-2 outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-200 dark:bg-neutral-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      required
                      className="mt-2 block w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg shadow-sm focus:ring-2 outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-200 dark:bg-neutral-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    >
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="mt-2 block w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg shadow-sm focus:ring-2 outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-200 dark:bg-neutral-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* Error and Success Messages */}
                {error && (
                  <div className="text-sm text-red-500 dark:text-red-400">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="text-sm text-green-600 dark:text-green-400">
                    {success}
                  </div>
                )}
              </div>
              <div className="px-6 py-4 text-right">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-8">
          <div className="border-t border-neutral-200 dark:border-neutral-600" />
        </div>
      </div>

      {/* Two-Factor Authentication Section */}
      <div className="md:grid md:grid-cols-3 md:gap-8">
        <div className="md:col-span-1">
          <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white">
            Two-Factor Authentication
          </h3>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Add additional security to your account using two-factor
            authentication.
          </p>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-6 bg-white dark:bg-neutral-800 space-y-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-neutral-300 rounded transition duration-200 dark:bg-neutral-700 dark:border-neutral-600"
                    disabled
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label className="font-medium text-neutral-700 dark:text-neutral-300">
                    Enable two-factor authentication
                  </label>
                  <p className="mt-1 text-neutral-500 dark:text-neutral-400">
                    Coming soon! We&apos;re working on implementing this
                    feature.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
