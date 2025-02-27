/**
 * @type {import('next-i18next').UserConfig}
 */

module.exports = {
  debug: process.env.NODE_ENV === "development",
  // debug: false,
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr", "es"],
  },

  localePath:
    typeof window === "undefined"
      ? require("path").resolve("./public/locales")
      : "/locales",

  reloadOnPrerender: process.env.NODE_ENV === "development",
};
