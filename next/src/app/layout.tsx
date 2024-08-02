import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { FC, PropsWithChildren } from 'react';
import { headers } from 'next/headers';

import StoreProvider from './StoreProvider';

const RootLayout: FC<PropsWithChildren> = async ({ children }) => {
  const headersList = headers();
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
export default RootLayout;
