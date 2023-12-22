import React from 'react';
import { Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

import useT from 'hooks/useT';

const FormActions: React.FC<{
  create?: {
    loading?: boolean;
    disabled?: boolean;
  };
  update?: {
    loading?: boolean;
    disabled?: boolean;
  };
  destroy?: {
    action: () => void;
    loading?: boolean;
    disabled?: boolean;
  };
}> = ({ create, update, destroy }) => {
  const t = useT();

  return (
    <Box>
      {create && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          type="submit"
          sx={{ my: 1.5, mr: 3 }}
          disabled={create.loading || create.disabled}
        >
          {create.loading ? t.loading : t.create}
        </Button>
      )}
      {update && (
        <Button
          variant="contained"
          color="success"
          startIcon={<SaveIcon />}
          type="submit"
          sx={{ my: 1.5, mr: 3 }}
          disabled={update.loading || update.disabled}
        >
          {update.loading ? t.loading : t.update}
        </Button>
      )}
      {destroy && (
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          type="button"
          sx={{ my: 1.5, mr: 3 }}
          disabled={destroy.loading || destroy.disabled}
          onClick={destroy.action}
        >
          {destroy.loading ? t.loading : t.delete}
        </Button>
      )}
    </Box>
  );
};
export default FormActions;
