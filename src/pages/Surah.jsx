import { useEffect, useState } from "react";
import { HiArrowCircleLeft, HiArrowCircleRight } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { styleSelect } from "../assets/constants";
import { Error, Loader } from "../components";
import { setSave } from "../redux/features/playerSlice";
import { useGetAyatsBySurahAndReaderQuery } from "../redux/services/quranApi";
import { t } from "i18next";

const Surah = () => {
    const dispatch = useDispatch();
    const { save } = useSelector((state) => state.player);
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

            setquranSurah(uniquePages);

            if (uniquePages.length > 0) {
                const initialPageIndex = parseInt(save) < uniquePages.length ? parseInt(save) : 0;
                setCurrentPageIndex(initialPageIndex);
                setCurrentAyah(uniquePages[initialPageIndex]);
            }
        }
    }, [data, save]);

    useEffect(() => {
        if (quranSurah.length > 0) {
            setCurrentAyah(quranSurah[currentPageIndex]);
        }
    }, [currentPageIndex, quranSurah]);

    const handleNext = () => {
        if (currentPageIndex < quranSurah.length - 1) {
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
        <div className="flex h-full w-full flex-col justify-center items-center">
            <div className="flex justify-center w-full mb-2">
                <select
                    value={currentPageIndex}
                    onChange={(e) => setCurrentPageIndex(parseInt(e.target.value))}
                    style={styleSelect}
                    className="hide-scrollbar w-fit"
                >
                    <option value="hide">{t('Choose Page')}</option>
                    {quranSurah.map((option, i) => (
                        <option key={i} value={i}>
                            {t('Page')} {i + 1}
                        </option>
                    ))}
                </select>
                <button
                    disabled={currentPageIndex === save}
                    className="bg-orange-600 w-fit p-2 rounded-md text-white ml-2"
                    onClick={() => { dispatch(setSave(currentPageIndex)) }}>
                    {currentPageIndex == save ? `${t('Saved')}` : `${t('Save')}`}
                </button>
            </div>

            <div className="flex flex-row justify-between items-center h-full w-fit">
                {currentPageIndex !== 0 && (
                    <button
                        onClick={handlePrevious}
                        disabled={currentPageIndex === 0}
                        className="bg-blue-300 text-white h-fit md:text-2xl p-2 rounded-lg opacity-50"
                    >
                        <HiArrowCircleLeft />
                    </button>
                )}

                <div className="flex justify-center items-center w-fit h-fit bg-white rounded-3xl">
                    {currentAyah?.page && (
                        <img
                            src={currentAyah.page}
                            alt="Ayah"
                            className="object-contain w-full h-full rounded-2xl"
                        />
                    )}
                </div>

                {currentPageIndex !== quranSurah.length - 1 && (
                    <button
                        onClick={handleNext}
                        disabled={currentPageIndex === quranSurah.length - 1}
                        className="bg-blue-300 text-white h-fit md:text-2xl p-2 rounded-lg opacity-50"
                    >
                        <HiArrowCircleRight />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Surah;
