import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminAuthProvider, useAdminAuth } from "./context/AdminAuthContext";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import UsersPage from "./pages/UsersPage";
import StartupsPage from "./pages/StartupsPage";
import IdeasPage from "./pages/IdeasPage";
import ProblemsPage from "./pages/ProblemsPage";
import AdminLogin from "./pages/AdminLogin";

const ProtectedAdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading, isAdmin } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050508]">
        <div className="spinner" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppContent = () => (
  <Routes>
    <Route path="/login" element={<AdminLogin />} />
    <Route
      path="/"
      element={
        <ProtectedAdminRoute>
          <AdminLayout />
        </ProtectedAdminRoute>
      }
    >
      <Route index element={<Dashboard />} />
      <Route path="users" element={<UsersPage />} />
      <Route path="startups" element={<StartupsPage />} />
      <Route path="ideas" element={<IdeasPage />} />
      <Route path="problems" element={<ProblemsPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const App = () => (
  <AdminAuthProvider>
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  </AdminAuthProvider>
);

export default App;
