import React from 'react';
import { Typography } from '@mui/material';

import rolesApi from '../../../store/api/rolesApi';
import { makeErrorText } from '../../../lib/functions';
import { IResource, IRole, IRolesResources } from '../../../lib/types';
import { useAppDispatch } from '../../../store/hooks';
import { addAlert } from '../../../store/slices/appSlice';
import FormActions from '../FormActions';
import FormBoxStyled from '../FormBoxStyled';
import ResourceRights from '../Resource/ResourceRights';
import { ROUTES } from '../../../lib/constants';
import useRights from '../../../hooks/useRights';
import dictionary from '../../../locales/dictionary';
import useLang from '../../../hooks/useLang';
import useT from 'hooks/useT';

const UpdateRoleResources: React.FC<{
  role: IRole;
  resources: IResource[];
}> = ({ role, resources }) => {
  const dispatch = useAppDispatch();
  const lang = useLang();
  const t = useT();
  const [update, updateReq] = rolesApi.useUpdateResourcesMutation();
  const [updatedRights, setUpdatedRights] = React.useState(
    role.resources?.map((value) => value.RolesResources) || []
  );
  const rights = useRights(ROUTES.api.roles);

  const updateHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    update({
      id: role.id,
      fields: updatedRights,
    });
  };

  const updateRights = (newRights: IRolesResources) => {
    const filtered = updatedRights.filter((value) => {
      if (
        newRights.roleId == value?.roleId &&
        newRights.resourceId == value?.resourceId
      ) {
        return false;
      } else {
        return true;
      }
    });
    if (
      !(
        newRights.creating == false &&
        newRights.reading == false &&
        newRights.updating == false &&
        newRights.deleting == false
      )
    ) {
      filtered.push(newRights);
    }
    setUpdatedRights(filtered);
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
      dispatch(
        addAlert({ type: 'success', text: dictionary[lang.current].success })
      );
    }
  }, [updateReq.data, updateReq.error, updateReq.isLoading, dispatch, lang]);

  return (
    <FormBoxStyled onSubmit={updateHandler}>
      <Typography component="h2" variant="h5" sx={{ my: 1.5, lineHeight: 1 }}>
        {t.resources}
      </Typography>
      {resources.map((resource) => (
        <ResourceRights
          key={`ResourceRights.${resource.id}`}
          roleId={role.id}
          resource={resource}
          rights={
            updatedRights.filter((value) => value?.resourceId == resource.id)[0]
          }
          setRights={updateRights}
        />
      ))}
      {resources && (
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
export default UpdateRoleResources;
