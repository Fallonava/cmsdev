"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, Maximize2 } from "lucide-react";
import Image from "next/image";
import * as React from "react";

// Placeholder data for the gallery
const galleryItems = [
  { id: 1, src: "/images/hero_cinematic.png", alt: "Gedung Sekolah Tampak Depan", category: "Fasilitas" },
  { id: 2, src: "/images/school_building.png", alt: "Suasana Belajar Modern", category: "Akademik" },
  { id: 3, src: "/images/principal_portrait.png", alt: "Kegiatan Ekstrakurikuler", category: "Kegiatan" },
  // Duplicate for masonry effect demonstration
  { id: 4, src: "/images/hero_cinematic.png", alt: "Laboratorium Komputer", category: "Fasilitas" },
  { id: 5, src: "/images/school_building.png", alt: "Upacara Bendera", category: "Kegiatan" },
  { id: 6, src: "/images/principal_portrait.png", alt: "Perpustakaan Digital", category: "Fasilitas" },
];

export default function GaleriPage() {
  const [selectedImg, setSelectedImg] = React.useState<any>(null);

  // Lock body scroll when lightbox is open
  React.useEffect(() => {
    if (selectedImg) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedImg]);

  return (
    <main className="flex flex-col min-h-screen bg-[#fbfbfd]">
      
      {/* 1. Spatial Hero Section */}
      <section className="relative w-full pt-40 pb-16 px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="container mx-auto max-w-5xl text-center flex flex-col items-center gap-6"
        >
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm border border-gray-100 mb-2">
            <ImageIcon size={32} />
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold text-gray-900 tracking-tighter">
            Rekam Jejak.
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-2xl leading-relaxed">
            Menangkap momen-momen berharga dari dinamika pendidikan, prestasi, dan kehidupan sosial di lingkungan sekolah kami.
          </p>
        </motion.div>
      </section>

      {/* 2. Masonry Gallery Grid */}
      <section className="pb-32 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          
          {/* Categories Filter (Static for now) */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {["Semua", "Akademik", "Kegiatan", "Fasilitas"].map((cat, i) => (
              <button 
                key={i} 
                className={`px-6 py-2.5 rounded-full font-bold text-sm transition-colors duration-300 ${i === 0 ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Pure CSS Masonry Layout */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {galleryItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: (index % 3) * 0.1 }}
                className="relative break-inside-avoid rounded-[2rem] overflow-hidden group cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-gray-100 bg-gray-50"
                onClick={() => setSelectedImg(item)}
              >
                <div className="relative w-full" style={{ aspectRatio: index % 2 === 0 ? '4/3' : '3/4' }}>
                  <Image 
                    src={item.src} 
                    alt={item.alt} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                
                {/* Hover Glassmorphism Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-widest mb-2 border border-white/20">
                      {item.category}
                    </span>
                    <h3 className="text-white font-bold text-lg">{item.alt}</h3>
                  </div>
                  <div className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300 border border-white/20">
                    <Maximize2 size={18} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-8"
            onClick={() => setSelectedImg(null)}
          >
            <button 
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-50 border border-white/10"
              onClick={() => setSelectedImg(null)}
            >
              <X size={24} />
            </button>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl aspect-video sm:aspect-auto sm:h-[80vh] rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.5)] border border-white/10 bg-gray-900"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
            >
              <Image 
                src={selectedImg.src} 
                alt={selectedImg.alt} 
                fill 
                className="object-contain sm:object-cover"
              />
              
              {/* Caption Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 bg-gradient-to-t from-black/80 to-transparent">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-widest mb-2 border border-white/20">
                  {selectedImg.category}
                </span>
                <h3 className="text-white font-bold text-xl sm:text-2xl">{selectedImg.alt}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
