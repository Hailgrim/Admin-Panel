import React from 'react';
import {
  FormControl,
  FormGroup,
  FormHelperText,
  FormLabel,
} from '@mui/material';

import useTranslate from '@/shared/hooks/useTranslate';
import FormCheckbox from '@/shared/ui/Form/FormCheckbox';
import { IResource, IRights } from '@ap/shared/src/types';

const ResourceRightsFields: React.FC<{
  roleId: string;
  resource: IResource;
  rights?: IRights;
  setRights: (newRights: IRights) => void;
}> = ({ roleId, resource, rights, setRights }) => {
  const t = useTranslate();
  const newRights: IRights = rights || {
    roleId,
    resourceId: resource.id,
    creating: false,
    reading: false,
    updating: false,
    deleting: false,
  };

  return (
    <FormControl sx={{ my: 1, mr: 3 }} component="fieldset" variant="standard">
      <FormLabel component="legend">{resource.name}</FormLabel>
      <FormGroup>
        <FormCheckbox
          labelProps={{ label: t.create }}
          name="create[]"
          value="create"
          checked={rights?.creating || false}
          onChange={() =>
            setRights({ ...newRights, creating: !newRights.creating })
          }
        />
        <FormCheckbox
          labelProps={{ label: t.read }}
          name="read[]"
          value="read"
          checked={rights?.reading || false}
          onChange={() =>
            setRights({ ...newRights, reading: !newRights.reading })
          }
        />
        <FormCheckbox
          labelProps={{ label: t.update }}
          name="update[]"
          value="update"
          checked={rights?.updating || false}
          onChange={() =>
            setRights({ ...newRights, updating: !newRights.updating })
          }
        />
        <FormCheckbox
          labelProps={{ label: t.delete }}
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
export default ResourceRightsFields;
