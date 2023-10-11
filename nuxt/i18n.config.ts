import type { LangDictionary, LangList } from './libs/types'
import en from './locales/en'
import ru from './locales/ru'

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
