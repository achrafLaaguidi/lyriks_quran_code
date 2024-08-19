import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentSongs: [],
  currentIndex: 0,
  isActive: false,
  isPlaying: false,
  surahId: null,
  activeSong: {},
  activeTafsir: {},
  language: localStorage.getItem('language') || 'ar',
  reader: localStorage.getItem('reader') || 102,
  riwaya: localStorage.getItem('riwaya') || 1
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setActiveSong: (state, action) => {


      state.activeSong = action.payload.song;
      state.activeTafsir = {}

      state.currentSongs = action.payload.data;


      state.currentIndex = action.payload.i;
      state.isActive = true;

    },
    setActiveTafsir: (state, action) => {

      state.activeTafsir = action.payload.song;
      state.activeSong = {}

      state.currentSongs = action.payload.data;

      state.currentIndex = action.payload.i;
      state.isActive = true;
    },

    nextSong: (state, action) => {
      if (state.activeSong?.id) {
        state.activeSong = state.currentSongs[action.payload];
        state.currentIndex = action.payload;
      }
      else {
        state.activeTafsir = state.currentSongs[action.payload]
        state.currentIndex = action.payload;
      }
      state.isActive = true;
    },

    prevSong: (state, action) => {
      if (state.activeSong?.id) {
        state.activeSong = state.currentSongs[action.payload];
        state.currentIndex = action.payload;
      }
      else {
        state.activeTafsir = state.currentSongs[action.payload]
        state.currentIndex = action.payload;
      }
      state.isActive = true;
    },

    playPause: (state, action) => {
      state.isPlaying = action.payload;
    },
    setSurahId: (state, action) => {
      state.surahId = action.payload;
    },

    setLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem('language', action.payload);
    },
    setReader: (state, action) => {
      state.reader = action.payload;
      localStorage.setItem('reader', action.payload);
    },
    setRiwaya: (state, action) => {
      state.riwaya = action.payload;
      localStorage.setItem('riwaya', action.payload);
    },
  },
});

export const { setActiveSong, nextSong, prevSong, playPause, selectGenreListId, setLanguage, setReader, setRiwaya, setActiveTafsir, setSurahId } = playerSlice.actions;

export default playerSlice.reducer;
