import d from './locales/dictionary';
import en from './locales/en';

export default defineI18nConfig(() => ({
  legacy: false,
  locale: en.langCode,
  fallbackLocale: en.langCode,
  messages: d,
}));
