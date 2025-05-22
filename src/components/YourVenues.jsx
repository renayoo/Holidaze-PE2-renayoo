import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_DELETE_VENUE, API_PROFILES } from "../api/constants";
import { headers } from "../api/headers";
import { getAuthUser } from "../utils/auth";

function YourVenues({ venues: initialVenues, onVenueDeleted, readOnly = false }) {
  const [venueBookings, setVenueBookings] = useState({});
  const [expandedVenues, setExpandedVenues] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserVenuesWithBookings = async () => {
      try {
        const currentUser = getAuthUser();
        const name = currentUser?.name || currentUser?.data?.name;

        const res = await fetch(
          `${API_PROFILES}/${name}/venues?_bookings=true`,
          {
            headers: headers(true),
          }
        );

        const json = await res.json();
        const venuesWithBookings = json.data || [];

        setVenueBookings(() => {
          const result = {};
          venuesWithBookings.forEach((venue) => {
            result[venue.id] = venue.bookings || [];
          });
          return result;
        });
      } catch (error) {
        console.error("❌ Failed to fetch your venue bookings:", error);
      }
    };

    if (!readOnly) {
      fetchUserVenuesWithBookings();
    }
  }, [readOnly]);

  const handleDeleteVenue = async (venueId) => {
    if (!onVenueDeleted) return;

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
      console.error("❌ Delete error:", error);
      alert("An error occurred while deleting.");
    }
  };

  const toggleVenueExpanded = (venueId) => {
    setExpandedVenues((prev) => ({
      ...prev,
      [venueId]: !prev[venueId],
    }));
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-pacifico text-[var(--color-button-turq)] mb-6">
        {readOnly ? "🏡 Venues" : "🏡 Your Venues"}
      </h2>

      <div className="flex flex-wrap gap-8">
        {initialVenues.map((venue) => {
          const allBookings = venueBookings[venue.id] || [];
          const futureBookings = allBookings.filter(
            (b) => new Date(b.dateTo) >= new Date()
          );

          const totalEarnings = futureBookings.reduce((sum, b) => {
            const nights =
              (new Date(b.dateTo) - new Date(b.dateFrom)) / (1000 * 60 * 60 * 24);
            return sum + nights * (venue.price || 0);
          }, 0);

          const showAll = expandedVenues[venue.id];
          const bookingsToShow = showAll
            ? futureBookings
            : futureBookings.slice(0, 2);

          return (
            <div
              key={venue.id}
              onClick={() => navigate(`/venue/${venue.id}`)}
              className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition duration-200 cursor-pointer w-full sm:w-[calc(50%-1rem)] flex flex-col"
            >
              <h3 className="font-semibold text-xl text-[var(--color-button-turq)] mb-2">
                {venue.name}
              </h3>

              {venue.media?.[0]?.url && (
                <img
                  src={venue.media[0].url}
                  alt={venue.media[0].alt || "Venue image"}
                  className="w-full h-40 object-cover rounded-xl mb-3"
                />
              )}

              {!readOnly && (
                <div className="text-sm font-medium text-gray-700 mb-3">
                  💰 Total earnings: ${totalEarnings.toFixed(0)}
                </div>
              )}

              {futureBookings.length > 0 && !readOnly && (
                <div className="space-y-3 mb-4">
                  {bookingsToShow.map((booking) => {
                    const nights =
                      (new Date(booking.dateTo) - new Date(booking.dateFrom)) /
                      (1000 * 60 * 60 * 24);
                    const pricePerNight = venue.price || 0;
                    const totalPrice = pricePerNight * nights;
                    const customerName =
                      booking.customer?.name || booking.customer?.data?.name || "Unknown";

                    return (
                      <div key={booking.id} className="bg-gray-100 rounded-lg p-3 shadow-sm">
                        <div className="flex items-center gap-2 text-sm text-gray-800 mb-1">
                          📅 {new Date(booking.dateFrom).toLocaleDateString()} →{" "}
                          {new Date(booking.dateTo).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-800">
                          👥 {booking.guests} guests
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-800">
                          💰 ${totalPrice.toFixed(0)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-800">
                          🙋{" "}
                          <a
                            href={`/profile?username=${customerName}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-600 hover:underline"
                          >
                            {customerName}
                          </a>
                        </div>
                      </div>
                    );
                  })}

                  {futureBookings.length > 2 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVenueExpanded(venue.id);
                      }}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {showAll
                        ? "Vis færre bookings"
                        : `Vis alle ${futureBookings.length} bookings`}
                    </button>
                  )}
                </div>
              )}

              {!readOnly && (
                <div className="flex justify-end gap-3 mt-auto pt-4 border-t">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/edit-venue/${venue.id}`);
                    }}
                    className="text-sm font-medium text-white bg-yellow-400 hover:bg-yellow-300 px-4 py-1 rounded-full shadow"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteVenue(venue.id);
                    }}
                    className="text-sm font-medium text-white bg-red-500 hover:bg-red-400 px-4 py-1 rounded-full shadow"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default YourVenues;












