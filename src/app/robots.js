const BASE = "https://hafizportfolio.netlify.app";

export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
