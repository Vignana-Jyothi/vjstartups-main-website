import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { Shield, AlertTriangle } from "lucide-react";
import { useAdminAuth, AdminUser } from "../context/AdminAuthContext";

const AdminLogin = () => {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:6220";

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      if (data.user.role !== "admin") {
        setError("Access denied. You do not have admin privileges.");
        setLoading(false);
        return;
      }

      if (!data.user.adminToken) {
        setError("No admin session token received. Contact the administrator.");
        setLoading(false);
        return;
      }

      login(data.user as AdminUser);
      navigate("/", { replace: true });
    } catch {
      setError("Could not reach the server. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050508] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/5 blur-3xl" />
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-violet-900/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-indigo-900/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-600/20 border border-violet-500/30 mb-4 shadow-lg shadow-violet-900/30">
            <Shield className="w-8 h-8 text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Panel</h1>
          <p className="text-sm text-[#64748b] mt-1.5">VJ Startups — Restricted Access</p>
        </div>

        {/* Card */}
        <div className="admin-card text-center space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-white mb-1">Sign In</h2>
            <p className="text-sm text-[#64748b]">
              Use your authorized Google account to access the admin dashboard.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-red-950/40 border border-red-800/40 text-left">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Google Sign In */}
          <div className="flex justify-center">
            {loading ? (
              <div className="flex items-center gap-2 text-[#64748b] text-sm">
                <div className="spinner" />
                Verifying...
              </div>
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google sign-in failed. Check your client ID configuration.")}
                theme="filled_black"
                shape="pill"
                size="large"
                text="signin_with"
              />
            )}
          </div>

          <p className="text-xs text-[#475569]">
            Only authorized admin accounts can log in. Contact{" "}
            <span className="text-violet-400">makhamishitagupta@gmail.com</span>{" "}
            for access.
          </p>
        </div>

        {/* Back to main site */}
        <p className="text-center mt-6">
          <a
            href="https://hub.vjstartup.com"
            className="text-xs text-[#475569] hover:text-[#94a3b8] transition-colors"
          >
            ← Back to main site
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
