/* eslint-disable no-nested-ternary -- Conditional rendering keeps loading, error, and content states together. */
import { useSelector, useDispatch } from 'react-redux';
import {
  HiOutlinePlay,
  HiOutlinePause,
  HiOutlineLightBulb,
} from 'react-icons/hi';
import {
  useGetSuwarByLanguageQuery,
  useGetTafsirBySuraQuery,
} from '../redux/services/quranApi';
import {
  setSurahId,
  setActiveTafsir,
  playPause,
} from '../redux/features/playerSlice';
import { PageHeading, LoadingState, ErrorState } from './common/UI';
import DownloadSong from './DownloadSong';

export default function Tafasir() {
  const dispatch = useDispatch();
  const { surahId, language, activeTafsir, isPlaying } = useSelector(
    (s) => s.player,
  );
  const id = Number(surahId) >= 1 && Number(surahId) <= 114 ? Number(surahId) : 1;
  const quran = useGetSuwarByLanguageQuery(language);
  const result = useGetTafsirBySuraQuery(id);
  const source = result.currentData?.tafasir;
  const entries = source?.soar?.[id] || [];
  return (
    <>
      <PageHeading eyebrow="لفهم أعمق" title="تفسير القرآن">
        استمع إلى التفسير الصوتي المتاح من المصدر، سورةً بعد سورة.
      </PageHeading>
      <div className="tafsir-layout">
        <aside className="context-panel">
          <HiOutlineLightBulb className="panel-icon" />
          <h2>اختر سورة للتدبّر</h2>
          <label>
            السورة
            <select
              value={id}
              onChange={(e) => dispatch(setSurahId(Number(e.target.value)))}
            >
              {quran.data?.suwar?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id}. {s.name}
                </option>
              ))}
            </select>
          </label>
          <div className="reader-pagination">
            <button
              type="button"
              disabled={id === 1}
              onClick={() => dispatch(setSurahId(id - 1))}
            >
              السابقة
            </button>
            <button
              type="button"
              disabled={id === 114}
              onClick={() => dispatch(setSurahId(id + 1))}
            >
              التالية
            </button>
          </div>
          <p className="muted">
            المصدر المدمج يوفّر تفسيراً صوتياً. عرض شرح نصي لكل آية واختيار مصادر
            إضافية يتطلب ربط مصدر موثوق.
          </p>
        </aside>
        <section>
          {result.isFetching || quran.isLoading ? (
            <LoadingState />
          ) : result.isError || quran.isError ? (
            <ErrorState
              retry={() => {
                result.refetch();
                quran.refetch();
              }}
            />
          ) : (
            <>
              <div className="source-heading">
                <span className="eyebrow">المصدر</span>
                <h2>{source?.name || 'التفسير الصوتي'}</h2>
                {source?.author && <p>{source.author}</p>}
              </div>
              <div className="tafsir-list">
                {entries.map((entry, i) => (
                  <article
                    className={`audio-lesson ${activeTafsir.id === entry.id ? 'is-active' : ''}`}
                    key={entry.id}
                  >
                    <span className="number-badge">{i + 1}</span>
                    <h3>{entry.name}</h3>
                    <DownloadSong
                      audio={entry.url}
                      name={entry.name}
                      size={18}
                    />
                    <button
                      className="icon-button play-button"
                      type="button"
                      disabled={!entry.url}
                      aria-label={`${activeTafsir.id === entry.id && isPlaying ? 'إيقاف' : 'استماع إلى'} ${entry.name}`}
                      onClick={() => {
                        if (activeTafsir.id === entry.id) dispatch(playPause(!isPlaying));
                        else {
                          dispatch(
                            setActiveTafsir({ song: entry, data: entries, i }),
                          );
                          dispatch(playPause(true));
                        }
                      }}
                    >
                      {activeTafsir.id === entry.id && isPlaying ? (
                        <HiOutlinePause />
                      ) : (
                        <HiOutlinePlay />
                      )}
                    </button>
                  </article>
                ))}
                {!entries.length && (
                  <p className="state">
                    لا توجد دروس متاحة لهذه السورة من المصدر الحالي.
                  </p>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
}
