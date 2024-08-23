import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const QuranCard = ({ quran }) => {
    const { language } = useSelector((state) => state.player);


    return (
        <div className="flex flex-col w-[250px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer ">
            <div className="mt-4 flex flex-col text-right">
                <p className="font-semibold text-base text-white truncate">
                    <Link to={`/surah/${quran?.name}/${quran?.id}`}>
                        {!quran.name.includes('سورة') && <> {(language === 'ar' || language === '') ? 'سورة' : 'Surat'}</>}  {quran.name}
                    </Link>
                </p>
                <div className='flex flex-row justify-between'>
                    <p className='text-sm truncate text-white  border border-white rounded-full p-1'>
                        {quran.id}
                    </p>
                    <p className="text-sm truncate text-gray-300 mt-1">
                        <Link to={`/surah/${quran?.name}/${quran?.id}`}>
                            {(language === 'ar' || language === '') ? quran.makkia ? 'مَكٍّيِةٌ' : 'مَدَنِيَةٌ' : quran.makkia ? 'Makkia' : 'Madania'}
                        </Link>
                    </p>

                </div>

            </div>


        </div>
    );
};

export default QuranCard;