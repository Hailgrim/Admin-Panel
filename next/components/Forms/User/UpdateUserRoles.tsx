import React from 'react';
import { Typography } from '@mui/material';

import lang from '../../../libs/lang';
import usersApi from '../../../store/api/usersApi';
import { isAllowed, makeErrorText } from '../../../libs/functions';
import { IRole, IUser, IUsersRoles } from '../../../libs/types';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addAlert } from '../../../store/slices/appSlice';
import FormActions from '../FormActions';
import FormBoxStyled from '../FormBoxStyled';
import FormCheckbox from '../FormCheckbox';
import { ROUTES } from '../../../libs/config';
import { Rights } from '../../../libs/constants';

const UpdateUserRoles: React.FC<{
  user: IUser;
  roles: IRole[];
}> = ({ user, roles }) => {
  const dispatch = useAppDispatch();
  const userLang = useAppSelector(store => store.app.userLang);
  const profile = useAppSelector(store => store.app.profile);
  const [update, updateReq] = usersApi.useUpdateRolesMutation();
  const [updatedRoles, setUpdatedRoles] = React.useState(
    user.roles?.map(value => value.UsersRoles) || []
  );

  const updateHandler = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    update({
      id: user.id,
      fields: updatedRoles,
    });
  };

  const updateRights = (newRole: IUsersRoles) => {
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
      <Typography
        component="h2"
        variant="h5"
        sx={{ my: 1.5, lineHeight: 1 }}
      >
        {lang.get(userLang)?.roles}
      </Typography>
      {roles.map(role => (
        <FormCheckbox
          key={`roleRow.${role.id}`}
          label={role.name}
          name="role[]"
          value="allowed"
          checked={updatedRoles.some(value => value?.roleId == role.id)}
          onChange={() => updateRights({ roleId: role.id, userId: user.id })}
        />
      ))}
      {roles && (
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
export default UpdateUserRoles;
