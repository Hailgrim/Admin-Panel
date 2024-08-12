'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { FC, PropsWithChildren, useEffect } from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { usePathname, useRouter } from 'next/navigation';

import theme from '@/shared/lib/theme';
import { useAppSelector } from '@/shared/store/hooks';
import { ROUTES } from '@/shared/lib/constants';

const PanelLayout: FC<PropsWithChildren> = ({ children }) => {
  const profile = useAppSelector((store) => store.main.profile);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!profile)
      router.push(`${ROUTES.ui.signIn}?return=${encodeURIComponent(pathname)}`);
  }, [profile, router, pathname]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
export default PanelLayout;
