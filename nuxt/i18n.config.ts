import en from './locales/en'
import ru from './locales/ru'
import type { LangDictionary, LangList } from './utils/types'

const messages: Record<LangList, LangDictionary> = {
  en,
  ru,
}

export default defineI18nConfig(() => ({
  legacy: false,
  locale: en.langCode,
  fallbackLocale: en.langCode,
  messages,
}))
