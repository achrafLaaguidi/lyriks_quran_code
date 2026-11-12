/* eslint-disable no-nested-ternary -- Conditional rendering keeps loading, error, and content states together. */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  HiOutlinePlay,
  HiOutlinePause,
  HiOutlineVolumeUp,
  HiOutlineVolumeOff,
  HiOutlineRefresh,
  HiOutlineRewind,
  HiOutlineFastForward,
} from 'react-icons/hi';
import { selectMoshaf, recitationUrl } from '../utils/quran.mjs';
import { playPause, nextSong, prevSong } from '../redux/features/playerSlice';
import { useGetRecitersByLanguageQuery } from '../redux/services/quranApi';

export default function PersistentPlayer() {
  const {
    activeSong,
    activeRadio,
    activeTafsir,
    language,
    reader,
    riwaya,
    isPlaying,
    currentIndex,
    currentSongs,
  } = useSelector((s) => s.player);
  const dispatch = useDispatch();
  const audio = useRef(null);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const result = useGetRecitersByLanguageQuery(
    language,
    { skip: !activeSong.id },
  );
  const active = activeRadio.id
    ? activeRadio
    : activeTafsir.id
      ? activeTafsir
      : activeSong;
  const live = !!activeRadio.id;
  const moshaf = selectMoshaf(result.currentData, reader, riwaya);
  const songUrl = recitationUrl(moshaf, activeSong.id);
  const supported = !!songUrl;
  const src = (live || activeTafsir.id ? active.url : songUrl) || '';
  const source = useRef(src);
  source.current = src;
  const playbackIntent = useRef(isPlaying);
  playbackIntent.current = isPlaying;
  const fail = useCallback((message) => {
    setLoading(false);
    setError(message);
    dispatch(playPause(false));
  }, [dispatch]);
  useEffect(() => {
    setError('');
    setElapsed(0);
    setDuration(0);
    setLoading(!!src);
  }, [src]);
  useEffect(() => {
    const element = audio.current;
    if (!element) return;
    if (isPlaying && src) {
      const requested = src;
      element.play().catch(() => {
        if (source.current === requested && playbackIntent.current) {
          fail('تعذّر التشغيل. اضغط تشغيل للمحاولة مجدداً.');
        }
      });
    } else element.pause();
  }, [isPlaying, src, fail]);
  useEffect(() => {
    if (audio.current) {
      audio.current.volume = volume;
      audio.current.muted = muted;
    }
  }, [volume, muted, active.id]);
  const move = (direction) => {
    if (!currentSongs.length) return;
    const index = shuffle
      ? Math.floor(Math.random() * currentSongs.length)
      : (currentIndex + direction + currentSongs.length) % currentSongs.length;
    dispatch(direction > 0 ? nextSong(index) : prevSong(index));
    dispatch(playPause(true));
  };
  const toggle = () => {
    setError('');
    if (audio.current?.error) audio.current.load();
    dispatch(playPause(!isPlaying));
  };
  const unavailable = activeSong.id && !result.isFetching && (!supported || result.isError);
  const format = (value) => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;
  if (!active.id) return null;
  return (
    <section className="persistent-player" aria-label="مشغل الصوت">
      <div className="player-inner">
        <div className="player-track">
          <span className="player-symbol">♪</span>
          <div>
            <small>
              {live
                ? 'إذاعة مباشرة'
                : activeTafsir.id
                  ? 'تفسير صوتي'
                  : 'تلاوة القرآن الكريم'}
            </small>
            <strong>{active.name}</strong>
            <span role="status">
              {error
                || (unavailable
                  ? 'التلاوة غير متاحة للقارئ المختار.'
                  : loading || result.isFetching
                    ? 'جارٍ الاتصال…'
                    : isPlaying
                      ? 'قيد الاستماع'
                      : 'متوقف مؤقتاً')}
            </span>
          </div>
        </div>
        <div className="player-controls">
          <button
            type="button"
            className="icon-button"
            aria-label="المقطع السابق"
            disabled={!currentSongs.length}
            onClick={() => move(-1)}
          >
            <HiOutlineFastForward />
          </button>
          <button
            type="button"
            className="icon-button play-button"
            disabled={!src}
            aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
            onClick={toggle}
          >
            {loading && isPlaying ? (
              <HiOutlineRefresh />
            ) : isPlaying ? (
              <HiOutlinePause />
            ) : (
              <HiOutlinePlay />
            )}
          </button>
          <button
            type="button"
            className="icon-button"
            aria-label="المقطع التالي"
            disabled={!currentSongs.length}
            onClick={() => move(1)}
          >
            <HiOutlineRewind />
          </button>
        </div>
        <div className="player-volume">
          <button
            type="button"
            className="icon-button"
            aria-label={muted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
            aria-pressed={muted}
            onClick={() => setMuted(!muted)}
          >
            {muted ? <HiOutlineVolumeOff /> : <HiOutlineVolumeUp />}
          </button>
          <input
            aria-label="مستوى الصوت"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </div>
        {!live && (
          <div className="player-progress">
            <label className="sr-only" htmlFor="audio-progress">
              موضع التشغيل
            </label>
            <span dir="ltr">{format(elapsed)}</span>
            <input
              id="audio-progress"
              type="range"
              min="0"
              max={duration || 0}
              value={Math.min(elapsed, duration)}
              disabled={!duration}
              step="1"
              onChange={(e) => {
                if (audio.current) {
                  audio.current.currentTime = Number(e.target.value);
                  setElapsed(Number(e.target.value));
                }
              }}
            />
            <span dir="ltr">{format(duration)}</span>
            <button
              type="button"
              aria-pressed={repeat}
              onClick={() => setRepeat(!repeat)}
            >
              تكرار
            </button>
            <button
              type="button"
              aria-pressed={shuffle}
              onClick={() => setShuffle(!shuffle)}
            >
              عشوائي
            </button>
          </div>
        )}
      </div>
      {/* Live streams and supplied recordings have no verified transcript; do not synthesize captions. */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audio}
        src={src || undefined}
        preload="none"
        loop={repeat && !live}
        onWaiting={() => setLoading(true)}
        onPlaying={() => {
          setLoading(false);
          setError('');
        }}
        onCanPlay={() => setLoading(false)}
        onError={() => fail('تعذّر الاتصال بالمصدر الصوتي. حاول مجدداً.')}
        onEnded={() => {
          if (!live) move(1);
        }}
        onTimeUpdate={(e) => setElapsed(e.currentTarget.currentTime)}
        onDurationChange={(e) => setDuration(
          Number.isFinite(e.currentTarget.duration)
            ? e.currentTarget.duration
            : 0,
        )}
      />
    </section>
  );
}
