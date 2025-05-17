import { FC, FormEvent, useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';

import FormBase from '@/shared/ui/Form/FormBase';
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

const UpdateRoleRightsForm: FC<{
  role: IRole;
  resources: IResource[];
}> = ({ role, resources }) => {
  const dispatch = useAppDispatch();
  const lRef = useLanguageRef();
  const tRef = useTranslateRef();
  const t = useTranslate();
  const [update, updateReq] = rolesApi.useUpdateRightsMutation();
  const [updatedRights, setUpdatedRights] = useState(role.rights || []);
  const rights = useRights(ROUTES.api.roles);

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    update({
      id: role.id,
      fields: { items: updatedRights },
    });
  };

  const updateRights = (newRights: IRights) => {
    const filteredRights = updatedRights.filter((value) => {
      if (
        newRights.roleId === value.roleId &&
        newRights.resourceId === value.resourceId
      ) {
        return false;
      } else {
        return true;
      }
    });

    if (
      newRights.creating ||
      newRights.reading ||
      newRights.updating ||
      newRights.deleting
    ) {
      filteredRights.push(newRights);
    }

    setUpdatedRights(filteredRights);
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
      {resources.map((resource) => (
        <ResourceRightsFields
          key={`ResourceRights.${resource.id}`}
          roleId={role.id}
          resource={resource}
          rights={updatedRights.find(
            (value) => value.resourceId === resource.id
          )}
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
    </FormBase>
  );
};
export default UpdateRoleRightsForm;
