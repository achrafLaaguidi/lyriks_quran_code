import { useParams } from "react-router-dom";
import { useGetChaptersQuery } from "../redux/services/booksApi";
import ChapterCard from "../components/ChapterCard";
import { Error, Loader } from "../components";
import { useMemo } from "react";
import { t } from "i18next";
import { useSelector } from "react-redux";
import useScrollToTopButton from "../assets/useScrollToTop";
import { HiArrowCircleUp } from "react-icons/hi";

const Chapters = ({ searchTerm }) => {
    const { bookSlug } = useParams()
    const { data, isFetching, error } = useGetChaptersQuery({ bookSlug })
    const { language } = useSelector((state) => state.player)

    const filteredChapters = useMemo(() => {
        if (!data) return [];
        return searchTerm
            ? data.chapters.filter((chapter) =>
                chapter['chapter' + t('lang')].toLowerCase().includes(searchTerm.toLowerCase())
            )
            : data.chapters;
    }, [data, searchTerm]);

    if (isFetching) return <Loader />;
    if (error) return <Error />;
    const { scrollContainerRef, showScrollButton, handleScrollToTop } = useScrollToTopButton();

    return (
        <div className={`flex  flex-col  h-screen  items-center md:pb-0 pb-20 mt-2  w-full  ${t('font')}`}>
            <h2 className={`text-white text-center  md:text-4xl text-2xl mb-8`}>{t('BookChapters')}</h2>
            <div ref={scrollContainerRef} className={`flex ${language === 'ar' && 'flex-row-reverse'} flex-wrap justify-center gap-8  mb-24 overflow-y-scroll hide-scrollbar`} >
                {filteredChapters.map((chapter) => (
                    <ChapterCard

                        key={chapter.id}
                        chapter={chapter}
                    />
                ))}
            </div>
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
    )
}

export default Chapters;