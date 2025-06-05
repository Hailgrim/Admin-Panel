import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { FC, PropsWithChildren } from 'react';
import { headers } from 'next/headers';

import StoreProvider from './StoreProvider';

const Layout: FC<PropsWithChildren> = async ({ children }) => {
  const headersList = await headers();
  const profileJson = headersList.get('store-profile');

  return (
    <html lang="en">
      <body>
        <StoreProvider profileJson={profileJson}>
          <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
        </StoreProvider>
      </body>
    </html>
  );
};
export default Layout;
