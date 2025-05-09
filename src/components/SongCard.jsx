import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import quran from '../assets/quran.jpg';
import { playPause, setActiveSong } from '../redux/features/playerSlice';
import DownloadSong from './DownloadSong';
import PlayPause from './PlayPause';
import useGetUrl from '../assets/useGetUrl';

const SongCard = memo(({ song, isPlaying, activeSong, data, i, urlParm }) => {
  const dispatch = useDispatch();
  const { language, save } = useSelector((state) => state.player);
  const { t } = useTranslation()
  const surahSaved = save.split(',')

  const [url, setUrl] = useState(null);

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const fetchedUrl = await useGetUrl({id:urlParm.id, currentSurah: urlParm.currentSurah});
        setUrl(fetchedUrl);
      } catch (error) {
        console.error('Error fetching URL:', error);
      }
    };

    fetchUrl();
  }, [urlParm]);


  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = () => {
    dispatch(playPause(true));
    dispatch(setActiveSong({ song: song, data: data.suwar, i }));

  };

  return (
    <div className={`flex flex-col md:w-[200px] w-[125px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer  ${surahSaved[1] == song.id && 'border-4 border-orange-700'}  `}>
      <div className="relative w-full md:h-48 h-24 group" >
        <div className={`absolute inset-0 justify-center items-center bg-black bg-opacity-50 group-hover:flex 
          ${activeSong?.name === song.name ? 'flex bg-black bg-opacity-70' : 'hidden'} rounded-lg`}
        >
          <PlayPause
            isPlaying={isPlaying}
            activeSong={activeSong}
            song={song}
            handlePause={handlePauseClick}
            handlePlay={handlePlayClick}
          />
        </div>

        <img alt="Quran" src={quran} className="w-full h-full rounded-lg" />
      </div>

      <div className={`mt-4 flex flex-col justify-between items-center h-full  `}>
        <p className={`font-semibold md:text-lg text-sm text-white   truncate ${t('font')}`}>
          <Link to={`/surah/${song?.id}`}>
            {t('Sourat')}  {song.name}
          </Link>
        </p>
        <div className='flex flex-row justify-between items-center w-full p-1'>
          <p className='md:text-sm text-xs truncate text-white  border border-white  rounded-lg  p-1 ' >
            {song.id}
          </p>
          <p className={`md:text-sm text-xs truncate text-gray-300 py-1  ${t('font')}`}>
            <Link to={`/surah/${song?.id}`}>
              {(language === 'ar' || language === '') ? song.makkia ? 'مَكِّيَةٌ' : 'مَدَنِيَةٌ' : song.makkia ? 'Makkia' : 'Madania'}
            </Link>
          </p>
        </div>
        <DownloadSong size={25} audio={url} name={song?.name} />
      </div>


    </div>
  );
})

export default SongCard;