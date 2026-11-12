import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  HiOutlineBookOpen,
  HiOutlineLibrary,
  HiOutlineStatusOnline,
  HiOutlineLightBulb,
  HiArrowLeft,
  HiOutlinePlay,
  HiOutlineBookmark,
} from 'react-icons/hi';
import { useGetSuwarByLanguageQuery } from '../redux/services/quranApi';
import { readStored } from '../hooks/useStoredState';

const services = [
  [
    '/quran',
    'القرآن الكريم',
    'اقرأ سور القرآن الكريم، واستمع إليها بصوت قارئك المفضّل.',
    HiOutlineBookOpen,
    'تصفّح السور',
  ],
  [
    '/books',
    'الحديث النبوي',
    'تصفّح كتب السنة النبوية، وابحث في أبوابها وأحاديثها.',
    HiOutlineLibrary,
    'استكشف المكتبة',
  ],
  [
    '/radio',
    'الإذاعة الإسلامية',
    'تلاوات ترافق يومك، عبر إذاعات قرآنية مباشرة.',
    HiOutlineStatusOnline,
    'استمع الآن',
  ],
  [
    '/tafsir',
    'تفسير القرآن',
    'تأمّل معاني القرآن مع دروس التفسير الصوتية المتاحة.',
    HiOutlineLightBulb,
    'استمع للتفسير',
  ],
];
export default function Home() {
  const { language, save } = useSelector((s) => s.player);
  const { data } = useGetSuwarByLanguageQuery(language);
  const recent = readStored('basair-reading', null);
  const radio = readStored('basair-radio', null);
  const hadith = readStored('basair-hadith', null);
  const saved = save?.split(',');
  const resume = recent
    || (Number(saved?.[1]) > 0
      ? {
        id: saved[1],
        name: data?.suwar?.find((s) => s.id === Number(saved[1]))?.name,
        page: saved[0],
      }
      : null);
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="gold-line" /> اقرأ. استمع. تدبّر.
          </span>
          <h1>
            رحلتك مع القرآن الكريم
            <br />
            <em>والسنة النبوية</em>
          </h1>
          <p>
            اقرأ القرآن الكريم، واستمع إلى التلاوات، وتدبر معاني الآيات، وتصفح
            الأحاديث النبوية في مكان واحد.
          </p>
          <div className="hero-actions">
            <Link className="button primary" to="/quran">
              <HiOutlineBookOpen />
              ابدأ القراءة
            </Link>
            <Link className="button" to="/radio">
              <HiOutlinePlay />
              استمع الآن
            </Link>
          </div>
          <div className="hero-note">
            <span /> مساحة هادئة للعلم والتدبّر
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="arch">
            <span className="arch-star">✧</span>
            <HiOutlineBookOpen />
            <span className="arch-calligraphy">القرآن الكريم</span>
            <span className="arch-caption">هُدًى وَنُور</span>
            <span className="arch-rule" />
          </div>
          <span className="art-caption">معك في كل يوم</span>
        </div>
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">أبواب المعرفة</span>
            <h2>كل ما يُقرّبك، في مكان واحد</h2>
          </div>
          <p>اختر وجهتك، وابدأ رحلتك</p>
        </div>
        <div className="service-grid">
          {services.map(([to, title, description, Icon, action], i) => (
            <Link className="service-card" to={to} key={to}>
              <div className="service-top">
                <span className="service-icon">
                  <Icon />
                </span>
                <span className="service-number">0{i + 1}</span>
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
              <span className="card-action">
                {action}
                <HiArrowLeft />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="explore-panel section">
        <div>
          <HiOutlineBookmark className="panel-icon" />
          <span className="eyebrow">رحلتك مستمرة</span>
          <h2>
            {resume || radio || hadith
              ? 'تابع من حيث توقّفت'
              : 'خطوة صغيرة، وأثر يبقى'}
          </h2>
          <p>اجعل للقراءة والاستماع مساحة في يومك. ستجد هنا آخر ما تصفّحته.</p>
        </div>
        <div className="resume-list">
          {resume && (
            <Link className="resume-item" to={`/surah/${resume.id}`}>
              <HiOutlineBookOpen />
              <span>
                متابعة القراءة
                <strong>
                  {resume.name || `السورة ${resume.id}`} · الصفحة{' '}
                  {resume.page || 1}
                </strong>
              </span>
              <HiArrowLeft />
            </Link>
          )}
          {radio && (
            <Link className="resume-item" to="/radio">
              <HiOutlineStatusOnline />
              <span>
                آخر إذاعة<strong>{radio.name}</strong>
              </span>
              <HiArrowLeft />
            </Link>
          )}
          {hadith && (
            <Link className="resume-item" to={hadith.path}>
              <HiOutlineLibrary />
              <span>
                آخر حديث<strong>{hadith.name}</strong>
              </span>
              <HiArrowLeft />
            </Link>
          )}
          {!resume && !radio && !hadith && (
            <Link className="resume-item" to="/quran">
              <HiOutlineBookOpen />
              <span>
                ابدأ رحلتك<strong>تصفّح سور القرآن الكريم</strong>
              </span>
              <HiArrowLeft />
            </Link>
          )}
        </div>
      </section>
      {data?.suwar?.length > 0 && (
        <section className="section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">من فهرس القرآن</span>
              <h2>ابدأ بالتلاوة</h2>
            </div>
            <Link className="text-link" to="/quran">
              جميع السور <HiArrowLeft />
            </Link>
          </div>
          <div className="featured-grid">
            {data.suwar.slice(0, 3).map((s) => (
              <Link className="resume-item" to={`/surah/${s.id}`} key={s.id}>
                <span className="number-badge">{s.id}</span>
                <strong>{s.name}</strong>
                <HiArrowLeft />
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
