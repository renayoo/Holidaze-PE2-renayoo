import { useNavigate } from "react-router-dom";
import { API_DELETE_VENUE } from "../api/constants";
import { headers } from "../api/headers";

function YourVenues({ venues, onVenueDeleted }) {
  const navigate = useNavigate();

  const handleDeleteVenue = async (venueId) => {
    const confirm = window.confirm("Are you sure you want to delete this venue?");
    if (!confirm) return;

    try {
      const response = await fetch(API_DELETE_VENUE(venueId), {
        method: "DELETE",
        headers: headers(true),
      });

      if (response.status === 204) {
        onVenueDeleted(venueId);
        alert("Venue deleted.");
      } else {
        alert("Failed to delete venue.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting.");
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-pacifico text-[var(--color-button-turq)] mb-4">🏠 Your Venues</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {venues.map((venue) => (
          <div
            key={venue.id}
            onClick={() => navigate(`/venue/${venue.id}`)}
            className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition duration-200 cursor-pointer"
          >
            <h3 className="font-semibold text-lg text-[var(--color-button-turq)] mb-2">{venue.name}</h3>

            {venue.media?.[0]?.url && (
              <img
                src={venue.media[0].url}
                alt={venue.media[0].alt || "Venue image"}
                className="w-full h-40 object-cover rounded mb-3"
              />
            )}

            {Array.isArray(venue.bookings) && venue.bookings.length > 0 && (
              <div className="text-sm text-gray-600 space-y-1 mb-3">
                {venue.bookings.map((booking) => (
                  <div key={booking.id}>
                    📅 {new Date(booking.dateFrom).toLocaleDateString()} →{" "}
                    {new Date(booking.dateTo).toLocaleDateString()} — {booking.guests} guests
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/edit-venue/${venue.id}`);
                }}
                className="text-sm text-white bg-yellow-400 hover:bg-yellow-300 px-3 py-1 rounded-full"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteVenue(venue.id);
                }}
                className="text-sm text-white bg-red-500 hover:bg-red-300 px-3 py-1 rounded-full"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default YourVenues;


