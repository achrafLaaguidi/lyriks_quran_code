import React from 'react';
import { quran } from '../../assets';
import { t } from "i18next";


const Track = ({ isPlaying, isActive, activeSong, activeTafsir, language, activeSurah }) => (
  <div className="flex-1 flex items-center justify-start">
    <div className={`${isPlaying && isActive ? 'animate-[spin_3s_linear_infinite]' : ''} hidden sm:block h-16 w-16 mr-4`}>
      <img src={quran} alt={activeSong.name || activeTafsir.name} className="rounded-full" />
    </div>

    <div className="sm:w-[50%] w-[100%]">
      <p className="truncate text-white font-bold sm:text-lg">

        {activeSurah || activeTafsir?.id ? `${!activeTafsir?.id ? `${t('Sourat')} ${activeSong?.name}` : `${activeTafsir.name} `}` : `${t('NotFound')}`}

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
