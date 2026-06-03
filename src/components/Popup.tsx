import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PopupItem {
  id: string;
  title: string;
  content: string;
  image?: string;
  status: string;
}

export default function Popup() {
  const [popups, setPopups] = useState<PopupItem[]>([]);
  const [closedPopups, setClosedPopups] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Check local storage for closed popups to not show them again within 24 hours
    const stored = localStorage.getItem("closedPopups");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const now = Date.now();
        const activeClosedIds = new Set<string>();
        for (const [id, timestamp] of Object.entries(parsed)) {
          // If closed less than 24 hours ago
          if (now - (timestamp as number) < 24 * 60 * 60 * 1000) {
            activeClosedIds.add(id);
          }
        }
        setClosedPopups(activeClosedIds);
      } catch (e) {}
    }

    const q = query(
      collection(db, "popups"),
      where("status", "==", "활성")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const activePopups: PopupItem[] = [];
      snapshot.forEach(doc => {
        activePopups.push({ id: doc.id, ...doc.data() } as PopupItem);
      });
      setPopups(activePopups);
    });

    return () => unsub();
  }, []);

  const handleClose = (id: string, dontShowAgain: boolean) => {
    setPopups(prev => prev.filter(p => p.id !== id));
    
    if (dontShowAgain) {
      const newClosedPopups = new Set(closedPopups);
      newClosedPopups.add(id);
      setClosedPopups(newClosedPopups);

      const stored = localStorage.getItem("closedPopups");
      const parsed = stored ? JSON.parse(stored) : {};
      parsed[id] = Date.now();
      localStorage.setItem("closedPopups", JSON.stringify(parsed));
    }
  };

  const popupsToShow = popups.filter(p => !closedPopups.has(p.id));

  if (popupsToShow.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex justify-center items-center sm:items-start sm:p-24 sm:justify-start gap-4 flex-wrap">
      <AnimatePresence>
        {popupsToShow.map((popup) => (
          <motion.div
            key={popup.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`pointer-events-auto bg-[#070B13] border border-[#2D7DFF]/20 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(45,125,255,0.15)] flex flex-col overflow-hidden max-w-[90vw] ${popup.image ? 'sm:max-w-[500px]' : 'sm:max-w-[400px]'} w-full shrink-0 m-4 sm:m-0`}
          >
            {popup.image ? (
              <div className="w-full bg-[#070B13] relative flex justify-center items-center">
                <img src={popup.image} alt="popup image" className="w-full h-auto object-contain block" />
              </div>
            ) : (
              <div className="p-6 md:p-8 pt-8">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug break-keep">{popup.title}</h3>
                </div>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed break-keep whitespace-pre-wrap">{popup.content}</p>
              </div>
            )}

            <div className="mt-auto border-t border-white/5 flex text-sm font-medium">
              <button 
                onClick={() => handleClose(popup.id, true)} 
                className="flex-1 py-3.5 md:py-4 px-4 text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-center border-r border-white/5"
              >
                오늘 하루 안 보기
              </button>
              <button 
                onClick={() => handleClose(popup.id, false)} 
                className="flex-1 py-3.5 md:py-4 px-4 text-white hover:bg-white/5 transition-colors text-center"
              >
                닫기
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
