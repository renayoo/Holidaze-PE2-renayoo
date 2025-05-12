import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_VENUE_BY_ID } from "../api/constants";
import { headers } from "../api/headers";

function Venue() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVenue() {
      try {
        const response = await fetch(API_VENUE_BY_ID(id), {
          headers: headers(), 
        });

        const json = await response.json();
        setVenue(json.data);
      } catch (error) {
        console.error("Error fetching venue:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVenue();
  }, [id]);

  if (loading) return <p className="p-4">Loading venue...</p>;
  if (!venue) return <p className="p-4">Venue not found.</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{venue.name}</h1>

      <img
        src={venue.media?.[0]?.url || "https://placehold.co/600x300"}
        alt={venue.media?.[0]?.alt || venue.name}
        className="w-full h-64 object-cover rounded mb-4"
      />

      <p className="text-gray-700 mb-4">{venue.description}</p>

      <p className="text-sm text-gray-600 mb-2">
        📍 {venue.location?.address}, {venue.location?.city}, {venue.location?.country}
      </p>

      <p className="font-semibold mb-2">💰 ${venue.price} / night</p>
      <p className="mb-2">👥 Max guests: {venue.maxGuests}</p>
      <p className="mb-2">⭐ Rating: {venue.rating}</p>

      <div className="mt-4">
        <h2 className="font-semibold mb-2">Amenities</h2>
        <ul className="text-sm text-gray-700 list-disc list-inside">
          <li>Wi-Fi: {venue.meta?.wifi ? "✅" : "❌"}</li>
          <li>Parking: {venue.meta?.parking ? "✅" : "❌"}</li>
          <li>Breakfast: {venue.meta?.breakfast ? "✅" : "❌"}</li>
          <li>Pets allowed: {venue.meta?.pets ? "✅" : "❌"}</li>
        </ul>
      </div>
    </div>
  );
}

export default Venue;
