"use client";

const businessLinks = [
  {
    label: "Upwork",
    badge: "Top Rated",
    href: "https://www.upwork.com/freelancers/~0199a33c600994d315?viewMode=1&s=1110580755107926016",
    color: "#6FDA44",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.546-1.405 0-2.543-1.14-2.543-2.546V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z" />
      </svg>
    ),
  },
  {
    label: "Fiverr",
    badge: "Seller",
    href: "https://www.fiverr.com/hafizabdulla377?up_rollout=true",
    color: "#1DBF73",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M23.004 15.588a.995.995 0 1 0 .002-1.99.995.995 0 0 0-.002 1.99zm-1.132-5.808c-1.093 0-2.134.46-2.944 1.28-.74.75-1.188 1.72-1.268 2.74H4.57V9.22h2.394V7.19H2.39v5.61H0v2.39h2.39v5.61h2.18v-5.61h1.96v-.002h11.42c.083.843.42 1.65.99 2.293.78.88 1.87 1.35 3.052 1.35 2.33 0 4.008-1.63 4.008-3.87 0-2.23-1.68-3.87-4.128-3.87h-.87zm-9.54-5.86c-1.093 0-1.98.887-1.98 1.98s.887 1.98 1.98 1.98 1.98-.887 1.98-1.98-.887-1.98-1.98-1.98z" />
      </svg>
    ),
  },
];

const BusinessMediaIcons = () => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-6">
      {businessLinks.map(({ label, badge, href, color, svg }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 px-6 py-4 rounded-2xl border border-white/10
            transition-all duration-300 hover:scale-105 hover:border-white/20"
          style={{
            background: "rgba(255,255,255,0.04)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `0 4px 24px ${color}44`;
            e.currentTarget.style.borderColor = `${color}55`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
          }}
        >
          {/* icon circle */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: color + "22", color }}
          >
            {svg}
          </div>

          {/* text */}
          <div className="text-left">
            <p className="font-opensans font-semibold text-white text-sm leading-none mb-1">
              {label}
            </p>
            <p
              className="font-opensans text-xs font-semibold"
              style={{ color }}
            >
              {badge}
            </p>
          </div>

          {/* arrow */}
          <svg
            className="w-4 h-4 ml-2 opacity-40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </a>
      ))}
    </div>
  );
};

export default BusinessMediaIcons;
