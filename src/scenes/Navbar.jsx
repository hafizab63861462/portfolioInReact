"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  "Home",
  "Skills",
  "Projects",
  "Gigs",
  "Book a Meeting",
  "Contact",
];

const toSlug = (page) =>
  page === "Book a Meeting" ? "book-meeting" : page.toLowerCase();

const NavLink = ({ page, selectedPage, setSelectedPage, isHome }) => {
  const slug = toSlug(page);
  const className = `${
    selectedPage === slug ? "text-yellow" : ""
  } hover:text-yellow transition duration-500`;

  // On the home page a plain in-page anchor is enough — the browser handles
  // the smooth scroll via `scroll-behavior` in globals.css. Elsewhere we need
  // a real navigation back to "/" first.
  if (isHome) {
    return (
      <a
        className={className}
        href={`#${slug}`}
        onClick={() => setSelectedPage(slug)}
      >
        {page}
      </a>
    );
  }

  return (
    <Link
      className={className}
      href={`/#${slug}`}
      onClick={() => setSelectedPage(slug)}
    >
      {page}
    </Link>
  );
};

const Navbar = () => {
  // Both of these used to live in App.js. Every reader and writer is inside
  // this subtree, so keeping them here lets the root layout stay a server
  // component — and stops a scroll event from re-rendering the whole page.
  const [selectedPage, setSelectedPage] = useState("home");
  const [isTopOfPage, setIsTopOfPage] = useState(true);
  const [isMenuToggled, setIsMenuToggled] = useState(false);

  const pathname = usePathname();
  const isHome = pathname === "/";
  const isDetailPage = pathname.startsWith("/projects/");

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

  const navbarBackground =
    isTopOfPage && !isDetailPage
      ? ""
      : "bg-[#06001e] bg-opacity-95 backdrop-blur-md border-b border-white/5";

  return (
    <nav
      className={`${navbarBackground} z-40 w-full fixed top-0 py-6 transition-all duration-500`}
    >
      <div className="flex items-center justify-between mx-auto w-5/6">
        <Link
          href="/"
          className="font-playfair text-3xl font-bold hover:text-yellow transition duration-300"
          onClick={() => setSelectedPage("home")}
        >
          Software Engineer
        </Link>

        {/* DESKTOP NAV — CSS breakpoint, not useMediaQuery, so the
            prerendered HTML matches the client on desktop (no flash).
            NOTE: sm: is 768px in this config, not md:. */}
        <div className="hidden sm:flex justify-between gap-8 xl:gap-12 font-opensans text-sm font-semibold">
          {NAV_ITEMS.map((page) => (
            <NavLink
              key={page}
              page={page}
              isHome={isHome}
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
          ))}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          className="sm:hidden rounded-full p-2 border border-white/20 hover:border-white/50 transition duration-300"
          style={{ background: "rgba(255,255,255,0.05)" }}
          aria-label="Open navigation menu"
          aria-expanded={isMenuToggled}
          onClick={() => setIsMenuToggled(!isMenuToggled)}
        >
          <img alt="" aria-hidden="true" src="/assets/menu-icon.svg" />
        </button>

        {/* MOBILE MENU POPUP */}
        {isMenuToggled && (
          <div
            className="sm:hidden fixed right-0 bottom-0 h-full w-[300px] border-l border-white/10"
            style={{ background: "#06001e" }}
          >
            <div className="flex justify-end p-12">
              <button
                aria-label="Close navigation menu"
                onClick={() => setIsMenuToggled(!isMenuToggled)}
              >
                <img alt="" aria-hidden="true" src="/assets/close-icon.svg" />
              </button>
            </div>

            <div className="flex flex-col gap-10 ml-[33%] text-2xl text-white">
              {NAV_ITEMS.map((page) => (
                <NavLink
                  key={page}
                  page={page}
                  isHome={isHome}
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
