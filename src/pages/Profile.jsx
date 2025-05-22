import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_PROFILE_BY_NAME } from "../api/constants";
import { headers } from "../api/headers";
import BookingCard from "../components/BookingCard";
import YourVenues from "../components/YourVenues";
import { getAuthUser, updateAuthUser } from "../utils/auth";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const query = useQuery();
  const navigate = useNavigate();
  const storedUser = getAuthUser();
  const urlUsername = query.get("username");
  const fallbackUsername = storedUser?.data?.name || storedUser?.name;
  const userName = urlUsername || fallbackUsername;
  const isOwnProfile = userName === fallbackUsername;

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

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
        if (isOwnProfile) {
          updateAuthUser(json.data);
        }
        setForm({
          bio: json.data.bio || "",
          avatarUrl: json.data.avatar?.url || "",
          avatarAlt: json.data.avatar?.alt || json.data.name,
          bannerUrl: json.data.banner?.url || "",
          bannerAlt: json.data.banner?.alt || "Banner",
          venueManager: json.data.venueManager || false,
        });
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

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

      updateAuthUser(json.data);
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
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {successMessage && (
        <p className="text-green-600 font-semibold text-center">{successMessage}</p>
      )}

      <div className="relative">
        <img
          src={profile.banner?.url || "https://placehold.co/1200x300"}
          alt={profile.banner?.alt || "Banner"}
          className="w-full h-48 md:h-64 object-cover rounded-xl"
        />
        <div className="absolute -bottom-10 left-6">
          <img
            src={profile.avatar?.url || "https://placehold.co/80x80"}
            alt={profile.avatar?.alt || profile.name}
            className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white shadow-md object-cover"
          />
        </div>
      </div>

      <div className="mt-12 px-4">
        <h1 className="text-3xl font-pacifico text-[var(--color-button-turq)] mb-5">
          {profile.name}
        </h1>
        <p className="text-sm text-gray-600 mb-5">{profile.email}</p>

        {!isOwnProfile && (
          <button
            onClick={() => navigate("/profile")}
            className="text-sm text-blue-600 hover:underline mb-6"
          >
            ← Back to my profile
          </button>
        )}

        {isOwnProfile && editing ? (
          <div className="space-y-3">
            {["bio", "avatarUrl", "avatarAlt", "bannerUrl", "bannerAlt"].map((field) => (
              <input
                key={field}
                name={field}
                value={form[field]}
                onChange={handleChange}
                placeholder={field.replace(/([A-Z])/g, " $1")}
                className="w-full border p-2 rounded bg-white"
              />
            ))}
            <label className="flex items-center gap-2 text-sm">
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
                className="bg-[var(--color-button-turq)] hover:bg-[#107c77] text-white px-4 py-2 rounded-full"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-full"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 italic mb-4">
              {profile.bio || "No bio available."}
            </p>
            <ul className="text-sm text-gray-800 space-y-1 mb-6">
              <li>🏷️ Role: {profile.venueManager ? "Venue Manager" : "Customer"}</li>
              <li>🏡 Venues: {profile._count?.venues ?? 0}</li>
            </ul>
            {isOwnProfile && (
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={() => setEditing(true)}
                  className="bg-yellow-400 text-white px-4 py-2 rounded-full"
                >
                  Edit Profile
                </button>
                {profile.venueManager && (
                  <button
                    onClick={() => navigate("/create-venue")}
                    className="bg-green-600 text-white px-4 py-2 rounded-full"
                  >
                    Create Venue
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {isOwnProfile && profile.bookings?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-pacifico text-[var(--color-button-turq)] mb-4">
            📆 Your Bookings
          </h2>
          {profile.bookings.map((b) => (
            <BookingCard key={b.id} booking={b} onCancel={handleBookingCancel} />
          ))}
        </div>
      )}

      {profile.venueManager && (
        <>
          {profile.venues?.length > 0 ? (
            <YourVenues
              venues={profile.venues}
              onVenueDeleted={isOwnProfile ? handleVenueDeleted : null}
              readOnly={!isOwnProfile}
            />
          ) : (
            <p className="text-gray-500 italic text-sm mt-6">
              {isOwnProfile
                ? "You haven’t created any venues yet."
                : `${profile.name} hasn’t published any venues yet.`}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default Profile;

