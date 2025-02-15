import { useState, useEffect } from "react";
import { adminService } from "../../services/api";
import AdminUsers from "./AdminUsers";
import AdminDraws from "./AdminDraws";
import AdminStats from "./AdminStats";
import PendingTickets from "./PendingTickets";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("stats");
  const [loading, setLoading] = useState(false);
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
      const response = await adminService.getStats();
      setStats(response.data);
    } catch (err) {
      setError("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingTickets = async () => {
    try {
      setLoading(true);
      const response = await adminService.getPendingTickets();
      setPendingTickets(response.data.tickets);
    } catch (err) {
      setError("Failed to load pending tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleTicketStatusUpdate = async (ticketId, status, note) => {
    try {
      await adminService.updateTicketStatus(ticketId, { status, adminNote: note });
      // Refresh pending tickets
      fetchPendingTickets();
      // Refresh stats if we're showing them
      if (activeTab === "stats") {
        fetchStats();
      }
    } catch (err) {
      setError("Failed to update ticket status");
    }
  };

  const tabs = [
    { id: "stats", name: "Dashboard" },
    { id: "pending", name: "Pending Tickets" },
    { id: "draws", name: "Manage Draws" },
    { id: "users", name: "Manage Users" },
  ];

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tabs */}
      <div className="border-b border-neutral-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-neutral-500 hover:border-neutral-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
            >
              {tab.name}
              {tab.id === "pending" && stats?.pendingTickets > 0 && (
                <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                  {stats.pendingTickets}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "stats" && <AdminStats stats={stats} />}
      {activeTab === "pending" && (
        <PendingTickets
          tickets={pendingTickets}
          onUpdateStatus={handleTicketStatusUpdate}
        />
      )}
      {activeTab === "draws" && <AdminDraws />}
      {activeTab === "users" && <AdminUsers />}
    </div>
  );
}
