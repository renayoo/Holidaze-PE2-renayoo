import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Header() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    function handleChange() {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    }

    window.addEventListener("userChanged", handleChange);
    return () => window.removeEventListener("userChanged", handleChange);
  }, []);

  function handleLogout() {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    window.dispatchEvent(new Event("userChanged"));
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