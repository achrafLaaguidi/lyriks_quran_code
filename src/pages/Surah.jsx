/* eslint-disable no-nested-ternary -- Conditional rendering keeps loading, error, and content states together. */
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  HiOutlineBookmark,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'react-icons/hi';
import {
  useGetAyatsBySurahAndReaderQuery,
  useGetSuwarByLanguageQuery,
} from '../redux/services/quranApi';
import { setSave } from '../redux/features/playerSlice';
import { PageHeading, ErrorState, LoadingState } from '../components/common/UI';
import useStoredState from '../hooks/useStoredState';

export default function Surah() {
  const { id } = useParams();
  const valid = /^\d+$/.test(id) && Number(id) >= 1 && Number(id) <= 114;
  const dispatch = useDispatch();
  const { language, save } = useSelector((s) => s.player);
  const result = useGetAyatsBySurahAndReaderQuery(
    { surahId: id },
    { skip: !valid },
  );
  const { data: metadata } = useGetSuwarByLanguageQuery(language);
  const pages = useMemo(
    () => [
      ...new Set(
        (Array.isArray(result.currentData) ? result.currentData : [])
          .map((a) => a.page)
          .filter(Boolean),
      ),
    ],
    [result.currentData],
  );
  const [page, setPage] = useState(() => (save?.split(',')[1] === id
    ? Math.max(1, Number(save.split(',')[0]) || 1)
    : 1));
  const [zoom, setZoom] = useState(100);
  const [imageError, setImageError] = useState(false);
  const [, setRecent] = useStoredState('basair-reading', null);
  const name = metadata?.suwar?.find((s) => s.id === Number(id))?.name;
  useEffect(() => {
    setPage(
      save?.split(',')[1] === id
        ? Math.max(1, Number(save.split(',')[0]) || 1)
        : 1,
    );
  }, [id, save]);
  useEffect(() => {
    setImageError(false);
  }, [id, page]);
  useEffect(() => {
    if (pages.length && page > pages.length) setPage(pages.length);
  }, [pages.length, page]);
  useEffect(() => {
    if (valid && name) setRecent({ id, name, page });
  }, [id, name, page, setRecent, valid]);
  if (!valid) {
    return (
      <ErrorState>
        رقم السورة غير صالح. <Link to="/quran">العودة لفهرس السور</Link>
      </ErrorState>
    );
  }
  const bookmarked = save === `${page},${id}`;
  return (
    <>
      <PageHeading
        eyebrow="القرآن الكريم"
        title={name ? `سورة ${name}` : `السورة ${id}`}
      >
        صفحات المصحف من المصدر الأصلي، دون تعديل النص القرآني.
      </PageHeading>
      <div className="reader-layout">
        <aside className="reader-aside">
          <details open>
            <summary>فهرس السور</summary>
            <nav aria-label="اختر السورة" className="surah-navigation">
              {metadata?.suwar?.map((s) => (
                <Link
                  key={s.id}
                  to={`/surah/${s.id}`}
                  aria-current={s.id === Number(id) ? 'page' : undefined}
                >
                  <span>{s.id}</span>
                  {s.name}
                </Link>
              ))}
            </nav>
          </details>
          <Link className="button" to="/quran">
            خيارات التلاوة والاستماع
          </Link>
        </aside>
        <section className="reader-panel" aria-label="قارئ المصحف">
          <div className="reader-toolbar">
            <label>
              الصفحة
              <select
                value={Math.min(page, pages.length || 1)}
                onChange={(e) => setPage(Number(e.target.value))}
              >
                {pages.map((url, i) => (
                  <option key={url} value={i + 1}>
                    {i + 1} / {pages.length}
                  </option>
                ))}
              </select>
            </label>
            <div className="button-group">
              <button
                type="button"
                disabled={zoom <= 80}
                onClick={() => setZoom(zoom - 10)}
                aria-label="تصغير صفحة المصحف"
              >
                −
              </button>
              <span>{zoom}%</span>
              <button
                type="button"
                disabled={zoom >= 160}
                onClick={() => setZoom(zoom + 10)}
                aria-label="تكبير صفحة المصحف"
              >
                +
              </button>
            </div>
            <button
              type="button"
              aria-pressed={bookmarked}
              onClick={() => dispatch(setSave(`${page},${id}`))}
            >
              <HiOutlineBookmark />
              {bookmarked ? 'تم حفظ الصفحة' : 'حفظ الصفحة'}
            </button>
          </div>
          {result.isFetching ? (
            <LoadingState />
          ) : result.isError ? (
            <ErrorState retry={result.refetch} />
          ) : !pages.length ? (
            <p className="state">
              لا تتوفر صفحات لهذه السورة من المصدر الحالي.
            </p>
          ) : (
            <>
              <div className="mushaf-viewport">
                {imageError ? (
                  <ErrorState retry={() => setImageError(false)}>
                    تعذّر عرض صورة المصحف.
                  </ErrorState>
                ) : (
                  <img
                    key={`${id}-${page}`}
                    className="mushaf-image"
                    style={{ width: `${zoom}%`, maxWidth: 'none' }}
                    src={pages[page - 1]}
                    alt={`صفحة ${page} من سورة ${name || id} من المصحف المصوّر`}
                    onError={() => setImageError(true)}
                  />
                )}
              </div>
              <div className="reader-pagination">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  <HiOutlineChevronRight />
                  الصفحة السابقة
                </button>
                <span role="status">
                  {page} / {pages.length}
                </span>
                <button
                  type="button"
                  disabled={page >= pages.length}
                  onClick={() => setPage(page + 1)}
                >
                  الصفحة التالية
                  <HiOutlineChevronLeft />
                </button>
              </div>
            </>
          )}
          <p className="reader-note">
            المصدر الحالي يوفّر صفحات مصوّرة؛ تحديد الآيات ونسخها وقراءتها بقارئ
            الشاشة يتطلب مصدراً نصياً موثوقاً.
          </p>
          <div className="reader-pagination">
            {Number(id) > 1 ? (
              <Link to={`/surah/${Number(id) - 1}`}>السورة السابقة</Link>
            ) : (
              <span />
            )}
            {Number(id) < 114 && (
              <Link to={`/surah/${Number(id) + 1}`}>السورة التالية</Link>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
