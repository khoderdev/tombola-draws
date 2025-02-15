import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { drawsService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function DrawList() {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchDraws = useCallback(async () => {
    try {
      setLoading(true);
      const response = await drawsService.getDraws();
      // Ensure we have an array of draws with required properties
      const formattedDraws = (response.data || []).map((draw) => ({
        ...draw,
        hasEntered: draw.hasEntered || false,
        ticketStatus: draw.ticketStatus || null,
        ticketId: draw.ticketId || null,
      }));
      setDraws(formattedDraws);
    } catch (err) {
      console.error("Error fetching draws:", err);
      setError("Failed to fetch draws");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDraws();
  }, [fetchDraws]);

  const handleEnterDraw = useCallback(
    async (drawId) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const response = await drawsService.enterDraw(drawId);
        if (response.data?.ticket) {
          setDraws((prevDraws) =>
            prevDraws.map((draw) =>
              draw.id === drawId
                ? {
                    ...draw,
                    hasEntered: true,
                    ticketStatus: "pending",
                    ticketId: response.data.ticket.id,
                  }
                : draw
            )
          );
        }
      } catch (err) {
        console.error("Error entering draw:", err);
        setError(err.response?.data?.message || "Failed to enter draw");
      }
    },
    [user, navigate]
  );

  const getStatusDisplay = (status) => {
    switch (status) {
      case "pending":
        return {
          text: "Pending",
          className: "bg-yellow-100 text-yellow-800",
        };
      case "active":
        return {
          text: "Subscribed",
          className: "bg-green-100 text-green-800",
        };
      case "declined":
        return {
          text: "Rejected",
          className: "bg-red-100 text-red-800",
        };
      default:
        return {
          text: status,
          className: "bg-gray-100 text-gray-800",
        };
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading draws...</div>
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
          Available Draws
        </h2>
        {user && (
          <button
            onClick={() => navigate("/tickets")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            My Tickets
          </button>
        )}
      </div>

      {!draws.length ? (
        <div className="text-center text-neutral-500">
          No draws available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {draws.map((draw) => (
            <div
              key={draw.id}
              className="bg-white dark:bg-neutral-800 overflow-hidden shadow rounded-lg"
            >
              {draw.image && (
                <img
                  src={draw.image}
                  alt={draw.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{draw.title}</h3>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                <p className="text-neutral-500 mb-4">{draw.prize}</p>
                <div className="flex justify-between items-center">
                  <div className="text-lg font-semibold">${draw.price}</div>
                  {draw.hasEntered ? (
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        getStatusDisplay(draw.ticketStatus).className
                      }`}
                    >
                      {getStatusDisplay(draw.ticketStatus).text}
                    </span>
                  ) : (
                    <button
                      onClick={() => handleEnterDraw(draw.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Enter Draw
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
