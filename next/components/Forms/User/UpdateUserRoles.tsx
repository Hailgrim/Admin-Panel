import React from 'react';
import { Typography } from '@mui/material';

import usersApi from '../../../store/api/usersApi';
import { makeErrorText } from '../../../lib/functions';
import { IRole, IUser, IUsersRoles } from '../../../lib/types';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addAlert } from '../../../store/slices/appSlice';
import FormActions from '../FormActions';
import FormBoxStyled from '../FormBoxStyled';
import FormCheckbox from '../FormCheckbox';
import { ROUTES } from '../../../lib/constants';
import useRights from '../../../hooks/useRights';
import dictionary from '../../../locales/dictionary';

const UpdateUserRoles: React.FC<{
  user: IUser;
  roles: IRole[];
}> = ({ user, roles }) => {
  const dispatch = useAppDispatch();
  const language = useAppSelector(store => store.app.language);
  const userLang = React.useRef(language);
  const t = useAppSelector(store => store.app.t);
  const [update, updateReq] = usersApi.useUpdateRolesMutation();
  const [updatedRoles, setUpdatedRoles] = React.useState(
    user.roles?.map(value => value.UsersRoles) || []
  );
  const rights = useRights(ROUTES.api.users);

  const updateHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    update({
      id: user.id,
      fields: updatedRoles,
    });
  };

  const updateRoles = (newRole: IUsersRoles) => {
    let find = false;

    const filtered = updatedRoles.filter(value => {
      if (
        newRole.userId == value?.userId &&
        newRole.roleId == value?.roleId
      ) {
        find = true;
        return false;
      } else {
        return true;
      }
    });

    if (!find) {
      filtered.push(newRole);
    }

    setUpdatedRoles(filtered);
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
  }, [updateReq.data, updateReq.error, updateReq.isLoading, dispatch]);

  return (
    <FormBoxStyled onSubmit={updateHandler}>
      <Typography
        component="h2"
        variant="h5"
        sx={{ my: 1.5, lineHeight: 1 }}
      >
        {t.roles}
      </Typography>
      {roles.map(role => (
        <FormCheckbox
          key={`roleRow.${role.id}`}
          label={role.name}
          name="role[]"
          value="allowed"
          checked={updatedRoles.some(value => value?.roleId == role.id)}
          onChange={() => updateRoles({ roleId: role.id, userId: user.id })}
        />
      ))}
      {roles && (
        <FormActions
          update={{
            loading: updateReq.isLoading,
            disabled: !rights.updating,
          }}
        />
      )}
    </FormBoxStyled>
  );
};
export default UpdateUserRoles;
