import { useEffect, useState } from "react";
import { API_VENUES } from "../api/constants";
import { headers } from "../api/headers";
import SearchInput from "../components/SearchInput";
import SortDropdown from "../components/SortDropdown";
import VenueCard from "../components/VenueCard";
import VenueCarousel from "../components/VenueCarousel";
import Pagination from "../components/Pagination";
import { useDebounce } from "../utils/useDebounce";

function Home() {
  const [venues, setVenues] = useState([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [sortOption, setSortOption] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const itemsPerPage = 12;


  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);


  useEffect(() => {
    async function fetchVenues() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append("limit", itemsPerPage.toString());
        params.append("page", currentPage.toString());

        // Sorting
        if (sortOption === "newest") {
          params.append("sort", "created");
          params.append("sortOrder", "desc");
        } else if (sortOption === "priceLow") {
          params.append("sort", "price");
          params.append("sortOrder", "asc");
        } else if (sortOption === "priceHigh") {
          params.append("sort", "price");
          params.append("sortOrder", "desc");
        }

        params.append("_owner", "true");
        params.append("_bookings", "true");

        // Search (server-side)
        let endpoint = `${API_VENUES}?${params.toString()}`;
        if (debouncedSearch.trim().length > 0) {
          params.append("q", debouncedSearch.trim());
          endpoint = `${API_VENUES}/search?${params.toString()}`;
        }

        const response = await fetch(endpoint, { headers: headers() });
        const json = await response.json();

        setVenues(Array.isArray(json.data) ? json.data : []);
        setTotalCount(json.meta?.totalCount || 0);
      } catch (error) {
        console.error("Failed to fetch venues:", error);
        setVenues([]);
      } finally {
        setLoading(false);
      }
    }

    fetchVenues();
  }, [debouncedSearch, sortOption, currentPage]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  if (loading) return <p className="p-4">Loading venues...</p>;

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-10">
      {/* Carousel on top */}
      <VenueCarousel venues={venues} />

      {/* Search + Sort */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <SearchInput search={search} onChange={setSearch} />
        <SortDropdown sortOption={sortOption} onChange={setSortOption} />
      </div>

      {/* Title */}
      <h2 className="font-pacifico text-3xl text-black text-center mt-6">
        🌴 Holidaze Venues
      </h2>

      {/* Venue grid or empty */}
      {venues.length === 0 ? (
        <p>No venues match your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

export default Home;


