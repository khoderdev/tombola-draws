import { configureStore } from "@reduxjs/toolkit";
import imageReducer from "./slice/imageSlice";

export const store = configureStore({
  reducer: {
    image: imageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
