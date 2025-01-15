var en = require("./translations.en.json");
var zh = require("./translations.zh.json");

const i18n = {
  translations: {
    en,
    zh,
  },
  defaultLang: "zh",
  useBrowserDefault: true,
  languageDataStore: "query" || "localStorage",
};

module.exports = i18n;