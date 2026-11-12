import { t } from 'i18next';
import { useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function DownloadSong({ audio, name, size }) {
  const [downloading, setDownloading] = useState(false);
  const download = async () => {
    const confirmation = await Swal.fire({
      title: t('Sure'),
      text: t('FileMessage'),
      showCancelButton: true,
      confirmButtonColor: '#176B5B',
      cancelButtonColor: '#626B66',
      cancelButtonText: t('Cancel'),
      confirmButtonText: t('Yes'),
    });
    if (!confirmation.isConfirmed) return;
    setDownloading(true);
    Swal.fire({ title: t('Loading'), allowOutsideClick: false, showConfirmButton: false, didOpen: () => Swal.showLoading() });
    try {
      const response = await fetch(audio);
      if (!response.ok) throw new Error('Download failed');
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement('a');
      link.href = url;
      link.download = `${name}.mp3`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      Swal.fire({ icon: 'success', title: t('DownloadComplete'), confirmButtonColor: '#176B5B' });
    } catch {
      Swal.fire({ icon: 'error', title: t('DownloadFailed'), confirmButtonColor: '#176B5B' });
    } finally {
      setDownloading(false);
    }
  };
  return <button type="button" className="text-button" disabled={!audio || downloading} aria-label={`تنزيل الملف الصوتي: ${name}`} title="تنزيل الملف الصوتي" onClick={download}><FaDownload size={size} aria-hidden="true" /><span className="sr-only">تنزيل الملف الصوتي</span></button>;
}
