import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import Form from '@/shared/ui/Form/Form';
import FormField from '@/shared/ui/Form/FormField';
import FormButton from '@/shared/ui/Form/FormButton';
import useT from '@/shared/hooks/useT';
import useLang from '@/shared/hooks/useLang';
import CustomModal from '@/shared/ui/CustomModal/CustomModal';
import { makeErrorText, testString } from '@/shared/lib/utils';
import profileApi from '@/shared/api/profile/profileApi';
import useRights from '@/shared/hooks/useRights';
import { EMAIL_REGEX, ROUTES } from '@/shared/lib/constants';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { addAlert } from '@/shared/store/main/main';
import ChangeEmailConfirmForm from './ChangeEmailConfirmForm';

const ChangeEmailRequestForm: FC = () => {
  const dispatch = useAppDispatch();
  const t = useT();
  const lang = useLang();
  const [confirmModal, setConfirmModal] = useState(false);
  const [changeEmailRequest, { data, error, isLoading, originalArgs }] =
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
        changeEmailRequest(email);
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
      setConfirmModal(true);
    }
  }, [data]);

  return (
    <>
      <Form onSubmit={submitHandler}>
        <FormField
          required
          name="email"
          type="email"
          label={t.email}
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          helperText={t.emailValidation}
          color={emailIsValid ? 'success' : 'error'}
          error={!emailIsValid && email.length > 0}
        />
        <FormButton
          type="submit"
          color="success"
          disabled={!rights.updating}
          loading={isLoading}
        >
          {t.change}
        </FormButton>
      </Form>
      <CustomModal open={confirmModal} title={t.changeEmail} onClose={onClose}>
        <ChangeEmailConfirmForm email={originalArgs || ''} onClose={onClose} />
      </CustomModal>
    </>
  );
};
export default ChangeEmailRequestForm;
