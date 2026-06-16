import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";
import { PageHero } from "@/components/design-system/PageHero";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleGoogleLogin = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return;

    try {
      const backendUrl = import.meta.env.VITE_AUTH_URL || import.meta.env.VITE_API_BASE_URL;

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
    <div className="page-shell bg-vj-neutral/30">
      <PageHero
        eyebrow="Access"
        title="Welcome Back"
        description="Sign in to continue to your account."
      />

      <section className="page-section">
        <div className="section-container flex justify-center">
          <div className="section-panel w-full max-w-md p-8 text-center">
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => {
                  console.log("Google OAuth error — check client ID in .env");
                  alert("Google login failed. Check that VITE_GOOGLE_CLIENT is set correctly in frontend/.env");
                }}
              />
            </div>

            <p className="mt-8 text-sm text-vj-muted">
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
      </section>
    </div>
  );
};

export default Login;