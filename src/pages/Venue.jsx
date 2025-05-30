import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaWifi, FaCar, FaCoffee, FaPaw, FaStar, FaRegStar } from "react-icons/fa";
import { API_VENUE_BY_ID, API_CREATE_BOOKING } from "../api/constants";
import { headers } from "../api/headers";
import BookingCalendar from "../components/BookingCalendar";
import ImgCarousel from "../components/ImgCarousel";

function Venue() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDates, setSelectedDates] = useState({ dateFrom: null, dateTo: null });
  const [bookedRanges, setBookedRanges] = useState([]);
  const [guests, setGuests] = useState(1);
  const [confirmation, setConfirmation] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    async function fetchVenue() {
      try {
        const res = await fetch(API_VENUE_BY_ID(id), { headers: headers() });
        const json = await res.json();
        const v = json.data;
        setVenue(v);
        setBookedRanges(
          v.bookings?.map((b) => ({
            start: new Date(b.dateFrom),
            end: new Date(b.dateTo),
          })) || []
        );
      } catch (e) {
        console.error("Error fetching venue:", e);
        setErrorMessage("Could not load venue.");
      } finally {
        setLoading(false);
      }
    }
    fetchVenue();
  }, [id]);

  useEffect(() => {
    if (confirmation) {
      const t = setTimeout(() => setConfirmation(null), 3000);
      return () => clearTimeout(t);
    }
  }, [confirmation]);

  useEffect(() => {
    if (errorMessage) {
      const t = setTimeout(() => setErrorMessage(null), 3000);
      return () => clearTimeout(t);
    }
  }, [errorMessage]);

  const nights = (() => {
    const { dateFrom, dateTo } = selectedDates;
    if (!dateFrom || !dateTo) return 0;
    const diff = dateTo.getTime() - dateFrom.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  })();

  const totalPrice = nights * (venue?.price || 0);

  const overlaps = () => {
    const { dateFrom, dateTo } = selectedDates;
    if (!dateFrom || !dateTo) return false;
    return bookedRanges.some(({ start, end }) => dateFrom <= end && dateTo >= start);
  };

  const handleBooking = async () => {
    const { dateFrom, dateTo } = selectedDates;
    if (!dateFrom || !dateTo || guests < 1) {
      setErrorMessage("Please select valid dates and number of guests.");
      return;
    }
    if (overlaps()) {
      setErrorMessage("Selected dates overlap with an existing booking.");
      return;
    }
    try {
      const res = await fetch(API_CREATE_BOOKING, {
        method: "POST",
        headers: headers(true),
        body: JSON.stringify({
          dateFrom: dateFrom.toISOString(),
          dateTo: dateTo.toISOString(),
          guests,
          venueId: id,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.errors?.[0]?.message || "Booking failed");

      setConfirmation({
        from: dateFrom.toLocaleDateString(),
        to: dateTo.toLocaleDateString(),
      });
      setBookedRanges((prev) => [...prev, { start: dateFrom, end: dateTo }]);
      setSelectedDates({ dateFrom: null, dateTo: null });
    } catch (e) {
      console.error("Booking error:", e);
      setErrorMessage("Failed to complete booking. Please try again.");
    }
  };

  if (loading) return <p className="p-4">Loading venue...</p>;
  if (!venue) return <p className="p-4">Venue not found.</p>;

  const owner = venue?.owner;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {confirmation && (
        <div className="fixed top-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded shadow z-50 animate-fade">
          ✅ Booking confirmed: {confirmation.from} → {confirmation.to}
        </div>
      )}
      {errorMessage && (
        <div className="fixed bottom-4 right-4 bg-red-100 text-red-800 px-4 py-2 rounded shadow z-50 animate-fade">
          ⚠️ {errorMessage}
        </div>
      )}

      <h1 className="font-pacifico text-3xl text-center mb-6">{venue.name}</h1>
      
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:w-1/2">
          <ImgCarousel images={venue.media} />
        </div>

        <div className="md:w-1/2 p-6 space-y-6">
          <div className="space-y-4">
            <p className="text-gray-700">{venue.description}</p>
            <p className="text-sm text-gray-600">
              📍 {venue.location.address}, {venue.location.city}, {venue.location.country}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-semibold">💰 ${venue.price} / night</span>
              <span>👥 {venue.maxGuests} guests</span>
            </div>

            <div className="flex items-center">
              {[...Array(5)].map((_, i) =>
                i < Math.round(venue.rating) ? (
                  <FaStar key={i} className="text-yellow-500" />
                ) : (
                  <FaRegStar key={i} className="text-yellow-300" />
                )
              )}
              <span className="ml-2 text-gray-600">{venue.rating.toFixed(1)}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
              {venue.meta.wifi && (
                <div className="flex items-center space-x-1">
                  <FaWifi size={20} />
                  <span>Wi-Fi</span>
                </div>
              )}
              {venue.meta.parking && (
                <div className="flex items-center space-x-1">
                  <FaCar size={20} />
                  <span>Parking</span>
                </div>
              )}
              {venue.meta.breakfast && (
                <div className="flex items-center space-x-1">
                  <FaCoffee size={20} />
                  <span>Breakfast</span>
                </div>
              )}
              {venue.meta.pets && (
                <div className="flex items-center space-x-1">
                  <FaPaw size={20} />
                  <span>Pets allowed</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Book This Venue</h2>
            <BookingCalendar
              selectedDates={selectedDates}
              onDateChange={setSelectedDates}
              bookedRanges={bookedRanges}
            />

            <div>
              <label className="block font-medium mb-1">Number of guests</label>
              <input
                type="number"
                min={1}
                max={venue.maxGuests}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="border rounded p-2 w-24"
              />
            </div>

            {nights > 0 && (
              <p>
                {nights} night{nights > 1 ? "s" : ""} × ${venue.price} ={" "}
                <strong>${totalPrice}</strong>
              </p>
            )}

            {user ? (
              <button
                onClick={handleBooking}
                disabled={nights === 0}
                className="w-full py-2 font-pacifico rounded-full bg-gradient-to-r from-teal-500 to-teal-300 text-white hover:brightness-110 disabled:opacity-50"
              >
                Book now
              </button>
            ) : (
              <p className="text-red-600">You must be logged in to book.</p>
            )}

            {/* 👤 Owner info */}
            {owner && (
              <div
                onClick={() => navigate(`/profile?username=${owner.name}`)}
                className="mt-6 flex items-center gap-3 cursor-pointer hover:opacity-90 transition"
              >
                <img
                  src={owner.avatar?.url || "https://placehold.co/64x64"}
                  alt={owner.avatar?.alt || owner.name}
                  className="w-12 h-12 rounded-full border shadow object-cover"
                />
                <span className="font-pacifico text-lg text-[var(--color-button-turq)]">
                  {owner.name}
                </span>
              </div>
            )}
            
          </div>
        </div>
      </div>
      <button
        onClick={() => navigate("/")}
        className="mt-6 mb-6 py-2 font-pacifico px-4 rounded-full bg-gradient-to-r from-teal-500 to-teal-300 text-white hover:brightness-110 transition"
      >
        ← Back to Home
      </button>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade {
          animation: fade-in 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default Venue;








