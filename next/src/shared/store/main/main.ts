import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { LangList } from '@/shared/locales/types';
import { IAlert } from './types';
import { IUser } from '@/shared/api/users/types';

export const mainSliceName = 'main';

const initialState = {
  profile: null as IUser | null,
  language: 'en' as LangList,
  alerts: [] as IAlert[],
  alertCounter: 0,
};

export const mainSlice = createSlice({
  name: mainSliceName,
  initialState: initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<IUser | null>) => {
      state.profile = action.payload;
    },

    setUserLang: (state, action: PayloadAction<LangList>) => {
      state.language = action.payload;
    },

    addAlert: (state, action: PayloadAction<Omit<IAlert, 'id'>>) => {
      state.alerts.push({ ...action.payload, id: state.alertCounter++ });
    },

    deleteAlert: (
      state,
      action: PayloadAction<{ id: number; delay?: boolean }>
    ) => {
      if (action.payload.delay) {
        state.alerts = state.alerts.map((alert) => {
          if (alert.id === action.payload.id) alert.deleted = true;
          return alert;
        });
      } else {
        state.alerts = state.alerts.filter(
          (alert) => alert.id !== action.payload.id
        );
      }
    },
  },
});

export const { setProfile, setUserLang, addAlert, deleteAlert } =
  mainSlice.actions;
export default mainSlice.reducer;
