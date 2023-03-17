import React from 'react';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
} from '@mui/material';

import lang from '../../../libs/lang';
import { useAppSelector } from '../../../store/hooks';
import { IResource, IRolesResources } from '../../../libs/types';

const defaultRights = {
  creating: false,
  listing: false,
  reading: false,
  updating: false,
  deleting: false,
};

const ResourceRow: React.FC<{
  roleId: number;
  resource: IResource;
  rights?: IRolesResources;
  setRights: (newRights: IRolesResources) => void;
}> = ({ roleId, resource, rights, setRights }) => {
  const userLang = useAppSelector(store => store.app.userLang);
  const newRights = rights || { roleId, resourceId: resource.id, ...defaultRights };

  return (
    <FormControl sx={{ my: 1.5, mr: 3 }} component="fieldset" variant="standard">
      <FormLabel component="legend">{resource.name}</FormLabel>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              name="create[]"
              value="create"
              checked={rights?.creating || false}
              onChange={() => setRights({ ...newRights, creating: !newRights.creating })}
            />
          }
          label={lang.get(userLang)?.create}
        />
        <FormControlLabel
          control={
            <Checkbox
              name="list[]"
              value="list"
              checked={rights?.listing || false}
              onChange={() => setRights({ ...newRights, listing: !newRights.listing })}
            />
          }
          label={lang.get(userLang)?.list}
        />
        <FormControlLabel
          control={
            <Checkbox
              name="read[]"
              value="read"
              checked={rights?.reading || false}
              onChange={() => setRights({ ...newRights, reading: !newRights.reading })}
            />
          }
          label={lang.get(userLang)?.read}
        />
        <FormControlLabel
          control={
            <Checkbox
              name="update[]"
              value="update"
              checked={rights?.updating || false}
              onChange={() => setRights({ ...newRights, updating: !newRights.updating })}
            />
          }
          label={lang.get(userLang)?.update}
        />
        <FormControlLabel
          control={
            <Checkbox
              name="delete[]"
              value="delete"
              checked={rights?.deleting || false}
              onChange={() => setRights({ ...newRights, deleting: !newRights.deleting })}
            />
          }
          label={lang.get(userLang)?.delete}
        />
      </FormGroup>
      <FormHelperText sx={{ maxWidth: 300 }}>{resource.description}</FormHelperText>
    </FormControl>
  );
};
export default ResourceRow;
