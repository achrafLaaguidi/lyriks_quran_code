import { t } from "i18next";


const ChapterCard = ({ chapter }) => (
    <div className={` flex   md:w-[200px] w-[150px]  gap-2 justify-between items-center text-white  p-4 bg-white/10 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer `}>

        <p className={` bg-[#134B70] w-full text-center md:text-xl text-sm rounded-lg p-2`}>{chapter['chapter' + t('lang')]}</p>
        <p className="bg-[#EEEEEE] rounded-lg p-2 text-black  font-bold">{chapter.chapterNumber}</p>

    </div>
)
export default ChapterCard;