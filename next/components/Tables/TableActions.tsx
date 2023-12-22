import React from 'react';
import { Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import LinkStyled from '../Other/LinkStyled';
import useT from 'hooks/useT';

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
  const t = useT();

  return (
    <Box>
      {create &&
        (create.disabled ? (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{ my: 1.5, mr: 3 }}
            disabled={create.disabled}
          >
            {t.create}
          </Button>
        ) : (
          <LinkStyled href={create.link}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              sx={{ my: 1.5, mr: 3 }}
              disabled={create.disabled}
            >
              {t.create}
            </Button>
          </LinkStyled>
        ))}
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
