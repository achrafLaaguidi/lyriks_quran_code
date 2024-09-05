import { t } from "i18next";

const HadithCard = ({ hadith, language, status }) =>
(<div className={`flex flex-col w-full gap-2  ${t('font')} ${language == 'ar' && 'text-right'} justify-center items-center text-white  p-4 bg-white/10 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg  `}  >
    <div className={`w-full flex ${language !== 'ar' && 'flex-row-reverse'} items-center justify-between rounded-lg bg-[#96C9F4] p-2`}>
        <p className={`${hadith.status.toUpperCase() == 'SAHIH' ? 'bg-green-600' : hadith.status.toUpperCase() == 'HASAN' ? 'bg-orange-600' : hadith.status.toUpperCase() == 'DA`EEF' && 'bg-red-600'}  rounded-lg md:text-xl text-base p-2`}>{status}</p>
        <p className={`   w-fit md:text-xl text-base bg-[#1A2130] rounded-lg p-2`}> {t('Hadith')} {t('Number')} {hadith.hadithNumber}</p>
    </div>
    <p className="bg-[#F5EDED] rounded-lg p-4 text-black w-full md:text-2xl text-xl md:leading-loose leading-relaxed">{hadith['hadith' + t('lang')]}</p>
</div >)
export default HadithCard;