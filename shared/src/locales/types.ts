import { d } from './dictionary';
import type en from './en';

export type TLangDictionary = typeof en;
export type TLangList = keyof typeof d;
