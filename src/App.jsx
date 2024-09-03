import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { Route, Routes, useLocation } from 'react-router-dom';
import { paths } from './assets/constants';
import { MusicPlayer, Searchbar, Sidebar, TopPlay } from './components';
import { Discover, Hadith, Surah } from './pages';
import Radio from './pages/Radio';

const App = () => {
  const { activeSong, surahId, activeTafsir, language } = useSelector((state) => state.player);
  const { i18n } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const [isInclude, setIncludes] = useState(false);
  const [isUp, setIsUp] = useState(true)
  useEffect(() => {

    i18n.changeLanguage(language);
    setIncludes(paths.some((path) => path === location.pathname));
  }, [location.pathname]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleUpDown = () => {
    setIsUp(!isUp)
  }

  return (
    <div className={`relative flex ${language === 'ar' && 'flex-row-reverse'} h-screen  `}>
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gradient-to-br from-black to-[#121286] ">
        {isInclude && <Searchbar handleChange={handleChange} searchTerm={searchTerm} />}

        <div className=" overflow-y-scroll hide-scrollbar flex xl:flex-row flex-col-reverse">
          <div className=" flex-1 h-fit  ">
            <Routes>
              <Route path="/" element={<Discover searchTerm={searchTerm} />} />
              <Route path="/surah/:id" element={<Surah />} />
              <Route path="/radio" element={<Radio searchTerm={searchTerm} />} />
              <Route path="/hadiths" element={<Hadith />} />
            </Routes>
          </div>
          {surahId &&
            <div className="xl:sticky  relative top-0 h-fit px-4">
              <TopPlay />
            </div>}
        </div>
      </div>

      {(activeSong?.id || activeTafsir?.id) && (
        <div className="absolute flex-col  items-center w-full h-fit md:pb-2 pb-4 md:bottom-0 bottom-12 left-0 right-0 flex animate-slideup bg-gradient-to-br from-white/10 to-[#2a2a80] backdrop-blur-lg rounded-3xl z-50">
          <div
            className='animate-slideup bg-gradient-to-br from-black/10 to-[#03033f] backdrop-blur-lg rounded-lg w-fit px-4 cursor-pointer'
            onClick={handleUpDown}>
            {isUp ? <HiChevronDown className='text-2xl text-white' />
              : <HiChevronUp className='text-2xl text-white' />}
          </div>
          <MusicPlayer isUp={isUp} />
        </div>
      )}
    </div>
  );
};

export default App;
