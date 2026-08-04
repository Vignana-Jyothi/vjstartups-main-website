import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";
import GalaxyBackground from "@/components/GalaxyBackground";
import vjLogo from "@/assets/vj-logo.png";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleGoogleLogin = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return;

    try {
      const backendUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_AUTH_URL || "http://localhost:6220";

      const res = await fetch(`${backendUrl}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.user) {
        console.error("Login failed:", data.message || "Unknown error");
        alert("Login failed: " + (data.message || "Please try again."));
        return;
      }

      console.log("Logged in user:", data.user);
      setUser(data.user);
      navigate("/");

    } catch (err) {
      console.error("Network error during login:", err);
      alert("Could not reach the server. Make sure the backend is running on port 6220.");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4">
      <GalaxyBackground />
      <div className="absolute inset-0 bg-gradient-to-br from-vj-surface/95 via-black/90 to-purple-950/40" />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900/80 p-8 text-center shadow-2xl backdrop-blur-md">
        <img
          src={vjLogo}
          alt="VJ Startups"
          className="mx-auto mb-4 h-20 w-auto"
        />
        <h1 className="font-playfair text-2xl font-bold text-white md:text-3xl">
          VJ Startups
        </h1>
        <p className="mb-8 mt-2 text-sm text-zinc-400">
          Join the innovation ecosystem
        </p>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => {
              console.log("Google OAuth error — check client ID in .env");
              alert("Google login failed. Check that VITE_GOOGLE_CLIENT is set correctly in frontend/.env");
            }}
          />
        </div>

        <p className="mt-8 text-sm text-zinc-500">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="text-vj-accent hover:underline">
            Terms
          </Link>{" "}
          &{" "}
          <Link to="/privacy" className="text-vj-accent hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
