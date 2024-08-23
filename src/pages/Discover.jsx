import React, { useEffect, useRef, useState } from 'react';
import { HiArrowCircleUp } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { Error, Loader, SongCard } from '../components';
import { setLanguage, setReader, setRiwaya } from '../redux/features/playerSlice';
import {
    useGetLanguageQuery,
    useGetMushafByLanguageQuery,
    useGetRecitersByLanguageQuery,
    useGetSuwarByLanguageQuery,
} from '../redux/services/quranApi';
import useScrollToTopButton from '../assets/useScrollToTop';

const Discover = ({ searchTerm }) => {
    const dispatch = useDispatch();
    const { activeSong, isPlaying, language, reader, riwaya } = useSelector((state) => state.player);
    const [availableReaders, setAvailableReaders] = useState([]);
    const { scrollContainerRef, showScrollButton, handleScrollToTop } = useScrollToTopButton();

    const [suwarsFiltred, setSuwarsFiltred] = useState({})
    const { data: suwars, isFetching: suwarIsFetching, error: suwarError } = useGetSuwarByLanguageQuery(language);
    const { data: languages, isFetching: languageIsFetching, error: languageError } = useGetLanguageQuery();
    const { data: readers, isFetching: readersIsFetching, error: readersError } = useGetRecitersByLanguageQuery(language);
    const { data: riwayat, isFetching: riwayatIsFetching, error: riwayatError } = useGetMushafByLanguageQuery(language);

    useEffect(() => {
        if (suwars)
            setSuwarsFiltred(suwars.suwar)
        if (searchTerm) {
            setSuwarsFiltred(suwars.suwar.filter((surah) => surah.name.includes(searchTerm)));
        }
        if (riwaya && readers) {
            const filteredReaders = readers.reciters.filter((reciter) =>
                reciter.moshaf.some((moshaf) => moshaf.moshaf_type == riwaya)
            );
            setAvailableReaders(filteredReaders || []);
        }
    }, [suwars, riwaya, readers, searchTerm]);



    const handleLanguageChange = (selectedLanguage) => {
        dispatch(setLanguage(selectedLanguage));
    };

    const handleReaderChange = (selectedReaderId) => {
        dispatch(setReader(selectedReaderId));
    };

    const handleRiwayaChange = (selectedRiwaya) => {
        dispatch(setRiwaya(selectedRiwaya));
    };

    if (suwarIsFetching || languageIsFetching || readersIsFetching || riwayatIsFetching) {
        return <Loader title="Loading Quran..." />;
    }
    if (suwarError || languageError || readersError || riwayatError) {
        return <Error language={language} />;
    }

    return (
        <div className="flex flex-col h-[calc(100vh)]  overflow-y-scroll hide-scrollbar">
            <div className="w-full flex  justify-between  items-center sm:flex-row flex-col mt-4 mb-8 ">

                <h2 className="font-bold text-3xl text-white text-left">Discover</h2>
                <div className="w-fit flex justify-between items-center sm:flex-row flex-col ">
                    <select
                        onChange={(e) => handleRiwayaChange(e.target.value)}
                        value={riwaya}
                        className="bg-black text-gray-300 p-3 text-sm rounded-lg outline-none sm:mb-0 mb-4"
                    >
                        <option key="0" value="">
                            {language === 'ar' ? 'اختر روايتك' : 'Choose your riwaya'}
                        </option>
                        {riwayat.riwayat.map((riwayaOption) => (
                            <option key={riwayaOption.id} value={riwayaOption.id}>
                                {riwayaOption.name}
                            </option>
                        ))}
                    </select>
                    <select
                        onChange={(e) => handleReaderChange(e.target.value)}
                        value={reader}
                        className="bg-black text-gray-300 p-3 text-sm rounded-lg outline-none sm:mb-0 mb-4"
                    >
                        <option key="0" value="">
                            {language === 'ar' ? 'اختر قارئك' : 'Choose your reader'}
                        </option>
                        {availableReaders.map((readerOption) => (
                            <option key={readerOption.id} value={readerOption.id}>
                                {readerOption.name}
                            </option>
                        ))}
                    </select>
                    <select
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        value={language}
                        className="bg-black text-gray-300 p-3 text-sm rounded-lg outline-none mb-0"
                    >
                        <option key="0" value="">
                            {language === 'ar' ? 'اختر لغتك' : 'Choose your language'}
                        </option>
                        {languages.language.map((lang) => (
                            <option key={lang.id} value={lang.locale}>
                                {lang.native}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div ref={scrollContainerRef} className={`flex flex-wrap sm:justify-between justify-center gap-8 h-fit  overflow-y-scroll hide-scrollbar`}>
                {suwarsFiltred?.map((song, i) => (
                    <SongCard
                        key={song.id}
                        song={song}
                        isPlaying={isPlaying}
                        activeSong={activeSong}
                        data={suwars}
                        i={i}
                    />
                ))}
                {showScrollButton && (
                    <button
                        className="absolute left-25   bottom-1/4 text-6xl bg-white rounded-full animate-pulse "
                        onClick={handleScrollToTop}
                    >
                        <HiArrowCircleUp />
                    </button>
                )}
            </div>


        </div>
    );
};

export default Discover;
