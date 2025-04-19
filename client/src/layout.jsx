import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import WelcomeMessage from "./components/WelcomeMessage"; // Import the new component
import Collaboration from "./components/Collaboration";
import Benefits from "./components/Benefits";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import { Outlet } from "react-router-dom";
import CareerInvestmentShop from "./components/CareerInvestmentShop";

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
        <>
          <Hero />
          <Benefits />
          <Collaboration />
          <CTA />
          <CareerInvestmentShop />
          <Services />
          <Footer />
        </>
      )}
      <Outlet />
    </div>
  );
};

export default Layout;
