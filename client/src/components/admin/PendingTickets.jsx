import { useState } from "react";

export default function PendingTickets({ tickets, onUpdateStatus }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [adminNote, setAdminNote] = useState("");

  const handleStatusUpdate = (ticketId, status) => {
    onUpdateStatus(ticketId, status, adminNote);
    setSelectedTicket(null);
    setAdminNote("");
  };

  if (!tickets?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-500">No pending tickets at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-neutral-800 shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-neutral-200">
          {tickets.map((ticket) => (
            <li key={ticket.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">
                    Ticket #{ticket.number}
                  </h3>
                  <div className="mt-1 text-sm text-neutral-500">
                    <p>Draw: {ticket.Draw.title}</p>
                    <p>Price: ${ticket.Draw.price}</p>
                    <p>
                      User: {ticket.User.name} ({ticket.User.email})
                    </p>
                    <p>
                      Purchase Date:{" "}
                      {new Date(ticket.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="space-x-3">
                  {selectedTicket === ticket.id ? (
                    <div className="space-y-3">
                      <textarea
                        className="w-full p-2 border rounded-md dark:bg-neutral-700"
                        placeholder="Add a note (optional)"
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(ticket.id, "accepted")}
                          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(ticket.id, "declined")}
                          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTicket(null);
                            setAdminNote("");
                          }}
                          className="px-4 py-2 bg-neutral-500 text-white rounded-md hover:bg-neutral-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedTicket(ticket.id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Review
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
