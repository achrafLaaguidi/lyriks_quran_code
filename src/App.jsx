import { lazy, Suspense, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import { ContentBoundary, LoadingState } from './components/common/UI';
import PersistentPlayer from './components/PersistentPlayer';

const Home = lazy(() => import('./pages/Home'));
const Discover = lazy(() => import('./pages/Discover'));
const Surah = lazy(() => import('./pages/Surah'));
const Library = lazy(() => import('./pages/Library'));
const Radio = lazy(() => import('./pages/Radio'));
const Tafasir = lazy(() => import('./components/Tafasir'));
export default function App() {
  const { language } = useSelector((s) => s.player);
  const { i18n } = useTranslation();
  const location = useLocation();
  const previousPath = useRef(location.pathname);
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);
  useEffect(() => {
    window.scrollTo(0, 0);
    if (previousPath.current !== location.pathname) {
      document.getElementById('main-content')?.focus({ preventScroll: true });
      previousPath.current = location.pathname;
    }
  }, [location.pathname]);
  return (
    <div className="app-shell" lang="ar" dir="rtl">
      <a className="skip-link" href="#main-content">
        انتقل إلى المحتوى
      </a>
      <Header />
      <main id="main-content" className="main-container" tabIndex={-1}>
        <ContentBoundary key={location.pathname}>
          <Suspense fallback={<LoadingState />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/quran" element={<Discover />} />
              <Route path="/surah/:id" element={<Surah />} />
              <Route path="/books" element={<Library />} />
              <Route path="/chapters/:bookSlug" element={<Library />} />
              <Route path="/hadiths/:bookSlug/:chapter" element={<Library />} />
              <Route path="/radio" element={<Radio />} />
              <Route path="/tafsir" element={<Tafasir />} />
              <Route
                path="*"
                element={(
                  <div className="state">
                    <h1>الصفحة غير موجودة</h1>
                    <Link to="/">العودة للرئيسية</Link>
                  </div>
                )}
              />
            </Routes>
          </Suspense>
        </ContentBoundary>
      </main>
      <footer className="site-footer">
        <Link className="footer-brand" to="/">
          بصائر
        </Link>
        <p>رفيقك في القراءة والاستماع والتدبّر</p>
        <span>القرآن الكريم · السنة النبوية · المعرفة</span>
      </footer>
      <PersistentPlayer />
    </div>
  );
}
