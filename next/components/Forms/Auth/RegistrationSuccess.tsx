import { useRouter } from 'next/router';
import React from 'react';

import lang from '../../../lib/lang';
import { useAppSelector } from '../../../store/hooks';
import AuthAlert from '../../AuthLayout/AuthAlert';
import AuthButtonStyled from '../../AuthLayout/AuthButtonStyled';
import FormBoxStyled from '../FormBoxStyled';
import { ROUTES } from '../../../lib/constants';

const RegistrationSuccess: React.FC<{
  callback?: () => void;
}> = ({ callback }) => {
  const router = useRouter();
  const userLang = useAppSelector(store => store.app.userLang);

  const formHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (callback) {
      callback();
    }
    router.push(ROUTES.auth.signIn);
  };

  return (
    <FormBoxStyled onSubmit={formHandler}>
      <AuthAlert severity="success" text={lang.get(userLang)?.registrationSuccessText} />
      <AuthButtonStyled>
        {lang.get(userLang)?.signIn}
      </AuthButtonStyled>
    </FormBoxStyled>
  );
};
export default RegistrationSuccess;
