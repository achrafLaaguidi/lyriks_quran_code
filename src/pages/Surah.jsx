import { useSelector } from "react-redux";
import { useGetAyatsBySurahAndReaderQuery } from "../redux/services/quranApi";
import { useParams } from "react-router-dom";
import { Error, Loader } from "../components";
import { useState, useEffect } from "react";
import { HiArrowCircleRight, HiArrowCircleLeft } from "react-icons/hi";

const Surah = () => {
    const { surah, id } = useParams();
    const { reader, language } = useSelector((state) => state.player);
    const { data, isFetching, error } = useGetAyatsBySurahAndReaderQuery({
        surahId: id,
        reader: reader,
    });

    const [quranPages, setQuranPages] = useState([]);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [currentAyah, setCurrentAyah] = useState({});

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

            setQuranPages(uniquePages);
            setCurrentAyah(uniquePages[0]);
            console.log(currentAyah) // Set the first Ayah as current
        }
    }, [data]);

    useEffect(() => {
        setCurrentAyah(quranPages[currentPageIndex]);
    }, [currentPageIndex, quranPages]);

    const handleNext = () => {
        if (currentPageIndex < quranPages.length - 1) {
            setCurrentPageIndex(prevIndex => prevIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPageIndex > 0) {
            setCurrentPageIndex(prevIndex => prevIndex - 1);
        }
    };

    if (isFetching) return <Loader title="Loading Quran..." />;
    if (error) return <Error language={language} />;

    return (
        <div className="flex flex-col items-center rounded-2xl h-[calc(100vh)]">
            <h2 className="md:text-3xl text-xl text-white text-center mb-10 p-4 bg-white/5 backdrop-blur-sm animate-slideup rounded-lg">
                سورة {surah}
            </h2>

            <div className="flex justify-between items-center mt-6 px-4">
                <button
                    onClick={handlePrevious}
                    disabled={currentPageIndex === 0}
                    className={`bg-blue-300 text-white h-fit text-2xl py-2 px-4 rounded-lg ${currentPageIndex === 0 && "opacity-50 cursor-not-allowed"}`}
                >
                    <HiArrowCircleLeft />
                </button>

                <div className="p-4 w-full flex justify-center h-full">
                    {currentAyah?.page && (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 255 255"
                            className="bg-white w-[calc(100vh)] rounded-2xl"
                        >
                            <image href={currentAyah.page} width="100%" height="100%" />
                        </svg>
                    )}
                </div>

                <button
                    onClick={handleNext}
                    disabled={currentPageIndex === quranPages.length - 1}
                    className={`bg-blue-300 text-white h-fit text-2xl py-2 px-4 rounded-lg ${currentPageIndex === quranPages.length - 1 && "opacity-50 cursor-not-allowed"}`}
                >
                    <HiArrowCircleRight />
                </button>
            </div>
        </div>
    );
};

export default Surah;
