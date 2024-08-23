import { useSelector } from "react-redux";
import { useGetAyatsBySurahAndReaderQuery } from "../redux/services/quranApi";
import { useParams } from "react-router-dom";
import { Error, Loader } from "../components";

const Surah = () => {
    const { surah, id } = useParams();
    const { reader, language } = useSelector((state) => state.player);
    const { data, isFetching, error } = useGetAyatsBySurahAndReaderQuery({
        surahId: id,
        reader: reader,
    });

    if (isFetching) {
        return <Loader title="Loading Quran..." />;
    }
    if (error) {
        return <Error language={language} />;
    }

    return (
        <div className="flex items-center flex-col h-[calc(100vh-10vh)] rounded-2xl  ">
            <h2 className="text-3xl text-white text-center mb-10 p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg ">سورة {surah} </h2>
            <div className=" overflow-y-scroll hide-scrollbar p-4 ">
                {data?.map((ayah) => (
                    <div key={ayah.ayah} className="mb-8 flex justify-center">
                        {/* Render the page background */}
                        {ayah?.page && (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 255 255" // Ensure this matches the aspect ratio of your SVG content
                                className="bg-white w-[calc(100vh*1.5)]  rounded-2xl "
                            >
                                <image href={ayah.page} width="100%" height="100%" />


                                {/* Render the polygon for each ayah if available */}
                                {ayah.polygon && (
                                    <polygon
                                        points={ayah.polygon}
                                        fill="rgba(0, 128, 255, 0.5)" // Highlight color
                                        stroke="blue"
                                        strokeWidth="1"
                                    />
                                )}
                            </svg>)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Surah;
