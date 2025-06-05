import { useEffect, useRef } from 'react';

import { useAppSelector } from '../store/hooks';

const useLanguageRef = () => {
  const language = useAppSelector((store) => store.main.language);
  const languageRef = useRef(language);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  return languageRef;
};
export default useLanguageRef;
