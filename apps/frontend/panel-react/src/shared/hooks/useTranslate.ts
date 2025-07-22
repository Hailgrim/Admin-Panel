import { getT } from '@ap/shared/src/locales';
import { useAppSelector } from '../store/hooks';

const useTranslate = () => {
  const language = useAppSelector((store) => store.main.language);
  return getT(language);
};
export default useTranslate;
