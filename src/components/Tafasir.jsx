import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import 'swiper/css';
import 'swiper/css/free-mode';
import { Tafsir } from '../assets';
import { playPause, setActiveTafsir, setSurahId } from '../redux/features/playerSlice';
import { useGetSuwarByLanguageQuery, useGetTafsirBySuraQuery } from '../redux/services/quranApi';
import Error from './Error';
import Loader from './Loader';
import PlayPause from './PlayPause';
import { SelectInput } from '../assets/constants';
import React, { memo } from 'react';

const TafsirCard = memo(({ tafsir, i, t, isPlaying, activeTafsir, handlePauseClick, handlePlayClick }) => (
  <div
    className={`w-full flex flex-row items-center hover:bg-[#4c426e] ${activeTafsir?.id === tafsir?.id ? 'bg-[#4c426e]' : 'bg-transparent'} py-2 p-2 rounded-lg cursor-pointer mb-2`}
  >
    <h3 className="font-bold text-base text-white mr-3">{i + 1}.</h3>
    <div className="flex-1 flex flex-row justify-between items-center">
      <img className="md:w-16 w-14 md:h-16 h-14 rounded-lg" src={Tafsir} alt={tafsir?.name} />
      <div className="flex-1 flex flex-col justify-center mx-2">
        <p className="md:text-lg text-xs font-bold text-white">{tafsir?.name}</p>
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
));


const Tafasir = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation()
  const { surahId, activeTafsir, isPlaying, language } = useSelector((state) => state.player);


  const { data: quran, isFetching: quranIsFetching, error: quranError } = useGetSuwarByLanguageQuery(language)
  const { data: tafasir, isFetching: tafasirIsFetching, error: tafasirError } = useGetTafsirBySuraQuery(surahId);

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (tafsir, i) => {
    const selectedTafsir = tafasir?.tafasir?.soar[surahId || activeTafsir?.sura_id];
    if (selectedTafsir) {
      dispatch(
        setActiveTafsir({
          song: tafsir,
          data: selectedTafsir,
          i,
        })
      );
      dispatch(playPause(true));
    }
  };

  const handleSurahChange = (selectedId) => {
    const surahData = quran?.suwar.find((rd) => rd.name == selectedId);
    if (surahData) {
      dispatch(setSurahId(surahData.id));
    }
  };
  if (tafasirIsFetching || quranIsFetching) return <Loader />;
  if (tafasirError || quranError) return <Error />;

  return (
    <div className=" flex-1 px-4 flex flex-col h-screen overflow-y-scroll hide-scrollbar">
      <div className="flex flex-col justify-center items-center mt-4 mb-8 gap-2 ">
        <h2 className={`text-white font-bold text-2xl ${t('font')}`}>{tafasir?.tafasir?.name}</h2>
        <SelectInput
          showSearch={true}
          options={quran?.suwar}
          value={quran?.suwar.find((ry) => ry.id == surahId)?.name}
          onChange={handleSurahChange}
          className={'w-1/3 '}
          placeholder={t('Choose Your Surah')}
        />
      </div>

      <div className={` flex flex-col gap-2 mb-4  overflow-y-scroll hide-scrollbar`}>

        {tafasir?.tafasir?.soar[surahId]?.map((tafsir, i) =>

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
