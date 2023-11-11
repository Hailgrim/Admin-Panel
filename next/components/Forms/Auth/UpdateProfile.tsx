import React from 'react';

import lang from '../../../lib/lang';
import { getUpdatedValues, makeErrorText } from '../../../lib/functions';
import { IUser } from '../../../lib/types';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addAlert, setProfile } from '../../../store/slices/appSlice';
import FormActions from '../FormActions';
import TextFieldStyled from '../../Other/TextFieldStyled';
import FormBoxStyled from '../FormBoxStyled';
import { ROUTES } from '../../../lib/constants';
import authApi from '../../../store/api/authApi';
import useRights from '../../../hooks/useRights';

const UpdateProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const userLang = useAppSelector(store => store.app.userLang);
  const profile = useAppSelector(store => store.app.profile);
  const [update, updateReq] = authApi.useUpdateProfileMutation();
  const [name, setName] = React.useState(profile?.name || '');
  const rights = useRights(ROUTES.api.auth.profile);

  const updateHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (profile) {
      const updatedValues = getUpdatedValues<IUser>(
        profile,
        { name },
      );
      if (Object.keys(updatedValues).length == 0) {
        dispatch(addAlert({ type: 'warning', text: lang.get(userLang)?.nothingToUpdate }));
      } else {
        update(updatedValues);
      }
    } else {
      dispatch(addAlert({ type: 'warning', text: lang.get(userLang)?.unknownError }));
    }
  };

  React.useEffect(() => {
    if (updateReq.isLoading) {
      return;
    }
    if (updateReq.data === false || updateReq.error) {
      dispatch(addAlert({ type: 'error', text: makeErrorText(updateReq.error, userLang) }));
    }
    if (updateReq.data && profile) {
      dispatch(setProfile({ ...profile, name }));
      dispatch(addAlert({ type: 'success', text: lang.get(userLang)?.success }));
    }
  }, [
    updateReq.data, updateReq.error, updateReq.isLoading,
    dispatch, userLang,
  ]);

  return (
    <FormBoxStyled onSubmit={updateHandler}>
      <TextFieldStyled
        required
        name="name"
        type="text"
        label={lang.get(userLang)?.name}
        value={name}
        onChange={event => setName(event.currentTarget.value)}
      />
      <FormActions
        update={{
          loading: updateReq.isLoading,
          disabled: !rights.updating,
        }}
      />
    </FormBoxStyled>
  );
};
export default UpdateProfile;
