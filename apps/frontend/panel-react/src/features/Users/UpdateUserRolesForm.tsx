import { FC, FormEvent, useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';

import FormBase from '@/shared/ui/Form/FormBase';
import FormButton from '@/shared/ui/Form/FormButton';
import useTranslate from '@/shared/hooks/useTranslate';
import useRights from '@/shared/hooks/useRights';
import FormCheckbox from '@/shared/ui/Form/FormCheckbox';
import { useAppDispatch } from '@/shared/store/hooks';
import usersApi from '@/shared/api/users/usersApi';
import { addAlert } from '@/shared/store/main/main';
import useTranslateRef from '@/shared/hooks/useTranslateRef';
import useLanguageRef from '@/shared/hooks/useLanguageRef';
import { IRole, IUser, IUsersRoles } from '@ap/shared/src/types';
import { getErrorText, ROUTES } from '@ap/shared/src/libs';

const UpdateUserRolesForm: FC<{
  user: IUser;
  roles: IRole[];
}> = ({ user, roles }) => {
  const dispatch = useAppDispatch();
  const lRef = useLanguageRef();
  const tRef = useTranslateRef();
  const t = useTranslate();
  const [update, updateReq] = usersApi.useUpdateRolesMutation();
  const [updatedRoles, setUpdatedRoles] = useState<IUsersRoles[]>(
    user.roles?.map((value) => ({ roleId: value.id, userId: user.id })) || []
  );
  const rights = useRights(ROUTES.api.users);

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    update({
      id: user.id,
      fields: { items: updatedRoles },
    });
  };

  const updateRoles = (newRole: IUsersRoles) => {
    let find = false;

    const filtered = updatedRoles.filter((value) => {
      if (newRole.userId === value.userId && newRole.roleId === value.roleId) {
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

  useEffect(() => {
    if (updateReq.isSuccess) {
      dispatch(addAlert({ type: 'success', text: tRef.current.success }));
    }
  }, [updateReq.isSuccess, dispatch, tRef]);

  useEffect(() => {
    if (updateReq.error) {
      dispatch(
        addAlert({
          type: 'error',
          text: getErrorText(updateReq.error, lRef.current),
        })
      );
    }
  }, [updateReq.error, dispatch, lRef]);

  return (
    <FormBase onSubmit={submitHandler}>
      {roles.map((role) => (
        <FormCheckbox
          key={`roleRow.${role.id}`}
          labelProps={{ label: role.name, sx: { display: 'inline-flex' } }}
          name="role[]"
          value="allowed"
          checked={updatedRoles.some((value) => value.roleId === role.id)}
          onChange={() => updateRoles({ roleId: role.id, userId: user.id })}
          disabled={role.admin}
        />
      ))}
      <br />
      <FormButton
        type="submit"
        color="success"
        startIcon={<SaveIcon />}
        disabled={!rights.updating}
        loading={updateReq.isLoading}
      >
        {t.update}
      </FormButton>
    </FormBase>
  );
};
export default UpdateUserRolesForm;
