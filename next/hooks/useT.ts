import { useAppSelector } from '../store/hooks';
import dictionary from '../locales/dictionary';

const useT = () => {
  const language = useAppSelector((store) => store.app.language);
  return dictionary[language];
};
export default useT;
