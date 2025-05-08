import { FC, FormEvent, useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';

import Form from '@/shared/ui/Form/Form';
import FormButton from '@/shared/ui/Form/FormButton';
import useRights from '@/shared/hooks/useRights';
import ResourceRightsFields from '../Resources/ResourceRightsFields';
import { useAppDispatch } from '@/shared/store/hooks';
import rolesApi from '@/shared/api/roles/rolesApi';
import { addAlert } from '@/shared/store/main/main';
import useTranslate from '@/shared/hooks/useTranslate';
import { getErrorText, IResource, IRights, IRole, ROUTES } from '@ap/shared';
import useLanguageRef from '@/shared/hooks/useLanguageRef';
import useTranslateRef from '@/shared/hooks/useTranslateRef';

const UpdateRoleResourcesForm: FC<{
  role: IRole;
  resources: IResource[];
}> = ({ role, resources }) => {
  const dispatch = useAppDispatch();
  const lRef = useLanguageRef();
  const tRef = useTranslateRef();
  const t = useTranslate();
  const [update, updateReq] = rolesApi.useUpdateResourcesMutation();
  const [updatedRights, setUpdatedRights] = useState(
    role.resources
      ?.map((value) => value.RightsModel)
      .filter((value) => value !== undefined) || []
  );
  const rights = useRights(ROUTES.api.roles);

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    update({
      id: role.id,
      fields: updatedRights,
    });
  };

  const updateRights = (newRights: IRights) => {
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
      {resources.map((resource) => (
        <ResourceRightsFields
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
      <FormButton
        type="submit"
        color="success"
        startIcon={<SaveIcon />}
        disabled={!rights.updating || role.default}
        loading={updateReq.isLoading}
      >
        {t.update}
      </FormButton>
    </Form>
  );
};
export default UpdateRoleResourcesForm;
