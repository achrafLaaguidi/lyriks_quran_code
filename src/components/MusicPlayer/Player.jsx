/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef, useState } from 'react';

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
  repeat,
}) => {
  const [audio, setAudio] = useState('');
  const ref = useRef(null);

  // Gestion de la source audio selon activeTafsir ou activeSong
  useEffect(() => {
    if (activeTafsir?.id) {
      setAudio(activeTafsir.url);
    } else if (activeSong && currentSong) {
      const id = activeSong.id;
      const reciterServer = currentSong.reciters[0].moshaf[0]?.server;
      const formattedIndex = id >= 100 ? id : id >= 10 ? `0${id}` : `00${id}`;
      const audioUrl = `${reciterServer}${formattedIndex}.mp3`;
      setAudio(audioUrl);
    }
  }, [activeSong, activeTafsir, currentSong]);

  // Gestion du contrôle lecture/pause

  if (ref.current) {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  // Mise à jour du volume
  useEffect(() => {
    if (ref.current) {
      ref.current.volume = volume;
    }
  }, [volume]);

  // Gestion du temps de lecture
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
    />
  );
};

export default Player;
