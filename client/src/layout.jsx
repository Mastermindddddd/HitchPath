import React, { useState, useEffect, Suspense, lazy } from "react";
import { useLocation } from "react-router-dom";
import WelcomeMessage from "./components/WelcomeMessage"; // Import the new component
import Collaboration from "./components/Collaboration";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import Header from "./components/Header";
const Hero = lazy(() => import('./components/Hero'));
import Services from "./components/Services";
import HowItWorks from "./components/HowItWorks";
import CallToActionBanner from "./components/CallToActionBanner";
import ValueProposition from "./components/ValueProposition";
import { Outlet } from "react-router-dom";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const Layout = () => {
  const location = useLocation();
  const [showWelcome, setShowWelcome] = useState(false);
  const [userName, setUserName] = useState("");

  const isRootRoute = location.pathname === "/";

  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name && location.state?.fromLogin) {
      setUserName(name);
      setShowWelcome(true);
    }
  }, [location]);

  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden flex flex-col min-h-screen">
      <Header />
      {showWelcome && (
        <WelcomeMessage
          userName={userName}
          onDismiss={() => setShowWelcome(false)}
        />
      )}
      {isRootRoute && (
        <Suspense fallback={<LoadingSpinner />}>
        <>
          <Hero />
          <CallToActionBanner />
          <ValueProposition />
          <HowItWorks />
          <Collaboration />
          <CTA />
          {/*<CareerInvestmentShop />*/}
          <Services />
          <Footer />
        </>
        </Suspense>
      )}
      <Outlet />
    </div>
  );
};

export default Layout;
