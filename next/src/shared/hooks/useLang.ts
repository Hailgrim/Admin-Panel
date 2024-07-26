import { useEffect, useRef } from 'react';

import { useAppSelector } from '../store/hooks';

const useLang = () => {
  const language = useAppSelector((store) => store.main.language);
  const langRef = useRef(language);

  useEffect(() => {
    langRef.current = language;
  }, [language]);

  return langRef;
};
export default useLang;
