import 'server-only';

import d from '@/locales/dictionary';

const getT = async (locale?: string) =>
  locale && locale in d ? d[locale as keyof typeof d] : d['en'];
export default getT;
