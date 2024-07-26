import d from '@/shared/locales/dictionary';
import { useAppSelector } from '../store/hooks';

const useT = () => {
  const language = useAppSelector((store) => store.main.language);
  return d[language];
};
export default useT;
