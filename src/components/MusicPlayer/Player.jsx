import React, { useEffect, useRef, useState } from 'react';
import { HiDownload } from 'react-icons/hi';

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
  const [isDownloading, setIsDownloading] = useState(false); // État pour l'alerte
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

  // Fonction pour afficher une notification
  const notifyDownloadStarted = () => {
    if (Notification.permission === 'granted') {
      new Notification('Download started', {
        body: 'The file is being downloaded. Please check your downloads folder.'
      });
    }
  };

  // Fonction pour le téléchargement
  const handleDownload = async () => {
    if (audio) {
      setIsDownloading(true); // Afficher l'alerte

      // Demander la permission pour les notifications
      if (Notification.permission !== 'granted') {
        await Notification.requestPermission();
      }

      try {
        const response = await fetch(audio);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        notifyDownloadStarted();
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = activeSong?.name || activeTafsir?.name; // Nom du fichier basé sur l'URL
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Afficher la notification
      } catch (error) {
        console.error('Error downloading the file:', error);
      } finally {
        setIsDownloading(false); // Masquer l'alerte
      }
    }
  };

  return (
    <div>
      <audio
        src={audio}
        ref={ref}
        loop={repeat}
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
        onLoadedData={onLoadedData}
        aria-label="Audio player" // Ajouter un label accessible
      />
      <button
        className='bg-white p-2 rounded-full text-2xl sm:bottom-11 bottom-10 sm:right-1/3 right-2 absolute'
        onClick={handleDownload}
        disabled={!audio || isDownloading} // Désactiver le bouton pendant le téléchargement
        aria-label="Download audio"
      >
        <HiDownload />
      </button>
    </div>
  );
};

export default Player;
