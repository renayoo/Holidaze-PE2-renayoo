import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  API_PROFILE_BY_NAME,
  API_DELETE_VENUE,
} from "../api/constants";
import { headers } from "../api/headers";
import BookingCard from "../components/BookingCard";
import YourVenues from "../components/YourVenues";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userName = storedUser?.data?.name || storedUser?.name;

  async function fetchProfile() {
    if (!userName) return;

    try {
      const response = await fetch(
        `${API_PROFILE_BY_NAME(userName)}?_bookings=true&_venues=true&_venues_bookings=true`,
        { headers: headers() }
      );
      const json = await response.json();
      if (json.errors) {
        console.error("API error:", json.errors);
        setProfile(null);
      } else {
        setProfile(json.data);
        setForm({
          bio: json.data.bio || "",
          avatarUrl: json.data.avatar?.url || "https://placehold.co/80x80",
          avatarAlt: json.data.avatar?.alt || json.data.name,
          bannerUrl: json.data.banner?.url || "https://placehold.co/1200x300",
          bannerAlt: json.data.banner?.alt || "Banner",
          venueManager: json.data.venueManager || false,
        });

        const token = localStorage.getItem("accessToken");
        const updatedUser = {
          accessToken: token,
          data: {
            ...json.data,
          },
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("userChanged"));
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, [userName]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSaveChanges() {
    try {
      const response = await fetch(API_PROFILE_BY_NAME(userName), {
        method: "PUT",
        headers: headers(true),
        body: JSON.stringify({
          bio: form.bio,
          avatar: {
            url: form.avatarUrl,
            alt: form.avatarAlt,
          },
          banner: {
            url: form.bannerUrl,
            alt: form.bannerAlt,
          },
          venueManager: form.venueManager,
        }),
      });

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.errors?.[0]?.message || "Failed to update profile");
      }

      // ✅ Oppdater user etter endring
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const updatedUser = {
        ...currentUser,
        data: {
          ...currentUser.data,
          ...json.data,
        },
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("userChanged"));

      await fetchProfile();
      setEditing(false);
      setSuccessMessage("Profile updated successfully!");
    } catch (err) {
      alert(err.message);
    }
  }

  const handleBookingCancel = (bookingId) => {
    setProfile((prev) => ({
      ...prev,
      bookings: prev.bookings.filter((b) => b.id !== bookingId),
      _count: {
        ...prev._count,
        bookings: (prev._count?.bookings || 1) - 1,
      },
    }));
  };

  const handleVenueDeleted = (venueId) => {
    setProfile((prev) => ({
      ...prev,
      venues: prev.venues.filter((v) => v.id !== venueId),
      _count: {
        ...prev._count,
        venues: (prev._count?.venues || 1) - 1,
      },
    }));
  };

  if (loading) return <p className="p-4">Loading profile...</p>;
  if (!profile) return <p className="p-4">No profile found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {successMessage && (
        <p className="text-green-600 mb-2 font-semibold">{successMessage}</p>
      )}

      {!editing && (
        <img
          src={profile.banner?.url || "https://placehold.co/1200x300"}
          alt={profile.banner?.alt || "Banner"}
          className="w-full h-48 object-cover rounded mb-4"
        />
      )}

      <div className="flex items-center gap-4 mb-4">
        <img
          src={profile.avatar?.url || "https://placehold.co/80x80"}
          alt={profile.avatar?.alt || profile.name}
          className="w-20 h-20 rounded-full border"
        />
        <div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-sm text-gray-600">{profile.email}</p>
        </div>
      </div>

      {editing ? (
        <div className="space-y-3">
          <input
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Bio"
            className="w-full border p-2 rounded"
          />
          <input
            name="avatarUrl"
            value={form.avatarUrl}
            onChange={handleChange}
            placeholder="Avatar URL"
            className="w-full border p-2 rounded"
          />
          <input
            name="avatarAlt"
            value={form.avatarAlt}
            onChange={handleChange}
            placeholder="Avatar alt text"
            className="w-full border p-2 rounded"
          />
          <input
            name="bannerUrl"
            value={form.bannerUrl}
            onChange={handleChange}
            placeholder="Banner URL"
            className="w-full border p-2 rounded"
          />
          <input
            name="bannerAlt"
            value={form.bannerAlt}
            onChange={handleChange}
            placeholder="Banner alt text"
            className="w-full border p-2 rounded"
          />
          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              name="venueManager"
              checked={form.venueManager}
              onChange={handleChange}
            />
            Register as Venue Manager
          </label>

          <div className="flex gap-2">
            <button
              onClick={handleSaveChanges}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-2">
            {profile.bio || "No bio available."}
          </p>

          <ul className="text-sm text-gray-700 mt-2 space-y-1">
            <li>🏷️ Role: {profile.venueManager ? "Venue Manager" : "Customer"}</li>
            <li>🏡 Venues: {profile._count?.venues ?? 0}</li>
            <li>📆 Bookings: {profile._count?.bookings ?? 0}</li>
          </ul>

          <div className="mt-4 flex gap-4">
            <button
              onClick={() => setEditing(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit Profile
            </button>

            {profile.venueManager && (
              <button
                onClick={() => navigate("/create-venue")}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Create Venue
              </button>
            )}
          </div>
        </>
      )}

      {profile.bookings && profile.bookings.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
          {profile.bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleBookingCancel}
            />
          ))}
        </div>
      )}

      {profile.venueManager && profile.venues?.length > 0 && (
        <YourVenues
          venues={profile.venues}
          onVenueDeleted={handleVenueDeleted}
        />
      )}
    </div>
  );
}

export default Profile;




