import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_UPDATE_VENUE, API_VENUE_BY_ID } from "../api/constants";
import { headers } from "../api/headers";

function EditVenue() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchVenue() {
      try {
        const response = await fetch(API_VENUE_BY_ID(id), {
          headers: headers(),
        });
        const json = await response.json();
        if (!response.ok) throw new Error("Could not load venue");
        setForm(json.data);
      } catch (err) {
        setError("Failed to fetch venue.");
      } finally {
        setLoading(false);
      }
    }

    fetchVenue();
  }, [id]);

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
    
      try {
        const response = await fetch(API_UPDATE_VENUE(id), {
          method: "PUT",
          headers: headers(true),
          body: JSON.stringify({
            ...form,
            price: parseInt(form.price),
            maxGuests: parseInt(form.maxGuests),
          }),
        });
    
        const json = await response.json();
    
        if (!response.ok) {
          throw new Error(json.errors?.[0]?.message || "Update failed");
        }
    
        setSuccess(true);
        navigate(`/venue/${id}`); 
      } catch (err) {
        setError(err.message);
      }
    }
  
    async function handleDelete() {
      const confirm = window.confirm("Are you sure you want to delete this venue?");
      if (!confirm) return;
    
      try {
        const response = await fetch(API_DELETE_VENUE(id), {
          method: "DELETE",
          headers: headers(true),
        });
    
        if (response.status === 204) {
          navigate("/profile");
        } else {
          throw new Error("Failed to delete venue");
        }
      } catch (err) {
        setError("Could not delete venue.");
      }
    }
    

  if (loading) return <p className="p-4">Loading venue...</p>;
  if (!form) return <p className="p-4 text-red-600">Failed to load venue.</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Venue</h1>

      {success && <p className="text-green-600 mb-4">✅ Venue updated!</p>}
      {error && <p className="text-red-600 mb-4">⚠️ {error}</p>}

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

        <div className="grid grid-cols-2 gap-2 ">
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
        {/* Media */}
        <div className="space-y-4">
          {form.media.map((item, index) => (
            <div key={index} className="border p-3 rounded shadow-sm bg-white">
              <div className="grid grid-cols-2 gap-2 mb-2 ">
                <input
                  value={item.url}
                  onChange={(e) => handleMediaChange(e, index, "url")}
                  placeholder="Image URL"
                  className="border p-2 rounded"
                />
                <input
                  value={item.alt}
                  onChange={(e) => handleMediaChange(e, index, "alt")}
                  placeholder="Alt text"
                  className="border p-2 rounded"
                />
              </div>

              {item.url && (
                <img
                  src={item.url}
                  alt={item.alt || "Preview"}
                  className="w-full max-h-60 object-cover rounded border"
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

        <fieldset className="border p-2 rounded bg-white">
          <legend className="text-sm font-medium">Amenities</legend>
          {["wifi", "parking", "breakfast", "pets"].map((key) => (
            <label key={key} className="block">
              <input
                type="checkbox"
                name={`meta.${key}`}
                checked={form.meta?.[key] || false}
                onChange={handleChange}
              />{" "}
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
          ))}
        </fieldset>

        <fieldset className="border p-2 rounded bg-white">
          <legend className="text-sm font-medium">Location</legend>
          {["address", "city", "zip", "country", "continent"].map((key) => (
            <input
              key={key}
              name={`location.${key}`}
              value={form.location?.[key] || ""}
              onChange={handleChange}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              className="w-full border p-2 rounded mb-2"
            />
          ))}
        </fieldset>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="ml-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete Venue
        </button>
      </form>
    </div>
  );
}

export default EditVenue;


  