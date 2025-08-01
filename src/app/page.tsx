"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

const images = Array.from({ length: 39 }, (_, i) => `/images/${i + 1}.jpg`);

const variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.8 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.8 },
  },
};

export default function Page() {
  const [history, setHistory] = useState<number[]>([0]);
  const [pointer, setPointer] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<Array<{ width: number; height: number } | null>>(
    images.map(() => null)
  );
  const [containerWidth, setContainerWidth] = useState(1000);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const containerHeight = 600;

  const currentIndex = history[pointer];

  useEffect(() => {
    images.forEach((src, i) => {
      const img = new window.Image();
      img.src = src;
      img.onload = () => {
        setImageDimensions((prev) => {
          const newDims = [...prev];
          newDims[i] = { width: img.naturalWidth, height: img.naturalHeight };
          return newDims;
        });
      };
    });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setContainerWidth(containerRef.current?.clientWidth || 1000);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scheduleNext = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      nextStep();
    }, 10000);
  };

  const nextStep = () => {
    const next = (currentIndex + 1) % images.length;
    const newHistory = history.slice(0, pointer + 1);
    newHistory.push(next);
    setHistory(newHistory);
    setPointer(newHistory.length - 1);
  };

  const goBack = () => {
    if (pointer > 0) {
      setPointer(pointer - 1);
    }
  };

  useEffect(() => {
    setLoaded(false);
    scheduleNext();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pointer]);

  const currentDims = imageDimensions[currentIndex];

  let displayWidth = 0;
  let displayHeight = 0;
  if (currentDims) {
    const scale = Math.min(
      containerWidth / currentDims.width,
      containerHeight / currentDims.height,
      1
    );
    displayWidth = currentDims.width * scale;
    displayHeight = currentDims.height * scale;
  }

  const hbSide = currentDims ? Math.min(300, Math.min(displayWidth, displayHeight)) : 0;

  return (
    <main
      className="flex flex-col items-center min-h-screen pt-16"
      style={{
        backgroundImage: "url(/images/purp1.avif)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <img
        src="/images/pearlmae.jpg"
        alt="Logo"
        className="h-30 object-contain rounded-xl mb-8"
      />
      <div
        ref={containerRef}
        className="w-full max-w-[1000px] px-4 sm:px-8 relative"
        style={{
          height: `${containerHeight}px`,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        {/* Static background image (below slideshow) */}
        {hbSide > 0 && (
          <div className="absolute mt-10 top-0 left-1/2 transform -translate-x-1/2 z-0">
            <Image
              src="/images/hb.png"
              alt="Static Base"
              width={hbSide}
              height={hbSide}
              className="rounded-xl"
            />
          </div>
        )}

        {/* Slideshow image (on top of static image) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={images[currentIndex]}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex z-10"
          >
            {currentDims ? (
              <Image
                src={images[currentIndex]}
                alt="slide"
                width={displayWidth}
                height={displayHeight}
                onLoad={() => setLoaded(true)}
                className={`rounded-xl transition-opacity duration-900 ${loaded ? "opacity-100" : "opacity-0"}`}
              />
            ) : (
              <div className="text-white">Loading image...</div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Overlay click areas */}
        <div className="absolute inset-0 z-20 flex" style={{ cursor: "pointer" }}>
          <div
            className="w-1/2 h-full"
            onClick={() => {
              goBack();
              scheduleNext();
            }}
          />
          <div
            className="w-1/2 h-full"
            onClick={() => {
              nextStep();
              scheduleNext();
            }}
          />
        </div>
      </div>

      {/* Footer Text */}
      <div className="mt-6 text-center text-[#38069f] leading-tight">
        <div className="text-sm">Built with love for</div>
        <div className="flex items-center justify-center text-xl gap-1 mt-1">
          <span>Grandma Peggy</span>
          <img src="/favicon.ico" alt="icon" width={14} height={14} />
          <span>Aunt Pearl</span>
          <img src="/favicon.ico" alt="icon" width={14} height={14} />
          <span>Cousin Mae</span>
        </div>
      </div>
    </main>
  );
}