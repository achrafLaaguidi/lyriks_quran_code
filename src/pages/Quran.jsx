import { useDispatch, useSelector } from "react-redux";
import { useGetSuwarByLanguageQuery } from "../redux/services/quranApi";
import { Error, Loader } from "../components";
import { useEffect, useState } from "react";
import QuranCard from "../components/QuranCard";
import { setActiveSong, setActiveTafsir, setSurahId } from "../redux/features/playerSlice";
import useScrollToTopButton from "../assets/useScrollToTop";
import { HiArrowCircleUp } from "react-icons/hi";
import { useTranslation } from "react-i18next";

const Quran = ({ searchTerm }) => {
    const dispatch = useDispatch()
    const { language } = useSelector((state) => state.player)
    const { t } = useTranslation()
    const [suwarsFiltred, setSuwarsFiltred] = useState([])
    const { scrollContainerRef, showScrollButton, handleScrollToTop } = useScrollToTopButton();

    const { data, isFetching, error } = useGetSuwarByLanguageQuery(language);
    useEffect(() => {
        dispatch(setActiveSong({}))
        dispatch(setSurahId(null))
        dispatch(setActiveTafsir(null))
        if (data)
            setSuwarsFiltred(data.suwar)
        if (searchTerm) {
            setSuwarsFiltred(data.suwar.filter((surah) => surah.name.includes(searchTerm)));
        }

    }, [searchTerm, data]);




    if (isFetching) {
        return <Loader />;
    }
    if (error) {
        return <Error />;
    }
    return (
        <div className="flex flex-col  items-center h-screen md:pb-6 pb-16 w-full  pt-2">
            <h2 className="text-white text-center md:text-4xl text-2xl mb-10 ">{t('Chapter')}</h2>
            <div ref={scrollContainerRef} className="flex flex-wrap justify-center gap-6 overflow-y-scroll hide-scrollbar">
                {suwarsFiltred?.map((surah) => (
                    <QuranCard
                        key={surah.id}
                        quran={surah}
                    />
                ))}
                {showScrollButton && (
                    <button
                        className="absolute left-25   bottom-1/4 md:text-6xl text-5xl bg-white rounded-full animate-pulse "
                        onClick={handleScrollToTop}
                    >
                        <HiArrowCircleUp />
                    </button>
                )}
            </div>
        </div>)
}

export default Quran;