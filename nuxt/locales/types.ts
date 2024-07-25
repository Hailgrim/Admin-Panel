import type dictionary from '~/locales/dictionary'
import type en from '~/locales/en'

export type LangList = keyof typeof dictionary;
export type LangDictionary = typeof en;
