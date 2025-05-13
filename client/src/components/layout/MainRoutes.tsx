import { useAuth } from "@/contexts/AuthContext";
import AuthCallbackPage from "@/pages/AuthCallbackPage";
import Campaigns from "@/pages/Campaigns";
import Dashboard from "@/pages/Dashboard";
import Feedback from "@/pages/Feedback";
import FeedbackForm from "@/pages/FeedbackForm";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Settings from "@/pages/Settings";
import Signup from "@/pages/Signup";
import { Navigate, Outlet, useRoutes } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

// Pages
export const MainRoutes = () => {
  const { isAuthenticated } = useAuth();

  const authenticatedRoutes = [
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "", element: <Navigate to="/dashboard" replace /> },
        { path: "/c/:slug", element: <FeedbackForm /> },
        { path: "login", element: <Navigate to="/dashboard" replace /> },
        { path: "signup", element: <Navigate to="/dashboard" replace /> },
        { path: "*", element: <NotFound /> },
      ],
    },
    {
      path: "/dashboard",
      element: <Layout />,
      children: [
        { path: "", element: <Dashboard /> },
        { path: "campaigns", element: <Campaigns /> },
        { path: "feedback", element: <Feedback /> },
        { path: "settings", element: <Settings /> },
      ],
    },
  ];

  const unauthenticatedRoutes = [
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "", element: <Index /> },
        { path: "login", element: <Login /> },
        { path: "signup", element: <Signup /> },
        { path: "auth/callback", element: <AuthCallbackPage /> },
        { path: "c/:slug", element: <FeedbackForm /> },
        { path: "*", element: <NotFound /> },
      ],
    },
    {
      path: "dashboard",
      children: [
        { path: "", element: <Navigate to="/signup" replace /> },
        { path: "*", element: <Navigate to="/signup" replace /> },
      ],
    },
  ];

  const allRoutes = isAuthenticated
    ? authenticatedRoutes
    : unauthenticatedRoutes;

  return useRoutes(allRoutes);
};
