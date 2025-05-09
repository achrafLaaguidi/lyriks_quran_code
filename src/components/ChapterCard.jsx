import { t } from "i18next";
import { memo } from "react";


const ChapterCard = memo(({ chapter, language, navigate, bookName }) => (
    <div
        onClick={() => navigate(`/hadiths/${chapter.bookSlug}/${chapter.chapterNumber}`, {
            state: {
                bookName: bookName
            }
        })}
        className={` flex  ${language !== 'ar' && 'flex-row-reverse border-l-2 border-l-[#E2DAD6]'} border-r-2 border-r-[#E2DAD6] md:w-[300px] w-[150px]  gap-2 justify-between items-center text-white  p-4 bg-white/10 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer `}>

        <p className={` bg-[#508C9B] w-full text-center md:text-xl text-sm rounded-lg p-2`}>{chapter['chapter' + t('lang')]}</p>
        <p className="bg-[#EEEEEE] rounded-lg p-2 text-black  font-bold">{chapter.chapterNumber}</p>

    </div>
))
export default ChapterCard;