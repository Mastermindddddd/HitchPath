import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation }  from "react-router-dom";
import ButtonGradient from "./assets/svg/ButtonGradient";
import { AuthProvider } from "./AuthContext";
import RegisterPage from "./pages/register";
import Login from "./pages/login";
import Layout from "./layout";
import UserInfoForm from "./pages/UserInfoForm";
import LearningPath from "./pages/LearningPath";
import Chatbot from "./pages/Chatbot";
import SpecificTopicPath from "./pages/SpecificTopicPath";
import { initializeGA, logPageView } from "./googleAnalytics";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Contact from "./pages/ContactUs";
import SavedResources from "./pages/SavedResources";

const App = () => {
  useEffect(() => {
    initializeGA();
    logPageView(); 
  }, []);

  return (
    <AuthProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AnalyticsTracker />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<Login />} />
            {/*<Route path="/dashboard" element={<DashboardPage />} />*/}
            <Route path="/user-info" element={<UserInfoForm />} />
            <Route path="/learning-path" element={<LearningPath />} />
            <Route path="/guidemate-AI" element={<Chatbot />} />
            <Route path="/generate-path" element={<SpecificTopicPath />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/saved-resources" element={<SavedResources />} />
          </Route>
        </Routes>
      <ButtonGradient />
      </GoogleOAuthProvider>
    </AuthProvider>
  );
};

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Ensure GA is initialized before sending page view
    if (window.gtag) {
      logPageView(location.pathname);
    }
  }, [location]);

  return null;
};


export default App;
