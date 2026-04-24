import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Ticket = () => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const [ticket, setTicket] = useState({
    title: "",
    description: "",
    response: "",
    status: "",
  });

  useEffect(() => {
    const fetchUserTicket = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/user/ticket`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const ticketData = await response.json();
        setTicket(ticketData);
      } catch (error) {
        console.error("Error fetching user tickets:", error);
      }
    };

    fetchUserTicket();
  }, [token]);

  return (
    <div>
      <div className="container mx-auto p-4 bg-gray-100 mt-9">
        <h1 className="text-4xl text-darkGray text-center font-bold mb-6">
          Tickets
        </h1>
      </div>
      {/* <div className="flex flex-wrap justify-center mb-8">
        <div className="m-2">
          <button
            className={`px-4 py-2 rounded-lg ${
              // selectedCategory === category.value
              "bg-gold text-white"
            }`}
          >
            hi this is me
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default Ticket;
