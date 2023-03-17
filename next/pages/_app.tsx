import React from 'react';
import type { AppProps } from 'next/app';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import { useRouter } from 'next/router';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import '../styles/globals.css';
import theme from '../libs/theme';
import { wrapper } from '../store/store';
import AuthLayout from '../components/AuthLayout/AuthLayout';
import PanelLayout from '../components/PanelLayout/PanelLayout';
import { routeSection } from '../libs/functions';

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const { store, props } = wrapper.useWrappedStore(pageProps);
  const Layout = React.useMemo(() => {
    switch (routeSection(router.pathname)) {
      case 'auth':
        return AuthLayout;
      case 'panel':
        return PanelLayout;
      default:
        return React.Fragment;
    }
  }, [router.pathname]);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <Component {...props} />
        </Layout>
      </ThemeProvider>
    </Provider>
  );
};
export default App;
