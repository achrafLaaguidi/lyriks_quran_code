import React, { useState } from 'react';
import { HiOutlineClipboardList, HiOutlineHome, HiOutlineMenu, HiOutlinePlay, HiOutlineUserGroup, HiOutlineVideoCamera } from 'react-icons/hi';
import { RiCloseLine } from 'react-icons/ri';
import { NavLink } from 'react-router-dom';

const links = [
  { name: 'Discover', to: '/', icon: HiOutlineHome },
  { name: 'Quran', to: '/quran', icon: HiOutlineClipboardList },
  { name: 'Top Artists', to: '/top-artists', icon: HiOutlineUserGroup },
  { name: 'Radio', to: '/radio', icon: HiOutlinePlay },
];

const NavLinks = ({ handleClick }) => (
  <div className="mt-10">
    {links.map((item) => (
      <NavLink
        key={item.name}
        to={item.to}
        className="flex flex-row justify-start items-center my-8 text-sm font-medium text-gray-400 hover:text-cyan-400"
        onClick={() => handleClick && handleClick()}
      >
        <item.icon className="w-6 h-6 mr-2" />
        {item.name}
      </NavLink>
    ))}
  </div>
);

const Sidebar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="md:flex hidden flex-col w-[240px] py-10 px-4 bg-[#191624]">
        <h3 className="text-white text-center text-2xl">اَلْقُرْآنُ اُلْكَرِيمُ</h3>
        <NavLinks />
      </div>

      {/* Mobile Menu Button */}
      <div className="absolute md:hidden block top-6 right-3">
        {!mobileMenuOpen ? (
          <HiOutlineMenu className="w-6 h-6 text-white cursor-pointer" onClick={() => setMobileMenuOpen(true)} />
        ) : (
          <RiCloseLine className="w-6 h-6 text-white cursor-pointer" onClick={() => setMobileMenuOpen(false)} />
        )}
      </div>

      {/* Mobile Sidebar */}
      <div className={`absolute top-0 h-screen w-2/3 bg-gradient-to-tl from-white/10 to-[#483D8B] backdrop-blur-lg z-10 p-6 md:hidden transform transition-transform duration-300 ${mobileMenuOpen ? 'left-0' : '-left-full'}`}>
        <h3 className="text-white text-center text-2xl">اَلْقُرْآنُ اُلْكَرِيمُ</h3>
        <NavLinks handleClick={() => setMobileMenuOpen(false)} />
      </div>
    </>
  );
};

export default Sidebar;
