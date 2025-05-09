import { configureStore } from '@reduxjs/toolkit';
import { quranApi } from './services/quranApi';

import playerReducer from './features/playerSlice';
import { booksApi } from './services/booksApi';

export const store = configureStore({
  reducer: {
    [quranApi.reducerPath]: quranApi.reducer,
    [booksApi.reducerPath]: booksApi.reducer,
    player: playerReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(
    {
      serializableCheck: false
    })
    .concat(quranApi.middleware)
    .concat(booksApi.middleware),
    

});
