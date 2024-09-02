import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HiBookmark, HiBookOpen, HiOutlineMenu, HiOutlinePlay } from 'react-icons/hi';
import { RiCloseLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogoQuran } from '../assets';
import { languages, SelectInput } from '../assets/constants';
import { setLanguage } from '../redux/features/playerSlice';

const links = [
  { name: 'Quran', to: '/', icon: HiBookOpen },
  { name: 'Al-Ahadits', to: '/top-artists', icon: HiBookmark },
  { name: 'Radio', to: '/radio', icon: HiOutlinePlay },
];

export const NavLinks = ({ handleClick }) => {
  const { t } = useTranslation()
  const { language } = useSelector((state) => state.player)

  return (
    <div >
      {links.map((item) => (
        <NavLink
          key={item.name}
          to={item.to}
          className={`flex ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'} justify-start items-center my-8 text-sm font-medium text-gray-400 hover:text-cyan-400`}
          onClick={() => handleClick && handleClick()}
        >
          <item.icon className="w-6 h-6 mx-2" />
          {t(item.name)}
        </NavLink>
      ))
      }
    </div >)
};

const Sidebar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language } = useSelector((state) => state.player)
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLanguageChange = (selectedLanguage) => {
    const languageData = languages.find((lng) => lng.native == selectedLanguage);
    if (languageData) {
      const { locale } = languageData;
      i18n.changeLanguage(locale);
      dispatch(setLanguage(locale));
      setMobileMenuOpen(false)
    }
  };
  return (
    <>
      {/* Desktop Sidebar */}
      <div className='md:flex hidden flex-col justify-between   w-[240px] py-10 px-4 bg-[#191624]'>

        <div className="flex  flex-col ">
          <img src={LogoQuran} alt="logo" className="w-full text-center h-28 object-contain cursor-pointer" onClick={() => navigate('/')} />
          <NavLinks />
        </div>
        <div className='w-full'>
          <SelectInput
            options={languages}
            value={languages.find((lng) => lng.locale == language)?.native}
            onChange={handleLanguageChange}
            className={'w-full text-center'}

            placeholder={t('Choose Your Language')}
          />
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className={`absolute md:hidden block top-4 ${language === 'ar' ? 'left-3' : 'right-3'}`}>
        {!mobileMenuOpen ? (
          <HiOutlineMenu className="w-6 h-6 text-white cursor-pointer" onClick={() => setMobileMenuOpen(true)} />
        ) : (
          <RiCloseLine className="w-6 h-6 text-white cursor-pointer" onClick={() => setMobileMenuOpen(false)} />
        )}
      </div>

      {/* Mobile Sidebar */}
      <div className={`absolute top-0 flex flex-col justify-between h-full w-2/3 bg-[#483D8B]  z-10 p-6 md:hidden transform transition-transform duration-300 ${mobileMenuOpen ? `${language === 'ar' ? 'right-0' : 'left-0'}` : '-left-full'}`}>
        <div>
          <img src={LogoQuran} alt="logo" className="w-full text-center h-28 object-contain cursor-pointer"
            onClick={() => {
              setMobileMenuOpen(false)
              navigate('/')
            }} />
          <NavLinks handleClick={() => setMobileMenuOpen(false)} />
        </div>


        <SelectInput
          options={languages}
          value={languages.find((lng) => lng.locale == language)?.native}
          onChange={handleLanguageChange}
          className={'w-full mb-16  text-center'}

          placeholder={t('Choose Your Language')}
        />


      </div>
    </>
  );
};

export default Sidebar;
