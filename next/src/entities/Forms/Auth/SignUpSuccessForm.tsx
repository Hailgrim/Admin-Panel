import { FC } from 'react';
import { useRouter } from 'next/navigation';

import Form from '@/shared/kit/Form/Form';
import FormButton from '@/shared/kit/Form/FormButton';
import useT from '@/shared/hooks/useT';
import FormAlert from '@/shared/kit/Form/FormAlert';
import { ROUTES } from '@/shared/lib/constants';

const SignUpSuccessForm: FC<{
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
    <Form onSubmit={formHandler}>
      <FormAlert severity="success">{t.registrationSuccessText}</FormAlert>
      <FormButton type="submit" fullWidth>
        {t.signIn}
      </FormButton>
    </Form>
  );
};
export default SignUpSuccessForm;
