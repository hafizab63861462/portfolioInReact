import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AnchorLink from "react-anchor-link-smooth-scroll";
import useMediaQuery from "../hooks/useMediaQuery";

const NavLink = ({ page, selectedPage, setSelectedPage }) => {
  const lowerCasePage = page.toLowerCase();
  const location = useLocation();
  const isHome = location.pathname === "/";

  if (isHome) {
    return (
      <AnchorLink
        className={`${
          selectedPage === lowerCasePage ? "text-yellow" : ""
        } hover:text-yellow transition duration-500`}
        href={`#${lowerCasePage}`}
        onClick={() => setSelectedPage(lowerCasePage)}
      >
        {page}
      </AnchorLink>
    );
  }

  return (
    <Link
      className={`${
        selectedPage === lowerCasePage ? "text-yellow" : ""
      } hover:text-yellow transition duration-500`}
      to={`/#${lowerCasePage}`}
      onClick={() => setSelectedPage(lowerCasePage)}
    >
      {page}
    </Link>
  );
};

const Navbar = ({ isTopOfPage, selectedPage, setSelectedPage }) => {
  const [isMenuToggled, setIsMenuToggled] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const location = useLocation();
  const isDetailPage = location.pathname.startsWith("/projects/");
  const navbarBackground =
    isTopOfPage && !isDetailPage
      ? ""
      : "bg-[#06001e] bg-opacity-95 backdrop-blur-md border-b border-white/5";

  const navItems = ["Home", "Skills", "Projects", "Gigs", "Contact"];

  return (
    <nav
      className={`${navbarBackground} z-40 w-full fixed top-0 py-6 transition-all duration-500`}
    >
      <div className="flex items-center justify-between mx-auto w-5/6">
        <Link
          to="/"
          className="font-playfair text-3xl font-bold hover:text-yellow transition duration-300"
          onClick={() => setSelectedPage("home")}
        >
          Software Engineer
        </Link>

        {/* DESKTOP NAV */}
        {isDesktop ? (
          <div className="flex justify-between gap-16 font-opensans text-sm font-semibold">
            {navItems.map((page) => (
              <NavLink
                key={page}
                page={page}
                selectedPage={selectedPage}
                setSelectedPage={setSelectedPage}
              />
            ))}
          </div>
        ) : (
          <button
            className="rounded-full p-2 border border-white/20 hover:border-white/50 transition duration-300"
            style={{ background: "rgba(255,255,255,0.05)" }}
            onClick={() => setIsMenuToggled(!isMenuToggled)}
          >
            <img alt="menu-icon" src="../assets/menu-icon.svg" />
          </button>
        )}

        {/* MOBILE MENU POPUP */}
        {!isDesktop && isMenuToggled && (
          <div
            className="fixed right-0 bottom-0 h-full w-[300px] border-l border-white/10"
            style={{ background: "#06001e" }}
          >
            <div className="flex justify-end p-12">
              <button onClick={() => setIsMenuToggled(!isMenuToggled)}>
                <img alt="close-icon" src="../assets/close-icon.svg" />
              </button>
            </div>

            <div className="flex flex-col gap-10 ml-[33%] text-2xl text-white">
              {navItems.map((page) => (
                <NavLink
                  key={page}
                  page={page}
                  selectedPage={selectedPage}
                  setSelectedPage={(p) => {
                    setSelectedPage(p);
                    setIsMenuToggled(false);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
