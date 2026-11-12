/* eslint-disable no-nested-ternary -- Conditional rendering keeps loading, error, and content states together. */
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import {
  HiOutlinePlay,
  HiOutlinePause,
  HiOutlineBookOpen,
} from 'react-icons/hi';
import { selectMoshaf, recitationUrl, normalizeSearch } from '../utils/quran.mjs';
import {
  useGetSuwarByLanguageQuery,
  useGetRecitersByLanguageQuery,
  useGetMushafByLanguageQuery,
} from '../redux/services/quranApi';
import {
  setReader,
  setRiwaya,
  setActiveSong,
  playPause,
} from '../redux/features/playerSlice';
import {
  PageHeading,
  SearchInput,
  LoadingState,
  ErrorState,
} from '../components/common/UI';
import DownloadSong from '../components/DownloadSong';

export default function Discover() {
  const dispatch = useDispatch();
  const { language, reader, riwaya, activeSong, isPlaying } = useSelector(
    (s) => s.player,
  );
  const [search, setSearch] = useState('');
  const [params] = useSearchParams();
  const quran = useGetSuwarByLanguageQuery(language);
  const reciters = useGetRecitersByLanguageQuery(language);
  const mushaf = useGetMushafByLanguageQuery(language);
  const readers = useMemo(
    () => reciters.data?.reciters?.filter((r) => r.moshaf.some((m) => Number(m.moshaf_type) === Number(riwaya))) || [],
    [reciters.data, riwaya],
  );
  const list = quran.data?.suwar?.filter(
    (s) => normalizeSearch(s.name).includes(normalizeSearch(search))
        || String(s.id) === search.trim(),
  ) || [];
  const moshaf = selectMoshaf(reciters.data, reader, riwaya);
  const play = (song) => {
    if (activeSong.id === song.id) dispatch(playPause(!isPlaying));
    else {
      dispatch(setActiveSong({ song, data: quran.data.suwar, i: song.id - 1 }));
      dispatch(playPause(true));
    }
  };
  return (
    <>
      <PageHeading eyebrow="اقرأ واستمع" title="القرآن الكريم">
        تصفّح السور، واختر تلاوتك، وخذ وقتك مع كتاب الله.
      </PageHeading>
      <div className="toolbar">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="اسم السورة أو رقمها…"
        />
        <label>
          الرواية
          <select
            value={riwaya}
            onChange={(e) => {
              const next = reciters.data?.reciters?.find((r) => r.moshaf.some(
                (m) => Number(m.moshaf_type) === Number(e.target.value),
              ));
              dispatch(setRiwaya(e.target.value));
              if (next) dispatch(setReader(next.id));
            }}
          >
            {mushaf.data?.riwayat?.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          القارئ
          <select
            value={
              readers.some((r) => Number(r.id) === Number(reader)) ? reader : ''
            }
            onChange={(e) => dispatch(setReader(e.target.value))}
          >
            <option value="" disabled>
              اختر القارئ
            </option>
            {readers.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      {params.has('search') && (
        <p className="muted">ابحث باسم السورة أو رقمها في حقل البحث أعلاه.</p>
      )}
      {quran.isLoading ? (
        <LoadingState />
      ) : quran.isError ? (
        <ErrorState retry={quran.refetch} />
      ) : (
        <>
          <div className="list-meta">
            <span>فهرس السور</span>
            <span>{list.length} سورة</span>
          </div>
          {!list.length && <p className="state">لا توجد سورة مطابقة لبحثك.</p>}
          <div className="surah-grid">
            {list.map((s) => {
              const url = recitationUrl(moshaf, s.id);
              const available = !!url;
              return (
                <article
                  className={`surah-card ${activeSong.id === s.id ? 'is-active' : ''}`}
                  key={s.id}
                >
                  <Link className="surah-link" to={`/surah/${s.id}`}>
                    <span className="number-badge">{s.id}</span>
                    <span>
                      <h2>{s.name}</h2>
                      <small>
                        {s.makkia ? 'مكية' : 'مدنية'} · قراءة السورة
                      </small>
                    </span>
                    <HiOutlineBookOpen />
                  </Link>
                  <div className="surah-actions">
                    <button
                      className="text-button"
                      type="button"
                      disabled={!available}
                      onClick={() => play(s)}
                    >
                      {activeSong.id === s.id && isPlaying ? (
                        <HiOutlinePause />
                      ) : (
                        <HiOutlinePlay />
                      )}
                      {activeSong.id === s.id && isPlaying
                        ? 'إيقاف مؤقت'
                        : 'استماع'}
                    </button>
                    {url && (
                      <DownloadSong audio={url} name={s.name} size={17} />
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
      {(reciters.isError || mushaf.isError) && (
        <ErrorState
          retry={() => {
            reciters.refetch();
            mushaf.refetch();
          }}
        >
          تعذّر تحميل خيارات التلاوة. يمكنك متابعة القراءة.
        </ErrorState>
      )}
    </>
  );
}
