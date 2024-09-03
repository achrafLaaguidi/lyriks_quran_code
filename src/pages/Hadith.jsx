import { useTranslation } from "react-i18next";
import { HadithCard } from "../components";
import { useSelector } from "react-redux";

const Hadith = () => {

    const { t } = useTranslation()
    const books = t('books', { returnObjects: true })
    const { language } = useSelector((state) => state.player)

    return (
        <div className={`flex  flex-col  h-screen  items-center  mt-8  w-full  ${t('font')}`}>
            <h2 className={`text-white text-center  md:text-4xl text-2xl mb-8`}>{t('booksName')}</h2>
            <div className="flex flex-wrap justify-center gap-6  mb-20 overflow-y-scroll hide-scrollbar ">
                {books.map((book) => (
                    <HadithCard
                        language={language}
                        key={book.id}
                        book={book}
                    />
                ))}
            </div>
        </div>)
}

export default Hadith;