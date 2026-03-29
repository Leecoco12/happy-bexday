import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useId, useState } from 'react';
import { Autoplay, EffectCreative, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-creative';

import styles from './Gallery.module.css';

export type GalleryItem = {
  src: string;
  alt: string;
};

type GalleryProps = {
  items: GalleryItem[];
  onLightboxOpenChange?: (open: boolean) => void;
};

export function Gallery({ items, onLightboxOpenChange }: GalleryProps) {
  const headingId = useId();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openAt = useCallback(
    (index: number) => {
      setLightboxIndex(index);
      onLightboxOpenChange?.(true);
    },
    [onLightboxOpenChange],
  );

  const close = useCallback(() => {
    setLightboxIndex(null);
    onLightboxOpenChange?.(false);
  }, [onLightboxOpenChange]);

  const handleSwiperInit = useCallback((swiper: SwiperType) => {
    // Démarrer l'autoplay après une petite pause pour s'assurer que tout est chargé
    setTimeout(() => {
      swiper.autoplay.start();
    }, 100);
  }, []);

  const handleSwiperClick = useCallback((swiper: SwiperType) => {
    // Redémarrer l'autoplay après un clic
    swiper.autoplay.start();
  }, []);

  return (
    <motion.section
      className={styles.section}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      aria-labelledby={headingId}
    >
      <h2 id={headingId} className={styles.title}>
        Little moments
      </h2>
      {/* <p className={styles.subtitle}>Tap an image to open the lightbox</p> */}

      <div className={styles.sliderWrap}>
        <Swiper
          modules={[Autoplay, Pagination, EffectCreative]}
          effect="creative"
          creativeEffect={{
            prev: { 
              shadow: true, 
              translate: ['-100%', 0, -200]
            },
            next: { 
              shadow: true, 
              translate: ['100%', 0, -200]
            },
          }}
          grabCursor
          centeredSlides
          slidesPerView={1.2}
          spaceBetween={24}
          loop={items.length > 1}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
            waitForTransition: true,
          }}
          pagination={{ 
            clickable: true,
            dynamicBullets: true,
            dynamicMainBullets: 3,
          }}
          breakpoints={{
            640: { 
              slidesPerView: 1.3, 
              spaceBetween: 28
            },
            900: { 
              slidesPerView: 1.4, 
              spaceBetween: 32
            },
          }}
          speed={800}
          onSwiper={handleSwiperInit}
          onSlideChangeTransitionStart={handleSwiperClick}
          className={styles.swiper}
        >
          {items.map((item, index) => (
            <SwiperSlide key={item.src} className={styles.slide}>
              <button
                type="button"
                className={styles.slideButton}
                onClick={() => openAt(index)}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className={styles.slideImg}
                  loading="lazy"
                />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && items[lightboxIndex] && (
          <motion.div
            className={styles.lightbox}
            role="dialog"
            aria-modal="true"
            aria-label="Enlarged photo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
          >
            <motion.div
              className={styles.lightboxInner}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={items[lightboxIndex].src}
                alt={items[lightboxIndex].alt}
                className={styles.lightboxImg}
              />
              <button type="button" className={styles.close} onClick={close}>
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
