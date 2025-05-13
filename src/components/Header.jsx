import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { clearAuthUser } from "../utils/auth";

function Header() {
  const user = useAuth();

  function handleLogout() {
    clearAuthUser();
    window.location.href = "/";
  }

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <nav className="flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex gap-6">
          <Link to="/" className="hover:underline">Home</Link>

          {!user && (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          )}

          {user && (
            <>
              <Link to="/profile" className="hover:underline">Profile</Link>
              {user.data?.venueManager && (
                <Link to="/create-venue" className="hover:underline">Create Venue</Link>
              )}
              <button onClick={handleLogout} className="hover:underline ml-2">Logout</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
