import { FC, useEffect, useRef, useState } from 'react';

import Form from '@/shared/ui/Form/Form';
import FormButton from '@/shared/ui/Form/FormButton';
import useT from '@/shared/hooks/useT';
import FormField from '@/shared/ui/Form/FormField';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import useLang from '@/shared/hooks/useLang';
import d from '@/shared/locales/dictionary';
import { makeErrorText } from '@/shared/lib/utils';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { addAlert, setProfile } from '@/shared/store/main/main';
import useRights from '@/shared/hooks/useRights';
import { ROUTES } from '@/shared/lib/constants';
import profileApi from '@/shared/api/profile/profileApi';

const ChangeEmailConfirmForm: FC<{
  email: string;
  onClose?: () => void;
}> = ({ email, onClose }) => {
  const dispatch = useAppDispatch();
  const t = useT();
  const lang = useLang();
  const [changeEmail, { data, error, isLoading }] =
    profileApi.useChangeEmailMutation();
  const rights = useRights(ROUTES.api.profile);
  const profile = useAppSelector((store) => store.main.profile);
  const emailRef = useRef(email);
  const profileRef = useRef(profile);
  const [code, setCode] = useState('');

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    changeEmail({ code });
  };

  useEffect(() => {
    if (error) {
      switch ((error as FetchBaseQueryError).status) {
        case 404:
          dispatch(
            addAlert({
              type: 'error',
              text: d[lang.current].wrongEmailOrCode,
            })
          );
          break;
        default:
          dispatch(
            addAlert({
              type: 'error',
              text: makeErrorText(error, lang.current),
            })
          );
          break;
      }
    }
  }, [error, lang, dispatch]);

  useEffect(() => {
    if (data) {
      onClose?.();
      if (profileRef.current) {
        dispatch(
          setProfile({ ...profileRef.current, email: emailRef.current })
        );
      }
    }
  }, [data, onClose, dispatch]);

  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  return (
    <Form onSubmit={submitHandler}>
      <FormField
        required
        autoComplete="off"
        name="code"
        label={t.code}
        value={code}
        onChange={(event) => setCode(event.currentTarget.value)}
        helperText={`${t.codeFromEmail} (${email})`}
      />
      <FormButton
        type="submit"
        fullWidth
        disabled={!rights.updating}
        loading={isLoading || data}
      >
        {t.confirm}
      </FormButton>
      <FormButton fullWidth color="error" onClick={onClose}>
        {t.close}
      </FormButton>
    </Form>
  );
};
export default ChangeEmailConfirmForm;
