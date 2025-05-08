import { useEffect, useRef } from 'react';

import useTranslate from './useTranslate';

const useTranslateRef = () => {
  const translate = useTranslate();
  const translateRef = useRef(translate);

  useEffect(() => {
    translateRef.current = translate;
  }, [translate]);

  return translateRef;
};
export default useTranslateRef;
