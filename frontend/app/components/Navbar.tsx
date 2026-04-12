import { Link, useNavigate } from "react-router";
import { isAuthenticated, signOut } from "~/lib/api";

const Navbar = () => {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();

  const handleLogout = () => {
    signOut();
    navigate("/auth?next=/", { replace: true });
  };

  return (
    <nav className="navbar">
      <Link to="/">
        <p className="text-2xl font-bold text-gradient">CareerMate</p>
      </Link>

      <div className="flex items-center gap-3">
        <Link to="/upload" className="primary-button w-fit">
          Upload Resume
        </Link>

        {loggedIn ? (
          <button onClick={handleLogout} className="primary-button w-fit">
            Logout
          </button>
        ) : (
          <Link to="/auth?next=/" className="primary-button w-fit">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

