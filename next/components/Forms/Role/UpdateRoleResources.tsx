import React from 'react';
import { Typography } from '@mui/material';

import lang from '../../../lib/lang';
import rolesApi from '../../../store/api/rolesApi';
import { isAllowed, makeErrorText } from '../../../lib/functions';
import { IResource, IRole, IRolesResources } from '../../../lib/types';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addAlert } from '../../../store/slices/appSlice';
import FormActions from '../FormActions';
import FormBoxStyled from '../FormBoxStyled';
import ResourceRights from '../Resource/ResourceRights';
import { Rights, ROUTES } from '../../../lib/constants';

const UpdateRoleResources: React.FC<{
  role: IRole;
  resources: IResource[];
}> = ({ role, resources }) => {
  const dispatch = useAppDispatch();
  const userLang = useAppSelector(store => store.app.userLang);
  const profile = useAppSelector(store => store.app.profile);
  const [update, updateReq] = rolesApi.useUpdateResourcesMutation();
  const [updatedRights, setUpdatedRights] = React.useState(
    role.resources?.map(value => value.RolesResources) || []
  );

  const updateHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    update({
      id: role.id,
      fields: updatedRights,
    });
  };

  const updateRights = (newRights: IRolesResources) => {
    const filtered = updatedRights.filter(value => {
      if (
        newRights.roleId == value?.roleId &&
        newRights.resourceId == value?.resourceId
      ) {
        return false;
      } else {
        return true;
      }
    });
    if (!(
      newRights.creating == false &&
      newRights.reading == false &&
      newRights.updating == false &&
      newRights.deleting == false
    )) {
      filtered.push(newRights);
    }
    setUpdatedRights(filtered);
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
        {lang.get(userLang)?.resources}
      </Typography>
      {resources.map(resource => (
        <ResourceRights
          key={`ResourceRights.${resource.id}`}
          roleId={role.id}
          resource={resource}
          rights={updatedRights.filter(value => value?.resourceId == resource.id)[0]}
          setRights={updateRights}
        />
      ))}
      {resources && (
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
export default UpdateRoleResources;
