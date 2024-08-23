import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const quranApi = createApi({
    reducerPath: 'quranApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://mp3quran.net/api/v3/',
    }),
    endpoints: (builder) => ({
        getLanguage: builder.query({ query: () => 'languages' }),
        getSuwarByLanguage: builder.query({ query: (lang) => `suwar?language=${lang}` }),
        getRecitersByLanguage: builder.query({ query: (lang) => `reciters?language=${lang}` }),
        getRecitersByLanguageAndIdAndRewaya: builder.query({ query: ({ lang, id, riwaya }) => `reciters?language=${lang}&reciter=${id}&rewaya=${riwaya}` }),
        getRiwayatByLanguage: builder.query({ query: (lang) => `riwayat?language=${lang}` }),
        getRecentReadsByLanguage: builder.query({ query: (lang) => `recent_reads?language=${lang}` }),
        getAyatsBySurahAndReader: builder.query({ query: ({ surahId }) => `ayat_timing?surah=${surahId}&read=10` }),
        getTafsirBySura: builder.query({ query: (sura_id) => `tafsir?sura=${sura_id}` }),
        getMushafByLanguage: builder.query({ query: (lang) => `moshaf?language=${lang}` }),
        getVideoType: builder.query({ query: () => 'viedo_types' }),

    }),
});

export const {
    useGetAyatsBySurahAndReaderQuery,
    useGetLanguageQuery,
    useGetRecentReadsByLanguageQuery,
    useGetRecitersByLanguageQuery,
    useGetRiwayatByLanguageQuery,
    useGetSuwarByLanguageQuery,
    useGetTafsirBySuraQuery,
    useGetRecitersByLanguageAndIdAndRewayaQuery,
    useGetMushafByLanguageQuery,
    useGetVideoTypeQuery
} = quranApi;
