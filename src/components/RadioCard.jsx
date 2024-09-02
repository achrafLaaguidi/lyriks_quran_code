import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Radio } from '../assets';
import { playPause, setActiveRadio } from '../redux/features/playerSlice';
import PlayPause from './PlayPause';
import { HiRefresh } from 'react-icons/hi';
import { t } from 'i18next';

const RadioCard = ({ radio, isPlaying, activeRadio, i }) => {
    const dispatch = useDispatch();
    const ref = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

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

    const handleChoose = () => {
        dispatch(setActiveRadio({ song: radio }));
        setIsLoading(true);
    };

    const handleLoadedData = () => {
        setIsLoading(false);
        handlePlayClick();
    };

    return (
        <div
            className={`flex flex-col md:w-[200px] w-[125px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg`}
            onClick={activeRadio.id !== radio.id ? handleChoose : null}
        >
            <div className="relative w-full md:h-48 h-24 group cursor-pointer">
                {isLoading ? (
                    <div
                        className={`absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 rounded-lg
                        ${activeRadio?.id === radio.id ? 'bg-opacity-70' : ''}`}
                    >
                        <HiRefresh className="text-gray-300 text-3xl animate-spin" />
                    </div>
                ) : (
                    <div
                        className={`absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 rounded-lg group-hover:flex 
                        ${activeRadio?.id === radio.id ? 'bg-opacity-70' : 'hidden'}`}
                    >
                        <PlayPause
                            isPlaying={isPlaying && activeRadio?.id == radio.id}
                            activeSong={activeRadio}
                            song={radio}
                            handlePause={handlePauseClick}
                            handlePlay={handlePlayClick}
                        />
                    </div>
                )}

                <img alt="Radio" src={Radio} className="w-full h-full rounded-lg" />
            </div>

            <div className="mt-4 flex flex-col justify-between items-center h-full">
                <p className={`font-semibold md:text-lg text-sm text-white text-center   ${t('font')}`}>
                    {radio.name}
                </p>
                <p className="md:text-base text-xs truncate text-white border border-white rounded-full p-1">
                    {i + 1}
                </p>
            </div>

            {activeRadio && activeRadio.id === radio.id && (
                <audio
                    ref={ref}
                    src={activeRadio?.url}
                    onCanPlayThrough={handleLoadedData}
                    autoPlay
                />
            )}
        </div>
    );
};

export default RadioCard;
