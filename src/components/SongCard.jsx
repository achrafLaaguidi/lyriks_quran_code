import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PlayPause from './PlayPause';
import { playPause, setActiveSong, setSurahId } from '../redux/features/playerSlice';
import quran from '../assets/quran.jpg';

const SongCard = ({ song, isPlaying, activeSong, data, i }) => {
  const dispatch = useDispatch();
  const { language } = useSelector((state) => state.player);



  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = () => {
    dispatch(playPause(true));
    dispatch(setActiveSong({ song: song, data: data.suwar, i }));

  };

  return (
    <div className="flex flex-col w-[250px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer">
      <div className="relative w-full h-56 group" onClick={() => dispatch(setSurahId(song.id))} >
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

      <div className="mt-4 flex flex-col text-right">
        <p className="font-semibold text-base text-white truncate">
          {!song.name.includes('سورة') && <> {(language === 'ar' || language === '') ? 'سورة' : 'Surat'}</>}  {song.name}
          <Link to={`/surah/${song?.number}`}>
          </Link>
        </p>
        <div className='flex flex-row justify-between'>
          <p className='text-sm truncate text-white  border border-white rounded-full p-1'>
            {song.id}
          </p>
          <p className="text-sm truncate text-gray-300 mt-1">
            <Link to={`/surah/${song?.number}`}>
              {(language === 'ar' || language === '') ? song.makkia ? 'مَكٍّيِةٌ' : 'مَدَنِيَةٌ' : song.makkia ? 'Makkia' : 'Madania'}
            </Link>
          </p>

        </div>

      </div>


    </div>
  );
};

export default SongCard;