import { FC, FormEvent, useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';

import Form from '@/shared/ui/Form/Form';
import FormButton from '@/shared/ui/Form/FormButton';
import useTranslate from '@/shared/hooks/useTranslate';
import useRights from '@/shared/hooks/useRights';
import FormCheckbox from '@/shared/ui/Form/FormCheckbox';
import { useAppDispatch } from '@/shared/store/hooks';
import usersApi from '@/shared/api/users/usersApi';
import { addAlert } from '@/shared/store/main/main';
import { getErrorText, IRole, IUser, IUsersRoles, ROUTES } from '@ap/shared';
import useTranslateRef from '@/shared/hooks/useTranslateRef';
import useLanguageRef from '@/shared/hooks/useLanguageRef';

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
      fields: updatedRoles,
    });
  };

  const updateRoles = (newRole: IUsersRoles) => {
    let find = false;

    const filtered = updatedRoles.filter((value) => {
      if (newRole.userId == value?.userId && newRole.roleId == value?.roleId) {
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
    if (updateReq.data) {
      dispatch(addAlert({ type: 'success', text: tRef.current.success }));
    }
  }, [updateReq.data, dispatch, tRef]);

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
    <Form onSubmit={submitHandler}>
      {roles.map((role) => (
        <FormCheckbox
          key={`roleRow.${role.id}`}
          labelProps={{ label: role.name, sx: { display: 'inline-flex' } }}
          name="role[]"
          value="allowed"
          checked={updatedRoles.some((value) => value?.roleId == role.id)}
          onChange={() => updateRoles({ roleId: role.id, userId: user.id })}
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
    </Form>
  );
};
export default UpdateUserRolesForm;
