'use client';

import { FC, PropsWithChildren, useRef } from 'react';
import { Provider } from 'react-redux';

import { AppStore, makeStore } from '@/store/store';
import { IUser } from '@/lib/types';
import { setProfile } from '@/store/slices/appSlice';

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
