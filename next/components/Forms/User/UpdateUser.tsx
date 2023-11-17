import React from 'react';
import { useRouter } from 'next/router';

import usersApi from '../../../store/api/usersApi';
import { getUpdatedValues, makeErrorText } from '../../../lib/functions';
import { IUser } from '../../../lib/types';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addAlert } from '../../../store/slices/appSlice';
import FormActions from '../FormActions';
import TextFieldStyled from '../../Other/TextFieldStyled';
import FormBoxStyled from '../FormBoxStyled';
import FormCheckbox from '../FormCheckbox';
import { ROUTES } from '../../../lib/constants';
import useRights from '../../../hooks/useRights';
import dictionary from '../../../locales/dictionary';

const UpdateUser: React.FC<{
  data: IUser;
}> = ({ data }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const language = useAppSelector(store => store.app.language);
  const userLang = React.useRef(language);
  const t = useAppSelector(store => store.app.t);
  const [update, updateReq] = usersApi.useUpdateMutation();
  const [destroy, deleteReq] = usersApi.useDeleteMutation();
  const [email, setEmail] = React.useState(data.email);
  const [name, setName] = React.useState(data.name);
  const [enabled, setEnabled] = React.useState(data.enabled);
  const rights = useRights(ROUTES.api.users);

  const updateHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedValues = getUpdatedValues<IUser>(
      data,
      { email, name, enabled },
    );
    if (Object.keys(updatedValues).length == 0) {
      dispatch(addAlert({ type: 'warning', text: t.nothingToUpdate }));
    } else {
      update({ id: data.id, fields: updatedValues });
    }
  };

  React.useEffect(() => { userLang.current = language }, [language]);

  React.useEffect(() => {
    if (updateReq.isLoading) {
      return;
    }
    if (updateReq.data === false || updateReq.error) {
      dispatch(addAlert({ type: 'error', text: makeErrorText(updateReq.error, userLang.current) }));
    }
    if (updateReq.data) {
      dispatch(addAlert({ type: 'success', text: dictionary[userLang.current].success }));
    }
  }, [updateReq.data, updateReq.error, updateReq.isLoading,
    dispatch]);

  React.useEffect(() => {
    if (deleteReq.isLoading) {
      return;
    }
    if (deleteReq.data === false || deleteReq.error) {
      dispatch(addAlert({ type: 'error', text: makeErrorText(deleteReq.error, userLang.current) }));
    }
    if (deleteReq.data) {
      dispatch(addAlert({ type: 'success', text: dictionary[userLang.current].success }));
      router.push(ROUTES.panel.users);
    }
  }, [deleteReq.data, deleteReq.error, deleteReq.isLoading, dispatch, router]);

  return (
    <FormBoxStyled onSubmit={updateHandler}>
      <TextFieldStyled
        required
        name="email"
        type="email"
        label={t.email}
        value={email}
        onChange={event => setEmail(event.currentTarget.value)}
      />
      <TextFieldStyled
        required
        name="name"
        type="text"
        label={t.name}
        value={name}
        onChange={event => setName(event.currentTarget.value)}
      />
      <FormCheckbox
        label={t.enabled}
        name="enabled"
        value="enabled"
        checked={enabled}
        onChange={() => setEnabled(!enabled)}
      />
      {data && (
        <FormActions
          update={{
            loading: updateReq.isLoading,
            disabled: !rights.updating,
          }}
          destroy={{
            action: () => destroy(data.id),
            loading: deleteReq.isLoading,
            disabled: !rights.deleting,
          }}
        />
      )}
    </FormBoxStyled>
  );
};
export default UpdateUser;
