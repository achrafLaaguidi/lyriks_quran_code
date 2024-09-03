import { t } from 'i18next';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FaPauseCircle, FaPlayCircle } from 'react-icons/fa';
import { HiArrowCircleUp, HiRefresh } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { radioLogo } from '../assets';
import useScrollToTopButton from '../assets/useScrollToTop';
import { Error, Loader } from '../components';
import RadioCard from '../components/RadioCard';
import { playPause } from '../redux/features/playerSlice';
import { useGetRadiosQuery } from '../redux/services/quranApi';


const Radio = ({ searchTerm }) => {
    const dispatch = useDispatch()
    const ref = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const { activeRadio, isPlaying, language, isActive } = useSelector((state) => state.player);
    const { data, isFetching, error } = useGetRadiosQuery(language);
    const { scrollContainerRef, showScrollButton, handleScrollToTop } = useScrollToTopButton();

    const filteredRadios = useMemo(() => {
        if (!data) return [];

        return searchTerm
            ? data.radios.filter((radio) =>
                radio.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : data.radios;
    }, [data, searchTerm]);

    useEffect(() => {
        if (activeRadio?.id && !isPlaying) {
            setIsLoading(false);
        }
    }, [activeRadio, isPlaying]);

    const handlePauseClick = () => {
        if (ref.current) {
            ref.current.pause();
        }
        dispatch(playPause(false));
    };

    const handlePlayClick = () => {
        if (ref.current) {
            ref.current.play();
        }
        dispatch(playPause(true));
    };
    const handleLoadedData = () => {
        setIsLoading(false);
        handlePlayClick();
    };
    const handleAudioError = () => {
        console.error('Error loading audio stream');
        setIsLoading(false);
        dispatch(playPause(false));
    };
    if (isFetching) return <Loader />;

    if (error) return <Error />;

    return (
        <div className=" flex flex-col h-screen overflow-y-scroll hide-scrollbar">
            <h2 className={`font-bold text-3xl my-4 text-white text-center  ${t('font')}`}>
                {t('ChannelRadio')}
            </h2>

            <div
                ref={scrollContainerRef}
                className={`flex ${language === 'ar' ? 'flex-row-reverse' : ''} flex-wrap  justify-center gap-8 h-fit   overflow-y-scroll hide-scrollbar md:pb-28 pb-36`}
            >
                {filteredRadios?.map((radio, i) => (
                    <RadioCard
                        key={radio.id}
                        radio={radio}
                        isPlaying={isPlaying}
                        activeRadio={activeRadio}
                        handlePauseClick={handlePauseClick}
                        handlePlayClick={handlePlayClick}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        i={i}
                    />
                ))}
                {activeRadio?.id &&
                    (<div className='absolute top-28 flex justify-between items-center animate-slideup bg-gradient-to-br from-white/10 to-[#010119] w-fit p-4 backdrop-blur-lg rounded-lg'>
                        <div className={`${isPlaying && isActive ? 'animate-[spin_3s_linear_infinite]' : ''}  md:h-20 h-full md:w-20 w-16 md:mr-6 mr-4`}>
                            <img src={radioLogo} alt={activeRadio.name} className=" rounded-full" />
                        </div>
                        <div className='flex flex-col-reverse justify-center items-center  '>
                            <div className=' text-gray-300  '>
                                {isLoading
                                    ? <HiRefresh className="md:text-4xl text-2xl  animate-spin" />
                                    : isPlaying
                                        ? <FaPauseCircle
                                            size={35}
                                            className="text-gray-300 cursor-pointer"
                                            onClick={handlePauseClick}
                                        />
                                        :
                                        <FaPlayCircle
                                            size={35}
                                            className="text-gray-300 cursor-pointer"
                                            onClick={handlePlayClick}
                                        />
                                }
                            </div>
                            <p className={`${t('font')} text-center   text-white font-bold md:text-lg `}>{activeRadio.name}</p>
                        </div>
                    </div>)
                }
                {showScrollButton && (
                    <button
                        className="absolute left-25 bottom-1/4 md:text-6xl text-5xl bg-white rounded-full animate-pulse"
                        onClick={handleScrollToTop}
                    >
                        <HiArrowCircleUp />
                    </button>
                )}
            </div>
            {
                activeRadio?.id && (

                    <audio
                        ref={ref}
                        src={activeRadio?.url}
                        onCanPlayThrough={handleLoadedData}
                        onError={handleAudioError}
                        autoPlay
                    />


                )
            }

        </div >
    );
};

export default Radio;
