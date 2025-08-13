import { configureStore } from "@reduxjs/toolkit";
import announcementsReducer from "./slices/announcementsSlice";

export const store = configureStore({
  reducer: {
    announcements: announcementsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;