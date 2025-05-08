import { FC } from 'react';

import Form from '@/shared/ui/Form/Form';
import FormButton from '@/shared/ui/Form/FormButton';
import useTranslate from '@/shared/hooks/useTranslate';
import FormAlert from '@/shared/ui/Form/FormAlert';

const SignUpSuccessForm: FC<{
  onClose?: () => void;
}> = ({ onClose }) => {
  const t = useTranslate();

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onClose?.();
  };

  return (
    <Form onSubmit={submitHandler}>
      <FormAlert severity="success">{t.registrationSuccessText}</FormAlert>
      <FormButton type="submit" fullWidth>
        {t.signIn}
      </FormButton>
    </Form>
  );
};
export default SignUpSuccessForm;
