import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getCurrentUsername, isAuthenticated, signOut } from "~/lib/api";

const WipeApp = () => {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const loggedIn = isAuthenticated();
    setAuthenticated(loggedIn);
    if (!loggedIn) {
      navigate("/auth?next=/wipe");
    }
  }, [navigate]);

  const handleLogout = () => {
    signOut();
    setAuthenticated(false);
    navigate("/auth?next=/wipe");
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Wipe App Data</h1>
      <p className="mb-4">This page is no longer connected to legacy local file storage.</p>
      <p className="mb-4">Authenticated as: {authenticated ? getCurrentUsername() : "Guest"}</p>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default WipeApp;