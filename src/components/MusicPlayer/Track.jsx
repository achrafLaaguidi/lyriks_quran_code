import React from 'react';
import { quran } from '../../assets';

const Track = ({ isPlaying, isActive, activeSong, activeTafsir, language, activeSurah }) => (
  <div className="flex-1 flex items-center justify-start">
    <div className={`${isPlaying && isActive ? 'animate-[spin_3s_linear_infinite]' : ''} hidden sm:block h-16 w-16 mr-4`}>
      <img src={quran} alt={activeSong.name || activeTafsir.name} className="rounded-full" />
    </div>

    <div className="sm:w-[50%] w-[75%]">
      <p className="truncate text-white font-bold sm:text-lg">
        {language === 'ar' ?
          `${activeSurah || activeTafsir?.id ? `${!activeTafsir?.id ? `سورة ${activeSong?.name}` : `${activeTafsir.name} `}` : 'لا يوجد تسجيل '} `
          :
          `${activeSurah || activeTafsir?.id ? `${!activeTafsir?.id ? `Surah ${activeSong?.name}` : `${activeTafsir.name} `}` : 'Not active surah'} `}
      </p>
      <p className="truncate text-gray-300">
        {language === 'ar' ?
          `${activeSurah || activeTafsir?.id
            ? activeSong?.makkia
              ? 'مَكٍّيِةٌ'
              : 'مَدَنِيَةٌ'
            : ''} `
          :
          `${activeSurah || activeTafsir?.id ?
            activeSong?.makkia
              ? 'Makkia'
              : 'Madania' : ''} `}

      </p>
    </div>
  </div>
);


export default Track;
