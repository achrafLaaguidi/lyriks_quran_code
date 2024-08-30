import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import quran from '../assets/quran.jpg';
import { playPause, setActiveSong, setSurahId } from '../redux/features/playerSlice';
import PlayPause from './PlayPause';
import { useTranslation } from 'react-i18next';

const SongCard = ({ song, isPlaying, activeSong, data, i }) => {
  const dispatch = useDispatch();
  const { language } = useSelector((state) => state.player);
  const { t } = useTranslation()


  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = () => {
    dispatch(playPause(true));
    dispatch(setActiveSong({ song: song, data: data.suwar, i }));

  };

  return (
    <div className="flex flex-col md:w-[200px] w-[125px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer ">
      <div className="relative w-full md:h-48 h-24 group" onClick={() => dispatch(setSurahId(song.id))} >
        <div className={`absolute inset-0 justify-center items-center bg-black bg-opacity-50 group-hover:flex 
          ${activeSong?.name === song.name ? 'flex bg-black bg-opacity-70' : 'hidden'}`}
        >
          <PlayPause
            isPlaying={isPlaying}
            activeSong={activeSong}
            song={song}
            handlePause={handlePauseClick}
            handlePlay={handlePlayClick}
          />
        </div>

        <img alt="song_img" src={quran} className="w-full h-full rounded-lg" />
      </div>

      <div className={`mt-4 flex flex-col ${language === 'ar' ? 'text-right' : 'text-left'} `}>
        <p className="font-semibold md:text-base text-sm text-white truncate">
          <Link to={`/surah/${song?.id}`}>
            {t('Sourat')}  {song.name}
          </Link>
        </p>
        <div className='flex flex-row justify-between'>
          <p className='md:text-sm text-xs truncate text-white  border border-white rounded-full  p-1 ' >
            {song.id}
          </p>
          <p className="md:text-sm text-xs truncate text-gray-300 mt-1">
            <Link to={`/surah/${song?.id}`}>
              {(language === 'ar' || language === '') ? song.makkia ? 'مَكٍّيِةٌ' : 'مَدَنِيَةٌ' : song.makkia ? 'Makkia' : 'Madania'}
            </Link>
          </p>

        </div>

      </div>


    </div>
  );
};

export default SongCard;