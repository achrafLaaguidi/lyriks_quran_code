import test from 'node:test';
import assert from 'node:assert/strict';
import { selectMoshaf, recitationUrl, normalizeSearch } from '../src/utils/quran.mjs';

test('selects the requested reader and narration instead of the first recording', () => {
  const requested = { moshaf_type: 11, server: 'https://example.org/hafs/', surah_list: '1,2,114' };
  const response = { reciters: [{ id: 102, moshaf: [{ moshaf_type: 222 }, requested] }] };
  assert.equal(selectMoshaf(response, '102', '11'), requested);
  assert.equal(selectMoshaf(response, 102, 21), undefined);
  assert.equal(selectMoshaf(undefined, 102, 11), undefined);
});
test('constructs padded recitation URLs only for available, valid surahs', () => {
  const moshaf = { server: 'https://example.org/', surah_list: '1,2,114' };
  assert.equal(recitationUrl(moshaf, 1), 'https://example.org/001.mp3');
  assert.equal(recitationUrl(moshaf, 114), 'https://example.org/114.mp3');
  for (const id of [0, 115, 1.5, '2abc', 3]) assert.equal(recitationUrl(moshaf, id), null);
  assert.equal(recitationUrl(undefined, 1), null);
});
test('Arabic metadata search tolerates vocalization and Alef variants', () => {
  assert.equal(normalizeSearch('الْفَاتِحَة'), normalizeSearch('الفاتحة'));
  assert.equal(normalizeSearch('إبراهيم'), normalizeSearch('ابراهيم'));
});
