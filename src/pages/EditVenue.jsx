import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_VENUE_BY_ID, API_UPDATE_VENUE } from "../api/constants";
import { headers } from "../api/headers";

function EditVenue() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchVenue() {
      try {
        const response = await fetch(API_VENUE_BY_ID(id), {
          headers: headers(),
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.errors?.[0]?.message || "Failed to load venue.");
        }

        setVenue(data.data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchVenue();
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setVenue((prev) => ({ ...prev, [name]: value }));
  }

  function handleMetaChange(e) {
    const { name, checked } = e.target;
    setVenue((prev) => ({
      ...prev,
      meta: { ...prev.meta, [name]: checked },
    }));
  }

  function handleLocationChange(e) {
    const { name, value } = e.target;
    setVenue((prev) => ({
      ...prev,
      location: { ...prev.location, [name]: value },
    }));
  }

  function handleMediaChange(e, index) {
    const { name, value } = e.target;
    const updatedMedia = [...venue.media];
    updatedMedia[index] = { ...updatedMedia[index], [name]: value };
    setVenue((prev) => ({ ...prev, media: updatedMedia }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(API_UPDATE_VENUE(id), {
        method: "PUT",
        headers: headers(true),
        body: JSON.stringify(venue),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.[0]?.message || "Failed to update venue.");
      }

      alert("Venue updated!");
      navigate(`/venue/${id}`);
    } catch (err) {
      setError(err.message);
    }
  }

  if (!venue) return <p className="p-4">Loading venue...</p>;

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Venue</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={venue.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="description"
          value={venue.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="price"
          type="number"
          value={venue.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="maxGuests"
          type="number"
          value={venue.maxGuests}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="rating"
          type="number"
          value={venue.rating}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <h3 className="font-semibold">Media</h3>
        {venue.media.map((media, index) => (
          <div key={index}>
            <input
              name="url"
              value={media.url}
              onChange={(e) => handleMediaChange(e, index)}
              className="w-full border p-2 rounded"
            />
            <input
              name="alt"
              value={media.alt}
              onChange={(e) => handleMediaChange(e, index)}
              className="w-full border p-2 rounded"
            />
          </div>
        ))}

        <h3 className="font-semibold">Meta</h3>
        {["wifi", "parking", "breakfast", "pets"].map((key) => (
          <label key={key} className="block text-sm">
            <input
              type="checkbox"
              name={key}
              checked={venue.meta?.[key] || false}
              onChange={handleMetaChange}
            />{" "}
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
        ))}

        <h3 className="font-semibold">Location</h3>
        {["address", "city", "zip", "country", "continent"].map((key) => (
          <input
            key={key}
            name={key}
            value={venue.location?.[key] || ""}
            onChange={handleLocationChange}
            placeholder={key}
            className="w-full border p-2 rounded"
          />
        ))}

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditVenue;

  