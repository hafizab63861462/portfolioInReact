import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./scenes/Navbar";
import Footer from "./scenes/Footer";
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";
import { useEffect, useState } from "react";

function App() {
  const [selectedPage, setSelectedPage] = useState("home");
  const [isTopOfPage, setIsTopOfPage] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsTopOfPage(true);
        setSelectedPage("home");
      }
      if (window.scrollY !== 0) setIsTopOfPage(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <BrowserRouter>
      <div className="app bg-deep-blue">
        <Navbar
          isTopOfPage={isTopOfPage}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
        />
        <Routes>
          <Route
            path="/"
            element={
              <Home />
            }
          />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
