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
  riwaya: localStorage.getItem('riwaya') || 1,
  save: localStorage.getItem('save') || '0,0'
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setActiveSong: (state, action) => {

      if (action.payload) {

        state.activeSong = action.payload.song;
        state.activeTafsir = {}

        state.currentSongs = action.payload.data;


        state.currentIndex = action.payload.song?.id - 1;

        state.isActive = true;
      }

    },
    setActiveTafsir: (state, action) => {
      if (action.payload) {
        state.activeTafsir = action.payload.song;
        state.activeSong = {}

        state.currentSongs = action.payload.data;

        state.currentIndex = action.payload.i;
        state.isActive = true;
      }
    },

    nextSong: (state, action) => {
      if (state.activeSong?.id) {
        state.activeSong = state.currentSongs[action.payload];
        state.currentIndex = action.payload;
        state.surahId = action.payload + 1;
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
        state.surahId = action.payload + 1;

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
    setSave: (state, action) => {
      state.save = action.payload;
      localStorage.setItem('save', action.payload);
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

export const { setActiveSong, nextSong, prevSong, playPause, selectGenreListId, setLanguage, setReader, setRiwaya, setActiveTafsir, setSurahId, setSave } = playerSlice.actions;

export default playerSlice.reducer;
