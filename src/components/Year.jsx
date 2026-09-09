"use client";

import { useEffect, useState } from "react";

// The page is statically prerendered, so a bare new Date().getFullYear() in a
// server component would freeze at build time and go stale on Jan 1st.
const Year = () => {
  const [year, setYear] = useState(() => new Date().getFullYear());
  useEffect(() => setYear(new Date().getFullYear()), []);
  return <>{year}</>;
};

export default Year;
