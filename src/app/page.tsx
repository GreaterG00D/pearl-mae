"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

const images = [
  "1.jpg",
  "2.jpg",
  "3.jpg",
  "4.jpg",
  "5.jpg",
  "6.jpg",
  "7.jpg",
  "8.jpg",
  "9.jpg",
  "10.jpg",
  "11.jpg",
  "12.jpg",
  "13.jpg",
  "14.jpg",
  "15.jpg",
  "16.jpg",
  "17.jpg",
  "18.jpg",
  "19.jpg",
  "20.jpg",
  "21.jpg",
  "22.jpg",
  "23.jpg",
  "24.jpg",
  "25.jpg",
  "26.jpg",
  "27.jpg",
  "28.jpg",
  "29.jpg",
  "30.jpg",
  "31.jpg",
  "32.jpg",
  "33.jpg",
  "34.jpg",
  "35.jpg",
  "36.jpg",
  "37.jpg",
  "38.jpg",
  "39.jpg",
].map((name) => `/images/${name}`);

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
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<Array<{ width: number; height: number } | null>>(
    images.map(() => null)
  );

  const containerWidth = 1000;
  const containerHeight = 600;

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

  const nextStep = () => {
    setIndex((prev) => {
      let next;
      do {
        next = Math.floor(Math.random() * images.length);
      } while (next === prev);
      return next;
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextStep();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setLoaded(false);
  }, [index]);

  const currentDims = imageDimensions[index];

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
        className="w-full max-w-[1000px] px-4 sm:px-8"
        style={{
          height: `${containerHeight}px`,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={images[index]}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex"
          >
            {currentDims ? (
              <Image
                src={images[index]}
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
      </div>
    </main>
  );
}
