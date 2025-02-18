import { useState, useEffect } from "react";
import { adminService } from "../../services/api";
import { format } from "date-fns";

export default function AdminDraws() {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDraw, setSelectedDraw] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    prize: "",
    price: "",
    startDate: "",
    endDate: "",
    image: "",
    imageFile: null,
    status: "active",
  });
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    fetchDraws();
  }, []);

  const fetchDraws = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDraws();
      console.log("Fetched draws:", response); // Debug log
      if (response.status === "success" && Array.isArray(response.data)) {
        setDraws(response.data);
      } else {
        setDraws([]);
        setError("Invalid data format received from server");
      }
    } catch (err) {
      console.error("Error fetching draws:", err);
      setError("Failed to load draws");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files[0]) {
      const file = files[0];
      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        image: "", // Clear URL when file is selected
      }));
    } else if (name === "image" && type === "url") {
      setFormData((prev) => ({
        ...prev,
        image: value,
        imageFile: null, // Clear file when URL is entered
      }));
      setImagePreview(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? e.target.checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let imageUrl = formData.image;

      // If there's a file to upload, handle it first
      if (formData.imageFile) {
        const formDataWithFile = new FormData();
        formDataWithFile.append("image", formData.imageFile);
        const uploadResponse = await adminService.uploadImage(formDataWithFile);
        imageUrl = uploadResponse.data.imageUrl;
      }

      const drawData = {
        ...formData,
        image: imageUrl,
      };
      delete drawData.imageFile; // Remove the file object before sending

      if (selectedDraw) {
        await adminService.updateDraw(selectedDraw.id, drawData);
      } else {
        await adminService.createDraw(drawData);
      }

      setIsModalOpen(false);
      setSelectedDraw(null);
      setFormData({
        title: "",
        prize: "",
        price: "",
        startDate: "",
        endDate: "",
        image: "",
        imageFile: null,
        status: "active",
      });
      setImagePreview("");
      fetchDraws();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save draw");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (draw) => {
    setSelectedDraw(draw);
    setFormData({
      title: draw.title,
      prize: draw.prize,
      price: draw.price.toString(),
      startDate: format(new Date(draw.startDate), "yyyy-MM-dd'T'HH:mm"),
      endDate: format(new Date(draw.endDate), "yyyy-MM-dd'T'HH:mm"),
      image: draw.image || "",
      imageFile: null,
      status: draw.status || "cancelled",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this draw?")) return;
    try {
      setLoading(true);
      await adminService.deleteDraw(id);
      fetchDraws();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete draw");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !draws.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading draws...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold ">Draws</h1>
          <p className="mt-2 text-sm">A list of all draws in the system.</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => {
              setSelectedDraw(null);
              setFormData({
                title: "",
                prize: "",
                price: "",
                startDate: "",
                endDate: "",
                image: "",
                imageFile: null,
                status: "active",
              });
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Draw
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 text-sm text-red-500 bg-red-50 p-4 rounded-md">
          {error}
        </div>
      )}

      <div className="mt-4 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              {draws.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50 dark:bg-neutral-700">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-sm font-semibold text-neutral-800 dark:text-gray-100"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-sm font-semibold text-neutral-800 dark:text-gray-100"
                      >
                        Prize
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-sm font-semibold text-neutral-800 dark:text-gray-100"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-sm font-semibold text-neutral-800 dark:text-gray-100"
                      >
                        Start Date
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-sm font-semibold text-neutral-800 dark:text-gray-100"
                      >
                        End Date
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-sm font-semibold text-neutral-800 dark:text-gray-100"
                      >
                        Status
                      </th>
                      <th scope="col" className="relative px-4 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white dark:bg-neutral-800">
                    {draws.map((draw) => (
                      <tr
                        key={draw.id}
                        className="hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                      >
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-neutral-800 dark:text-gray-100">
                          {draw.title}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-neutral-800 dark:text-gray-100">
                          {draw.prize}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-neutral-800 dark:text-gray-100">
                          ${draw.price}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-neutral-800 dark:text-gray-100">
                          {format(new Date(draw.startDate), "PPp")}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-neutral-800 dark:text-gray-100">
                          {format(new Date(draw.endDate), "PPp")}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              draw.status === "active"
                                ? "bg-green-100 text-green-800"
                                : draw.status === "completed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {draw.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(draw)}
                            className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 mr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(draw.id)}
                            className="text-red-500 hover:text-red-900 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-neutral-800 dark:text-gray-100">
                    No draws
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Get started by creating a new draw.
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDraw(null);
                        setFormData({
                          title: "",
                          prize: "",
                          price: "",
                          startDate: "",
                          endDate: "",
                          image: "",
                          imageFile: null,
                          status: "active",
                        });
                        setIsModalOpen(true);
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Create new draw
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-neutral-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg max-w-xl w-full p-6">
            <h2 className="text-lg font-medium mb-4">
              {selectedDraw ? "Edit Draw" : "Create Draw"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-2 block w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none focus:border-blue-500 transition duration-200 dark:bg-neutral-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Prize</label>
                <input
                  type="text"
                  name="prize"
                  value={formData.prize}
                  onChange={handleInputChange}
                  className="mt-2 block w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none focus:border-blue-500 transition duration-200 dark:bg-neutral-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="mt-2 block w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none focus:border-blue-500 transition duration-200 dark:bg-neutral-700 dark:text-white"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="w-full flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-x-2">
                <label className="w-full flex flex-col text-sm font-medium">
                  Start Date
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="mt-2  px-2 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none focus:border-blue-500 transition duration-200 dark:bg-neutral-700 dark:text-white"
                    required
                  />
                </label>
                <label className="w-full flex flex-col text-sm font-medium">
                  End Date
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="mt-2  px-2 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none focus:border-blue-500 transition duration-200 dark:bg-neutral-700 dark:text-white"
                    required
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium">Image</label>
                <div className="mt-1 flex flex-col space-y-4">
                  {/* URL input */}
                  <div>
                    <label className="block text-sm mb-1">
                      Option 1: Enter Image URL
                    </label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="Enter image URL"
                      className="mt-2 block w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none focus:border-blue-500 transition duration-200 dark:bg-neutral-700 dark:text-white"
                    />
                  </div>

                  {/* File upload */}
                  <div>
                    <label className="block text-sm  mb-1">
                      Option 2: Upload Image File
                    </label>
                    <input
                      type="file"
                      name="imageFile"
                      accept="image/*"
                      onChange={handleInputChange}
                      className="block w-full text-sm 
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-red-50 file:text-red-700
                        hover:file:bg-red-100"
                    />
                  </div>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mt-2">
                      <label className="block text-sm  mb-1">Preview</label>
                      <div className="relative w-full h-48">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="rounded-md object-cover w-full h-full"
                          onError={() => setImagePreview("")}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview("");
                            setFormData((prev) => ({
                              ...prev,
                              image: "",
                              imageFile: null,
                            }));
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="status"
                  checked={formData.status === "active"}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      status: e.target.checked ? "active" : "cancelled",
                    });
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm font-medium">Active</label>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-sm disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300  px-4 py-2 text-base font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
