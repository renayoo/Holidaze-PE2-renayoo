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
              <Link to="/login" className="hover:underline py-2" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="hover:underline py-2 mb-4" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}

          {user && (
            <>
              <Link to="/profile" className="hover:underline py-2" onClick={() => setMenuOpen(false)}>Profile</Link>
              {user.data?.venueManager && (
                <Link to="/create-venue" className="hover:underline py-2" onClick={() => setMenuOpen(false)}>Create Venue</Link>
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

      {/* Mobile menu panel with animation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out transform ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } px-6 flex flex-col text-base font-pacifico bg-header-dark-turqoiuse pt-2`}
      >
        {!user && (
          <>
            <Link to="/login" className="hover:underline py-2 border-b border-white/20" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/register" className="hover:underline py-3 border-b border-white/20" onClick={() => setMenuOpen(false)}>Register</Link>
          </>
        )}

        {user && (
          <>
            <Link to="/profile" className="hover:underline py-2 border-b border-white/20" onClick={() => setMenuOpen(false)}>Profile</Link>
            {user.data?.venueManager && (
              <Link to="/create-venue" className="hover:underline py-2 border-b border-white/20" onClick={() => setMenuOpen(false)}>Create Venue</Link>
            )}
            <button onClick={handleLogout} className="hover:underline text-left py-3">Logout</button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;

