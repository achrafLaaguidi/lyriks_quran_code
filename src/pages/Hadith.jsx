import { useTranslation } from "react-i18next";
import { HadithCard } from "../components";
import { useSelector } from "react-redux";

const Hadith = () => {

    const { t } = useTranslation()
    const books = t('books', { returnObjects: true })
    const { language } = useSelector((state) => state.player)

    return (
        <div className={`flex flex-col  items-center h-screen mt-8  w-full px-1 pb-2 ${t('font')}`}>
            <h2 className={`text-white text-center  md:text-4xl text-2xl mb-10`}>{t('booksName')}</h2>
            <div className="flex flex-wrap justify-center gap-6 overflow-y-scroll hide-scrollbar">
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