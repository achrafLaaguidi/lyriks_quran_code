import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const HADITH_API_KEY = import.meta.env.VITE_HADITH_API_KEY;
export const booksApi = createApi({
  reducerPath: 'booksApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://hadithapi.com/api/',
  }),
  endpoints: (builder) => ({
    getChapters: builder.query({
      query: ({ bookSlug }) => `${bookSlug}/chapters?apiKey=${HADITH_API_KEY}`,
    }),
    getHadiths: builder.query({
      query: ({ book, chapter, words, page, locale = 'Arabic' }) => `hadiths?apiKey=${HADITH_API_KEY}&book=${book}&chapter=${chapter}&page=${page}&hadith${locale}=${encodeURIComponent(words || '')}`,
    }),
  }),
});

export const { useGetChaptersQuery, useGetHadithsQuery } = booksApi;
