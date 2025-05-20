import { Link } from "react-router-dom";

function VenueCard({ venue }) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow hover:shadow-md transition">
      <Link to={`/venue/${venue.id}`}>
        <img
          src={venue.media?.[0]?.url || "https://placehold.co/400x200"}
          alt={venue.media?.[0]?.alt || venue.name}
          className="w-full h-48 object-cover rounded mb-3 hover:opacity-90 transition"
        />
      </Link>
      <h2 className="font-pacifico text-xl mb-1">{venue.name}</h2>
      <p className="text-sm text-gray-600">
        {venue.location?.city || "Unknown"},{" "}
        {venue.location?.country || ""}
      </p>
      <p className="text-sm text-gray-500 mb-3">{venue.price} $ / night</p>
      <Link
        to={`/venue/${venue.id}`}
        className="text-blue-600 hover:underline"
      >
        View details
      </Link>
    </div>
  );
}

export default VenueCard;
