import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { nextSong, playPause, prevSong } from '../../redux/features/playerSlice';
import { useGetRecitersByLanguageAndIdAndRewayaQuery } from '../../redux/services/quranApi';
import Error from '../Error';
import Loader from '../Loader';
import Controls from './Controls';
import Player from './Player';
import Seekbar from './Seekbar';
import Track from './Track';
import VolumeBar from './VolumeBar';

const MusicPlayer = ({ isUp }) => {
  const {
    activeSong,
    currentSongs,
    currentIndex,
    isActive,
    language,
    isPlaying,
    reader,
    riwaya,
    activeTafsir,
  } = useSelector((state) => state.player);

  const { data, isFetching, error } = useGetRecitersByLanguageAndIdAndRewayaQuery({
    lang: language,
    id: reader,
    riwaya: riwaya / 10,
  });

  const [duration, setDuration] = useState(0);
  const [seekTime, setSeekTime] = useState(0);
  const [appTime, setAppTime] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const dispatch = useDispatch();
  const activeSurah = data?.reciters?.[0]?.moshaf[0]?.surah_list
    .split(',')
    .some((id) => id === String(activeSong.id));

  const handlePlayPause = () => {
    if (!isActive) return;
    dispatch(playPause(!isPlaying));
  };

  const handleNextSong = () => {
    if (currentIndex === currentSongs.length - 1) {
      dispatch(nextSong(0));
    } else if (!shuffle) {
      dispatch(nextSong(currentIndex + 1));
    } else {
      dispatch(nextSong(Math.floor(Math.random() * currentSongs.length)));
    }
    dispatch(playPause(true));
  };

  const handlePrevSong = () => {
    if (currentIndex === 0) {
      dispatch(prevSong(currentSongs.length - 1));
    } else if (shuffle) {
      dispatch(prevSong(Math.floor(Math.random() * currentSongs.length)));
    } else {
      dispatch(prevSong(currentIndex - 1));
    }
  };

  if (isFetching) return <Loader />;
  if (error) return <Error language={language} />;


  return (
    <div className={`${!isUp && 'hidden'} relative sm:px-12 px-8 w-full flex items-center justify-between`}>
      <Track
        activeTafsir={activeTafsir}
        activeSurah={activeSurah}
        isPlaying={isPlaying}
        isActive={isActive}
        activeSong={activeSong}
        language={language}
      />
      <div className="flex-1 flex flex-col items-center justify-center">
        <Controls
          isPlaying={isPlaying}
          isActive={isActive}
          repeat={repeat}
          setRepeat={setRepeat}
          shuffle={shuffle}
          setShuffle={setShuffle}
          currentSongs={currentSongs}
          handlePlayPause={handlePlayPause}
          handlePrevSong={handlePrevSong}
          handleNextSong={handleNextSong}
        />
        <Seekbar
          value={appTime}
          min="0"
          max={duration}
          onInput={(event) => setSeekTime(event.target.value)}
          setSeekTime={setSeekTime}
          appTime={appTime}
        />
        <Player
          language={language}
          reader={reader}
          currentSong={data}
          activeSong={activeSong}
          activeTafsir={activeTafsir}
          volume={volume}
          isPlaying={isPlaying}
          seekTime={seekTime}
          repeat={repeat}
          onEnded={handleNextSong}
          onTimeUpdate={(event) => setAppTime(event.target.currentTime)}
          onLoadedData={(event) => setDuration(event.target.duration)}
        />
      </div>
      <VolumeBar
        value={volume}
        min="0"
        max="1"
        onChange={(event) => setVolume(event.target.value)}
        setVolume={setVolume}
      />
    </div>
  );
};

export default MusicPlayer;
