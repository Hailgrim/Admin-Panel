import { FC, FormEvent, useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';

import Form from '@/shared/kit/Form/Form';
import FormButton from '@/shared/kit/Form/FormButton';
import { ROUTES } from '@/shared/lib/constants';
import useT from '@/shared/hooks/useT';
import useLang from '@/shared/hooks/useLang';
import d from '@/shared/locales/dictionary';
import useRights from '@/shared/hooks/useRights';
import FormCheckbox from '@/shared/kit/Form/FormCheckbox';
import { useAppDispatch } from '@/shared/store/hooks';
import usersApi from '@/shared/api/users/usersApi';
import { IUsersRoles } from '@/shared/api/roles/types';
import { addAlert } from '@/shared/store/slices/appSlice';
import { makeErrorText } from '@/shared/lib/utils';
import { IUserAndRoles } from '@/shared/api/users/types';

const UpdateUserRolesForm: FC<IUserAndRoles> = ({ user, roles }) => {
  const dispatch = useAppDispatch();
  const lang = useLang();
  const t = useT();
  const [update, updateReq] = usersApi.useUpdateRolesMutation();
  const [updatedRoles, setUpdatedRoles] = useState(
    user.roles?.map((value) => value.UsersRoles) || []
  );
  const rights = useRights(ROUTES.api.users);

  const formHandler = (event: FormEvent<HTMLFormElement>) => {
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
      dispatch(addAlert({ type: 'success', text: d[lang.current].success }));
    }
  }, [updateReq.data, dispatch, lang]);

  useEffect(() => {
    if (updateReq.error) {
      dispatch(
        addAlert({
          type: 'error',
          text: makeErrorText(updateReq.error, lang.current),
        })
      );
    }
  }, [updateReq.error, dispatch, lang]);

  return (
    <Form onSubmit={formHandler}>
      {roles?.map((role) => (
        <FormCheckbox
          key={`roleRow.${role.id}`}
          labelProps={{ label: role.name, sx: { display: 'inline-flex' } }}
          name="role[]"
          value="allowed"
          checked={updatedRoles.some((value) => value?.roleId == role.id)}
          onChange={() => updateRoles({ roleId: role.id, userId: user.id })}
        />
      ))}
      {!roles || (roles.length === 0 && t.error)}
      <br />
      <FormButton
        type="submit"
        color="success"
        startIcon={<SaveIcon />}
        disabled={
          !rights.updating ||
          updateReq.isLoading ||
          !roles ||
          roles.length === 0
        }
      >
        {t.update}
      </FormButton>
    </Form>
  );
};
export default UpdateUserRolesForm;
