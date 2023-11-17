import { useEffect, useRef } from 'react';

import { useAppSelector } from '../store/hooks';

const useLang = () => {
  const language = useAppSelector(store => store.app.language);
  const userLang = useRef(language);
  useEffect(() => { userLang.current = language }, [language]);
  return userLang;
}
export default useLang;
