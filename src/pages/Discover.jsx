import React, { useEffect, useMemo, useState } from 'react';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { HiArrowCircleUp } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import useScrollToTopButton from '../assets/useScrollToTop';
import { Error, Loader, SongCard } from '../components';
import { setLanguage, setReader, setRiwaya } from '../redux/features/playerSlice';
import {
    useGetLanguageQuery,
    useGetMushafByLanguageQuery,
    useGetRecitersByLanguageQuery,
    useGetSuwarByLanguageQuery,
} from '../redux/services/quranApi';

const Discover = ({ searchTerm }) => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { activeSong, isPlaying, language, reader, riwaya } = useSelector((state) => state.player);
    const [suwarsFiltred, setSuwarsFiltred] = useState([]);
    const { scrollContainerRef, showScrollButton, handleScrollToTop } = useScrollToTopButton();

    // API Queries
    const { data: suwars, isFetching: suwarIsFetching, error: suwarError } = useGetSuwarByLanguageQuery(language);
    const { data: languages, isFetching: languageIsFetching, error: languageError } = useGetLanguageQuery();
    const { data: readers, isFetching: readersIsFetching, error: readersError } = useGetRecitersByLanguageQuery(language);
    const { data: riwayat, isFetching: riwayatIsFetching, error: riwayatError } = useGetMushafByLanguageQuery(language);

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
            const filteredSuwars = searchTerm
                ? suwars.suwar.filter((surah) => surah.name.includes(searchTerm))
                : suwars.suwar;
            setSuwarsFiltred(filteredSuwars);
        }
    }, [suwars, searchTerm]);

    const handleLanguageChange = (selectedLanguage) => {
        i18n.changeLanguage(languages.language.slice(0, 3).find((lng) => lng.native == selectedLanguage).locale);
        dispatch(setLanguage(languages.language.slice(0, 3).find((lng) => lng.native == selectedLanguage).locale));
    };

    const handleReaderChange = (selectedReaderId) => dispatch(setReader(availableReaders.find((rd) => rd.name == selectedReaderId).id));
    const handleRiwayaChange = (selectedRiwaya) => dispatch(setRiwaya(riwayat.riwayat.find((ry) => ry.name == selectedRiwaya).id));

    if (suwarIsFetching || languageIsFetching || readersIsFetching || riwayatIsFetching) {
        return <Loader />;
    }
    if (suwarError || languageError || readersError || riwayatError) {
        return <Error />;
    }

    // Abstracted Select Component
    const SelectInput = ({ options, value, onChange, placeholder }) => (
        <Select
            showSearch
            value={value}
            onChange={onChange}
            className="md:mt-0 mt-5 md:w-[25%] w-[75%]"
            placeholder={placeholder}
        >
            <Select.Option value="hide">{placeholder}</Select.Option>
            {options.map((option) => (
                <Select.Option key={option.locale || option.id} value={option.native || option.name}>
                    {option.native || option.name}
                </Select.Option>
            ))}
        </Select>
    );

    return (
        <div className="px-4 flex flex-col h-[calc(100vh)] overflow-y-scroll hide-scrollbar">
            <div className={`w-full flex justify-between items-center ${language === 'ar' ? 'md:flex-row-reverse' : 'md:flex-row'} flex-col mt-4 mb-8`}>
                <h2 className="font-bold text-3xl text-white text-left">{t('Discover')}</h2>
                <div className={`w-full flex md:flex-row flex-col items-center ${language === 'ar' ? 'justify-start' : 'justify-end'}`}>
                    <SelectInput
                        options={riwayat?.riwayat || []}
                        value={riwayat.riwayat.find((ry) => ry.id == riwaya)?.name}
                        onChange={handleRiwayaChange}
                        placeholder={t('Choose Your Riwaya')}
                    />
                    <SelectInput
                        options={availableReaders}
                        value={availableReaders.find((rd) => rd.id == reader)?.name}
                        onChange={handleReaderChange}
                        placeholder={t('Choose Your Reader')}
                    />
                    <SelectInput
                        options={languages?.language.slice(0, 3) || []}
                        value={languages.language.slice(0, 3).find((lng) => lng.locale == language)?.native}
                        onChange={handleLanguageChange}
                        placeholder={t('Choose Your Language')}
                    />
                </div>
            </div>

            <div ref={scrollContainerRef} className="flex flex-wrap sm:justify-between justify-center gap-8 h-fit overflow-y-scroll hide-scrollbar">
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
