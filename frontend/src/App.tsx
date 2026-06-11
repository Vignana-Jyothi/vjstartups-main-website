import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Problems from "./pages/Problems";
import ProblemDetail from "./pages/ProblemDetail";
import UpdateProblemForm from "./pages/UpdateProblemForm";
import Ideas from "./pages/Ideas";
import IdeaDetail from "./pages/IdeaDetail";
import IdeaValidation from "./pages/IdeaValidation";
import Programs from "./pages/Programs";
import ProgramDetail from "./pages/ProgramDetail";
import SuccessStories from "./pages/SuccessStories";
import SuccessStoryDetail from "./pages/SuccessStoryDetail";
import Club from "./pages/Club";
import Startups from "./pages/Startups";
import StartupDetail from "./pages/StartupDetail";
import StartupForm from "./pages/StartupForm";
import Login from "./pages/Login";
import Leaderboard from "./pages/Leaderboard";
import AllChanges from "./pages/AllChanges";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";
import { UserProvider } from "../src/pages/UserContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* Wrap the entire app with UserProvider */}
        <UserProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/problems" element={<Problems />} />
                <Route path="/problems/:id" element={<ProblemDetail />} />
                <Route path="/update-problem/:id" element={<UpdateProblemForm />} />
                <Route path="/ideas" element={<Ideas />} />
                <Route path="/ideas/:slug" element={<IdeaDetail />} />
                <Route path="/idea-validation" element={<IdeaValidation />} />
                <Route path="/programs" element={<Programs />} />
                <Route path="/programs/:id" element={<ProgramDetail />} />
                <Route path="/programs/:programId/success-stories" element={<SuccessStories />} />
                <Route path="/programs/:programId/success-stories/:storyId" element={<SuccessStoryDetail />} />
                <Route path="/club" element={<Club />} />
                <Route path="/startups" element={<Startups />} />
                <Route path="/startups/:id" element={<StartupDetail />} />
                <Route path="/startup-form" element={<StartupForm />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/changes" element={<AllChanges />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/login" element={<Login />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </UserProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
