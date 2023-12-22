import React from 'react';
import {
  FormControl,
  FormGroup,
  FormHelperText,
  FormLabel,
} from '@mui/material';

import { IResource, IRolesResources } from '../../../lib/types';
import FormCheckbox from '../FormCheckbox';
import useT from 'hooks/useT';

const ResourceRights: React.FC<{
  roleId: number;
  resource: IResource;
  rights?: IRolesResources;
  setRights: (newRights: IRolesResources) => void;
}> = ({ roleId, resource, rights, setRights }) => {
  const t = useT();
  const newRights: IRolesResources = rights || {
    roleId,
    resourceId: resource.id,
    creating: false,
    reading: false,
    updating: false,
    deleting: false,
  };

  return (
    <FormControl
      sx={{ my: 1.5, mr: 3 }}
      component="fieldset"
      variant="standard"
    >
      <FormLabel component="legend">{resource.name}</FormLabel>
      <FormGroup>
        <FormCheckbox
          label={t.create}
          name="create[]"
          value="create"
          checked={rights?.creating || false}
          onChange={() =>
            setRights({ ...newRights, creating: !newRights.creating })
          }
        />
        <FormCheckbox
          label={t.read}
          name="read[]"
          value="read"
          checked={rights?.reading || false}
          onChange={() =>
            setRights({ ...newRights, reading: !newRights.reading })
          }
        />
        <FormCheckbox
          label={t.update}
          name="update[]"
          value="update"
          checked={rights?.updating || false}
          onChange={() =>
            setRights({ ...newRights, updating: !newRights.updating })
          }
        />
        <FormCheckbox
          label={t.delete}
          name="delete[]"
          value="delete"
          checked={rights?.deleting || false}
          onChange={() =>
            setRights({ ...newRights, deleting: !newRights.deleting })
          }
        />
      </FormGroup>
      <FormHelperText sx={{ maxWidth: 300 }}>
        {resource.description}
      </FormHelperText>
    </FormControl>
  );
};
export default ResourceRights;
