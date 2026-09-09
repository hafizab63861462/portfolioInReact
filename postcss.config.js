// Required by Next.js. Create React App auto-injected the Tailwind PostCSS
// plugin when it detected tailwind.config.js, which is why this file did not
// exist before the migration. Next does not do that.
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
