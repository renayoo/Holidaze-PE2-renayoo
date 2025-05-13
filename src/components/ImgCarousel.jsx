import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function ImgCarousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);

  if (!images || images.length === 0) {
    return (
      <img
        src="https://placehold.co/800x400"
        alt="No images"
        className="w-full h-80 object-cover rounded"
      />
    );
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 50) handleNext(); // swipe left
    else if (diff < -50) handlePrev(); // swipe right

    setTouchStartX(null);
  };

  return (
    <div
      className="relative mb-6"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={images[currentIndex].url}
        alt={images[currentIndex].alt || "Venue image"}
        className="w-full h-96 object-cover rounded"
      />

      {images.length > 1 && (
        <>
          {/* Arrows only on medium screens and up */}
          <button
            onClick={handlePrev}
            className="hidden md:block absolute top-1/2 -left-12 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-gray-700 text-white p-3 rounded"
            aria-label="Previous"
          >
            <FaChevronLeft />
          </button>

          <button
            onClick={handleNext}
            className="hidden md:block absolute top-1/2 -right-12 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-gray-700 text-white p-3 rounded"
            aria-label="Next"
          >
            <FaChevronRight />
          </button>
        </>
      )}

      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
        {images.map((_, index) => (
          <span
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default ImgCarousel;

