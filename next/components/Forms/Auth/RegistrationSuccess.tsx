import { useRouter } from 'next/router';
import React from 'react';

import AuthAlert from '../../AuthLayout/AuthAlert';
import AuthButtonStyled from '../../AuthLayout/AuthButtonStyled';
import FormBoxStyled from '../FormBoxStyled';
import { ROUTES } from '../../../lib/constants';
import useT from 'hooks/useT';

const RegistrationSuccess: React.FC<{
  callback?: () => void;
}> = ({ callback }) => {
  const router = useRouter();
  const t = useT();

  const formHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (callback) {
      callback();
    }
    router.push(ROUTES.auth.signIn);
  };

  return (
    <FormBoxStyled onSubmit={formHandler}>
      <AuthAlert severity="success" text={t.registrationSuccessText} />
      <AuthButtonStyled>{t.signIn}</AuthButtonStyled>
    </FormBoxStyled>
  );
};
export default RegistrationSuccess;
