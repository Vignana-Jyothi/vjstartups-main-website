import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PlaneLayout from "./components/PlaneLayout";
import ProjectsPage from "./pages/ProjectsPage";
import BoardPage from "./pages/BoardPage";

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PlaneLayout />}>
          <Route index element={<ProjectsPage />} />
          <Route path="projects/:id" element={<BoardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
