import { useState, useEffect } from 'react';
import { drawsService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await drawsService.getMyTickets();
      setTickets(response.data?.tickets || []);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Failed to fetch tickets');
    } finally {
      setLoading(false);
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
      <h2 className="text-3xl font-bold text-gray-900 mb-8">My Tickets</h2>
      
      {tickets.length === 0 ? (
        <div className="text-center text-gray-500">
          You haven't entered any draws yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-lg shadow p-6 flex items-center justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {ticket.Draw?.title || 'Unknown Draw'}
                </h3>
                <p className="text-gray-600">Ticket #{ticket.number}</p>
                <p className="text-gray-500 text-sm">
                  Purchased: {new Date(ticket.purchaseDate).toLocaleDateString()}
                </p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                    ticket.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : ticket.status === 'won'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {ticket.status}
                </span>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-indigo-600">
                  Prize: {ticket.Draw?.prize || 'N/A'}
                </p>
                <p className="text-sm text-gray-500">
                  Draw Date: {ticket.Draw?.endDate ? new Date(ticket.Draw.endDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
