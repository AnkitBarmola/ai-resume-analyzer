import { Link } from "react-router";
import { usePuterStore } from "~/lib/puter";

const Navbar = () => {
  const { auth } = usePuterStore();

  return (
    <nav className="navbar">
      <Link to="/">
        <p className="text-2xl font-bold text-gradient">CareerMate</p>
      </Link>

      <div className="flex items-center gap-3">
        <Link to="/upload" className="primary-button w-fit">
          Upload Resume
        </Link>

        {auth.isAuthenticated ? (
          <button onClick={auth.signOut} className="primary-button w-fit">
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
