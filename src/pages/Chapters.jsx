import { useLocation, useNavigate, useParams } from "react-router-dom";
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
    const location = useLocation()
    const bookName = location.state.bookName
    const navigate = useNavigate()
    const { data, isFetching, error } = useGetChaptersQuery({ bookSlug })
    const { language } = useSelector((state) => state.player)
    const { scrollContainerRef, showScrollButton, handleScrollToTop } = useScrollToTopButton();

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

    return (
        <div className={`flex px-4 flex-col h-screen  items-center  w-full  md:pb-24  pb-32 ${t('font')}`}>
            <h2 className={`text-white w-full bg-[#191624] border-x-2 border-x-[#EEEEEE] rounded-lg py-4 text-center  md:text-4xl text-2xl mb-1`}>{t('BookChapters')} {bookName}</h2>
            <div ref={scrollContainerRef} className={`flex ${language === 'ar' && 'flex-row-reverse'} overflow-y-scroll hide-scrollbar  flex-wrap justify-center gap-4  `} >
                {filteredChapters.map((chapter) => (
                    <ChapterCard
                        bookName={bookName}
                        navigate={navigate}
                        language={language}
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