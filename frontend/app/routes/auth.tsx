import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { signIn, isAuthenticated } from "~/lib/api";

//  register API call
const registerUser = async (username: string, password: string) => {
  const response = await fetch("http://localhost:8000/api/auth/register/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || "Registration failed");
  }
  return response.json();
};

const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegister, setIsRegister] = useState(false); // ✅ toggle mode
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
      if (isRegister) {
        await registerUser(username.trim(), password);
      }
      // after register, sign in automatically
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
        <h1 className="text-3xl font-bold mb-4">
          {isRegister ? "Create Account" : "Sign In"}
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          {isRegister
            ? "Create a new account to get started."
            : "Enter your username and password to continue."}
        </p>
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
            {isLoading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
          </button>
        </form>

        {/*toggle between login and register */}
        <p className="text-sm text-center text-gray-600 mt-4">
          {isRegister ? "Already have an account?" : "Don't have an account?"}
          <button
            className="text-blue-600 font-semibold ml-1 cursor-pointer"
            onClick={() => { setIsRegister(!isRegister); setError(null); }}
          >
            {isRegister ? "Sign In" : "Register"}
          </button>
        </p>
      </div>
    </main>
  );
};

export default Auth;