import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import Header from "./Header";
import Footer from "./Footer";
import MobileCTA from "./MobileCTA";

export default function Layout() {
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <div className="h-[100dvh] bg-[#070B13] text-white font-sans selection:bg-[#2D7DFF] selection:text-white flex flex-col overflow-hidden relative">
      <Header />
      <main 
        id="main-scroll"
        ref={mainRef}
        className="flex-1 overflow-y-auto w-full scroll-smooth pt-16 pb-[70px] md:pb-0"
      >
        <Outlet />
        <Footer />
      </main>
      <MobileCTA />
    </div>
  );
}
