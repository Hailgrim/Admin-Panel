import React from 'react';
import { Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

import lang from '../../libs/lang';
import { useAppSelector } from '../../store/hooks';

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
  const userLang = useAppSelector(store => store.app.userLang);

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
          {create.loading ? lang.get(userLang)?.loading : lang.get(userLang)?.create}
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
          {update.loading ? lang.get(userLang)?.loading : lang.get(userLang)?.update}
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
          {destroy.loading ? lang.get(userLang)?.loading : lang.get(userLang)?.delete}
        </Button>
      )}
    </Box>
  );
};
export default FormActions;
