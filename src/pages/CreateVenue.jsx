import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_CREATE_VENUE } from "../api/constants";
import { headers } from "../api/headers";

function CreateVenue() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    media: [{ url: "", alt: "" }],
    price: "",
    maxGuests: "",
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
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("meta.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        meta: {
          ...prev.meta,
          [key]: type === "checkbox" ? checked : value,
        },
      }));
    } else if (name.startsWith("location.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [key]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  function handleMediaChange(e, index, field) {
    const { value } = e.target;
    setForm((prev) => {
      const updated = [...prev.media];
      updated[index][field] = value;
      return { ...prev, media: updated };
    });
  }

  function addMedia() {
    setForm((prev) => ({
      ...prev,
      media: [...prev.media, { url: "", alt: "" }],
    }));
  }

  function removeMedia(index) {
    setForm((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
  
    if (!form.name || !form.description || !form.price || !form.maxGuests) {
      setError("Please fill in all required fields.");
      return;
    }
  
    try {
      const response = await fetch(API_CREATE_VENUE, {
        method: "POST",
        headers: headers(true),
        body: JSON.stringify({
          ...form,
          price: parseInt(form.price),
          maxGuests: parseInt(form.maxGuests),
        }),
      });
  
      const json = await response.json();
  
      if (!response.ok) {
        throw new Error(json.errors?.[0]?.message || "Something went wrong");
      }
  
      setSuccess(true);
      navigate(`/venue/${json.data.id}`); 
    } catch (err) {
      setError(err.message);
    }
  }
  

  return (
    <div className="max-w-2xl mx-auto p-4 ">
      <h1 className="font-pacifico text-center text-2xl mb-4">Create a New Venue</h1>

      {success && (
        <p className="text-green-600 mb-4 font-medium">
          🎉 Venue created! Redirecting...
        </p>
      )}

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Venue name"
          className="w-full border p-2 rounded bg-white"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 rounded bg-white"
          required
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price per night"
            className="border p-2 rounded bg-white"
            required
          />
          <input
            name="maxGuests"
            type="number"
            value={form.maxGuests}
            onChange={handleChange}
            placeholder="Max guests"
            className="border p-2 rounded bg-white"
            required
          />
        </div>

        {/* 🖼️ Media */}
        <div className="space-y-4">
          {form.media.map((item, index) => (
            <div key={index} className="border p-3 rounded shadow-sm bg-white">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  name={`media.url.${index}`}
                  value={item.url}
                  onChange={(e) => handleMediaChange(e, index, "url")}
                  placeholder="Image URL"
                  className="border p-2 rounded bg-white"
                />
                <input
                  name={`media.alt.${index}`}
                  value={item.alt}
                  onChange={(e) => handleMediaChange(e, index, "alt")}
                  placeholder="Alt text"
                  className="border p-2 rounded bg-white"
                />
              </div>

              {item.url && (
                <img
                  src={item.url}
                  alt={item.alt || "Image preview"}
                  className="w-full max-h-60 object-cover rounded border bg-white"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/600x300?text=Invalid+Image";
                  }}
                />
              )}

              {form.media.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMedia(index)}
                  className="text-sm text-red-600 mt-2"
                >
                  Remove Image
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addMedia}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add another image
          </button>
        </div>

        {/* ✅ Amenities */}
        <fieldset className="border p-2 rounded bg-white">
          <legend className="text-sm font-medium">Amenities</legend>
          {["wifi", "parking", "breakfast", "pets"].map((key) => (
            <label key={key} className="block">
              <input
                type="checkbox"
                name={`meta.${key}`}
                checked={form.meta[key]}
                onChange={handleChange}
              />{" "}
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
          ))}
        </fieldset>

        {/* 🌍 Location */}
        <fieldset className="border p-2 rounded bg-white">
          <legend className="text-sm font-medium ">Location</legend>
          {["address", "city", "zip", "country", "continent"].map((key) => (
            <input
              key={key}
              name={`location.${key}`}
              value={form.location[key]}
              onChange={handleChange}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              className="w-full border p-2 rounded mb-2 "
            />
          ))}
        </fieldset>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Venue
        </button>
      </form>
    </div>
  );
}

export default CreateVenue;


