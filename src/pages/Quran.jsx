import { useDispatch, useSelector } from "react-redux";
import { useGetSuwarByLanguageQuery } from "../redux/services/quranApi";
import { Error, Loader } from "../components";
import { useEffect, useState } from "react";
import QuranCard from "../components/QuranCard";
import { setActiveSong, setActiveTafsir, setSurahId } from "../redux/features/playerSlice";
import useScrollToTopButton from "../assets/useScrollToTop";
import { HiArrowCircleUp } from "react-icons/hi";

const Quran = ({ searchTerm }) => {
    const dispatch = useDispatch()
    const { language } = useSelector((state) => state.player)
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
        return <Loader title="Loading Quran..." />;
    }
    if (error) {
        return <Error language={language} />;
    }
    return (<div className="flex flex-col  items-center h-[calc(100vh)]  ">
        <h2 className="text-white text-right text-3xl mb-10 ">سُوَرُ الْقُرْآنُ الْكَرِيمُ</h2>
        <div ref={scrollContainerRef} className="flex flex-wrap sm:justify-between justify-center gap-8  overflow-y-scroll hide-scrollbar">
            {suwarsFiltred?.map((surah) => (
                <QuranCard
                    key={surah.id}
                    quran={surah}
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
    </div>)
}

export default Quran;