import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import { MusicPlayer, Searchbar, Sidebar, TopPlay } from './components';
import { AroundYou, ArtistDetails, Discover, Search, SongDetails, TopArtists } from './pages';
import Radio from './pages/Radio';
import { useRef, useEffect } from 'react';

const App = () => {
  const { activeSong, activeTafsir } = useSelector((state) => state.player);
  const quranList = useRef(null);

  useEffect(() => {
    if (quranList.current) {
      quranList.current.scrollIntoView({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleScrollToTop = () => {
    quranList.current.scrollIntoView({ top: 0, behavior: 'smooth' });

  };

  return (
    <div className="relative flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gradient-to-br from-black to-[#121286]">
        <Searchbar />

        <div className="px-6 h-[calc(100vh-72px)] overflow-y-scroll hide-scrollbar flex xl:flex-row flex-col-reverse" >
          <div className="flex-1 h-fit pb-40" ref={quranList}>
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
          <div className="xl:sticky relative top-0 h-fit">
            <TopPlay />
          </div>
        </div>
      </div>

      {(activeSong?.id || activeTafsir?.id) && (
        <div className="absolute h-28 sm:bottom-0 bottom-12 left-0 right-0 flex animate-slideup bg-gradient-to-br from-white/10 to-[#2a2a80] backdrop-blur-lg rounded-t-3xl z-50">
          <MusicPlayer />
        </div>
      )}

      <button
        className="absolute right-8 top-1/2 transform -translate-y-1/2 rounded-full bg-neutral-500 border w-auto p-2"
        onClick={handleScrollToTop}
      >
        Scroll to Top
      </button>
    </div>
  );
};

export default App;
