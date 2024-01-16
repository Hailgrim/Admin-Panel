import { FC } from 'react';
import { useRouter } from 'next/navigation';

import Form from '@/components/Form/Form';
import FormButton from '@/components/Form/FormButton';
import useT from '@/hooks/useT';
import FormAlert from '@/components/Form/FormAlert';
import { ROUTES } from '@/lib/constants';

const SignUpSuccess: FC<{
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
export default SignUpSuccess;
