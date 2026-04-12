import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { signIn, isAuthenticated } from "~/lib/api";

const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      const next = new URLSearchParams(location.search).get("next") || "/";
      navigate(next, { replace: true });
    }
  }, [location.search, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signIn(username.trim(), password);
      const next = new URLSearchParams(location.search).get("next") || "/";
      navigate(next, { replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex items-center justify-center">
      <div className="auth-panel p-8 rounded-3xl shadow-xl bg-white/90 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4">Sign In</h1>
        <p className="text-sm text-gray-600 mb-6">Enter your username and password to continue.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="font-semibold">Username</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="input-field"
              placeholder="Username"
              required
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-semibold">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="input-field"
              placeholder="Password"
              required
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="primary-button w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Auth;

