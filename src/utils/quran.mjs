// MP3Quran moshaf_type is the full catalog identifier, not the list position.
export function selectMoshaf(data, readerId, typeId) {
  return data?.reciters?.find((r) => Number(r.id) === Number(readerId))
    ?.moshaf?.find((m) => Number(m.moshaf_type) === Number(typeId));
}
export function recitationUrl(moshaf, surahId) {
  if (!/^\d+$/.test(String(surahId)) || Number(surahId) < 1 || Number(surahId) > 114) return null;
  if (!moshaf?.server || !moshaf.surah_list?.split(',').includes(String(Number(surahId)))) return null;
  return `${moshaf.server}${String(Number(surahId)).padStart(3, '0')}.mp3`;
}
// Only metadata and search input are normalized; Quran content is never transformed.
export function normalizeSearch(value) {
  return String(value).normalize('NFD').replace(/[\u064B-\u065F\u0670]/g, '').replace(/[أإآ]/g, 'ا')
    .toLowerCase();
}
