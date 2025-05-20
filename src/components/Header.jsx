import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { clearAuthUser } from "../utils/auth";
import logo from "/assets/images/Holidaze-logo-forme.png";

function Header() {
  const user = useAuth();

  function handleLogout() {
    clearAuthUser();
    window.location.href = "/";
  }

  return (
    <header className="bg-header-dark-turqoiuse sticky top-0 z-50 text-white shadow-md">
      <nav className="font-pacifico flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
        <Link to="/">
          <img
            src={logo}
            alt="Holidaze logo"
            className="h-16 md:h-20 transition-opacity hover:opacity-90"
          />
        </Link>
        <div className="flex items-center gap-6 text-sm md:text-base font-medium">
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
              <button onClick={handleLogout} className="hover:underline">Logout</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
