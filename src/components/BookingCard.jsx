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

  const days = (new Date(dateTo) - new Date(dateFrom)) / (1000 * 60 * 60 * 24);
  const totalPrice = venue.price * days;

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition duration-200 cursor-pointer"
    >
      {venue.media?.[0]?.url && (
        <img
          src={venue.media[0].url}
          alt={venue.media[0].alt || venue.name}
          className="w-full h-40 object-cover rounded mb-3"
        />
      )}

      <h3 className="font-bold text-lg text-[var(--color-button-turq)] mb-1">{venue.name}</h3>
      <p className="text-sm text-gray-600">
        📅 {new Date(dateFrom).toLocaleDateString()} → {new Date(dateTo).toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-600">👥 {guests} guests</p>
      <p className="text-sm text-gray-600 mb-3">💰 Total: ${totalPrice}</p>

      <div className="text-right">
        <button
          onClick={handleCancel}
          disabled={loading}
          className="text-sm text-white bg-red-500 hover:bg-red-400 px-3 py-1 rounded-full transition disabled:opacity-50"
        >
          Cancel booking
        </button>
      </div>
    </div>
  );
}

export default BookingCard;

