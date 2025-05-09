import { t } from "i18next";
import { HiArrowCircleUp, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import useScrollToTopButton from "../assets/useScrollToTop";
import { Error, HadithCard, Loader } from "../components";
import { useGetHadithsQuery } from "../redux/services/booksApi";
import { useState } from "react";
import { FaArrowCircleLeft, FaChevronLeft, FaChevronRight, FaHandPointLeft, FaHandPointRight, FaQuoteLeft, FaRegHandPointLeft } from "react-icons/fa";

const Hadiths = ({ searchTerm }) => {
    const { chapter, bookSlug } = useParams();
    const [page, setPage] = useState(1);


    const { data, isFetching, error } = useGetHadithsQuery({ book: bookSlug, chapter, words: searchTerm, page });


    const chapterName = data?.hadiths?.data[0]?.chapter[`chapter${t('lang')}`];
    const location = useLocation()
    const bookName = location.state.bookName


    const { language } = useSelector((state) => state.player);


    const { scrollContainerRef, showScrollButton, handleScrollToTop } = useScrollToTopButton();


    const status = t('Status', { returnObjects: true });


    if (isFetching) return <Loader />;


    if (error) return <Error message="Failed to fetch data" />;

    return (
        <div className={`flex px-4 flex-col  h-screen items-center  md:pb-24 pb-40 ${t('font')}`}>
            <div className={`text-white md:p-4 p-2 w-full border-x-2 border-x-[#EEEEEE]  flex ${language !== 'ar' && 'flex-row-reverse'} justify-between items-center bg-[#191624] rounded-lg text-center  mb-1`}>
                <h4 className="md:text-lg text-xs text-black bg-white rounded-lg p-1">{t('Page') + " " + t('Number') + " " + page}</h4>
                <h2 className="md:text-2xl text-lg  " >
                    <span className="md:text-3xl text-xl ">{bookName}:</span> {chapterName}
                </h2>
            </div>
            <div
                ref={scrollContainerRef}
                className={`flex ${language === 'ar' ? 'flex-row-reverse' : ''} overflow-y-scroll hide-scrollbar  flex-wrap justify-center gap-y-4 my-2 `}
            >
                {data?.hadiths?.data.map((hadith) => (
                    <HadithCard
                        key={hadith.id}  // Add unique key
                        status={status[hadith.status?.toUpperCase()] || t('Unknown')}
                        hadith={hadith}
                        language={language}
                    />
                ))}
            </div>

            {/* Pagination Section */}
            {(data?.hadiths?.prev_page_url || data?.hadiths?.next_page_url) && <div className="flex gap-2 w-fit bg-white flex-wrap justify-center rounded-lg p-1">
                {data?.hadiths?.links.map((link, i) => (
                    (!link.active && (link.url || link.label == '...')) && (
                        <button
                            disabled={!link.url}
                            key={i}
                            onClick={() => setPage(link.url.split('=')[1])}
                            className={`px-2 py-1 border rounded md:text-xl text-xs ${link.url && 'hover:bg-gray-200'}`}

                        >
                            {link.label == '&laquo; Previous'
                                ? <FaChevronLeft />
                                : link.label == 'Next &raquo;'
                                    ? < FaChevronRight />
                                    : link.label}
                        </button>
                    )
                ))}
            </div>}

            {/* Scroll to top button */}
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
    );
};

export default Hadiths;
