import { Link } from "react-router-dom";

function VenueCard({ venue }) {
  return (
    <div className="bg-white/90 border border-gray-200 rounded-3xl overflow-hidden shadow-md transform transition-transform duration-300 hover:scale-[1.02] p-4">
      <Link to={`/venue/${venue.id}`}>
        <img
          src={venue.media?.[0]?.url || "https://placehold.co/400x200"}
          alt={venue.media?.[0]?.alt || venue.name}
          className="w-full h-48 object-cover rounded-xl mb-3 transition-transform duration-300 hover:scale-105"
        />
      </Link>

      <div className="space-y-1">
        <h2 className="font-pacifico text-xl text-[var(--color-button-turq)]">
          {venue.name}
        </h2>

        <p className="text-sm text-gray-600">
          📍 {venue.location?.city || "Unknown"},{" "}
          {venue.location?.country || ""}
        </p>

        <p className="text-sm text-gray-700">
          💰 {venue.price} NOK / night
        </p>

        <Link
          to={`/venue/${venue.id}`}
          className="inline-block mt-3 text-white bg-[var(--color-button-turq)] hover:bg-opacity-90 text-sm px-4 py-1.5 rounded-full transition"
        >
          View details
        </Link>
      </div>
    </div>
  );
}

export default VenueCard;



