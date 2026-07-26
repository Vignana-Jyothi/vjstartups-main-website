import { Link } from "react-router-dom";
import { CheckSquare, LogOut, ExternalLink } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth, PlaneUser } from "../context/AuthContext";

const PlaneHeader = () => {
  const { user, setUser, logout } = useAuth();
  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:6220";

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return;
    try {
      const res = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user as PlaneUser);
      }
    } catch {
      console.error("Google login failed");
    }
  };

  return (
    <header className="plane-header flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Brand */}
      <Link to="/" className="flex items-center gap-2.5 no-underline">
        <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center shadow-lg shadow-sky-900/40">
          <CheckSquare className="w-4.5 h-4.5 text-white" />
        </div>
        <div>
          <span className="font-bold text-sm text-white tracking-tight">VJ Plane</span>
          <span className="text-[10px] text-sky-400 font-mono ml-2 px-1.5 py-0.5 rounded bg-sky-950/60 border border-sky-800/40">
            PUBLIC TASK BOARD
          </span>
        </div>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <a
          href="https://hub.vjstartup.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-[#64748b] hover:text-[#38bdf8] transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Main Hub</span>
        </a>

        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img
                src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0ea5e9&color=fff`}
                alt={user.name}
                className="w-7 h-7 rounded-full border border-sky-500/30"
              />
              <span className="text-xs font-medium text-[#f8fafc] hidden sm:inline">{user.name}</span>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-[#64748b] hover:text-red-400 hover:bg-white/5 transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="scale-90">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.error("Google login failed")}
              type="icon"
              shape="circle"
              theme="filled_black"
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default PlaneHeader;
