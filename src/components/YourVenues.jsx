import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_DELETE_VENUE, API_BOOKINGS } from "../api/constants";
import { headers } from "../api/headers";
import { getAuthUser } from "../utils/auth";

function YourVenues({ venues: initialVenues, onVenueDeleted }) {
  const [venueBookings, setVenueBookings] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAllBookings() {
      try {
        const res = await fetch(`${API_BOOKINGS}?_venue=true&_customer=true`, {
          headers: headers(true),
        });
        const json = await res.json();
        const allBookings = json.data || [];

        const currentUser = getAuthUser();
        const currentName = currentUser?.name || currentUser?.data?.name;

        const bookingsByVenue = {};
        allBookings.forEach((booking) => {
          const venue = booking.venue;
          if (venue?.owner?.name === currentName) {
            const venueId = venue.id;
            if (!bookingsByVenue[venueId]) bookingsByVenue[venueId] = [];
            bookingsByVenue[venueId].push(booking);
          }
        });

        setVenueBookings(bookingsByVenue);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      }
    }

    fetchAllBookings();
  }, [initialVenues]);

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
        {initialVenues.map((venue) => {
          const allBookings = venueBookings[venue.id] || [];
          const futureBookings = allBookings.filter(
            (b) => new Date(b.dateTo) >= new Date()
          );

          return (
            <div
              key={venue.id}
              onClick={() => navigate(`/venue/${venue.id}`)}
              className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition duration-200 cursor-pointer"
            >
              <h3 className="font-semibold text-lg text-[var(--color-button-turq)] mb-2">
                {venue.name}
              </h3>

              {venue.media?.[0]?.url && (
                <img
                  src={venue.media[0].url}
                  alt={venue.media[0].alt || "Venue image"}
                  className="w-full h-40 object-cover rounded mb-3"
                />
              )}

              {futureBookings.length > 0 ? (
                <div className="text-sm text-gray-600 space-y-1 mb-3">
                  {futureBookings.map((booking) => (
                    <div key={booking.id}>
                      📅 {new Date(booking.dateFrom).toLocaleDateString()} →{" "}
                      {new Date(booking.dateTo).toLocaleDateString()} — {booking.guests} guests
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic mb-3">No upcoming bookings</p>
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
                  className="text-sm text-white bg-red-500 hover:bg-red-400 px-3 py-1 rounded-full"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default YourVenues;







