import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BooksCard } from "../components";

const Books = () => {

    const { t } = useTranslation()
    const books = t('books', { returnObjects: true })
    const { language } = useSelector((state) => state.player)
    const navigate = useNavigate()

    return (
        <div className={`flex px-4 flex-col h-screen  items-center  w-full pb-28 md:pb-8 md:mt-2 mt-12 ${t('font')}`}>
            <h2 className={`text-white w-full bg-[#191624] border-x-2 border-x-[#EEEEEE] rounded-lg py-4 text-center  md:text-4xl text-2xl mb-2 `}>{t('booksName')}</h2>
            <div className="flex flex-wrap overflow-y-scroll hide-scrollbar  justify-center gap-4    ">
                {books.map((book) => (
                    <BooksCard
                        navigate={navigate}
                        language={language}
                        key={book.id}
                        book={book}
                    />
                ))}
            </div>


        </div>)
}

export default Books;