/* eslint-disable no-nested-ternary -- Conditional rendering keeps loading, error, and content states together. */
import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  HiOutlineLibrary,
  HiOutlineBookmark,
  HiOutlineDuplicate,
  HiOutlineShare,
} from 'react-icons/hi';
import {
  useGetChaptersQuery,
  useGetHadithsQuery,
} from '../redux/services/booksApi';
import {
  PageHeading,
  SearchInput,
  LoadingState,
  ErrorState,
} from '../components/common/UI';
import useStoredState from '../hooks/useStoredState';

export default function Library() {
  const { bookSlug, chapter } = useParams();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const rawBooks = t('books', { returnObjects: true });
  const books = Array.isArray(rawBooks) ? rawBooks : [];
  const book = books.find((b) => b.bookSlug === bookSlug);
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState('');
  const [bookmarks, setBookmarks] = useStoredState(
    'basair-hadith-bookmarks',
    [],
  );
  const [, setRecent] = useStoredState('basair-hadith', null);
  useEffect(() => {
    setSearch('');
    setDebounced('');
    setPage(1);
  }, [pathname]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);
  const chapters = useGetChaptersQuery(
    { bookSlug },
    { skip: !bookSlug || !!chapter },
  );
  const hadiths = useGetHadithsQuery(
    { book: bookSlug, chapter, words: debounced, page, locale: t('lang') },
    { skip: !chapter },
  );
  const query = chapter ? hadiths : chapters;
  const chapterList = chapters.data?.chapters?.filter(
    (c) => String(c[`chapter${t('lang')}`] || c.chapterArabic || '').includes(
      search,
    ) || String(c.chapterNumber) === search,
  ) || [];
  const entries = hadiths.data?.hadiths;
  useEffect(() => {
    const first = entries?.data?.[0];
    if (chapter && first) setRecent({ path: pathname, name: `${book?.bookName || bookSlug} — ${first.hadithNumber}` });
  }, [entries, chapter, pathname, book?.bookName, bookSlug, setRecent]);
  const chapterName = entries?.data?.[0]?.chapter?.[`chapter${t('lang')}`];
  const textFor = (h) => h[`hadith${t('lang')}`] || h.hadithArabic || '';
  const reference = (h) => `${book?.bookName || bookSlug} — ${h.hadithNumber}`;
  const copy = async (h) => {
    try {
      await navigator.clipboard.writeText(`${textFor(h)}\n${reference(h)}`);
      setNotice('تم نسخ الحديث مع المرجع.');
    } catch {
      setNotice('تعذّر النسخ. يمكنك تحديد النص ونسخه يدوياً.');
    }
  };
  const share = async (h) => {
    if (!navigator.share) {
      await copy(h);
      return;
    }
    try {
      await navigator.share({
        title: reference(h),
        text: `${textFor(h)}\n${reference(h)}`,
        url: window.location.href,
      });
    } catch (e) {
      if (e.name !== 'AbortError') setNotice('تعذّرت المشاركة.');
    }
  };
  return (
    <>
      <PageHeading
        eyebrow="من هدي السنة"
        title={
          chapter
            ? chapterName || 'الأحاديث النبوية'
            : bookSlug
              ? book?.bookName || bookSlug
              : 'مكتبة الحديث النبوي'
        }
      >
        تصفّح المجموعات والأبواب واقرأ الأحاديث مع مراجعها كما يوردها المصدر.
      </PageHeading>
      {bookSlug && (
        <nav className="breadcrumbs" aria-label="مسار التصفح">
          <Link to="/books">مكتبة الحديث</Link>
          <span>/</span>
          {chapter ? (
            <Link to={`/chapters/${bookSlug}`}>
              {book?.bookName || bookSlug}
            </Link>
          ) : (
            <span>{book?.bookName || bookSlug}</span>
          )}
          {chapter && (
            <>
              <span>/</span>
              <span>الباب {chapter}</span>
            </>
          )}
        </nav>
      )}
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder={
          chapter
            ? 'ابحث في نص الحديث…'
            : bookSlug
              ? 'ابحث في الأبواب…'
              : 'ابحث عن مجموعة…'
        }
      />
      {!bookSlug ? (
        <div className="collection-grid">
          {books
            .filter((b) => b.bookName.includes(search))
            .map((b) => (
              <Link
                className="collection-card"
                key={b.id}
                to={`/chapters/${b.bookSlug}`}
              >
                <HiOutlineLibrary className="panel-icon" />
                <h2>{b.bookName}</h2>
                <p>{b.writerName}</p>
                <span className="card-action">
                  {b.hadiths_count} {b.hadiths} · تصفّح الأبواب ←
                </span>
              </Link>
            ))}
        </div>
      ) : query.isFetching ? (
        <LoadingState />
      ) : query.isError ? (
        <ErrorState retry={query.refetch}>
          {import.meta.env.VITE_HADITH_API_KEY
            ? 'تعذّر الاتصال بمصدر الأحاديث. يرجى المحاولة مجدداً.'
            : 'يتطلب مصدر الأحاديث مفتاح VITE_HADITH_API_KEY صالحاً في إعدادات التطبيق.'}
        </ErrorState>
      ) : !chapter ? (
        <div className="chapter-grid">
          {chapterList.map((c) => (
            <Link
              className="chapter-card"
              key={c.id}
              to={`/hadiths/${bookSlug}/${c.chapterNumber}`}
            >
              <span className="number-badge">{c.chapterNumber}</span>
              <h2>{c[`chapter${t('lang')}`] || c.chapterArabic}</h2>
              <span aria-hidden="true">←</span>
            </Link>
          ))}
          {!chapterList.length && (
            <p className="state">لا توجد أبواب مطابقة لبحثك.</p>
          )}
        </div>
      ) : (
        <>
          <p role="status" className="notice">
            {notice}
          </p>
          <div className="hadith-list">
            {entries?.data?.map((h) => {
              const key = `${bookSlug}:${h.hadithNumber}`;
              const saved = bookmarks.includes(key);
              return (
                <article className="hadith-card" key={h.id}>
                  <div className="hadith-meta">
                    <span>{reference(h)}</span>
                    {h.status && <span className="grade">{h.status}</span>}
                  </div>
                  <p
                    className="hadith-text"
                    dir={t('lang') === 'Arabic' ? 'rtl' : 'auto'}
                  >
                    {textFor(h)}
                  </p>
                  <div className="hadith-actions">
                    <button type="button" onClick={() => copy(h)}>
                      <HiOutlineDuplicate />
                      نسخ مع المرجع
                    </button>
                    <button type="button" onClick={() => share(h)}>
                      <HiOutlineShare />
                      مشاركة
                    </button>
                    <button
                      type="button"
                      aria-pressed={saved}
                      onClick={() => {
                        setBookmarks(
                          saved
                            ? bookmarks.filter((v) => v !== key)
                            : [...bookmarks, key],
                        );
                        setRecent({ path: pathname, name: reference(h) });
                        setNotice(
                          saved
                            ? 'أزيل الحديث من المحفوظات.'
                            : 'تم حفظ الحديث.',
                        );
                      }}
                    >
                      <HiOutlineBookmark />
                      {saved ? 'محفوظ' : 'حفظ'}
                    </button>
                  </div>
                </article>
              );
            })}
            {!entries?.data?.length && (
              <p className="state">لا توجد أحاديث مطابقة لبحثك.</p>
            )}
          </div>
          <nav className="reader-pagination" aria-label="صفحات الأحاديث">
            <button
              type="button"
              disabled={!entries?.prev_page_url}
              onClick={() => setPage(Math.max(1, page - 1))}
            >
              السابق
            </button>
            <span aria-live="polite">
              الصفحة {page}
              {entries?.last_page ? ` / ${entries.last_page}` : ''}
            </span>
            <button
              type="button"
              disabled={!entries?.next_page_url}
              onClick={() => setPage(page + 1)}
            >
              التالي
            </button>
          </nav>
        </>
      )}
    </>
  );
}
