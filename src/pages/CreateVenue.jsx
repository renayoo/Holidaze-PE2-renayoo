import { useState } from "react";
import { API_CREATE_VENUE } from "../api/constants"; 
import { headers } from "../api/headers"; 

function CreateVenue() {
  const [venue, setVenue] = useState({
    name: "",
    description: "",
    price: 0,
    maxGuests: 0,
    media: [
      { url: "", alt: "" },
      { url: "", alt: "" },
      { url: "", alt: "" },
      { url: "", alt: "" },
    ],
    rating: 0,
    meta: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
    location: {
      address: "",
      city: "",
      zip: "",
      country: "",
      continent: "",
      lat: 0,
      lng: 0,
    },
  });

  const [error, setError] = useState("");

  // Funksjon for å oppdatere feltene i state
  function handleChange(e) {
    const { name, value } = e.target;
    setVenue((prev) => ({ ...prev, [name]: value }));
  }

  // Funksjon for å håndtere endring i media bilder
  function handleMediaChange(e, index) {
    const { name, value } = e.target;
    const updatedMedia = [...venue.media];
    updatedMedia[index] = { ...updatedMedia[index], [name]: value };
    setVenue((prev) => ({ ...prev, media: updatedMedia }));
  }

  // Funksjon for å opprette venue
  async function handleCreate() {
    try {
      const response = await fetch(API_CREATE_VENUE, {
        method: "POST",
        headers: headers(true),
        body: JSON.stringify(venue),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.[0]?.message || "Failed to create venue");
      }

      // Naviger til profil eller venue-liste etter vellykket opprettelse
      alert("Venue created successfully!");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a New Venue</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreate();
        }}
        className="space-y-4"
      >
        <input
          type="text"
          name="name"
          value={venue.name}
          onChange={handleChange}
          placeholder="Venue Name"
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="description"
          value={venue.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="price"
          value={venue.price}
          onChange={handleChange}
          placeholder="Price"
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="maxGuests"
          value={venue.maxGuests}
          onChange={handleChange}
          placeholder="Max Guests"
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="rating"
          value={venue.rating}
          onChange={handleChange}
          placeholder="Rating (0-5)"
          required
          className="w-full border p-2 rounded"
        />
        
        {/* Media Fields (4 images) */}
        <h3 className="text-lg font-semibold">Media</h3>
        {venue.media.map((media, index) => (
          <div key={index} className="space-y-2">
            <input
              type="text"
              name="url"
              value={media.url}
              onChange={(e) => handleMediaChange(e, index)}
              placeholder={`Image URL ${index + 1}`}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="alt"
              value={media.alt}
              onChange={(e) => handleMediaChange(e, index)}
              placeholder={`Image Alt ${index + 1}`}
              className="w-full border p-2 rounded"
            />
          </div>
        ))}

        {/* Meta Information */}
        <h3 className="text-lg font-semibold">Meta Information</h3>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="wifi"
            checked={venue.meta.wifi}
            onChange={(e) =>
              setVenue((prev) => ({
                ...prev,
                meta: { ...prev.meta, wifi: e.target.checked },
              }))
            }
          />
          Wi-Fi
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="parking"
            checked={venue.meta.parking}
            onChange={(e) =>
              setVenue((prev) => ({
                ...prev,
                meta: { ...prev.meta, parking: e.target.checked },
              }))
            }
          />
          Parking
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="breakfast"
            checked={venue.meta.breakfast}
            onChange={(e) =>
              setVenue((prev) => ({
                ...prev,
                meta: { ...prev.meta, breakfast: e.target.checked },
              }))
            }
          />
          Breakfast
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="pets"
            checked={venue.meta.pets}
            onChange={(e) =>
              setVenue((prev) => ({
                ...prev,
                meta: { ...prev.meta, pets: e.target.checked },
              }))
            }
          />
          Pets Allowed
        </label>

        {/* Location */}
        <h3 className="text-lg font-semibold">Location</h3>
        <input
          type="text"
          name="address"
          value={venue.location.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="city"
          value={venue.location.city}
          onChange={handleChange}
          placeholder="City"
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="zip"
          value={venue.location.zip}
          onChange={handleChange}
          placeholder="ZIP Code"
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="country"
          value={venue.location.country}
          onChange={handleChange}
          placeholder="Country"
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="continent"
          value={venue.location.continent}
          onChange={handleChange}
          placeholder="Continent"
          className="w-full border p-2 rounded"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Create Venue
        </button>
      </form>
    </div>
  );
}

export default CreateVenue;
