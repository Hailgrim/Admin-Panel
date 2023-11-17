import React from 'react';
import { Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

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
  const t = useAppSelector(store => store.app.t);

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
              {t.create}
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
                {t.create}
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
          {destroy.loading ? t.loading : t.delete}
        </Button>
      )}
    </Box>
  );
};
export default TableActions;
