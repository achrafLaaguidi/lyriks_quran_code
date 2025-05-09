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
  const [audioSrc, setAudioSrc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Handle audio source changes
  useEffect(() => {
    const fetchAudioUrl = async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      setIsLoading(true);

      try {
        let url;
        if (activeTafsir?.id) {
          url = activeTafsir.url;
        } else if (activeSong && currentSong) {
          url = await useGetUrl({ 
            id: activeSong?.id, 
            currentSurah: currentSong 
          }, abortControllerRef.current.signal);
        }
        
        if (url) {
          setAudioSrc(url);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching audio URL:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAudioUrl();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [activeSong, activeTafsir, currentSong]);

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;

    const handlePlay = async () => {
      try {
        await audioRef.current.play();
      } catch (error) {
        console.error('Playback error:', error);
      }
    };

    if (isPlaying && audioSrc) {
      handlePlay();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, audioSrc]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle seek time changes
  useEffect(() => {
    if (audioRef.current && seekTime !== undefined) {
      audioRef.current.currentTime = seekTime;
    }
  }, [seekTime]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="audio-player-container">
      {isLoading && <div className="audio-loading-indicator">Loading audio...</div>}
      <audio
        src={audioSrc}
        ref={audioRef}
        loop={repeat}
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
        onLoadedData={onLoadedData}
        onError={(e) => console.error('Audio error:', e)}
        aria-label="Audio player"
        preload="metadata"
      />
    </div>
  );
};

export default Player;