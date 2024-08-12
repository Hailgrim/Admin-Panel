import { FC, FormEvent, useEffect, useMemo, useState } from 'react';

import Form from '@/shared/ui/Form/Form';
import FormButton from '@/shared/ui/Form/FormButton';
import { PASSWORD_REGEX, ROUTES } from '@/shared/lib/constants';
import useT from '@/shared/hooks/useT';
import useLang from '@/shared/hooks/useLang';
import d from '@/shared/locales/dictionary';
import useRights from '@/shared/hooks/useRights';
import { useAppDispatch } from '@/shared/store/hooks';
import { makeErrorText, testString } from '@/shared/lib/utils';
import { addAlert } from '@/shared/store/main/main';
import FormPassword from '@/shared/ui/Form/FormPassword';
import profileApi from '@/shared/api/profile/profileApi';

const UpdatePasswordForm: FC = () => {
  const dispatch = useAppDispatch();
  const lang = useLang();
  const t = useT();
  const [update, { data, isLoading, error }] =
    profileApi.useUpdatePasswordMutation();
  const rights = useRights(ROUTES.api.profile);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const passwordIsValid = useMemo(
    () => testString(PASSWORD_REGEX, newPassword),
    [newPassword]
  );

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (passwordIsValid) {
      if (oldPassword === newPassword) {
        dispatch(addAlert({ type: 'warning', text: t.nothingToUpdate }));
      } else {
        update({ oldPassword, newPassword });
      }
    } else {
      dispatch(addAlert({ type: 'warning', text: t.unknownError }));
    }
  };

  useEffect(() => {
    if (error) {
      dispatch(
        addAlert({
          type: 'error',
          text: makeErrorText(error, lang.current),
        })
      );
    }
  }, [dispatch, error, lang]);

  useEffect(() => {
    if (data) {
      dispatch(addAlert({ type: 'success', text: d[lang.current].success }));
    }
  }, [data, dispatch, lang]);

  return (
    <Form onSubmit={submitHandler}>
      <FormPassword
        name="old-password"
        label={t.oldPassword}
        value={oldPassword}
        onChange={(event) => setOldPassword(event.currentTarget.value)}
      />
      <FormPassword
        required
        name="new-password"
        label={t.newPassword}
        value={newPassword}
        onChange={(event) => setNewPassword(event.currentTarget.value)}
        helperText={t.passwordValidation}
        color={passwordIsValid ? 'success' : 'error'}
        error={!passwordIsValid && newPassword.length > 0}
      />
      <FormButton
        type="submit"
        color="success"
        disabled={!rights.updating}
        loading={isLoading}
      >
        {t.update}
      </FormButton>
    </Form>
  );
};
export default UpdatePasswordForm;
