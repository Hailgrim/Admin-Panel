import React from 'react';
import { FormControlLabel, Checkbox, CheckboxProps } from '@mui/material';

const FormCheckbox: React.FC<{
  label?: React.ReactNode;
} & CheckboxProps> = ({ label, ...props }) => {
  return (
    <FormControlLabel
      control={<Checkbox {...props} />}
      label={label}
    />
  );
};
export default FormCheckbox;
