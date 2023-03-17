import React from 'react';

import lang from '../../../libs/lang';
import { getUpdatedValues, isAllowed, makeErrorText } from '../../../libs/functions';
import { IUser } from '../../../libs/types';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addAlert } from '../../../store/slices/appSlice';
import FormActions from '../FormActions';
import TextFieldStyled from '../../Other/TextFieldStyled';
import FormBoxStyled from '../FormBoxStyled';
import { ROUTES } from '../../../libs/config';
import { Rights } from '../../../libs/constants';
import authApi from '../../../store/api/authApi';

const UpdateProfile: React.FC<{
  data: IUser;
}> = ({ data }) => {
  const dispatch = useAppDispatch();
  const userLang = useAppSelector(store => store.app.userLang);
  const profile = useAppSelector(store => store.app.profile);
  const [update, updateReq] = authApi.useUpdateProfileMutation();
  const [name, setName] = React.useState(data.name);

  const updateHandler = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const updatedValues = getUpdatedValues<IUser>(
      data,
      { name },
    );
    if (Object.keys(updatedValues).length == 0) {
      dispatch(addAlert({ type: 'warning', text: lang.get(userLang)?.nothingToUpdate }));
    } else {
      update({ id: data.id, fields: updatedValues });
    }
  };

  React.useEffect(() => {
    if (updateReq.isLoading) {
      return;
    }
    if (updateReq.data === false || updateReq.error) {
      dispatch(addAlert({ type: 'error', text: makeErrorText(updateReq.error, userLang) }));
    }
    if (updateReq.data) {
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
      {data && (
        <FormActions
          update={{
            loading: updateReq.isLoading,
            disabled: !isAllowed(ROUTES.panel.resources, Rights.Updating, profile?.roles),
          }}
        />
      )}
    </FormBoxStyled>
  );
};
export default UpdateProfile;
