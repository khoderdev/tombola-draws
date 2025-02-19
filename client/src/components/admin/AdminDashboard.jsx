import { useState, useEffect } from "react";
import { adminService } from "../../services/api";
import AdminUsers from "./AdminUsers";
import AdminDraws from "./AdminDraws";
import AdminStats from "./AdminStats";
import PendingTickets from "./PendingTickets";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("stats");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const [pendingTickets, setPendingTickets] = useState([]);

  useEffect(() => {
    if (activeTab === "stats") {
      fetchStats();
    } else if (activeTab === "pending") {
      fetchPendingTickets();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("Fetching stats...");
      const response = await adminService.getStats();
      console.log("Stats response:", response);
      
      // The response is already unwrapped in the adminService
      setStats(response.data);
      console.log("Stats set:", response.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError(err.message || "Failed to load statistics");
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingTickets = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminService.getPendingTickets();
      setPendingTickets(response.data.tickets);
    } catch (err) {
      console.error("Error fetching pending tickets:", err);
      setError(err.message || "Failed to load pending tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleTicketStatusUpdate = async (ticketId, status, note) => {
    try {
      await adminService.updateTicketStatus(ticketId, {
        status,
        adminNote: note,
      });
      // Refresh pending tickets
      fetchPendingTickets();
      // Refresh stats if we're showing them
      if (activeTab === "stats") {
        fetchStats();
      }
    } catch (err) {
      console.error("Error updating ticket status:", err);
      setError("Failed to update ticket status");
    }
  };

  const tabs = [
    { id: "stats", name: "Dashboard" },
    { id: "pending", name: "Pending Tickets" },
    { id: "draws", name: "Manage Draws" },
    { id: "users", name: "Manage Users" },
  ];

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <p>{error}</p>
        <button
          onClick={() => {
            setError("");
            if (activeTab === "stats") fetchStats();
            else if (activeTab === "pending") fetchPendingTickets();
          }}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tabs */}
      <div className="border-b border-neutral-200 dark:border-neutral-700 mb-4">
        <nav className="overflow-x-auto" aria-label="Tabs">
          <div className="flex min-w-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-neutral-500 hover:border-neutral-300 dark:text-neutral-100 dark:hover:border-neutral-500"
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium flex-shrink-0 flex items-center`}
              >
                {tab.name}
                {tab.id === "pending" && stats?.pendingTickets > 0 && (
                  <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                    {stats.pendingTickets}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "stats" && <AdminStats stats={stats} loading={loading} />}
      {activeTab === "pending" && (
        <PendingTickets
          tickets={pendingTickets}
          onUpdateStatus={handleTicketStatusUpdate}
          loading={loading}
        />
      )}
      {activeTab === "draws" && <AdminDraws />}
      {activeTab === "users" && <AdminUsers />}
    </div>
  );
}
