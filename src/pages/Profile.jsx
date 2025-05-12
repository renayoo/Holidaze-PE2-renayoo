import { useEffect, useState } from "react";
import { headers } from "../api/headers";
import { API_PROFILE_BY_NAME } from "../api/constants";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userName = storedUser?.data?.name;

  useEffect(() => {
    async function fetchProfile() {
      if (!userName) return;

      try {
        const response = await fetch(API_PROFILE_BY_NAME(userName), {
          headers: headers(),
        });

        const json = await response.json();

        if (json.errors) {
          console.error("API error:", json.errors);
          setProfile(null);
        } else {
          setProfile(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [userName]);

  if (!userName) {
    return <p className="p-4">You must be logged in to view your profile.</p>;
  }

  if (loading) {
    return <p className="p-4">Loading profile...</p>;
  }

  if (!profile) {
    return <p className="p-4">No profile found.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Banner */}
      {profile.banner?.url && (
        <img
          src={profile.banner.url}
          alt={profile.banner.alt || "Banner"}
          className="w-full h-48 object-cover rounded mb-4"
        />
      )}

      {/* Avatar og info */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={profile.avatar?.url || "https://placehold.co/80x80"}
          alt={profile.avatar?.alt || profile.name}
          className="w-20 h-20 rounded-full border"
        />
        <div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-sm text-gray-600">{profile.email}</p>
          <p className="text-sm text-gray-500">
            {profile.bio || "No bio available."}
          </p>
        </div>
      </div>

      {/* Statistikk */}
      <ul className="text-sm text-gray-700 mt-2 space-y-1">
        <li>🏷️ Role: {profile.venueManager ? "Venue Manager" : "Customer"}</li>
        <li>🏡 Venues: {profile._count?.venues ?? 0}</li>
        <li>📆 Bookings: {profile._count?.bookings ?? 0}</li>
      </ul>
    </div>
  );
}

export default Profile;
