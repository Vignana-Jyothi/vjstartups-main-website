import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";
import { PageHero } from "@/components/design-system/PageHero";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleGoogleLogin = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      const token = credentialResponse.credential;

      const res = await fetch(`${import.meta.env.VITE_AUTH_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      console.log("Logged in user:", data.user);

      setUser(data.user);
      navigate("/");
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
                onError={() => console.log("Login Failed")}
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
