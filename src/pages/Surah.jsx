import { t } from "i18next";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import SwiperCore, { Pagination } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import { styleSelect } from "../assets/constants";
import { Error, Loader } from "../components";
import { setSave } from "../redux/features/playerSlice";
import { useGetAyatsBySurahAndReaderQuery } from "../redux/services/quranApi";

SwiperCore.use([Pagination]);

const Surah = () => {
    const dispatch = useDispatch();
    const { save } = useSelector((state) => state.player);
    const { id } = useParams();
    const { data, isFetching, error } = useGetAyatsBySurahAndReaderQuery({
        surahId: id,
    });

    const [quranSurah, setQuranSurah] = useState([]);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const swiperRef = useRef(null);
    const [page, setPage] = useState([])
    useEffect(() => {
        const parsedSave = save.split(',');
        setPage(parsedSave);
    }, [save]);


    useEffect(() => {
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


            if (uniquePages.length > 0) {


                const initialPageIndex = (parseInt(page[0]) < uniquePages.length && page[1] == id) ? parseInt(page[0]) : 0;
                setCurrentPageIndex(initialPageIndex);
            }
        }
    }, [data, page, id]);



    const handleSave = () => {
        dispatch(setSave(`${currentPageIndex},${id}`));
    };

    if (isFetching) return <Loader />;
    if (error) return <Error />;

    return (
        <>

            {
                quranSurah.length > 0 ? (
                    <Swiper
                        className="md:max-w-xl w-screen h-screen "
                        grabCursor={true}
                        slidesPerView={1}
                        loop={quranSurah.length != 1}
                        direction="vertical"
                        onSlideChange={(swiper) => {
                            setCurrentPageIndex(swiper.realIndex);
                        }}
                        initialSlide={currentPageIndex}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                    >
                        {quranSurah.map((ayah, index) => (
                            <SwiperSlide
                                className="flex h-full justify-center items-center bg-white rounded-3xl overflow-hidden "
                                key={index}
                            >
                                <div className="flex flex-col justify-center items-center w-full md:h-full h-fit py-6">

                                    <div className="flex justify-center w-full h-fit ">
                                        <select
                                            value={currentPageIndex}
                                            onChange={(e) => {
                                                const selectedIndex = parseInt(e.target.value) + 1;
                                                setCurrentPageIndex(selectedIndex);
                                                swiperRef.current.slideTo(selectedIndex);
                                            }}
                                            style={styleSelect}
                                            className="hide-scrollbar w-fit px-2 py-1 border border-gray-300 rounded"
                                        >
                                            <option value="hide">{t('Choose Page')}</option>
                                            {quranSurah.map((_, i) => (
                                                <option key={i} value={i}>
                                                    {t('Page')} {i + 1}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            disabled={currentPageIndex == page[0]}
                                            className={`bg-orange-600 w-fit p-2 rounded-md text-white ml-2 ${currentPageIndex == page[0] ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-700'}`}
                                            onClick={handleSave}
                                        >
                                            {currentPageIndex == page[0] ? `${t('Saved')}` : `${t('Save')}`}
                                        </button>
                                    </div>
                                    <img
                                        src={ayah.page}
                                        alt={`${t('Page')} ${index + 1}`}
                                        className="object-contain w-full h-full "

                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <Error />
                )
            }
        </>

    );

};

export default Surah;
