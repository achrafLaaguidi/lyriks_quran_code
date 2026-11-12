import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  HiOutlineBookOpen,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineSearch,
} from 'react-icons/hi';
import { setLanguage } from '../../redux/features/playerSlice';

const links = [
  ['/quran', 'القرآن الكريم'],
  ['/books', 'الحديث النبوي'],
  ['/radio', 'الإذاعة الإسلامية'],
  ['/tafsir', 'التفسير'],
];
export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { language } = useSelector((s) => s.player);
  const dispatch = useDispatch();
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/" onClick={() => setOpen(false)}>
          <span className="brand-symbol">
            <HiOutlineBookOpen />
          </span>
          <span>
            بصائر<small>قرآنٌ يُتلى، وعلمٌ يُنير</small>
          </span>
        </Link>
        <nav
          id="main-navigation"
          aria-label="التنقل الرئيسي"
          className={open ? 'navigation is-open' : 'navigation'}
        >
          {links.map(([to, label]) => (
            <NavLink
              className={({ isActive }) => (isActive
                || (to === '/quran' && pathname.startsWith('/surah'))
                || (to === '/books' && /chapters|hadiths/.test(pathname))
                ? 'nav-link selected'
                : 'nav-link')}
              key={to}
              to={to}
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <Link
            className="icon-button"
            aria-label="البحث عن سورة"
            to="/quran?search=1"
          >
            <HiOutlineSearch />
          </Link>
          <label className="language-select">
            <span className="sr-only">لغة المحتوى</span>
            <select
              value={language}
              onChange={(e) => dispatch(setLanguage(e.target.value))}
            >
              <option value="ar">العربية</option>
              <option value="eng">English</option>
              <option value="fr">Français</option>
            </select>
          </label>
          <button
            className="icon-button menu-toggle"
            type="button"
            aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={open}
            aria-controls="main-navigation"
            onClick={() => setOpen(!open)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setOpen(false);
            }}
          >
            {open ? <HiOutlineX /> : <HiOutlineMenu />}
          </button>
        </div>
      </div>
    </header>
  );
}
