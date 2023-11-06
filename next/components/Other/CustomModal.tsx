import React from 'react';
import { Backdrop, Fade, Modal, ModalProps, Typography } from '@mui/material';
import { Container, styled } from '@mui/system';

import theme from '../../lib/theme';

const ModalStyled = styled(
  (props: ModalProps<'div'>) => (
    <Modal
      component="div"
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: theme.transitions.duration.short,
        },
      }}
      {...props}
    />
  ),
)(() => ({

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(3),

}));

const CustomModal: React.FC<Omit<ModalProps, 'sx'>> = (props) => {
  return (
    <ModalStyled {...props} title={undefined}>
      <Fade
        in={props.open}
        timeout={theme.transitions.duration.short}
      >
        <Container
          maxWidth="xs"
          sx={{
            maxHeight: '100%',
            outline: 'none',
            paddingTop: theme.spacing(1.5),
            paddingBottom: theme.spacing(1.5),
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3),
            backgroundColor: theme.palette.background.default,
            boxShadow: theme.shadows[1],
            zIndex: 1,
          }}
        >
          {props.title && (
            <Typography
              component="h1"
              variant="h5"
              sx={{
                py: 1.5,
                lineHeight: 1,
                textAlign: 'center',
              }}
            >
              {props.title}
            </Typography>
          )}
          {props.children}
        </Container>
      </Fade>
    </ModalStyled>
  );
};
export default CustomModal;
