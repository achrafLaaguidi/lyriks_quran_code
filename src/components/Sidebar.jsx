import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HiBookmark, HiBookOpen, HiHome, HiOutlineMenu, HiOutlinePlay } from 'react-icons/hi';
import { RiCloseLine } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogoQuran } from '../assets';

const links = [
  { name: 'Discover', to: '/', icon: HiHome },
  { name: 'Quran', to: '/quran', icon: HiBookOpen },
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
  const navigate = useNavigate()
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="md:flex hidden flex-col w-[240px] py-10 px-4 bg-[#191624]">
        <img src={LogoQuran} alt="logo" className="w-full text-center h-28 object-contain cursor-pointer" onClick={() => navigate('/')} />
        <NavLinks />
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
      <div className={`absolute top-0 h-screen w-2/3 bg-[#483D8B]  z-10 p-6 md:hidden transform transition-transform duration-300 ${mobileMenuOpen ? `${language === 'ar' ? 'right-0' : 'left-0'}` : '-left-full'}`}>
        <img src={LogoQuran} alt="logo" className="w-full text-center h-28 object-contain cursor-pointer"
          onClick={() => {
            setMobileMenuOpen(false)
            navigate('/')
          }} />
        <NavLinks handleClick={() => setMobileMenuOpen(false)} />
      </div>
    </>
  );
};

export default Sidebar;
