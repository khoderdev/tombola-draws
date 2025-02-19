import { useState, useEffect } from "react";
import { drawsService } from "../../services/api";
import { FaArrowLeft } from "react-icons/fa";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await drawsService.getMyTickets();
      console.log("Tickets response:", response.data); // Debug log
      setTickets(response.data?.tickets || []);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "won":
        return "bg-blue-100 text-blue-800";
      case "declined":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading tickets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          My Tickets
        </h2>
        <button onClick={() => window.history.back()} className="btn inline-flex items-center space-x-2">
          <FaArrowLeft className="h-4 w-4" />
          <span>Back to Draws</span>
        </button>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-neutral-500 dark:text-neutral-400">
            You haven&apos;t entered any draws yet
          </h3>
          <p className="mt-2 text-neutral-400 dark:text-neutral-500">
            Go back to the draws page to participate in exciting draws!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white">
                      {ticket.Draw?.title || "Unknown Draw"}
                    </h3>
                    <div className="mt-1 space-y-1">
                      <p className="text-neutral-500 dark:text-neutral-400">
                        Ticket #{ticket.number}
                      </p>
                      <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                        Purchased:{" "}
                        {new Date(ticket.purchaseDate).toLocaleDateString()}
                      </p>
                      {ticket.adminNote && (
                        <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2 bg-neutral-50 dark:bg-neutral-900 p-2 rounded-md">
                          Admin Note: {ticket.adminNote}
                        </p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(
                      ticket.status
                    )}`}
                  >
                    {ticket.status}
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-lg font-medium text-neutral-900 dark:text-white">
                        Prize: {ticket.Draw?.prize || "N/A"}
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Price: ${ticket.Draw?.price || "N/A"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Draw Date:{" "}
                        {ticket.Draw?.endDate
                          ? new Date(ticket.Draw.endDate).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
