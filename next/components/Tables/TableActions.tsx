import React from 'react';
import { Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import lang from '../../lib/lang';
import { useAppSelector } from '../../store/hooks';
import LinkUnstyled from '../../components/Other/LinkUnstyled';

const TableActions: React.FC<{
  create?: {
    link: string;
    disabled?: boolean;
  };
  destroy?: {
    action: () => void;
    disabled?: boolean;
    loading?: boolean;
  };
}> = ({ create, destroy }) => {
  const userLang = useAppSelector(store => store.app.userLang);

  return (
    <Box>
      {create && (
        create.disabled
          ? (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              sx={{ my: 1.5, mr: 3 }}
              disabled={create.disabled}
            >
              {lang.get(userLang)?.create}
            </Button>
          )
          : (
            <LinkUnstyled href={create.link}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                sx={{ my: 1.5, mr: 3 }}
                disabled={create.disabled}
              >
                {lang.get(userLang)?.create}
              </Button>
            </LinkUnstyled>
          )
      )}
      {destroy && (
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          sx={{ my: 1.5, mr: 3 }}
          onClick={() => destroy.action()}
          disabled={destroy.loading || destroy.disabled}
        >
          {destroy.loading ? lang.get(userLang)?.loading : lang.get(userLang)?.delete}
        </Button>
      )}
    </Box>
  );
};
export default TableActions;
