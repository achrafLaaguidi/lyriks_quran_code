import { useEffect, useState } from "react";
import { HiArrowCircleLeft, HiArrowCircleRight } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { styleSelect } from "../assets/constants";
import { Error, Loader } from "../components";
import { setSave } from "../redux/features/playerSlice";
import { useGetAyatsBySurahAndReaderQuery } from "../redux/services/quranApi";

const Surah = () => {
    const dispatch = useDispatch();
    const { save } = useSelector((state) => state.player)
    const { id } = useParams();
    const { language } = useSelector((state) => state.player);
    const { data, isFetching, error } = useGetAyatsBySurahAndReaderQuery({
        surahId: id,
    });

    const [quranSurah, setquranSurah] = useState([]);
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
            console.log(currentPageIndex)

            setquranSurah(uniquePages);
            setCurrentPageIndex(save)
            // Set the first Ayah as current
            setCurrentAyah(uniquePages[save || 0]);
        }
    }, [data]);

    useEffect(() => {
        setCurrentAyah(quranSurah[currentPageIndex]);
    }, [currentPageIndex, save]);

    const handleNext = () => {

        setCurrentPageIndex(prevIndex => prevIndex + 1);

    };

    const handlePrevious = () => {

        setCurrentPageIndex(prevIndex => prevIndex - 1);

    };


    if (isFetching) return <Loader title="Loading Quran..." />;
    if (error) return <Error language={language} />;

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="flex justify-center w-full">

                <select
                    value={currentPageIndex}
                    onChange={(e) => setCurrentPageIndex(parseInt(e.target.value))}
                    style={styleSelect}
                    className="hide-scrollbar w-fit "
                >
                    <option value="hide">اختر الصفحة</option>
                    {quranSurah.map((option, i) => (
                        <option key={i + 1} value={i}>
                            {i + 1} الصفحة
                        </option>
                    ))}
                </select>
                <button
                    disabled={currentPageIndex === save}
                    className="bg-orange-600 w-fit p-2 rounded-md text-white"
                    onClick={() => { dispatch(setSave(currentPageIndex)) }}>
                    {currentPageIndex === save ? 'Saved' : 'Save'}
                </button>
            </div>

            <div className="flex flex-row justify-between items-center ">
                {currentPageIndex != 0 && (<button
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
                            className="bg-white md:w-[calc(100vh)] w-screen  h-max rounded-2xl object-cover"
                        >
                            <image href={currentAyah.page} width="100%" height='100%' />
                        </svg>
                    )}
                </div>


                {currentPageIndex != quranSurah.length - 1 && <button
                    onClick={handleNext}
                    disabled={currentPageIndex === quranSurah.length - 1}
                    className={`md:right-10 right-4 absolute bg-blue-300 text-white h-fit md:text-2xl p-2 rounded-lg   opacity-50`}
                >
                    <HiArrowCircleRight />
                </button>}
            </div>
        </div>
    );
};

export default Surah;
