import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { playPause, setActiveTafsir } from '../redux/features/playerSlice';
import PlayPause from './PlayPause';
import 'swiper/css';
import 'swiper/css/free-mode';
import { useGetTafsirBySuraQuery } from '../redux/services/quranApi';
import Error from './Error';
import Loader from './Loader';
import { Tafsir } from '../assets';
import { useTranslation } from 'react-i18next';

const TafsirCard = ({ tafsir, i, t, isPlaying, activeTafsir, handlePauseClick, handlePlayClick }) => (
  <div
    className={`w-full flex flex-row items-center hover:bg-[#4c426e] ${activeTafsir?.id === tafsir?.id ? 'bg-[#4c426e]' : 'bg-transparent'
      } py-2 p-2 rounded-lg cursor-pointer mb-2`}
  >
    <h3 className="font-bold text-base text-white mr-3">{i + 1}.</h3>
    <div className="flex-1 flex flex-row justify-between items-center">
      <img className="md:w-16 w-14 md:h-16 h-14 rounded-lg " src={Tafsir} alt={tafsir?.name} />
      <div className="flex-1 flex flex-col justify-center md:mx-2  ">
        <p className="md:text-lg text-xs font-bold text-white text-center ">{tafsir?.name}</p>
        <p className="md:text-base text-xs text-gray-300 mt-1">{t('Sourat') + ' ' + t('Number')} {tafsir?.sura_id}</p>
      </div>
    </div>
    <PlayPause
      isPlaying={isPlaying}
      activeSong={activeTafsir}
      song={tafsir}
      handlePause={handlePauseClick}
      handlePlay={handlePlayClick}
    />
  </div>
);

const Tafasir = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation()
  const { surahId, activeTafsir, isPlaying, language } = useSelector((state) => state.player);

  // Fetch data based on the current surahId or activeTafsir's surah id
  const { data, isFetching, error } = useGetTafsirBySuraQuery(surahId || activeTafsir?.sura_id);

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (tafsir, i) => {
    dispatch(
      setActiveTafsir({
        song: tafsir,
        data: data?.tafasir?.soar[surahId || activeTafsir?.sura_id],
        i,
      })
    );
    dispatch(playPause(true));
  };

  if (isFetching) return <Loader />;
  if (error) return <Error language={language} />;

  return (
    <div className="xl:ml-6 ml-0 xl:mb-0 mb-6 flex-1 xl:max-w-[500px] max-w-full flex flex-col h-full overflow-y-scroll hide-scrollbar">
      <div className="flex flex-row justify-center items-center">
        <h2 className="text-white font-bold text-xl">{data?.tafasir?.name}</h2>
      </div>

      <div className={`mt-4 flex flex-col gap-1 ${data?.tafasir?.soar[surahId || activeTafsir?.sura_id]?.length > 4 ? ' h-[calc(100vh-25vh)]' : 'h-fit'} overflow-y-scroll hide-scrollbar`}>

        {data?.tafasir?.soar[surahId || activeTafsir?.sura_id]?.map((tafsir, i) =>

          <TafsirCard
            t={t}
            key={tafsir.id}
            tafsir={tafsir}
            i={i}
            isPlaying={isPlaying}
            activeTafsir={activeTafsir}
            handlePauseClick={handlePauseClick}
            handlePlayClick={() => handlePlayClick(tafsir, i)}
          />
        )}


      </div>
    </div>
  );
};

export default Tafasir;
