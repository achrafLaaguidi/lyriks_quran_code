import React from 'react';
import { quran, radioLogo, Tafsir } from '../../assets';
import { t } from "i18next";


const Track = ({ isPlaying, isActive, activeSong, activeTafsir, activeRadio, language, activeSurah }) => (
  <div className="flex-1 flex items-center justify-start">
    <div className={`${isPlaying && isActive ? 'animate-[spin_3s_linear_infinite]' : ''} hidden md:block h-16 w-16 mr-4`}>
      <img src={(activeSong?.id && quran) || (activeTafsir?.id && Tafsir) || (activeRadio?.id && radioLogo)} alt={activeSong.name || activeTafsir.name || activeRadio?.name} className="rounded-full" />
    </div>

    <div className="w-fit ">
      <p className="truncate text-white font-bold md:text-lg  ">

        {activeRadio?.id ? activeRadio.name : `${activeSurah || activeTafsir?.id ? `${!activeTafsir?.id ? `${t('Sourat')} ${activeSong?.name}` : `${activeTafsir.name} `}` : `${t('NotFound')}`}`}

      </p>
      {!activeRadio?.id && <p className="truncate text-gray-300">
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

      </p>}
    </div>
  </div>
);


export default Track;
