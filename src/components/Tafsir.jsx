/* eslint-disable import/no-unresolved */
import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { playPause, setActiveTafsir } from '../redux/features/playerSlice';
import PlayPause from './PlayPause';

import 'swiper/css';
import 'swiper/css/free-mode';
import { quran } from '../assets';
import { useGetTafsirBySuraQuery } from '../redux/services/quranApi';
import Error from './Error';
import Loader from './Loader';

const TafsirCard = ({ tafsir, i, isPlaying, activeTafsir, handlePauseClick, handlePlayClick }) =>
(<div className={`w-full flex flex-row items-center hover:bg-[#4c426e] ${activeTafsir?.id == tafsir?.id ? 'bg-[#4c426e]' : 'bg-transparent'} py-2 p-4 rounded-lg cursor-pointer mb-2`}>
  <h3 className="font-bold text-base text-white mr-3">{i + 1}.</h3>
  <div className="flex-1 flex flex-row justify-between items-center">
    <img className="w-20 h-20 rounded-lg" src={quran} alt={tafsir?.name} />
    <div className="flex-1 flex flex-col justify-center mx-3">
      <p className="text-xl font-bold text-white">{tafsir?.name}</p>
      <p className="text-base text-gray-300 mt-1">سورة رقم {tafsir?.sura_id}</p>
    </div>
  </div>
  <PlayPause
    isPlaying={isPlaying}
    activeTafsir={activeTafsir}
    song={tafsir}
    handlePause={handlePauseClick}
    handlePlay={handlePlayClick}
  />
</div>)
  ;

const Tafasir = () => {
  const dispatch = useDispatch();
  const { surahId, activeTafsir, isPlaying, language } = useSelector((state) => state.player);
  const { data, isFetching, error } = useGetTafsirBySuraQuery(surahId || activeTafsir.sura_id);
  const tafsirListRef = useRef();

  useEffect(() => {
    if (tafsirListRef.current) {
      tafsirListRef.current.scrollIntoView({ behavior: 'smooth' });
    }

  }, [surahId || activeTafsir.sura_id]);

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (tafsir, i) => {
    dispatch(setActiveTafsir({ song: tafsir, data: data.tafasir.soar[surahId || activeTafsir.sura_id], i }));
    dispatch(playPause(true));
  };

  if (isFetching) return <Loader />;
  if (error) return <Error language={language} />;

  return (
    <div className="xl:ml-6 ml-0 xl:mb-0 mb-6 flex-1 xl:max-w-[500px] max-w-full flex flex-col">
      <div className="flex flex-row justify-center items-center">
        <h2 className="text-white font-bold text-xl">{data.tafasir.name}</h2>
      </div>

      <div ref={tafsirListRef} className="mt-4 flex flex-col gap-1">
        {surahId || activeTafsir.sura_id ? data?.tafasir?.soar[surahId || activeTafsir.sura_id]?.map((tafsir, i) => (
          <TafsirCard
            key={tafsir.id}
            tafsir={tafsir}
            i={i}
            isPlaying={isPlaying}
            activeTafsir={activeTafsir}
            handlePauseClick={handlePauseClick}
            handlePlayClick={() => handlePlayClick(tafsir, i)}
          />
        ))
          : <h2 className='text-white text-xl text-center animate-slideup'>اختر سورة</h2>
        }
      </div>
    </div>
  );
};

export default Tafasir;
