import React from 'react';
import { useTranslation } from 'react-i18next';

import { FiSearch } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const Searchbar = ({ handleChange, searchTerm }) => {
  const { language } = useSelector((state) => state.player)
  const { t } = useTranslation()


  return (
    <div autoComplete="off" className={`p-2 text-gray-400 focus-within:text-gray-600  flex-1 flex ${language === 'ar' && 'justify-end'}`}>
      <label htmlFor="search-field" className="sr-only">
        {t('Search')}
      </label>
      <div className={`flex ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'} justify-start  items-center md:w-1/2 w-3/2   rounded-xl`} style={{ border: '1px solid white' }}>
        <FiSearch aria-hidden="true" className={`w-fit h-fit ${language === 'ar' ? 'mr-4' : 'ml-4'}`} />
        <input
          name="search-field"
          autoComplete="off"
          id="search-field"
          className={`flex-1 ${language === 'ar' && 'text-right px-0'} bg-transparent  placeholder-gray-500 outline-none text-base text-white   p-2`}
          placeholder={t('Search')}
          type="search"
          value={searchTerm}
          onChange={(e) => handleChange(e)}
        />
      </div>
    </div>
  );
};

export default Searchbar;