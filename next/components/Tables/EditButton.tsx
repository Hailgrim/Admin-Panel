import { IconButton } from '@mui/material';
import React from 'react';
import EditIcon from '@mui/icons-material/Edit';

import LinkUnstyled from '../Other/LinkUnstyled';
import { useAppSelector } from '../../store/hooks';
import { isAllowed } from '../../lib/functions';
import { Rights } from '../../lib/constants';

const EditButton: React.FC<{
  route: string;
  link: string;
  selectable?: boolean;
}> = ({ route, link, selectable = true }) => {
  const profile = useAppSelector(store => store.app.profile);

  return selectable && isAllowed(route, Rights.Reading, profile?.roles)
    ? (
      <LinkUnstyled
        href={link}
        onClick={event => event.stopPropagation()}
      >
        <IconButton size="medium">
          <EditIcon />
        </IconButton>
      </LinkUnstyled>
    )
    : (
      <IconButton size="medium" disabled={true}>
        <EditIcon />
      </IconButton>
    );
};
export default EditButton;
