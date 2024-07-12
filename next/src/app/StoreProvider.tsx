'use client';

import { FC, PropsWithChildren, useRef } from 'react';
import { Provider } from 'react-redux';

import { AppStore, makeStore } from '@/shared/store/store';
import { setProfile } from '@/shared/store/slices/appSlice';

const StoreProvider: FC<
  PropsWithChildren & { profileJson?: string | null }
> = ({ children, profileJson }) => {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
    if (profileJson) {
      try {
        storeRef.current.dispatch(setProfile(JSON.parse(profileJson)));
      } catch {}
    }
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
};
export default StoreProvider;
