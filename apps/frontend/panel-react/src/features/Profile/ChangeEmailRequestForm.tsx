import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import FormBase from '@/shared/ui/Form/FormBase';
import FormField from '@/shared/ui/Form/FormField';
import FormButton from '@/shared/ui/Form/FormButton';
import CustomModal from '@/shared/ui/CustomModal/CustomModal';
import profileApi from '@/shared/api/profile/profileApi';
import useRights from '@/shared/hooks/useRights';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { addAlert } from '@/shared/store/main/main';
import ChangeEmailConfirmForm from './ChangeEmailConfirmForm';
import { EMAIL_REGEX, getErrorText, ROUTES, testString } from '@ap/shared';
import useTranslate from '@/shared/hooks/useTranslate';
import useLanguageRef from '@/shared/hooks/useLanguageRef';

const ChangeEmailRequestForm: FC = () => {
  const dispatch = useAppDispatch();
  const lRef = useLanguageRef();
  const t = useTranslate();
  const [confirmModal, setConfirmModal] = useState(false);
  const [changeEmailRequest, { isSuccess, error, isLoading }] =
    profileApi.useChangeEmailRequestMutation();
  const rights = useRights(ROUTES.api.profile);
  const profile = useAppSelector((store) => store.main.profile);
  const [email, setEmail] = useState(profile?.email || '');
  const emailIsValid = useMemo(() => testString(EMAIL_REGEX, email), [email]);
  const onClose = useCallback(() => setConfirmModal(false), []);

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (emailIsValid) {
      if (email === profile?.email) {
        dispatch(addAlert({ type: 'warning', text: t.nothingToUpdate }));
      } else {
        changeEmailRequest({ newEmail: email });
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
      setConfirmModal(true);
    }
  }, [isSuccess]);

  return (
    <>
      <FormBase onSubmit={submitHandler}>
        <FormField
          required
          name="email"
          type="email"
          label={t.email}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          helperText={t.emailValidation}
          color={emailIsValid ? 'success' : 'error'}
          error={!emailIsValid && email.length > 0}
          disabled={isLoading}
        />
        <FormButton
          type="submit"
          color="success"
          disabled={!rights.updating}
          loading={isLoading}
        >
          {t.change}
        </FormButton>
      </FormBase>
      <CustomModal open={confirmModal} title={t.changeEmail} onClose={onClose}>
        <ChangeEmailConfirmForm
          email={email}
          onClose={onClose}
        />
      </CustomModal>
    </>
  );
};
export default ChangeEmailRequestForm;
