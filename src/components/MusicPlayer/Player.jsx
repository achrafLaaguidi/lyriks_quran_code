import { t } from 'i18next';
import React, { useEffect, useRef, useState } from 'react';
import { HiDownload } from 'react-icons/hi';
import Swal from 'sweetalert2';

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
  language
}) => {
  const [audio, setAudio] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const ref = useRef(null);

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

  const handleDownload = async () => {
    if (audio) {
      setIsDownloading(true);

      Swal.fire({
        title: `${language !== 'ar' ? 'Téléchargement en cours...' : '...جاري التحميل'}`,
        html: 'Progression : <b>0%</b>',
        allowOutsideClick: false,
        showConfirmButton: false,
        position: 'top',
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        const response = await fetch(audio);
        if (!response.ok) throw new Error('Erreur réseau');

        const total = parseInt(response.headers.get('content-length'), 10); // Taille totale du fichier
        let loaded = 0; // Octets téléchargés

        const reader = response.body.getReader();
        const stream = new ReadableStream({
          start(controller) {
            function push() {
              reader.read().then(({ done, value }) => {
                if (done) {
                  controller.close();
                  return;
                }
                loaded += value.length;
                controller.enqueue(value);

                // Mettre à jour la progression dans l'alerte
                const progress = loaded / total;
                Swal.getHtmlContainer().querySelector('b').textContent = `${Math.round(progress * 100)}%`;

                push();
              });
            }
            push();
          },
        });

        const blob = await new Response(stream).blob();

        // Télécharger le fichier après téléchargement complet
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = (activeSong?.name || activeTafsir?.name) + '.mp3';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Fermer l'alerte et afficher une notification de succès
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: `${t('DownloadComplete')}`,
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        console.error('Erreur lors du téléchargement du fichier :', error);
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: `${t('DownloadFailed')}`,
        });
      } finally {
        setIsDownloading(false);
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
        aria-label="Audio player"
      />
      <button
        className="bg-white p-2 rounded-md md:text-3xl text-2xl bottom-4 sm:right-4 right-2 absolute"
        onClick={handleDownload}
        disabled={!audio || isDownloading}
        aria-label="Download audio"
      >
        <HiDownload />
      </button>
    </div>
  );
};

export default Player;
