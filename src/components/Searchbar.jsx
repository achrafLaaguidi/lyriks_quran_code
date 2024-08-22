import React from 'react';

import { FiSearch } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const Searchbar = ({ handleChange, searchTerm }) => {
  const { language } = useSelector((state) => state.player)



  return (
    <div autoComplete="off" className="w-[25%] p-2 text-gray-400 focus-within:text-gray-600">
      <label htmlFor="search-field" className="sr-only">
        {language == 'ar' ? 'بحث' : 'Search'}
      </label>
      <div className="flex flex-row justify-start items-center">
        <FiSearch aria-hidden="true" className="w-5 h-5 ml-4" />
        <input
          name="search-field"
          autoComplete="off"
          id="search-field"
          className="flex-1 bg-transparent border-none placeholder-gray-500 outline-none text-base text-white p-4"
          placeholder={language == 'ar' ? 'بحث' : 'Search'}
          type="search"
          value={searchTerm}
          onChange={(e) => handleChange(e)}
        />
      </div>
    </div>
  );
};

export default Searchbar;