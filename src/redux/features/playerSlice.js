import { createSlice } from '@reduxjs/toolkit';

const getStored = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
const persist = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Persistence is optional. */ } };

const updateSong = (state, action) => {
  if (state.activeSong?.id) {
    state.activeSong = state.currentSongs[action.payload];
    state.surahId = action.payload + 1;
  } else if (state.activeTafsir?.id) {
    state.activeTafsir = state.currentSongs[action.payload];
  } else {
    state.activeRadio = state.currentSongs[action.payload];
  }
  state.currentIndex = action.payload;
  state.isActive = true;
};

const initialState = {
  currentSongs: [],
  currentIndex: 0,
  isActive: false,
  isPlaying: false,
  surahId: getStored('surahId') || 2,
  activeSong: {},
  activeTafsir: {},
  activeRadio: {},
  language: getStored('language') || 'ar',
  reader: getStored('reader') || 102,
  riwaya: !getStored('riwaya') || getStored('riwaya') === '1' ? 11 : getStored('riwaya'),
  save: getStored('save') || '0,0',
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setActiveRadio: (state, action) => {
      if (action.payload) {
        state.activeRadio = action.payload.song;
        state.activeSong = {};
        state.activeTafsir = {};

        state.currentSongs = action.payload.data;
        state.currentIndex = action.payload.i;
        state.isActive = true;
      }
    },
    setActiveSong: (state, action) => {
      if (action.payload) {
        state.activeSong = action.payload.song;
        state.activeTafsir = {};
        state.activeRadio = {};

        state.currentSongs = action.payload.data;

        state.currentIndex = action.payload.i ?? Math.max(0, Number(action.payload.song?.id ?? 1) - 1);

        state.isActive = true;
      }
    },
    setActiveTafsir: (state, action) => {
      if (action.payload) {
        state.activeTafsir = action.payload.song;
        state.activeSong = {};
        state.activeRadio = {};
        state.currentSongs = action.payload.data;

        state.currentIndex = action.payload.i;
        state.isActive = true;
      }
    },

    nextSong: (state, action) => {
      updateSong(state, action);
    },

    prevSong: (state, action) => {
      updateSong(state, action);
    },

    playPause: (state, action) => {
      state.isPlaying = action.payload;
    },
    setSurahId: (state, action) => {
      state.surahId = action.payload;
      persist('surahId', action.payload);
    },
    setSave: (state, action) => {
      state.save = action.payload;
      persist('save', action.payload);
    },

    setLanguage: (state, action) => {
      state.language = action.payload;
      persist('language', action.payload);
    },
    setReader: (state, action) => {
      state.reader = action.payload;
      persist('reader', action.payload);
    },
    setRiwaya: (state, action) => {
      state.riwaya = action.payload;
      persist('riwaya', action.payload);
    },
  },
});

export const {
  setActiveSong,
  nextSong,
  prevSong,
  playPause,
  selectGenreListId,
  setLanguage,
  setReader,
  setRiwaya,
  setActiveTafsir,
  setSurahId,
  setSave,
  setActiveRadio } = playerSlice.actions;

export default playerSlice.reducer;
