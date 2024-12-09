import Collaboration from "./components/Collaboration";
import Benefits from "./components/Benefits";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";

import { Outlet } from "react-router-dom";

import { useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();

  const isRootRoute = location.pathname === "/";

  return (
    <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden flex flex-col min-h-screen">
      <Header />
      {isRootRoute && (
        <>
          <Hero />
          <Benefits />
          <Collaboration />
          <CTA />
          <Services />
        </>
      )}
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
