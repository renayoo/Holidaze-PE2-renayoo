import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_VENUE_BY_ID, API_CREATE_BOOKING } from "../api/constants";
import { headers } from "../api/headers";
import BookingCalendar from "../components/BookingCalendar";

function Venue() {
  const { id } = useParams();
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
        const response = await fetch(API_VENUE_BY_ID(id), {
          headers: headers(),
        });
        const json = await response.json();
        const venueData = json.data;
        setVenue(venueData);

        const ranges =
          venueData.bookings?.map((booking) => ({
            start: new Date(booking.dateFrom),
            end: new Date(booking.dateTo),
          })) || [];
        setBookedRanges(ranges);
      } catch (error) {
        console.error("Error fetching venue:", error);
        setErrorMessage("Could not load venue.");
      } finally {
        setLoading(false);
      }
    }

    fetchVenue();
  }, [id]);

  useEffect(() => {
    if (confirmation) {
      const timer = setTimeout(() => setConfirmation(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [confirmation]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const calculateNights = () => {
    const { dateFrom, dateTo } = selectedDates;
    if (!dateFrom || !dateTo) return 0;
    const timeDiff = dateTo.getTime() - dateFrom.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();
  const totalPrice = nights * venue?.price;

  const isOverlappingBooking = () => {
    const { dateFrom, dateTo } = selectedDates;
    if (!dateFrom || !dateTo) return false;

    return bookedRanges.some((range) => {
      const start = new Date(range.start);
      const end = new Date(range.end);
      return dateFrom <= end && dateTo >= start;
    });
  };

  const handleBooking = async () => {
    const { dateFrom, dateTo } = selectedDates;

    if (!dateFrom || !dateTo || guests < 1) {
      setErrorMessage("Please select valid dates and number of guests.");
      return;
    }

    if (isOverlappingBooking()) {
      setErrorMessage("Selected dates overlap with an existing booking.");
      return;
    }

    try {
      const response = await fetch(API_CREATE_BOOKING, {
        method: "POST",
        headers: headers(true),
        body: JSON.stringify({
          dateFrom: dateFrom.toISOString(),
          dateTo: dateTo.toISOString(),
          guests,
          venueId: id,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.errors?.[0]?.message || "Booking failed");
      }

      setConfirmation({
        from: new Date(dateFrom).toLocaleDateString(),
        to: new Date(dateTo).toLocaleDateString(),
      });

      setBookedRanges((prev) => [
        ...prev,
        { start: dateFrom, end: dateTo },
      ]);

      setSelectedDates({ dateFrom: null, dateTo: null });
    } catch (error) {
      console.error("Booking error:", error);
      setErrorMessage("Failed to complete booking. Please try again.");
    }
  };

  if (loading) return <p className="p-4">Loading venue...</p>;
  if (!venue) return <p className="p-4">Venue not found.</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto relative">
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

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Book This Venue</h2>

        <BookingCalendar
          selectedDates={selectedDates}
          onDateChange={setSelectedDates}
          bookedRanges={bookedRanges}
        />

        <div className="mt-4">
          <label className="block font-medium mb-1">Number of guests:</label>
          <input
            type="number"
            min={1}
            max={venue.maxGuests}
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            className="border rounded p-2 w-24"
          />
        </div>

        <div className="mt-4 text-sm text-gray-800">
          {nights > 0 && (
            <p>
              {nights} night{nights > 1 ? "s" : ""} × ${venue.price} ={" "}
              <strong>${totalPrice}</strong>
            </p>
          )}
        </div>

        {user ? (
          <button
            onClick={handleBooking}
            disabled={nights === 0}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Book Now
          </button>
        ) : (
          <p className="mt-4 text-red-600">You must be logged in to book this venue.</p>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-5px); }
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





