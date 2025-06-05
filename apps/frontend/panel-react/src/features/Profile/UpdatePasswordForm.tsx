import { FC, FormEvent, useEffect, useMemo, useState } from 'react';

import FormBase from '@/shared/ui/Form/FormBase';
import FormButton from '@/shared/ui/Form/FormButton';
import useRights from '@/shared/hooks/useRights';
import { useAppDispatch } from '@/shared/store/hooks';
import { addAlert } from '@/shared/store/main/main';
import FormPassword from '@/shared/ui/Form/FormPassword';
import profileApi from '@/shared/api/profile/profileApi';
import { getErrorText, PASSWORD_REGEX, ROUTES, testString } from '@ap/shared';
import useTranslate from '@/shared/hooks/useTranslate';
import useTranslateRef from '@/shared/hooks/useTranslateRef';
import useLanguageRef from '@/shared/hooks/useLanguageRef';

const UpdatePasswordForm: FC = () => {
  const dispatch = useAppDispatch();
  const lRef = useLanguageRef();
  const tRef = useTranslateRef();
  const t = useTranslate();
  const [update, { isSuccess, isLoading, error }] =
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
          text: getErrorText(error, lRef.current),
        })
      );
    }
  }, [dispatch, error, lRef]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(addAlert({ type: 'success', text: tRef.current.success }));
    }
  }, [isSuccess, dispatch, tRef]);

  return (
    <FormBase onSubmit={submitHandler}>
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
    </FormBase>
  );
};
export default UpdatePasswordForm;
