import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { MusicPlayer, Searchbar, Sidebar, TopPlay } from './components';
import { AroundYou, ArtistDetails, Discover, Search, SongDetails, TopArtists } from './pages';
import Radio from './pages/Radio';
import { useState, useEffect, useRef } from 'react';

const App = () => {
  const { activeSong, activeTafsir } = useSelector((state) => state.player);


  return (
    <div className="relative flex ">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gradient-to-br from-black to-[#121286]">
        <Searchbar />

        <div className="px-6 h-[calc(100vh-72px)] overflow-y-scroll hide-scrollbar flex xl:flex-row flex-col-reverse">
          <div className="flex-1 h-fit pb-40">

            <Routes>
              <Route path="/" element={<Discover />} />
              <Route path="/top-artists" element={<TopArtists />} />
              <Route path="/radio" element={<Radio />} />
              <Route path="/around-you" element={<AroundYou />} />
              <Route path="/artists/:id" element={<ArtistDetails />} />
              <Route path="/surah/:number" element={<SongDetails />} />
              <Route path="/search/:searchTerm" element={<Search />} />
            </Routes>
          </div>
          <div className="xl:sticky relative top-0 h-fit  " >
            <TopPlay />
          </div>
        </div>
      </div>

      {(activeSong?.id || activeTafsir?.id) && (
        <div className="absolute h-28 bottom-0  left-0 right-0 flex animate-slideup bg-gradient-to-br from-white/10 to-[#2a2a80] backdrop-blur-lg rounded-3xl z-50">
          <MusicPlayer />
        </div>
      )}


    </div>
  );
};

export default App;
