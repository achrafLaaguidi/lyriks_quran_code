import { bookLogo } from "../assets"

const HadithCard = ({ book, language }) =>
(<div className={`flex ${language == 'ar' && 'flex-row-reverse'} gap-x-1  justify-between text-white   md:w-fit  p-4 bg-white/10 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer `}  >
    <div className={`w-1/2 h-full flex  flex-col justify-between ${language == 'ar' ? 'items-end' : 'items-start'} gap-y-1`}>
        <div className={`${language == 'ar' ? 'text-right' : 'text-left'} bg-[#508C9B] w-full p-2 rounded-lg `}>
            <p className={`mb-3 bg-[#134B70]  rounded-lg p-2`}>{book.bookName}</p>
            <p>{book.writerName}</p>
        </div>
        <div className="bg-[#201E43]  px-2 py-1 rounded-full">
            <p>{book.hadiths_count}</p>
        </div>
    </div>
    <div className=" h-[150px]  flex items-center ">
        <img src={bookLogo} className="h-full w-full  rounded-lg" />
    </div>
</div>)
export default HadithCard