import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { clearAuthUser } from "../utils/auth";
import logo from "/assets/images/Holidaze-logo-forme.png";
import { useState } from "react";
import { Menu, X } from "lucide-react";

function Header() {
  const user = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    clearAuthUser();
    window.location.href = "/";
  }

  return (
    <header className="bg-header-dark-turqoiuse sticky top-0 z-50 text-white shadow-md">
      <nav className="font-pacifico max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/">
          <img
            src={logo}
            alt="Holidaze logo"
            className="h-16 md:h-20 transition-opacity hover:opacity-90"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm md:text-base font-medium">
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

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-3 text-sm font-pacifico font-medium bg-header-dark-turqoiuse">
          {!user && (
            <>
              <Link to="/login" className="hover:underline" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="hover:underline" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}

          {user && (
            <>
              <Link to="/profile" className="hover:underline" onClick={() => setMenuOpen(false)}>Profile</Link>
              {user.data?.venueManager && (
                <Link to="/create-venue" className="hover:underline" onClick={() => setMenuOpen(false)}>Create Venue</Link>
              )}
              <button onClick={handleLogout} className="hover:underline text-left">Logout</button>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
