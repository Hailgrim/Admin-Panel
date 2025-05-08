export default defineI18nConfig(() => ({
  legacy: false,
  locale: getT().langCode,
  fallbackLocale: getT().langCode,
  messages: d,
}))
