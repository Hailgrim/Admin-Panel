import { FC, useEffect, useRef, useState } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import FormBase from '@/shared/ui/Form/FormBase';
import FormButton from '@/shared/ui/Form/FormButton';
import FormField from '@/shared/ui/Form/FormField';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { addAlert, setProfile } from '@/shared/store/main/main';
import useRights from '@/shared/hooks/useRights';
import profileApi from '@/shared/api/profile/profileApi';
import { getErrorText, ROUTES } from '@ap/shared';
import useTranslate from '@/shared/hooks/useTranslate';
import useTranslateRef from '@/shared/hooks/useTranslateRef';
import useLanguageRef from '@/shared/hooks/useLanguageRef';

const ChangeEmailConfirmForm: FC<{
  email: string;
  onClose?: () => void;
}> = ({ email, onClose }) => {
  const dispatch = useAppDispatch();
  const lRef = useLanguageRef();
  const tRef = useTranslateRef();
  const t = useTranslate();
  const [changeEmailConfirm, { isSuccess, error, isLoading }] =
    profileApi.useChangeEmailConfirmMutation();
  const rights = useRights(ROUTES.api.profile);
  const profile = useAppSelector((store) => store.main.profile);
  const emailRef = useRef(email);
  const profileRef = useRef(profile);
  const [code, setCode] = useState('');

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    changeEmailConfirm({ code });
  };

  useEffect(() => {
    if (error) {
      switch ((error as FetchBaseQueryError).status) {
        case 404:
          dispatch(
            addAlert({
              type: 'error',
              text: tRef.current.wrongEmailOrCode,
            })
          );
          break;
        default:
          dispatch(
            addAlert({
              type: 'error',
              text: getErrorText(error, lRef.current),
            })
          );
          break;
      }
    }
  }, [error, tRef, lRef, dispatch]);

  useEffect(() => {
    if (isSuccess) {
      onClose?.();

      if (profileRef.current) {
        dispatch(
          setProfile({ ...profileRef.current, email: emailRef.current })
        );
      }
    }
  }, [isSuccess, onClose, dispatch]);

  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  return (
    <FormBase onSubmit={submitHandler}>
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
        loading={isLoading || isSuccess}
      >
        {t.confirm}
      </FormButton>
      <FormButton fullWidth color="error" onClick={onClose}>
        {t.close}
      </FormButton>
    </FormBase>
  );
};
export default ChangeEmailConfirmForm;
