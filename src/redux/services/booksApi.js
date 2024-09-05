import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { t } from 'i18next';
const HADITH_API_KEY = import.meta.env.VITE_HADITH_API_KEY;
export const booksApi = createApi({
    reducerPath: 'booksApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://hadithapi.com/api/',
    }),
    endpoints: (builder) => ({
        getChapters: builder.query({ query: ({ bookSlug }) => `${bookSlug}/chapters?apiKey=${HADITH_API_KEY}` }),
        getHadiths: builder.query({ query: ({ book, chapter, words, page }) => `hadiths?apiKey=${HADITH_API_KEY}&book=${book}&chapter=${chapter}&page=${page}&hadith${t('lang')}=${words}` }),

    }),
});

export const {
    useGetChaptersQuery,
    useGetHadithsQuery

} = booksApi;
