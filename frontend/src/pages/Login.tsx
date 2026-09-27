import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { BrandMark } from "@/components/site/SiteChrome";
import "@/components/design-system/page-hero.css";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";
import { GOOGLE_CLIENT_ID } from "@/config/google";

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
    <section className="auth">
      <div className="auth-statement">
        <span className="auth-meta">VJ Startups / Member access</span>
        <h1>Sign in.<br /><em>Start building.</em></h1>
        <p>One Google sign-in opens the whole platform: problems worth solving, ideas in progress, the startup journey and the people building alongside you.</p>
      </div>

      <div className="auth-panel">
        <BrandMark />
        <p className="auth-lede">Join the innovation ecosystem at VNRVJIET.</p>
        <div className="auth-google">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => {
              console.log("Google OAuth error — check client ID in .env");
              alert("Google login failed. Check that VITE_GOOGLE_CLIENT is set correctly in frontend/.env");
            }}
            theme="filled_black"
            shape="pill"
            size="large"
            text="continue_with"
          />
        </div>
        <p className="auth-legal">
          By continuing, you agree to our <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>.
        </p>
      </div>
    </section>
  );
};

// The Google Identity script is ~100 KB and only this page needs it, so the provider lives
// here instead of wrapping the whole app.
const LoginPage = () => (
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <Login />
  </GoogleOAuthProvider>
);

export default LoginPage;
