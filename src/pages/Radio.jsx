/* eslint-disable no-nested-ternary -- Conditional rendering keeps loading, error, and content states together. */
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  HiOutlineStatusOnline,
  HiOutlinePlay,
  HiOutlinePause,
} from 'react-icons/hi';
import { useGetRadiosQuery } from '../redux/services/quranApi';
import { setActiveRadio, playPause } from '../redux/features/playerSlice';
import {
  PageHeading,
  SearchInput,
  LoadingState,
  ErrorState,
} from '../components/common/UI';
import useStoredState from '../hooks/useStoredState';

export default function Radio() {
  const { language, activeRadio, isPlaying } = useSelector((s) => s.player);
  const dispatch = useDispatch();
  const result = useGetRadiosQuery(language);
  const [search, setSearch] = useState('');
  const [, setRecent] = useStoredState('basair-radio', null);
  const stations = result.data?.radios?.filter((r) => r.name.toLowerCase().includes(search.toLowerCase())) || [];
  const select = (station) => {
    if (station.id === activeRadio.id) dispatch(playPause(!isPlaying));
    else {
      dispatch(
        setActiveRadio({
          song: station,
          data: result.data.radios,
          i: result.data.radios.findIndex((r) => r.id === station.id),
        }),
      );
      dispatch(playPause(true));
    }
    setRecent({ id: station.id, name: station.name });
  };
  return (
    <>
      <PageHeading eyebrow="تلاوات ترافق يومك" title="الإذاعة الإسلامية">
        اختر إذاعتك واستمع مباشرة. يستمر الاستماع أثناء تنقّلك بين الصفحات.
      </PageHeading>
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="ابحث عن إذاعة…"
      />
      {result.isLoading ? (
        <LoadingState />
      ) : result.isError ? (
        <ErrorState retry={result.refetch} />
      ) : (
        <>
          <div className="list-meta">
            <span>الإذاعات المتاحة</span>
            <span>{stations.length} إذاعة</span>
          </div>
          <div className="radio-grid">
            {stations.map((r) => (
              <article
                className={`station-card ${activeRadio.id === r.id ? 'is-active' : ''}`}
                key={r.id}
              >
                <span className="service-icon">
                  <HiOutlineStatusOnline />
                </span>
                <div>
                  <span className="eyebrow">
                    {activeRadio.id === r.id && isPlaying
                      ? 'قيد الاستماع'
                      : 'بث مباشر'}
                  </span>
                  <h2>{r.name}</h2>
                </div>
                <button
                  type="button"
                  className="icon-button play-button"
                  disabled={!r.url}
                  aria-label={`${activeRadio.id === r.id && isPlaying ? 'إيقاف' : 'تشغيل'} ${r.name}`}
                  onClick={() => select(r)}
                >
                  {activeRadio.id === r.id && isPlaying ? (
                    <HiOutlinePause />
                  ) : (
                    <HiOutlinePlay />
                  )}
                </button>
              </article>
            ))}
          </div>
          {!stations.length && (
            <p className="state">لا توجد إذاعات مطابقة لبحثك.</p>
          )}
        </>
      )}
    </>
  );
}
