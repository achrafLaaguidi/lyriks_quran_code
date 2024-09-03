import { bookLogo } from "../assets"

const HadithCard = ({ book, language }) =>
(<div className={`flex flex-col gap-y-1 w-[200px]   justify-between items-center text-white  p-4 bg-white/10 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer `}  >
    <div className="w-full md:h-40 h-36 flex items-center ">
        <img src={bookLogo} className="h-full w-full  rounded-lg" />
    </div>
    <div className={`w-full flex  flex-col justify-center gap-y-1 `}>
        <div className={`${language == 'ar' ? 'text-right' : 'text-left'} bg-[#508C9B]  p-2 rounded-lg `}>
            <p className={`mb-3 bg-[#134B70]  rounded-lg p-2`}>{book.bookName}</p>
            <p className="bg-[#EEEEEE] rounded-lg p-2 text-black  font-bold">{book.hadiths_count}  {book.hadiths}</p>
        </div>
        <div className="bg-[#201E43] text-center  p-2 rounded-lg">
            <p>{book.writerName}</p>

        </div>
    </div>
</div>)
export default HadithCard