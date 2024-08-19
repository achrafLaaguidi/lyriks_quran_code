import { configureStore } from '@reduxjs/toolkit';
import { quranApi } from './services/quranApi';

import playerReducer from './features/playerSlice';

export const store = configureStore({
  reducer: {
    [quranApi.reducerPath]: quranApi.reducer,
    player: playerReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(quranApi.middleware),

});
