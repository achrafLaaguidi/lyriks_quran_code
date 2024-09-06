import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HiArrowCircleUp } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { SelectInput } from '../assets/constants';
import useScrollToTopButton from '../assets/useScrollToTop';
import { Error, Loader, SongCard } from '../components';
import { setReader, setRiwaya } from '../redux/features/playerSlice';
import {
    useGetMushafByLanguageQuery,
    useGetRecitersByLanguageAndIdAndRewayaQuery,
    useGetRecitersByLanguageQuery,
    useGetSuwarByLanguageQuery
} from '../redux/services/quranApi';
import useGetUrl from '../assets/useGetUrl';
const Discover = ({ searchTerm }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { activeSong, isPlaying, language, reader, riwaya } = useSelector((state) => state.player);
    const [filteredSuwars, setFilteredSuwars] = useState([]);
    const { scrollContainerRef, showScrollButton, handleScrollToTop } = useScrollToTopButton();

    // API Queries
    const { data: suwars, isFetching: suwarIsFetching, error: suwarError } = useGetSuwarByLanguageQuery(language);

    const { data: readers, isFetching: readersIsFetching, error: readersError } = useGetRecitersByLanguageQuery(language);
    const { data: riwayat, isFetching: riwayatIsFetching, error: riwayatError } = useGetMushafByLanguageQuery(language);
    const { data: currentSurah, isFetching: currentSurahIsFetching, error: currentSurahError } = useGetRecitersByLanguageAndIdAndRewayaQuery({
        lang: language,
        id: reader,
        riwaya: riwaya / 10,
    });
    // Memoized derived state
    const availableReaders = useMemo(() => {
        if (riwaya && readers) {
            return readers.reciters.filter((reciter) =>
                reciter.moshaf.some((moshaf) => moshaf.moshaf_type == riwaya)
            );
        }
        return [];
    }, [riwaya, readers]);

    useEffect(() => {
        if (suwars) {
            const filtered = searchTerm
                ? suwars.suwar.filter((surah) => surah.name.includes(searchTerm))
                : suwars.suwar;
            setFilteredSuwars(filtered);
        }

    }, [suwars, searchTerm]);



    const handleReaderChange = (selectedReaderId) => {
        const readerData = availableReaders.find((rd) => rd.name == selectedReaderId);
        if (readerData) {
            dispatch(setReader(readerData.id));
        }
    };

    const handleRiwayaChange = (selectedRiwaya) => {
        const riwayaData = riwayat.riwayat.find((ry) => ry.name == selectedRiwaya);
        if (riwayaData) {
            dispatch(setRiwaya(riwayaData.id));
        }
    };

    if (suwarIsFetching || readersIsFetching || riwayatIsFetching || currentSurahIsFetching) {
        return <Loader />;
    }
    if (suwarError || readersError || riwayatError || currentSurahError) {
        return <Error />;
    }



    const languageDirectionClass = language == 'ar' ? 'md:flex-row-reverse' : 'md:flex-row';

    return (
        <div className="px-4 flex flex-col h-screen overflow-y-scroll hide-scrollbar">
            <div className={`w-full flex justify-between items-center ${languageDirectionClass} gap-2 bg-[#191624] border-x-2 border-x-[#EEEEEE] rounded-lg p-4  flex-col my-2`}>
                <h2 className={`font-bold text-2xl text-white text-center  w-fit  ${t('font')}`}>
                    {t('Chapter')}
                </h2>
                <div className={`w-[75%] flex md:flex-row flex-col gap-2 items-center ${language == 'ar' ? 'justify-start' : 'justify-end'}`}>
                    <SelectInput
                        showSearch={true}
                        options={riwayat?.riwayat || []}
                        value={riwayat.riwayat.find((ry) => ry.id == riwaya)?.name}
                        onChange={handleRiwayaChange}
                        className={' md:w-[50%] w-[75%]'}
                        placeholder={t('Choose Your Riwaya')}
                    />
                    <SelectInput
                        showSearch={true}
                        options={availableReaders}
                        value={availableReaders.find((rd) => rd.id == reader)?.name}
                        onChange={handleReaderChange}
                        className={' md:w-[50%] w-[75%]'}

                        placeholder={t('Choose Your Reader')}
                    />
                </div>
            </div>

            <div ref={scrollContainerRef} className={`flex ${language == 'ar' && 'flex-row-reverse'} flex-wrap md:justify-satrt justify-center gap-8 h-fit overflow-y-scroll hide-scrollbar md:pb-28 pb-36`}>
                {filteredSuwars?.map((song, i) => (
                    <SongCard
                        key={song.id}
                        song={song}
                        isPlaying={isPlaying}
                        activeSong={activeSong}
                        url={useGetUrl({ id: song.id, currentSurah: currentSurah })}
                        data={suwars}
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

export default Discover;
