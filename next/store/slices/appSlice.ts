import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import { IAlert, ICookies, IUser, LangList } from '../../lib/types';

export const appSliceName = 'app';
let alertCounter = 0;

const initialState = {
  accessToken: null as string | null,
  refreshToken: null as string | null,
  rememberMe: false,
  userAgent: null as string | null,
  isSideBarOpened: true,
  isModalSideBarOpened: false,
  profile: null as IUser | null,
  language: 'en' as LangList,
  alerts: [] as IAlert[],
};

export const appSlice = createSlice({
  name: appSliceName,
  initialState: initialState,
  reducers: {
    setAuthTokens: (state, action: PayloadAction<ICookies>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.rememberMe = action.payload.rememberMe;
    },

    setUserAgent: (state, action: PayloadAction<string | null>) => {
      state.userAgent = action.payload;
    },

    toggleSideBar: (state, action: PayloadAction<boolean>) => {
      state.isSideBarOpened = action.payload;
    },

    toggleModalSideBar: (state, action: PayloadAction<boolean>) => {
      state.isModalSideBarOpened = action.payload;
    },

    setProfile: (state, action: PayloadAction<IUser | null>) => {
      state.profile = action.payload;
    },

    setUserLang: (state, action: PayloadAction<LangList>) => {
      state.language = action.payload;
    },

    addAlert: (state, action: PayloadAction<Omit<IAlert, 'id'>>) => {
      state.alerts.push({ ...action.payload, id: alertCounter++ });
    },

    deleteAlert: (state, action: PayloadAction<number>) => {
      state.alerts = state.alerts.filter(
        (alert) => alert.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: any) => {
      return {
        ...state,
        ...action.payload[appSliceName],
        isSideBarOpened: state.isSideBarOpened,
      };
    });
  },
});

export const {
  setAuthTokens,
  setUserAgent,
  toggleSideBar,
  toggleModalSideBar,
  setProfile,
  setUserLang,
  addAlert,
  deleteAlert,
} = appSlice.actions;
export default appSlice.reducer;
