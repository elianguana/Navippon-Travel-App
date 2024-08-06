import { useMemo } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme.js";
import LoginPage from "./pages/LoginPage/Login.jsx";
import HomePage from "./pages/HomePage/Home.jsx";
import ProfilePage from "./pages/ProfilePage/Profile.jsx";
import ActivityDetails from "./pages/ActivitiesPage/ActivityDetails.jsx";
import ActivitiesPage from "./pages/ActivitiesPage/ActivitiesPage.jsx";
import AboutUsPage from "./pages/AboutUsPage/AboutUsPage.jsx";
import TripsWidget from "./pages/widgets/TripsWidget.jsx";
import TripView from "./components/TripView.jsx";
import BlogPage from "./pages/BlogPage/BlogPage.jsx";
import FilteredCategoriesPage from "./pages/ActivitiesPage/FilteredCategoriesPage.jsx";
import FilteredPrefecturePage from "./pages/ActivitiesPage/FilteredPrefecturePage.jsx";
import AdminPanel from "./pages/AdminPage/AdminPanel.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import ActivityForm from "./pages/ActivitiesPage/ActivityForm.jsx";
import useAuth from "./hooks/useAuth.js";
import NotFound from "./pages/NotFound.jsx";

function App() {
  const mode = useSelector((state) => state.mode);
  const { isAuthenticated, isAdmin } = useAuth();
  console.log("Is Authenticated:", isAuthenticated);
  console.log("Is Admin:", isAdmin);

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/posts" element={<BlogPage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route
              path="/activities/filtered-category/:categoryName"
              element={<FilteredCategoriesPage />}
            />
            <Route
              path="/activities/filtered-prefecture/:prefectureId"
              element={<FilteredPrefecturePage />}
            />
            <Route path="/trips" element={<TripsWidget />} />
            <Route path="/trips/:tripId" element={<TripView />} />
            <Route path="/activities/:id" element={<ActivityDetails />} />
            <Route path="/create-activity" element={<ActivityForm />} />
            <Route path="/edit-activity/:id" element={<ActivityForm />} />
          </Route>
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route element={<PrivateRoute requiredRole="admin" />}>
            <Route path="/admin" element={<AdminPanel />} />
          </Route>{" "}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
