import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

function isSafeImage(url) {
  if (!url || typeof url !== "string") return false;
  return !url.includes("gstatic.com") && !url.includes("data:image");
}

function VenueCarousel({ venues }) {
  const [index, setIndex] = useState(0);
  const [carouselList, setCarouselList] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (venues.length) {
      const withImages = venues.filter((v) =>
        isSafeImage(v.media?.[0]?.url)
      );
      const shuffled = [...withImages].sort(() => 0.5 - Math.random());
      setCarouselList(shuffled.slice(0, 5));
    }
  }, [venues]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIndex((prev) =>
        carouselList.length > 0 ? (prev + 1) % carouselList.length : 0
      );
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, [carouselList]);

  if (carouselList.length === 0) return null;

  const current = carouselList[index];
  const imageUrl =
    isSafeImage(current.media?.[0]?.url)
      ? current.media[0].url
      : "https://placehold.co/1200x400?text=Unavailable";

  return (
    <div
      onMouseEnter={() => clearInterval(intervalRef.current)}
      onMouseLeave={() =>
        (intervalRef.current = setInterval(() => {
          setIndex((prev) =>
            carouselList.length > 0 ? (prev + 1) % carouselList.length : 0
          );
        }, 4000))
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
                e.target.src =
                  "https://placehold.co/1200x400?text=Image+Unavailable";
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-end p-6 text-white">
              <div className="space-y-1">
                <h2 className="font-pacifico text-3xl drop-shadow-md">
                  {current.name}
                </h2>
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









