import { IconButton } from '@mui/material';
import React from 'react';
import EditIcon from '@mui/icons-material/Edit';

import LinkUnstyled from '../Other/LinkUnstyled';
import useRights from '../../hooks/useRights';

const EditButton: React.FC<{
  route: string;
  link: string;
  selectable?: boolean;
}> = ({ route, link, selectable = true }) => {
  const rights = useRights(route);

  return selectable && rights.reading
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
