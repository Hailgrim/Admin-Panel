import { d } from './dictionary';
import type { TLangDictionary, TLangList } from './types';

/**
 * @param {LangList} lang Desired language
 * @returns {LangDictionary} Dictionary in the desired language
 */
export const getT = (lang?: string): TLangDictionary =>
  lang && lang in d ? d[lang as TLangList] : d['en'];
