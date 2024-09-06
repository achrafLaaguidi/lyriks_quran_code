import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { FaPauseCircle, FaPlayCircle } from 'react-icons/fa';
import { HiArrowCircleUp, HiChevronDown, HiChevronUp, HiRefresh } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'i18next';
import { radioLogo } from '../assets';
import useScrollToTopButton from '../assets/useScrollToTop';
import { Error, Loader } from '../components';
import RadioCard from '../components/RadioCard';
import { playPause, nextSong, prevSong } from '../redux/features/playerSlice';
import { useGetRadiosQuery } from '../redux/services/quranApi';
import Controls from '../components/MusicPlayer/Controls';

const Radio = ({ searchTerm }) => {
    const dispatch = useDispatch();
    const ref = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [shuffle, setShuffle] = useState(false);
    const [isUp, setIsUp] = useState(true)
    const { activeRadio, isPlaying, language, isActive, currentIndex } = useSelector((state) => state.player);
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

    const handleNextSong = useCallback(() => {

        if (currentIndex === filteredRadios.length - 1) {
            dispatch(nextSong(0));
        } else if (!shuffle) {
            dispatch(nextSong(currentIndex + 1));
        } else {
            dispatch(nextSong(Math.floor(Math.random() * filteredRadios.length)));
        }
        dispatch(playPause(true));
    }, [filteredRadios, activeRadio, shuffle, dispatch]);

    const handlePrevSong = useCallback(() => {

        if (currentIndex === 0) {
            dispatch(prevSong(filteredRadios.length - 1));
        } else if (shuffle) {
            dispatch(prevSong(Math.floor(Math.random() * filteredRadios.length)));
        } else {
            dispatch(prevSong(currentIndex - 1));
        }
        dispatch(playPause(true));
    }, [filteredRadios, activeRadio, shuffle, dispatch]);

    const handlePlayPause = useCallback(() => {
        if (!isActive) return;
        isPlaying ? handlePauseClick() : handlePlayClick();
    }, [isActive, isPlaying]);

    const handlePauseClick = useCallback(() => {
        if (ref.current) {
            ref.current.pause();
        }
        dispatch(playPause(false));
    }, [dispatch]);

    const handlePlayClick = useCallback(() => {
        if (ref.current) {
            ref.current.play();
        }
        dispatch(playPause(true));
    }, [dispatch]);

    const handleLoadedData = () => {
        setIsLoading(false);
        handlePlayClick();
    };

    const handleAudioError = () => {
        console.error('Error loading audio stream');
        setIsLoading(false);
        dispatch(playPause(false));
        return <Error />;
    };
    const handleUpDown = () => {
        setIsUp(!isUp)
    }

    if (isFetching) return <Loader />;
    if (error) return <Error />;

    return (
        <div className="flex flex-col h-screen px-4 md:pb-0 pb-4 overflow-y-scroll hide-scrollbar">
            <h2 className={`font-bold text-3xl my-2 bg-[#191624] border-x-2 border-x-[#EEEEEE] rounded-lg py-4 text-white text-center ${t('font')}`}>
                {t('ChannelRadio')}
            </h2>

            <div
                ref={scrollContainerRef}
                className={`flex ${language === 'ar' ? 'flex-row-reverse' : ''} flex-wrap justify-center gap-8 h-fit overflow-y-scroll hide-scrollbar md:pb-28 pb-36`}
            >
                {filteredRadios?.map((radio, i) => (
                    <RadioCard
                        key={radio.id}
                        radio={radio}
                        currentRadios={data.radios}
                        isPlaying={isPlaying}
                        activeRadio={activeRadio}
                        handlePauseClick={handlePauseClick}
                        handlePlayClick={handlePlayClick}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        i={i}
                    />
                ))}
                {activeRadio?.id && (
                    <div className='absolute flex-col mx-auto items-center md:w-3/4 px-2 md:pb-2 pb-4 md:bottom-0 bottom-14 left-0 right-0 flex animate-slideup bg-gradient-to-br from-white/10 to-[#2a2a80] backdrop-blur-lg rounded-3xl z-50'>
                        <div
                            className='animate-slideup bg-gradient-to-br from-black/10 h-fit to-[#03033f] backdrop-blur-lg rounded-lg w-fit px-4 cursor-pointer'
                            onClick={handleUpDown}>
                            {isUp ? <HiChevronDown className='text-2xl text-white' />
                                : <HiChevronUp className='text-2xl text-white' />}
                        </div>
                        <div className={`flex justify-around items-center w-full ${!isUp && 'hidden'}`}>
                            <div className='flex justify-between items-center'>
                                <div className={`${isPlaying && isActive ? 'animate-[spin_3s_linear_infinite]' : ''} md:h-20 h-full md:w-20 w-16 md:mr-6 mr-4`}>
                                    <img src={radioLogo} alt={activeRadio.name} className="rounded-full" />
                                </div>
                                <p className={`${t('font')} text-center text-white font-bold md:text-lg`}>
                                    {activeRadio.name}
                                </p>
                            </div>
                            <div className='flex flex-col-reverse justify-center items-center'>
                                <div className='text-gray-300'>
                                    {isLoading ? (
                                        <HiRefresh className="md:text-4xl text-2xl animate-spin" />
                                    ) : (
                                        <Controls
                                            isPlaying={isPlaying}
                                            isActive={isActive}
                                            shuffle={shuffle}
                                            setShuffle={setShuffle}
                                            currentSongs={filteredRadios}
                                            handlePlayPause={handlePlayPause}
                                            handlePrevSong={handlePrevSong}
                                            handleNextSong={handleNextSong}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {showScrollButton && (
                    <button
                        className="absolute left-25 bottom-1/4 md:text-6xl text-5xl bg-white rounded-full animate-pulse"
                        onClick={handleScrollToTop}
                        aria-label="Scroll to top"
                    >
                        <HiArrowCircleUp />
                    </button>
                )}
            </div>
            {activeRadio?.id && (
                <audio
                    ref={ref}
                    src={activeRadio?.url}
                    onCanPlayThrough={handleLoadedData}
                    onError={handleAudioError}
                    autoPlay
                />
            )}
        </div>
    );
};

export default Radio;
