import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Error, Loader } from '../components';
import RadioCard from '../components/RadioCard';
import { useGetRadiosQuery } from '../redux/services/quranApi';
import useScrollToTopButton from '../assets/useScrollToTop';
import { HiArrowCircleUp } from 'react-icons/hi';
import { t } from 'i18next';
import { setActiveSong, setSurahId, setActiveTafsir } from '../redux/features/playerSlice';

const Radio = ({ searchTerm }) => {
    const dispatch = useDispatch()
    const { activeRadio, isPlaying, language } = useSelector((state) => state.player);
    const { data, isFetching, error } = useGetRadiosQuery(language);
    const [filteredRadios, setFiltredRadios] = useState([]);
    const { scrollContainerRef, showScrollButton, handleScrollToTop } = useScrollToTopButton();

    useEffect(() => {
        dispatch(setActiveSong({}))
        dispatch(setSurahId(null))
        dispatch(setActiveTafsir(null))
        if (data) {
            const filtered = searchTerm
                ? data.radios.filter((radio) =>
                    radio.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                : data.radios;
            setFiltredRadios(filtered);
        }
    }, [data, searchTerm]);

    if (isFetching) return <Loader />;

    if (error) return <Error />;

    return (
        <div className="px-4 flex flex-col h-screen overflow-y-scroll hide-scrollbar">
            <h2 className={`font-bold text-3xl my-4 text-white text-center  ${t('font')}`}>
                {t('ChannelRadio')}
            </h2>

            <div
                ref={scrollContainerRef}
                className={`flex ${language === 'ar' ? 'flex-row-reverse' : ''} flex-wrap  justify-center gap-8 h-fit overflow-y-scroll hide-scrollbar md:pb-28 pb-36`}
            >
                {filteredRadios?.map((radio, i) => (
                    <RadioCard
                        key={i}
                        radio={radio}
                        isPlaying={isPlaying}
                        activeRadio={activeRadio}
                        i={i}
                    />
                ))}
                {showScrollButton && (
                    <button
                        className="absolute left-25 bottom-1/4 md:text-6xl text-5xl bg-white rounded-full animate-pulse"
                        onClick={handleScrollToTop}
                    >
                        <HiArrowCircleUp />
                    </button>
                )}
            </div>

        </div>
    );
};

export default Radio;
