import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';

const DEFAULT_REVIEWS = [
  { 
    result: "구속영장 기각", 
    title: "구속 위기에서 벗어나 일상을 지켰습니다",
    text: "경찰 체포 후 바로 구속영장이 청구되어 정말 막막했습니다. 다급한 마음에 법진을 찾았고, 변호사님이 휴일임에도 즉시 유치장으로 접견을 와주셨습니다. 심사 당일 재판부를 설득하는 논리적인 변론 덕분에 기각 결정을 받고 가족의 품으로 돌아갈 수 있었습니다.",
    name: "의뢰인 김**"
  }
];

export default function ReviewSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviews, setReviews] = useState(DEFAULT_REVIEWS);

  useEffect(() => {
    const q = query(
      collection(db, "reviews"),
      where("status", "==", "승인됨"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setReviews(DEFAULT_REVIEWS);
        return;
      }
      
      const fetchedReviews = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          result: data.result || "구속영장 기각",
          title: data.title || "후기",
          text: data.content,
          name: data.writer,
          image: data.image
        };
      });
      setReviews(fetchedReviews);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 4000); // Change review every 4 seconds
    return () => clearInterval(timer);
  }, [reviews.length]);

  if (reviews.length === 0) return null;

  return (
    <div className="relative w-full max-w-4xl mx-auto min-h-[400px] md:min-h-[300px] flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute w-full px-4"
        >
          <div className="bg-[#070B13] p-8 md:p-12 rounded-2xl border border-[#2D7DFF]/20 relative overflow-hidden group shadow-[0_0_20px_rgba(45,125,255,0.05)] w-full">
            {/* Subtle background image softly masked to the right */}
            <div 
              className={`absolute inset-0 bg-cover bg-center opacity-[0.25] mix-blend-luminosity z-0 [mask-image:linear-gradient(to_right,transparent_20%,black_100%)] pointer-events-none transition-all duration-700`}
              style={{ backgroundImage: `url(${reviews[currentIndex]?.image || "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?q=80&w=2070&auto=format&fit=crop"})` }}
            />
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2D7DFF]/10 blur-[40px] rounded-bl-full pointer-events-none z-0" />
            
            <div className="relative z-10 flex flex-col h-full items-start">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-xs text-[#8BE0FF] font-medium tracking-widest bg-[#2D7DFF]/10 px-3 py-1.5 rounded-full border border-[#2D7DFF]/20">
                  {reviews[currentIndex]?.result}
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">"{reviews[currentIndex]?.title}"</h3>
              <p className="text-gray-300 text-sm md:text-lg leading-[1.8] font-light mb-8 break-keep">
                {reviews[currentIndex]?.text}
              </p>
              <div className="mt-auto w-full flex justify-between items-center border-t border-white/5 pt-6">
                <span className="text-gray-500 text-sm font-medium">{reviews[currentIndex]?.name}</span>
                <div className="flex items-center gap-1 text-[#59C7FF]">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Indicators */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {reviews.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "bg-[#2D7DFF] w-6" : "bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
