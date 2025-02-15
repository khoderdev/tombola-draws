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
      setDraws(response.data || []); // ✅ Always update state
    } catch (err) {
      console.error("Error fetching draws:", err);
      setError("Failed to fetch draws");
    } finally {
      setLoading(false);
    }
  }, []); // ✅ No dependencies

  useEffect(() => {
    fetchDraws();
  }, [fetchDraws]); // ✅ No infinite lo

  const handleEnterDraw = useCallback(
    async (drawId) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        await drawsService.enterDraw(drawId);
        setDraws((prevDraws) =>
          prevDraws.map((draw) =>
            draw.id === drawId ? { ...draw, hasEntered: true } : draw
          )
        );
      } catch (err) {
        console.error("Error entering draw:", err);
        setError("Failed to enter draw");
      }
    },
    [user, navigate]
  );

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

  if (!draws.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-neutral-500">
          No draws available at the moment.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Available Draws</h2>
        {user && (
          <button
            onClick={() => navigate("/tickets")}
            className="inline-flex bg-red-500 hover:bg-red-700 items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md transition-all duration-300"
          >
            My Tickets
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {draws.map((draw) => (
          <div
            key={draw.id}
            className="bg-white dark:bg-neutral-700 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={draw.image || "/placeholder-draw.jpg"}
              alt={draw.title}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.src = "/placeholder-draw.jpg";
              }}
            />
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold ">
                  {draw.title}
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              <p className="text-neutral-500 mb-4">{draw.description}</p>
              <div className="flex justify-between items-center">
                <div className="text-lg font-semibold">${draw.price}</div>
                <button
                  onClick={() => handleEnterDraw(draw.id)}
                  disabled={draw.hasEntered}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                    draw.hasEntered
                      ? "bg-green-600 text-white cursor-not-allowed"
                      : "text-white bg-red-500 hover:bg-red-700"
                  }`}
                >
                  {draw.hasEntered ? "Subscribed" : "Enter Draw"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
