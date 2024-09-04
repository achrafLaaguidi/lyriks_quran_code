import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const HADITH_API_KEY = "$2y$10$BJYFPtBe2ir8GdJLWR6O7KKIKeDl7A5iPSuKSN9TXeHtgQYQai";

export const booksApi = createApi({
    reducerPath: 'booksApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://hadithapi.com/api/',
    }),
    endpoints: (builder) => ({
        getChapters: builder.query({ query: ({ bookSlug }) => `${bookSlug}/chapters?apiKey=${HADITH_API_KEY}` }),


    }),
});

export const {
    useGetChaptersQuery

} = booksApi;
