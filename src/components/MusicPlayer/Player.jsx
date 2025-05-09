import React, { useEffect, useRef, useState } from 'react';
import useGetUrl from '../../assets/useGetUrl';

const Player = ({
  activeSong,
  isPlaying,
  volume,
  seekTime,
  onEnded,
  onTimeUpdate,
  onLoadedData,
  currentSong,
  activeTafsir,
  repeat
}) => {
  const [audio, setAudio] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    if (activeTafsir?.id) {
      setAudio(activeTafsir.url);
    } else if (activeSong && currentSong) {
      const audioUrl = useGetUrl({ id: activeSong?.id, currentSurah: currentSong })
      setAudio(audioUrl);
    }
  }, [activeSong, activeTafsir, currentSong]);

  if (ref.current) {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (ref.current) {
      ref.current.currentTime = seekTime;
    }
  }, [seekTime]);



  return (
    <audio
      src={audio}
      ref={ref}
      loop={repeat}
      onEnded={onEnded}
      onTimeUpdate={onTimeUpdate}
      onLoadedData={onLoadedData}
      aria-label="Audio player"
    />

  );
};

export default Player;
