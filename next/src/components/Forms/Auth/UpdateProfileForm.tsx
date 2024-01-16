import { FC, FormEvent, useEffect, useRef, useState } from 'react';

import Form from '@/components/Form/Form';
import FormField from '@/components/Form/FormField';
import FormButton from '@/components/Form/FormButton';
import { ROUTES } from '@/lib/constants';
import useT from '@/hooks/useT';
import authApi from '@/store/api/authApi';
import { getUpdatedValues, makeErrorText } from '@/lib/functions';
import useLang from '@/hooks/useLang';
import { addAlert, setProfile } from '@/store/slices/appSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import d from '@/locales/dictionary';
import useRights from '@/hooks/useRights';
import { IUser } from '@/lib/types';

const UpdateProfileForm: FC = () => {
  const dispatch = useAppDispatch();
  const lang = useLang();
  const t = useT();
  const profile = useAppSelector((store) => store.app.profile);
  const newProfile = useRef(profile);
  const [update, { data, isLoading, error }] =
    authApi.useUpdateProfileMutation();
  const [name, setName] = useState(profile?.name || '');
  const rights = useRights(ROUTES.api.auth.profile);

  const formHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (profile) {
      const updatedValues = getUpdatedValues<IUser>(profile, { name });
      if (Object.keys(updatedValues).length == 0) {
        dispatch(addAlert({ type: 'warning', text: t.nothingToUpdate }));
      } else {
        if (newProfile.current) {
          newProfile.current.name = name;
        }
        update(updatedValues);
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
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
      />
      <FormButton
        type="submit"
        color="success"
        disabled={!rights.updating || isLoading}
      >
        {t.update}
      </FormButton>
    </Form>
  );
};
export default UpdateProfileForm;
