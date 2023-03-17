import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

import appSlice, { appSliceName } from './slices/appSlice';
import authApi from './api/authApi';
import usersApi from './api/usersApi';
import rolesApi from './api/rolesApi';
import resourcesApi from './api/resourcesApi';

const makeStore = () => configureStore({
  reducer: {
    [appSliceName]: appSlice,
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [rolesApi.reducerPath]: rolesApi.reducer,
    [resourcesApi.reducerPath]: resourcesApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(usersApi.middleware)
      .concat(rolesApi.middleware)
      .concat(resourcesApi.middleware);
  },
  devTools: false,
});

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
export type RootState = ReturnType<AppStore['getState']>;
export const wrapper = createWrapper<AppStore>(makeStore, { debug: false });
