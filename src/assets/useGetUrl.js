const useGetUrl = ({ id, currentSurah }) => {
    const reciterServer = currentSurah.reciters[0].moshaf[0]?.server;
    const formattedIndex = id >= 100 ? id : id >= 10 ? `0${id}` : `00${id}`;
    return `${reciterServer}${formattedIndex}.mp3`;
}
export default useGetUrl;