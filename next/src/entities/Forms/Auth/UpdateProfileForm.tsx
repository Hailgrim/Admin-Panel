import { FC, FormEvent, useEffect, useMemo, useRef, useState } from 'react';

import Form from '@/shared/kit/Form/Form';
import FormField from '@/shared/kit/Form/FormField';
import FormButton from '@/shared/kit/Form/FormButton';
import { NAME_REGEX, ROUTES } from '@/shared/lib/constants';
import useT from '@/shared/hooks/useT';
import useLang from '@/shared/hooks/useLang';
import d from '@/shared/locales/dictionary';
import useRights from '@/shared/hooks/useRights';
import authApi from '@/shared/api/auth/authApi';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import {
  getUpdatedValues,
  makeErrorText,
  testString,
} from '@/shared/lib/utils';
import { addAlert, setProfile } from '@/shared/store/main/main';
import { IUser } from '@/shared/api/users/types';

const UpdateProfileForm: FC = () => {
  const dispatch = useAppDispatch();
  const lang = useLang();
  const t = useT();
  const [update, { data, isLoading, error }] =
    authApi.useUpdateProfileMutation();
  const rights = useRights(ROUTES.api.auth.profile);
  const profile = useAppSelector((store) => store.main.profile);
  const newProfile = useRef<IUser | null>(profile);
  const [newData, setNewData] = useState<IUser | null>(profile);
  const nameIsValid = useMemo(
    () => newData && testString(NAME_REGEX, newData.name),
    [newData]
  );

  const formHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (profile && newData && nameIsValid) {
      const updatedValues = getUpdatedValues<IUser>(profile, newData);

      if (Object.keys(updatedValues).length == 0) {
        dispatch(addAlert({ type: 'warning', text: t.nothingToUpdate }));
      } else {
        update(updatedValues);
      }
    } else {
      dispatch(addAlert({ type: 'warning', text: t.unknownError }));
    }
  };

  useEffect(() => {
    newProfile.current = newData;
  }, [newData]);

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
      dispatch(setProfile(newProfile.current));
      dispatch(addAlert({ type: 'success', text: d[lang.current].success }));
    }
  }, [data, dispatch, lang]);

  return (
    <Form onSubmit={formHandler}>
      <FormField
        required
        name="name"
        type="text"
        label={t.name}
        value={newData?.name || ''}
        onChange={(event) =>
          newData && setNewData({ ...newData, name: event.currentTarget.value })
        }
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
export default UpdateProfileForm;
