import { configureStore } from '@reduxjs/toolkit';

import mainSlice, { mainSliceName } from './main/main';
import authApi from '../api/auth/authApi';
import usersApi from '../api/users/usersApi';
import rolesApi from '../api/roles/rolesApi';
import resourcesApi from '../api/resources/resourcesApi';

export const makeStore = () =>
  configureStore({
    reducer: {
      [mainSliceName]: mainSlice,
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
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
