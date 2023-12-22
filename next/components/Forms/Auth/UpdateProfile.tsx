import React from 'react';

import { getUpdatedValues, makeErrorText } from '../../../lib/functions';
import { IUser } from '../../../lib/types';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addAlert, setProfile } from '../../../store/slices/appSlice';
import FormActions from '../FormActions';
import TextFieldStyled from '../FormTextFieldStyled';
import FormBoxStyled from '../FormBoxStyled';
import { ROUTES } from '../../../lib/constants';
import authApi from '../../../store/api/authApi';
import useRights from '../../../hooks/useRights';
import dictionary from '../../../locales/dictionary';
import useLang from '../../../hooks/useLang';
import useT from 'hooks/useT';

const UpdateProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const lang = useLang();
  const t = useT();
  const profile = useAppSelector((store) => store.app.profile);
  const newProfile = React.useRef(profile);
  const [update, updateReq] = authApi.useUpdateProfileMutation();
  const [name, setName] = React.useState(profile?.name || '');
  const rights = useRights(ROUTES.api.auth.profile);

  const updateHandler = (event: React.FormEvent<HTMLFormElement>) => {
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

  React.useEffect(() => {
    if (updateReq.isLoading) {
      return;
    }
    if (updateReq.data === false || updateReq.error) {
      dispatch(
        addAlert({
          type: 'error',
          text: makeErrorText(updateReq.error, lang.current),
        })
      );
    }
    if (updateReq.data) {
      dispatch(setProfile(newProfile.current));
      dispatch(
        addAlert({ type: 'success', text: dictionary[lang.current].success })
      );
    }
  }, [updateReq.data, updateReq.error, updateReq.isLoading, dispatch, lang]);

  return (
    <FormBoxStyled onSubmit={updateHandler}>
      <TextFieldStyled
        required
        name="name"
        type="text"
        label={t.name}
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
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
