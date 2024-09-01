import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes, useLocation } from 'react-router-dom';
import { paths } from './assets/constants';
import { MusicPlayer, Searchbar, Sidebar, TopPlay } from './components';
import { AroundYou, ArtistDetails, Discover, Quran, Search, SongDetails, Surah } from './pages';
import Radio from './pages/Radio';

const App = () => {
  const { activeSong, surahId, activeTafsir, language } = useSelector((state) => state.player);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const [isInclude, setIncludes] = useState(false)
  useEffect(() => {
    setIncludes(paths.some((path) => path === location.pathname));
  }, [location.pathname]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };


  return (
    <div className={`relative flex ${language === 'ar' && 'flex-row-reverse'} h-screen w-screen`}>
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gradient-to-br from-black to-[#121286] ">
        {isInclude && <Searchbar handleChange={handleChange} searchTerm={searchTerm} />}

        <div className=" h-screen   overflow-y-scroll hide-scrollbar flex xl:flex-row flex-col-reverse">
          <div className=" flex-1 h-fit  ">
            <Routes>
              <Route path="/" element={<Discover searchTerm={searchTerm} />} />
              <Route path="/surah/:id" element={<Surah />} />
              <Route path="/radio" element={<Radio />} />
              <Route path="/around-you" element={<AroundYou />} />
              <Route path="/artists/:id" element={<ArtistDetails />} />
              <Route path="/surah/:number" element={<SongDetails />} />
              <Route path="/search/:searchTerm" element={<Search />} />
            </Routes>
          </div>
          {surahId &&
            <div className="xl:sticky relative top-0 h-fit px-4">
              <TopPlay />
            </div>}
        </div>
      </div>

      {(activeSong?.id || activeTafsir?.id) && (
        <div className="absolute md:h-28 h-24 md:bottom-0 bottom-12 left-0 right-0 flex animate-slideup bg-gradient-to-br from-white/10 to-[#2a2a80] backdrop-blur-lg rounded-3xl z-50">
          <MusicPlayer />
        </div>
      )}
    </div>
  );
};

export default App;
