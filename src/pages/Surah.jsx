import { useSelector } from "react-redux";
import { useGetAyatsBySurahAndReaderQuery } from "../redux/services/quranApi";
import { useParams } from "react-router-dom";
import { Error, Loader } from "../components";
import { useState, useEffect } from "react";
import { HiArrowCircleRight, HiArrowCircleLeft } from "react-icons/hi";

const Surah = () => {
    const { id } = useParams();
    const { language } = useSelector((state) => state.player);
    const { data, isFetching, error } = useGetAyatsBySurahAndReaderQuery({
        surahId: id,
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
            // Set the first Ayah as current
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
        <div className="flex flex-row justify-between items-center   ">
            {currentPageIndex !== 0 && (<button
                onClick={handlePrevious}
                disabled={currentPageIndex === 0}
                className={`md:left-1/4 left-4 absolute bg-blue-300 text-white  h-fit md:text-2xl p-2  rounded-lg opacity-50 ${currentPageIndex === 0 && "cursor-not-allowed"}`}
            >
                <HiArrowCircleLeft />
            </button>)}

            <div className="text-center m-auto">

                {currentAyah?.page && (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 255 255"
                        className="bg-white md:w-[calc(100vh)] w-screen   rounded-2xl"
                    >
                        <image href={currentAyah.page} width="100%" height="100%" />
                    </svg>
                )}
            </div>


            {currentPageIndex !== quranPages.length - 1 && <button
                onClick={handleNext}
                disabled={currentPageIndex === quranPages.length - 1}
                className={`md:right-10 right-4 absolute bg-blue-300 text-white h-fit md:text-2xl p-2 rounded-lg  ${currentPageIndex === quranPages.length - 1 && " cursor-not-allowed"} opacity-50`}
            >
                <HiArrowCircleRight />
            </button>}
        </div>
    );
};

export default Surah;
