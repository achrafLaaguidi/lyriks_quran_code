import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Error, Loader, SongCard } from '../components';
import { useGetSuwarByLanguageQuery } from '../redux/services/quranApi';
import { HiArrowCircleUp } from 'react-icons/hi';
import useScrollToTopButton from '../assets/useScrollToTop';

const Search = () => {
  const { searchTerm } = useParams();
  const { activeSong, isPlaying, language } = useSelector((state) => state.player);
  const { data, isFetching, error } = useGetSuwarByLanguageQuery(language);
  const { scrollContainerRef, showScrollButton, handleScrollToTop } = useScrollToTopButton()

  const songs = data?.suwar.filter((song) =>
    song.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isFetching) return <Loader title={`Searching ${searchTerm}...`} />;
  if (error) return <Error />;

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">
        {language === 'ar' ? 'عرض النتائج ' : 'Showing results '}
      </h2>

      <div ref={scrollContainerRef} className={`flex flex-wrap sm:justify-start justify-center gap-8 ${songs.length <= 4 ? 'h-[calc(100vh-60vh)]' : 'h-[calc(100vh-30vh)]'} overflow-y-scroll hide-scrollbar`}>
        {songs.length > 0 ? (
          songs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              isPlaying={isPlaying}
              activeSong={activeSong}
              data={data}
            />
          ))
        ) : (
          <p className="text-white">{language === 'ar' ? 'لم يتم العثور على نتائج' : 'No results found'}</p>
        )}
        {showScrollButton && (
          <button
            className="absolute  left-25 bottom-1/4 text-6xl bg-white rounded-full animate-pulse "
            onClick={handleScrollToTop}
          >
            <HiArrowCircleUp />
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;
