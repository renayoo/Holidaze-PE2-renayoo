import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-red-600 text-white p-4 shadow-md">
      <nav className="flex gap-80">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/login" className="hover:underline">Log in</Link>
        <Link to="/register" className="hover:underline">Register</Link>
        <Link to="/profile" className="hover:underline">Profile</Link>
        <Link to="/create-venue" className="hover:underline">Create a venue</Link>
      </nav>
    </header>
  );
}

export default Header;
