import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { API_VENUES } from "../api/constants";

function isSafeImage(url) {
  return typeof url === "string" && !url.includes("gstatic.com") && !url.startsWith("data:image");
}

function VenueCarousel() {
  const [venues, setVenues] = useState([]);
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    async function fetchVenues() {
      try {
        const res = await fetch(`${API_VENUES}?limit=100`);
        const json = await res.json();
        const withImages = (json.data || []).filter((v) =>
          isSafeImage(v.media?.[0]?.url)
        );
        const shuffled = [...withImages].sort(() => 0.5 - Math.random());
        setVenues(shuffled.slice(0, 20));
      } catch (err) {
        console.error("Failed to load venues for carousel:", err);
      }
    }

    fetchVenues();
  }, []);

  useEffect(() => {
    if (venues.length === 0) return;
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % venues.length);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, [venues]);

  if (venues.length === 0) return null;

  const current = venues[index];
  const imageUrl = isSafeImage(current.media?.[0]?.url)
    ? current.media[0].url
    : "https://placehold.co/1200x400?text=Unavailable";

  return (
    <div
      onMouseEnter={() => clearInterval(intervalRef.current)}
      onMouseLeave={() =>
        (intervalRef.current = setInterval(() => {
          setIndex((prev) => (prev + 1) % venues.length);
        }, 7000))
      }
      className="relative w-full h-72 md:h-[35rem] rounded-xl overflow-hidden shadow-md"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Link to={`/venue/${current.id}`} className="block w-full h-full">
            <img
              src={imageUrl}
              alt={current.name}
              onError={(e) => {
                e.target.src = "https://placehold.co/1200x400?text=Image+Unavailable";
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-end p-6 text-white">
              <div className="space-y-1">
                <h2 className="font-pacifico text-3xl drop-shadow-md">{current.name}</h2>
                <p className="text-sm md:text-base drop-shadow">
                  📍 {current.location?.city || "Unknown"},{" "}
                  {current.location?.country || ""}
                </p>
                <p className="text-sm md:text-base drop-shadow">
                  💰 {current.price} $ / night
                </p>
              </div>
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default VenueCarousel;











