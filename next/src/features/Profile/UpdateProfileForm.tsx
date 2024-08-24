import { FC, FormEvent, useEffect, useMemo, useRef, useState } from 'react';

import Form from '@/shared/ui/Form/Form';
import FormField from '@/shared/ui/Form/FormField';
import FormButton from '@/shared/ui/Form/FormButton';
import { NAME_REGEX, ROUTES } from '@/shared/lib/constants';
import useT from '@/shared/hooks/useT';
import useLang from '@/shared/hooks/useLang';
import d from '@/shared/locales/dictionary';
import useRights from '@/shared/hooks/useRights';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import {
  getUpdatedValues,
  makeErrorText,
  testString,
} from '@/shared/lib/utils';
import { addAlert, setProfile } from '@/shared/store/main/main';
import { IUser } from '@/shared/api/users/types';
import profileApi from '@/shared/api/profile/profileApi';

const UpdateProfileForm: FC = () => {
  const dispatch = useAppDispatch();
  const lang = useLang();
  const t = useT();
  const [update, { data, isLoading, error }] =
    profileApi.useUpdateProfileMutation();
  const rights = useRights(ROUTES.api.profile);
  const profile = useAppSelector((store) => store.main.profile);
  const newProfile = useRef(profile);
  const [newData, setNewData] = useState(
    (() => {
      const { email, ...fields } = profile || ({} as Partial<IUser>);
      return fields;
    })()
  );
  const nameIsValid = useMemo(
    () => newData.name && testString(NAME_REGEX, newData.name),
    [newData]
  );

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (profile && nameIsValid) {
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
    if (newProfile.current) {
      newProfile.current = { ...newProfile.current, ...newData };
    }
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
    <Form onSubmit={submitHandler}>
      {profile?.googleId && (
        <FormField
          name="googleId"
          label={t.googleId}
          value={profile.googleId}
          disabled
        />
      )}
      <FormField
        required
        name="name"
        label={t.name}
        value={newData?.name || ''}
        onChange={(event) =>
          newData && setNewData({ ...newData, name: event.currentTarget.value })
        }
        helperText={t.nameValidation}
        color={nameIsValid ? 'success' : 'error'}
        error={!nameIsValid && (newData?.name || '').length > 0}
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
