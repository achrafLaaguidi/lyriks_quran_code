import { t } from 'i18next';
import { useState } from 'react';
import { FaDownload } from 'react-icons/fa';

import Swal from 'sweetalert2';

const DownloadSong = ({ audio, name, size }) => {
    const [isDownloading, setIsDownloading] = useState(false);


    const handleSure = async () => {
        Swal.fire({
            title: `${t('Sure')}`,
            text: `${t('FileMessage')}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: `${t('Cancel')}`,
            confirmButtonText: `${t('Yes')}`
        }).then((result) => {
            if (result.isConfirmed) {
                handleDownload()
            }
        });
    }
    const handleDownload = async () => {
        if (audio) {
            setIsDownloading(true);



            Swal.fire({
                title: `${t('Loading')}`,
                html: 'Progression : <b>0%</b>',
                allowOutsideClick: false,
                showConfirmButton: false,
                position: 'top',
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                const response = await fetch(audio);
                if (!response.ok) throw new Error('Erreur réseau');

                const total = parseInt(response.headers.get('content-length'), 10); // Taille totale du fichier
                let loaded = 0; // Octets téléchargés

                const reader = response.body.getReader();
                const stream = new ReadableStream({
                    start(controller) {
                        function push() {
                            reader.read().then(({ done, value }) => {
                                if (done) {
                                    controller.close();
                                    return;
                                }
                                loaded += value.length;
                                controller.enqueue(value);

                                // Mettre à jour la progression dans l'alerte
                                const progress = loaded / total;
                                Swal.getHtmlContainer().querySelector('b').textContent = `${Math.round(progress * 100)}%`;

                                push();
                            });
                        }
                        push();
                    },
                });

                const blob = await new Response(stream).blob();

                // Télécharger le fichier après téléchargement complet
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = name + '.mp3';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Fermer l'alerte et afficher une notification de succès
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: `${t('DownloadComplete')}`,
                    showConfirmButton: false,
                    timer: 1500,
                });
            } catch (error) {
                console.error('Erreur lors du téléchargement du fichier :', error);
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: `${t('DownloadFailed')}`,
                });
            } finally {
                setIsDownloading(false);
            }
        }
    };

    return (
        <>
            <FaDownload
                aria-disabled={!audio || isDownloading}
                size={size}
                className="text-gray-300"
                onClick={handleSure} />
        </>
    )

}
export default DownloadSong;