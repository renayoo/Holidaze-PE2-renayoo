import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function ImgCarousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">No images</span>
      </div>
    );
  }

  const prev = () =>
    setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () =>
    setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  const onTouchStart = (e) => setTouchStartX(e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchStartX === null) return;
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (delta > 50) next();
    else if (delta < -50) prev();
    setTouchStartX(null);
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-lg"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <img
        src={images[currentIndex].url}
        alt={images[currentIndex].alt || "Venue image"}
        className="w-full h-full object-cover object-center transition-transform duration-500"
      />

      {/* Prev/Next */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute top-1/2 left-4 md:left-6 transform -translate-y-1/2 bg-black bg-opacity-25 hover:bg-opacity-40 text-white p-2 rounded-full"
            aria-label="Previous"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={next}
            className="absolute top-1/2 right-4 md:right-6 transform -translate-y-1/2 bg-black bg-opacity-25 hover:bg-opacity-40 text-white p-2 rounded-full"
            aria-label="Next"
          >
            <FaChevronRight />
          </button>
        </>
      )}

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`block w-2 h-2 rounded-full ${
              idx === currentIndex ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default ImgCarousel;


