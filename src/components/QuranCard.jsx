import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const QuranCard = ({ quran }) => {
    const { language } = useSelector((state) => state.player);
    const navigate = useNavigate()
    const { t } = useTranslation()
    return (

        <div className="flex  flex-col md:w-[200px] w-[145px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer " onClick={() => navigate(`/surah/${quran?.id}`)}>
            <p className="font-semibold md:text-base text-sm text-white truncate">
                <Link to={`/surah/${quran?.id}`}>
                    {t('Sourat')}  {quran.name}
                </Link>
            </p>
            <div className='flex flex-row justify-between'>
                <p className='text-sm truncate text-white  border border-white rounded-full p-1'>
                    {quran.id}
                </p>
                <p className="md:text-sm text-xs truncate text-gray-300 mt-1">
                    <Link to={`/surah/${quran?.id}`}>
                        {(language === 'ar' || language === '') ? quran.makkia ? 'مَكٍّيِةٌ' : 'مَدَنِيَةٌ' : quran.makkia ? 'Makkia' : 'Madania'}
                    </Link>
                </p>

            </div>
        </div>

    );
};

export default QuranCard;