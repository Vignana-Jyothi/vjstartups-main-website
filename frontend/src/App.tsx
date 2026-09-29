import { Toaster } from "@/components/ui/toaster";
import { PageTransition } from "./components/site/PageTransition";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import Layout from "./components/Layout";
import Landing from "./landing/Landing";
import { UserProvider } from "../src/pages/UserContext";

const queryClient = new QueryClient();

const Journey = lazy(() => import("./pages/Journey"));
const Problems = lazy(() => import("./pages/Problems"));
const ProblemDetail = lazy(() => import("./pages/ProblemDetail"));
const SubmitProblem = lazy(() => import("./pages/SubmitProblem"));
const UpdateProblemForm = lazy(() => import("./pages/UpdateProblemForm"));
const Ideas = lazy(() => import("./pages/Ideas"));
const IdeaDetail = lazy(() => import("./pages/IdeaDetail"));
const SubmitIdea = lazy(() => import("./pages/SubmitIdea"));
const IdeaValidation = lazy(() => import("./pages/IdeaValidation"));
const Programs = lazy(() => import("./pages/Programs"));
const ProgramDetail = lazy(() => import("./pages/ProgramDetail"));
const SuccessStories = lazy(() => import("./pages/SuccessStories"));
const StoryForm = lazy(() => import("./pages/StoryForm"));
const SuccessStoryDetail = lazy(() => import("./pages/SuccessStoryDetail"));
const Club = lazy(() => import("./pages/Club"));
const Startups = lazy(() => import("./pages/Startups"));
const StartupDetail = lazy(() => import("./pages/StartupDetail"));
const StartupForm = lazy(() => import("./pages/StartupForm"));
const Login = lazy(() => import("./pages/Login"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const AllChanges = lazy(() => import("./pages/AllChanges"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PostAnnouncement = lazy(() => import("./pages/PostAnnouncement"));
const NotFound = lazy(() => import("./pages/NotFound"));

const SITE_TITLE = "VJ Startups — Turn questions into ventures";

// Pages with a PageHero title themselves; these are the ones without one.
const ROUTE_TITLES: Record<string, string> = {
  "/journey": "Startup journey",
  "/login": "Log in",
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const title = ROUTE_TITLES[pathname] ?? (pathname.startsWith("/update-problem") ? "Update problem" : null);
    document.title = title ? `${title} — VJ Startups` : SITE_TITLE;
  }, [pathname]);
  return null;
};

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
            <ScrollToTop />
            <PageTransition />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route element={<Layout />}>
                <Route path="/journey" element={<Journey />} />
                <Route path="/problems" element={<Problems />} />
                <Route path="/problems/:id" element={<ProblemDetail />} />
                <Route path="/submit-problem" element={<SubmitProblem />} />
                <Route path="/update-problem/:id" element={<UpdateProblemForm />} />
                <Route path="/ideas" element={<Ideas />} />
                <Route path="/ideas/:slug" element={<IdeaDetail />} />
                <Route path="/submit-idea" element={<SubmitIdea />} />
                <Route path="/idea-validation" element={<IdeaValidation />} />
                <Route path="/programs" element={<Programs />} />
                <Route path="/programs/:id" element={<ProgramDetail />} />
                <Route path="/stories" element={<SuccessStories />} />
                <Route path="/stories/new" element={<StoryForm />} />
                <Route path="/stories/:id/edit" element={<StoryForm />} />
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
                <Route path="/announcements/new" element={<PostAnnouncement />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
