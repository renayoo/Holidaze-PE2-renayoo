// API base
export const API_BASE = "https://v2.api.noroff.dev";
export const API_KEY = "4de79ef0-5e26-4d1b-8a61-9e6e653eb26b"; 

// 🔐 Authentication
export const API_AUTH = `${API_BASE}/auth`;
export const API_AUTH_REGISTER = `${API_AUTH}/register`;
export const API_AUTH_LOGIN = `${API_AUTH}/login`;

// 🏠 Venues
export const API_VENUES = `${API_BASE}/holidaze/venues`; // Get all venues
export const API_VENUE_BY_ID = (id) => `${API_VENUES}/${id}?_bookings=true&_owner=true`; // Get single venue
export const API_CREATE_VENUE = `${API_VENUES}`; // POST new venue
export const API_UPDATE_VENUE = (id) => `${API_VENUES}/${id}`; // PUT venue
export const API_DELETE_VENUE = (id) => `${API_VENUES}/${id}`; // DELETE venue

// 📅 Bookings
export const API_BOOKINGS = `${API_BASE}/holidaze/bookings`; // Get all bookings
export const API_CREATE_BOOKING = `${API_BOOKINGS}`; // POST a booking
export const API_BOOKING_BY_ID = (id) => `${API_BOOKINGS}/${id}`; // GET/DELETE single booking
export const API_VENUE_BOOKINGS = (id) => `${API_VENUES}/${id}/bookings`; // View booking on profile

// 👤 Profiles
export const API_PROFILES = `${API_BASE}/holidaze/profiles`;
export const API_PROFILE_BY_NAME = (name) => `${API_PROFILES}/${name}`; // Get a specific profile
export const API_PROFILE_BOOKINGS = (name) => `${API_PROFILES}/${name}/bookings`; // Get user's bookings
export const API_PROFILE_VENUES = (name) => `${API_PROFILES}/${name}/venues`; // Get user's venues
