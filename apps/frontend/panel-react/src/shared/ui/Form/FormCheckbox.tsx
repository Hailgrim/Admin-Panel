import Checkbox, { CheckboxProps } from '@mui/material/Checkbox';
import FormControlLabel, {
  FormControlLabelProps,
} from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import { FC } from 'react';

const FormCheckbox: FC<
  CheckboxProps & { labelProps: Omit<FormControlLabelProps, 'control'> }
> = ({ labelProps, ...props }) => {
  return (
    <FormControlLabelStyled
      control={<Checkbox color="primary" sx={{ my: 0 }} {...props} />}
      {...labelProps}
    />
  );
};
export default FormCheckbox;

const FormControlLabelStyled = styled(FormControlLabel)`
  display: flex;
`;
