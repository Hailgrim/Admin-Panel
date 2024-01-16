import { FC, FormEvent, useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';

import Form from '@/components/Form/Form';
import FormButton from '@/components/Form/FormButton';
import { ROUTES } from '@/lib/constants';
import useT from '@/hooks/useT';
import { makeErrorText } from '@/lib/functions';
import useLang from '@/hooks/useLang';
import { addAlert } from '@/store/slices/appSlice';
import { useAppDispatch } from '@/store/hooks';
import d from '@/locales/dictionary';
import useRights from '@/hooks/useRights';
import { IRoleAndResources, IRolesResources } from '@/lib/types';
import rolesApi from '@/store/api/rolesApi';
import ResourceRights from '../Resources/ResourceRights';

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
