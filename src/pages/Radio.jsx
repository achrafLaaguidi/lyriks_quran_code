import React from 'react';
import { useSelector } from 'react-redux';

import { Error, Loader, SongCard } from '../components';
import { useGetTafsirBySuraQuery } from '../redux/services/quranApi';


const Radio = () => {
    const { data, isFetching, error } = useGetTafsirBySuraQuery();
    const { activeSong, isPlaying, language } = useSelector((state) => state.player);

    if (isFetching) return <Loader />;

    if (error) return <Error language={language} />;

    return (
        <div className="flex flex-col">
            <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">{language == 'ar' ? data.tafasir.name : 'Quran Tafsir'}</h2>

            <div className="flex flex-wrap sm:justify-start justify-center gap-8">
                {data?.tafasir?.soar.map((song, i) => (
                    <SongCard
                        key={song.key}
                        song={song}
                        isPlaying={isPlaying}
                        activeSong={activeSong}
                        data={data}
                        i={i}
                    />
                ))}
            </div>
        </div>
    );
};

export default Radio;