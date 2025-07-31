"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

const images = [
  "DSCF7271-Enhanced-NR.jpg",
  "DSCF7271-Enhanced-NR-2.jpg",
  "DSCF7283.jpg",
  "DSCF7289.jpg",
  "DSCF7290.jpg",
  "DSCF7292-Enhanced-NR-2.jpg",
  "DSCF7297-2.jpg",
  "DSCF7297-3.jpg",
  "DSCF7299-Enhanced-NR.jpg",
  "DSCF7301-Enhanced-NR.jpg",
  "DSCF7303.jpg",
  "DSCF7304-Enhanced-NR.jpg",
  "DSCF7305-Enhanced-NR.jpg",
  "DSCF7307-Enhanced-NR.jpg",
  "DSCF7309-Enhanced-NR.jpg",
  "DSCF7311-Enhanced-NR.jpg",
  "DSCF7314-Enhanced-SR.jpg",
  "DSCF7317.jpg",
  "DSCF7317-Enhanced-NR.jpg",
  "DSCF7318.jpg",
  "DSCF7321-Enhanced-NR-2.jpg",
  "DSCF7322-Enhanced-NR.jpg",
  "DSCF7323-Enhanced-NR-2.jpg",
  "DSCF7324-Enhanced-NR.jpg",
  "DSCF7331-Enhanced-SR.jpg",
  "DSCF7333.jpg",
  "DSCF7335.jpg",
  "DSCF7337-Enhanced-NR-2.jpg",
  "DSCF7337-Enhanced-NR.jpg",
  "DSCF7338-Enhanced-NR.jpg",
  "DSCF7339-Enhanced-NR.jpg",
  "DSCF7342.jpg",
  "DSCF7343-Enhanced-NR-2.jpg",
  "DSCF7343-Enhanced-NR.jpg",
  "DSCF7348-Enhanced-NR.jpg",
  "DSCF7351-Enhanced-NR.jpg",
  "DSCF7355-Enhanced-NR.jpg",
  "DSCF7360.jpg",
  "DSCF7368-Enhanced-NR.jpg",
  "DSCF7371-Enhanced-NR.jpg",
  "DSCF7378-Enhanced-NR.jpg",
  "DSCF7385-Enhanced-NR.jpg",
  "DSCF7387-Enhanced-NR.jpg",
  "DSCF7390-Enhanced-NR.jpg",
  "DSCF7395.jpg",
  "DSCF7399-Enhanced-SR.jpg",
  "DSCF7401-Enhanced-NR.jpg",
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
