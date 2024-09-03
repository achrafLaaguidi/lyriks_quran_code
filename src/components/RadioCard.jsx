import { t } from 'i18next';
import React, { useCallback, useRef, useState } from 'react';
import { HiRefresh } from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import { radioLogo } from '../assets';
import { setActiveRadio } from '../redux/features/playerSlice';
import PlayPause from './PlayPause';

const RadioCard = ({ radio, isPlaying, activeRadio, i, handlePauseClick, handlePlayClick, isLoading, setIsLoading }) => {
    const dispatch = useDispatch();




    const handleChoose = useCallback(() => {
        dispatch(setActiveRadio({ song: radio }));
        setIsLoading(true);
    }, [dispatch, radio]);




    return (
        <div
            className={`flex flex-col md:w-[200px] w-[125px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer`}
            onClick={activeRadio.id !== radio.id ? handleChoose : null}
        >
            <div className="relative w-full md:h-48 h-24 group ">
                {isLoading && activeRadio.id == radio.id ? (
                    <div className={`absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 rounded-lg`}>
                        <HiRefresh className="text-gray-300 text-3xl animate-spin" />
                    </div>
                ) : (
                    <div className={`absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 rounded-lg group-hover:flex ${activeRadio?.id === radio.id ? 'bg-opacity-70' : 'hidden'}`}>
                        <PlayPause
                            isPlaying={isPlaying && activeRadio?.id == radio.id}
                            activeSong={activeRadio}
                            song={radio}
                            handlePause={handlePauseClick}
                            handlePlay={handlePlayClick}
                        />
                    </div>
                )}


                <img alt="Radio" src={radioLogo} className="w-full h-full rounded-lg" />
            </div>

            <div className="mt-4 flex flex-col justify-between items-center h-full">
                <p className={`font-semibold md:text-lg text-sm text-white text-center   ${t('font')}`}>
                    {radio.name}
                </p>
                <p className="md:text-base text-xs truncate text-white border border-white rounded-full p-1">
                    {i + 1}
                </p>
            </div>


        </div>
    );
};

export default RadioCard;
