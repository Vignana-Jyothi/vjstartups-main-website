import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { BrandMark } from "@/components/site/SiteChrome";
import "@/components/design-system/page-hero.css";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";
import { API_BASE } from "@/config/api";
import { useSiteConfig } from "@/data/siteConfig";
import { toast } from "@/components/ui/use-toast";

const failed = (description: string) => toast({ title: "Couldn't sign you in", description, variant: "destructive" });

function GoogleButton() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleGoogleLogin = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return;
    try {
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success || !data.user) {
        failed(data.message || "Please try again.");
        return;
      }
      setUser(data.user);
      navigate("/");
    } catch {
      failed("The server couldn't be reached. Check your connection and try again.");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleLogin}
      onError={() => failed("Google sign-in didn't complete. Please try again.")}
      theme="filled_black"
      shape="pill"
      size="large"
      text="continue_with"
    />
  );
}

// The Google Identity script is ~100 KB and only this page needs it, so the provider lives
// here instead of wrapping the whole app. Its client id comes from the backend (see siteConfig).
const Login = () => {
  const config = useSiteConfig();

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
          {!config ? (
            <p className="auth-lede">Loading sign-in…</p>
          ) : config.googleClientId ? (
            <GoogleOAuthProvider clientId={config.googleClientId}>
              <GoogleButton />
            </GoogleOAuthProvider>
          ) : (
            <p className="auth-lede">Sign-in isn't available right now. Please try again later.</p>
          )}
        </div>
        <p className="auth-legal">
          By continuing, you agree to our <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>.
        </p>
      </div>
    </section>
  );
};

export default Login;
