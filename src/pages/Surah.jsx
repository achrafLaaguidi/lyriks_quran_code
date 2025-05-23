import { t } from "i18next";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import SwiperCore, { Pagination } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import { Error, Loader } from "../components";
import { setSave, setSurahId } from "../redux/features/playerSlice";
import { useGetAyatsBySurahAndReaderQuery } from "../redux/services/quranApi";
import { Select } from 'antd';
import { HiLockClosed, HiLockOpen, HiSave, HiSaveAs } from "react-icons/hi";

// Initialize Swiper with the Pagination module
SwiperCore.use([Pagination]);

const Surah = () => {
    const dispatch = useDispatch();
    const { save } = useSelector((state) => state.player);
    const { id } = useParams();
    const { data, isFetching, error } = useGetAyatsBySurahAndReaderQuery({ surahId: id });

    const [quranSurah, setQuranSurah] = useState([]);
    const [currentPageIndex, setCurrentPageIndex] = useState(1);
    const swiperRef = useRef(null);
    const [page, setPage] = useState([]);

    useEffect(() => {
        const parsedSave = save?.split(',');
        setPage(parsedSave);
        const initialPageIndex = (parsedSave[1] == id) ? parseInt(parsedSave[0]) : 1;
        setCurrentPageIndex(initialPageIndex);
    }, [save]);

    useEffect(() => {
        dispatch(setSurahId(null));
        if (data) {
            const uniquePages = [];
            const pageSet = new Set();

            data.forEach(item => {
                if (item.page && !pageSet.has(item.page)) {
                    pageSet.add(item.page);
                    uniquePages.push(item);
                }
            });

            setQuranSurah(uniquePages);
        }
    }, [data, dispatch]);

    const handleSave = () => {
        dispatch(setSave(`${currentPageIndex},${id}`));
    };

    const handleChange = (selectedPage) => {
        const selectedIndex = parseInt(selectedPage);
        setCurrentPageIndex(selectedIndex);
        swiperRef.current.slideTo(selectedIndex);
    };

    const SelectInput = ({ options, value, onChange, placeholder }) => (
        <Select
            showSearch
            value={value}
            onChange={onChange}
            className="w-[50%]"
            placeholder={placeholder}
        >
            <Select.Option value="">{placeholder}</Select.Option>
            {options.map((_, i) => (
                <Select.Option key={i} value={i + 1}>
                    {t('Page')} {i + 1}
                </Select.Option>
            ))}
        </Select>
    );

    if (isFetching) return <Loader />;
    if (error) return <Error />;

    return (
        <>
            <div className="flex flex-col justify-center items-center m-auto w-fit md:h-full h-screen  md:pb-6 pt-2 bg-white overflow-hidden ">
                <div className="flex justify-center w-full h-fit">
                    <SelectInput
                        options={quranSurah}
                        value={currentPageIndex}
                        onChange={handleChange}
                        placeholder={t('Choose Page')}
                    />
                    <button
                        disabled={currentPageIndex == parseInt(page[0])}
                        className={`bg-orange-600 w-fit p-2 rounded-md text-white ml-2 ${currentPageIndex == parseInt(page[0]) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-700'}`}
                        onClick={handleSave}
                    >
                        {currentPageIndex == parseInt(page[0]) ? <HiLockClosed title={t('Saved')} /> : <HiLockOpen title={t('Save')} />}
                    </button>
                </div>
                {quranSurah.length > 0 && (
                    <Swiper
                        className="md:max-w-xl w-screen h-screen "
                        grabCursor={true}
                        slidesPerView={1}
                        loop={quranSurah.length !== 1}
                        direction="vertical"
                        onSlideChange={(swiper) => setCurrentPageIndex(swiper.realIndex + 1)}
                        initialSlide={currentPageIndex - 1}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                    >

                        {quranSurah.map((ayah, index) => (
                            <SwiperSlide

                                key={index}
                            >

                                <img
                                    src={ayah.page}
                                    alt={`${t('Page')} ${index + 1}`}
                                    className="object-contain w-full md:h-full h-fit "
                                />

                            </SwiperSlide>
                        ))}

                    </Swiper>
                )}
            </div>
        </>
    );
};

export default Surah;
