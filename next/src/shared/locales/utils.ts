import d from './dictionary';
import { LangDictionary, LangList } from './types';

/**
 * @param {LangList} lang Desired language
 * @returns {LangDictionary} Dictionary in the desired language
 */
export const getT = (lang?: LangList): LangDictionary =>
  lang && lang in d ? d[lang] : d['en'];
