import { FC, FormEvent, useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';

import Form from '@/kit/Form/Form';
import FormButton from '@/kit/Form/FormButton';
import { ROUTES } from '@/shared/lib/constants';
import useT from '@/shared/hooks/useT';
import useLang from '@/shared/hooks/useLang';
import d from '@/shared/locales/dictionary';
import useRights from '@/shared/hooks/useRights';
import ResourceRights from '../Resources/ResourceRights';
import { IRoleAndResources } from '@/shared/api/roles/types';
import { useAppDispatch } from '@/shared/store/hooks';
import rolesApi from '@/shared/api/roles/rolesApi';
import { IRolesResources } from '@/shared/api/resources/types';
import { addAlert } from '@/shared/store/slices/appSlice';
import { makeErrorText } from '@/shared/lib/utils';

const UpdateRoleResourcesForm: FC<IRoleAndResources> = ({
  role,
  resources,
}) => {
  const dispatch = useAppDispatch();
  const lang = useLang();
  const t = useT();
  const [update, updateReq] = rolesApi.useUpdateResourcesMutation();
  const [updatedRights, setUpdatedRights] = useState(
    role.resources?.map((value) => value.RolesResources) || []
  );
  const rights = useRights(ROUTES.api.roles);

  const formHandler = (event: FormEvent<HTMLFormElement>) => {
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
      {resources?.map((resource) => (
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
      <br />
      {!resources || (resources.length === 0 && t.error)}
      <FormButton
        type="submit"
        color="success"
        startIcon={<SaveIcon />}
        disabled={
          !rights.updating ||
          updateReq.isLoading ||
          !resources ||
          resources.length === 0
        }
      >
        {t.update}
      </FormButton>
    </Form>
  );
};
export default UpdateRoleResourcesForm;
