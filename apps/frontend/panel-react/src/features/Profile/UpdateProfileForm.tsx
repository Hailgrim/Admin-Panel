import { FC, FormEvent, useEffect, useMemo, useRef, useState } from 'react';

import FormBase from '@/shared/ui/Form/FormBase';
import FormField from '@/shared/ui/Form/FormField';
import FormButton from '@/shared/ui/Form/FormButton';
import useRights from '@/shared/hooks/useRights';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { addAlert, setProfile } from '@/shared/store/main/main';
import profileApi from '@/shared/api/profile/profileApi';
import useTranslate from '@/shared/hooks/useTranslate';
import useLanguageRef from '@/shared/hooks/useLanguageRef';
import useTranslateRef from '@/shared/hooks/useTranslateRef';
import {
  getErrorText,
  getUpdatedValues,
  NAME_REGEX,
  ROUTES,
  testString,
} from '@ap/shared/src/libs';
import { IUser } from '@ap/shared/src/types';

const UpdateProfileForm: FC = () => {
  const dispatch = useAppDispatch();
  const lRef = useLanguageRef();
  const tRef = useTranslateRef();
  const t = useTranslate();
  const [update, { isSuccess, isLoading, error }] =
    profileApi.useUpdateProfileMutation();
  const rights = useRights(ROUTES.api.profile);
  const profile = useAppSelector((store) => store.main.profile);
  const newProfile = useRef(profile);
  const [newData, setNewData] = useState({ ...profile });
  const nameIsValid = useMemo(
    () => newData.name && testString(NAME_REGEX, newData.name),
    [newData]
  );

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (profile && nameIsValid) {
      const updatedValues = getUpdatedValues<IUser>(profile, newData);

      if (Object.keys(updatedValues).length === 0) {
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
          text: getErrorText(error, lRef.current),
        })
      );
    }
  }, [dispatch, error, lRef]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(setProfile(newProfile.current));
      dispatch(addAlert({ type: 'success', text: tRef.current.success }));
    }
  }, [isSuccess, dispatch, tRef]);

  return (
    <FormBase onSubmit={submitHandler}>
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
        value={newData.name || ''}
        onChange={(event) =>
          newData && setNewData({ ...newData, name: event.target.value })
        }
        helperText={t.nameValidation}
        color={nameIsValid ? 'success' : 'error'}
        error={!nameIsValid && (newData.name || '').length > 0}
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
export default UpdateProfileForm;
