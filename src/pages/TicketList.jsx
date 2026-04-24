import React, { useState, useEffect } from 'react';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      const response = await fetch('/api/tickets');
      const data = await response.json();
      setTickets(data);
      setLoading(false);
    };

    fetchTickets();
  }, []);

  const updateTicketStatus = async (ticketId, status) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/tickets/${ticketId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });

    if (response.ok) {
      const updatedTicket = await response.json();
      setTickets(tickets.map(t => (t._id === ticketId ? updatedTicket : t)));
    } else {
      alert('Failed to update ticket');
    }
  };

  if (loading) return <div className="text-center text-lg text-gray-600 mt-6">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Manage Tickets</h2>
      {tickets.map(ticket => (
        <div key={ticket._id} className="bg-white shadow-md rounded-md p-6 mb-4">
          <h3 className="text-xl font-semibold mb-2">{ticket.title}</h3>
          <p className="text-gray-700 mb-2">{ticket.description}</p>
          <p className="text-sm text-gray-500">Status: <span className="font-medium">{ticket.status}</span></p>

          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => updateTicketStatus(ticket._id, 'In Progress')}
              className="py-2 px-4 bg-yellow-500 text-white text-sm font-medium rounded hover:bg-yellow-600"
            >
              Mark as In Progress
            </button>

            <button
              onClick={() => updateTicketStatus(ticket._id, 'Resolved')}
              className="py-2 px-4 bg-green-500 text-white text-sm font-medium rounded hover:bg-green-600"
            >
              Mark as Resolved
            </button>

            <button
              onClick={() => updateTicketStatus(ticket._id, 'Closed')}
              className="py-2 px-4 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600"
            >
              Close Ticket
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TicketList;
