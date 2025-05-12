import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_VENUES } from "../api/constants";
import { headers } from "../api/headers";
import SearchInput from "../components/SearchInput";
import SortDropdown from "../components/SortDropdown";
import Pagination from "../components/Pagination";

function Home() {
  const [venues, setVenues] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 12;

  useEffect(() => {
    async function fetchVenues() {
      try {
        const response = await fetch(API_VENUES, { headers: headers() });
        const json = await response.json();
        setVenues(json.data);
      } catch (error) {
        console.error("Failed to fetch venues:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVenues();
  }, []);

  const filteredVenues = venues
    .filter((venue) => {
      const name = venue.name?.toLowerCase() || "";
      const city = venue.location?.city?.toLowerCase() || "";
      const country = venue.location?.country?.toLowerCase() || "";
      return (
        name.includes(search) || city.includes(search) || country.includes(search)
      );
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "priceLow":
          return a.price - b.price;
        case "priceHigh":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "newest":
        default:
          return new Date(b.created) - new Date(a.created);
      }
    });

  const totalPages = Math.ceil(filteredVenues.length / itemsPerPage);
  const paginatedVenues = filteredVenues.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <p className="p-4">Loading venues...</p>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Browse Venues</h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <SearchInput search={search} onChange={setSearch} />
        <SortDropdown sortOption={sortOption} onChange={setSortOption} />
      </div>

      {paginatedVenues.length === 0 ? (
        <p>No venues match your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {paginatedVenues.map((venue) => (
            <div key={venue.id} className="border rounded p-4 shadow-sm">
              <Link to={`/venue/${venue.id}`}>
                <img
                  src={venue.media?.[0]?.url || "https://placehold.co/400x200"}
                  alt={venue.media?.[0]?.alt || venue.name}
                  className="w-full h-48 object-cover rounded mb-3 hover:opacity-90 transition"
                />
              </Link>
              <h2 className="text-xl font-semibold mb-1">{venue.name}</h2>
              <p className="text-sm text-gray-600 mb-1">
                {venue.location?.city}, {venue.location?.country}
              </p>
              <p className="text-sm text-gray-500 mb-3">${venue.price} / night</p>
              <Link
                to={`/venue/${venue.id}`}
                className="text-blue-600 hover:underline"
              >
                View details
              </Link>
            </div>
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Home;



