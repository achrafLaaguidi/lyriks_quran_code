import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FiSearch } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { setSurahId } from '../redux/features/playerSlice';

const Searchbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState('');
  const { language } = useSelector((state) => state.player)

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setSurahId(null))
    navigate(`/search/${searchTerm}`);
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off" className="p-2 text-gray-400 focus-within:text-gray-600">
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
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </form>
  );
};

export default Searchbar;