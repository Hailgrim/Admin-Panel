import React from 'react';
import {
  FormControl,
  FormGroup,
  FormHelperText,
  FormLabel,
} from '@mui/material';

import lang from '../../../lib/lang';
import { useAppSelector } from '../../../store/hooks';
import { IResource, IRolesResources } from '../../../lib/types';
import FormCheckbox from '../FormCheckbox';

const ResourceRights: React.FC<{
  roleId: number;
  resource: IResource;
  rights?: IRolesResources;
  setRights: (newRights: IRolesResources) => void;
}> = ({ roleId, resource, rights, setRights }) => {
  const userLang = useAppSelector(store => store.app.userLang);
  const newRights = rights || {
    roleId,
    resourceId: resource.id,
    creating: false,
    reading: false,
    updating: false,
    deleting: false,
  };

  return (
    <FormControl sx={{ my: 1.5, mr: 3 }} component="fieldset" variant="standard">
      <FormLabel component="legend">{resource.name}</FormLabel>
      <FormGroup>
        <FormCheckbox
          label={lang.get(userLang)?.create}
          name="create[]"
          value="create"
          checked={rights?.creating || false}
          onChange={() => setRights({ ...newRights, creating: !newRights.creating })}
        />
        <FormCheckbox
          label={lang.get(userLang)?.read}
          name="read[]"
          value="read"
          checked={rights?.reading || false}
          onChange={() => setRights({ ...newRights, reading: !newRights.reading })}
        />
        <FormCheckbox
          label={lang.get(userLang)?.update}
          name="update[]"
          value="update"
          checked={rights?.updating || false}
          onChange={() => setRights({ ...newRights, updating: !newRights.updating })}
        />
        <FormCheckbox
          label={lang.get(userLang)?.delete}
          name="delete[]"
          value="delete"
          checked={rights?.deleting || false}
          onChange={() => setRights({ ...newRights, deleting: !newRights.deleting })}
        />
      </FormGroup>
      <FormHelperText sx={{ maxWidth: 300 }}>{resource.description}</FormHelperText>
    </FormControl>
  );
};
export default ResourceRights;
