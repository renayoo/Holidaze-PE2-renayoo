import { useNavigate } from "react-router-dom";
import { headers } from "../api/headers";
import { useState } from "react";
import { API_BOOKING_BY_ID } from "../api/constants";

function BookingCard({ booking, onCancel }) {
  const { dateFrom, dateTo, guests, venue, id } = booking;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    navigate(`/venue/${venue.id}`);
  };

  const handleCancel = async (e) => {
    e.stopPropagation();

    const confirm = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirm) return;

    try {
      setLoading(true);
      const response = await fetch(API_BOOKING_BY_ID(id), {
        method: "DELETE",
        headers: headers(true),
      });

      if (response.status === 204) {
        alert("Booking cancelled.");
        if (onCancel) onCancel(id);
      } else {
        alert("Failed to cancel booking.");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Error cancelling booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="border p-4 rounded shadow-sm mb-4 cursor-pointer hover:bg-gray-50 transition relative"
    >
      <h3 className="font-bold text-lg">{venue.name}</h3>
      <p className="text-sm text-gray-600">
        {new Date(dateFrom).toLocaleDateString()} → {new Date(dateTo).toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-600">Guests: {guests}</p>
      <p className="text-sm text-gray-600">
        Total: ${venue.price * ((new Date(dateTo) - new Date(dateFrom)) / (1000 * 60 * 60 * 24))}
      </p>

      <button
        onClick={handleCancel}
        disabled={loading}
        className="absolute top-4 right-4 text-sm text-red-600 border border-red-300 px-2 py-1 rounded hover:bg-red-50 disabled:opacity-50"
      >
        Cancel
      </button>
    </div>
  );
}

export default BookingCard;
