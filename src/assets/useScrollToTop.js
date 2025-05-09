// useScrollToTopButton.js
import { useEffect, useState, useRef } from 'react';

const useScrollToTopButton = () => {
    const [showScrollButton, setShowScrollButton] = useState(false);
    const scrollContainerRef = useRef(null);


    useEffect(() => {
        const refCurrent = scrollContainerRef.current;



        const handleScroll = () => {
            if (refCurrent.scrollTop > 300) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };

        if (refCurrent) {
            refCurrent.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (refCurrent) {
                refCurrent.removeEventListener('scroll', handleScroll);
            }
        };
    }, [scrollContainerRef.current]);

    const handleScrollToTop = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return { scrollContainerRef, showScrollButton, handleScrollToTop };
};

export default useScrollToTopButton;
