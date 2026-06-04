import { useState, useEffect } from "react";
import { X, ChevronRight, Plus } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

interface LawyerData {
  id: string;
  name: string;
  title: string;
  image?: string;
  history: string[];
  order?: number;
  badges: string[];
}

export default function Lawyer() {
  const [selectedLawyer, setSelectedLawyer] = useState<LawyerData | null>(null);
  const [lawyers, setLawyers] = useState<LawyerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "lawyers"), (snapshot) => {
      const data: LawyerData[] = [];
      snapshot.forEach(doc => {
        const d = doc.data();
        data.push({
          id: doc.id,
          name: d.name,
          title: d.role,
          image: d.image || "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=800&q=80",
          history: d.type ? d.type.split('\n').filter((line: string) => line.trim() !== '') : [],
          order: d.order,
          badges: d.badges ? d.badges.split(',').map((b: string) => b.trim()).filter((b: string) => b !== '') : []
        });
      });
      setLawyers(data.sort((a,b) => {
        const orderA = a.order || 0;
        const orderB = b.order || 0;
        if (orderA !== orderB) return orderA - orderB;
        return 0; // or b.createdAt - a.createdAt if we have it, but we don't. That's fine.
      }));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "lawyers");
    });
    return () => unsub();
  }, []);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (selectedLawyer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedLawyer]);

  return (
    <div className="pt-24 pb-32">
      <Helmet>
        <title>변호사 소개 | 수원지방법원 형사전문변호사</title>
        <meta name="description" content="수원 영장실질심사 전담 변호사. 대표 변호사가 강력 사건을 직접 전담하며 구속 위기에서 구출해 드립니다." />
        <link rel="canonical" href="https://suwonwarrantcenter.com/lawyer" />
      </Helmet>
      {/* Slogan Banner */}
      <div className="bg-[#2D7DFF] py-3 text-center mb-12">
        <p className="text-white font-bold text-sm md:text-base tracking-wide">
          수원지방법원 영장실질심사 1,000건 이상 수행
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">변호사 소개</h1>
          <p className="text-gray-400 text-[15px] md:text-lg max-w-2xl mx-auto break-keep leading-relaxed">
            대표 변호사가 직접 사건을 맡아 처음부터 끝까지 책임지고 대응합니다.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-12">로딩 중...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {lawyers.map((lawyer) => (
              <div 
                key={lawyer.id}
                onClick={() => setSelectedLawyer(lawyer)}
                className="group cursor-pointer flex flex-col items-center"
              >
                <div className="w-[240px] md:w-[260px] aspect-[4/5] bg-[#111827] rounded-3xl relative overflow-hidden border border-white/10 mb-6 transition-all duration-300 group-hover:border-[#2D7DFF]/50 group-hover:shadow-[0_0_30px_rgba(45,125,255,0.2)] group-hover:-translate-y-2">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${lawyer.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/80 via-transparent to-transparent opacity-60 z-0 pointer-events-none" />
                  <div className="absolute inset-0 bg-[#2D7DFF]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center z-10 backdrop-blur-[2px]">
                    <div className="bg-[#2D7DFF] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                      약력 상세보기
                    </div>
                  </div>

                  {/* Always-visible visual cue for accessibility */}
                  <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md rounded-full shadow-lg w-8 h-8 border border-white/30 text-white group-hover:text-white group-hover:bg-[#2D7DFF] group-hover:border-[#2D7DFF] transition-all z-20 flex items-center justify-center">
                     <Plus size={18} strokeWidth={2.5} />
                  </div>
                </div>
                
                <div className="text-center w-full relative flex flex-col items-center px-2">
                  <div className="flex flex-col gap-1.5 mb-3 items-center">
                    {lawyer.badges && lawyer.badges.length > 0 ? (
                      lawyer.badges.map((badge, idx) => (
                        <span key={idx} className={`bg-transparent border ${badge.includes('형사전문') ? 'border-[#D4AF37]/50 text-[#D4AF37]' : badge.includes('전담') ? 'border-[#FF5A5A]/50 text-[#FF5A5A]' : 'border-white/20 text-white'} text-[11px] font-bold px-2.5 py-1 rounded-sm tracking-wide`}>
                          {badge}
                        </span>
                      ))
                    ) : (
                      <>
                        <span className="bg-transparent border border-[#FF5A5A]/50 text-[#FF5A5A] text-[11px] font-bold px-2.5 py-1 rounded-sm tracking-wide">
                          영장실질심사 전담
                        </span>
                        <span className="bg-transparent border border-[#D4AF37]/50 text-[#D4AF37] text-[11px] font-bold px-2.5 py-1 rounded-sm tracking-wide">
                          대한변호사협회 형사전문변호사
                        </span>
                      </>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-white mb-2 group-hover:text-[#59C7FF] transition-colors flex items-baseline gap-2">
                    <span className="text-[#8BE0FF] text-[15px] font-medium opacity-80 mb-0">{lawyer.title}</span>
                    {lawyer.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lawyer Modal */}
      {selectedLawyer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm">
          {/* Backdrop for click outside */}
          <div className="absolute inset-0" onClick={() => setSelectedLawyer(null)} />
          
          <div className="bg-[#0A0F18] w-full max-w-[800px] max-h-[90vh] overflow-y-auto md:overflow-hidden flex flex-col md:flex-row relative z-20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-300 rounded-sm">
            {/* Fine border inside like a true card edge */}
            <div className="absolute inset-0 border border-white/10 pointer-events-none z-30" />
            
            <button 
              onClick={() => setSelectedLawyer(null)} 
              className="absolute top-4 right-4 text-white/40 hover:text-white p-2 hover:bg-white/5 rounded-full transition-colors z-40"
            >
              <X size={24} />
            </button>
            
            {/* Image Section */}
            <div className="w-full md:w-[40%] shrink-0 relative bg-[#0A0F18] flex justify-center pt-10 md:pt-0 md:block">
               {/* Mobile: smaller portrait box to prevent cropping and overflowing. Desktop: fill height */}
              <div className="w-[140px] sm:w-[180px] aspect-[4/5] md:w-full md:h-full md:aspect-auto relative rounded-sm overflow-hidden md:rounded-none shadow-lg md:shadow-none border border-white/10 md:border-none">
                <div 
                  className="absolute inset-0 bg-cover bg-top bg-no-repeat"
                  style={{ backgroundImage: `url(${selectedLawyer.image})` }}
                />
                {/* Horizontal gradient to beautifully fade into content on desktop */}
                <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent via-[#0A0F18]/50 to-[#0A0F18]" />
              </div>
            </div>
            
            {/* Content Section */}
            <div className="flex-1 p-6 sm:p-8 md:p-14 flex flex-col justify-center relative z-20 bg-[#0A0F18] w-full text-center md:text-left">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6 md:mb-8 justify-center md:justify-start">
                {selectedLawyer.badges && selectedLawyer.badges.length > 0 ? (
                  selectedLawyer.badges.map((badge, idx) => (
                    <span key={idx} className={`px-2 py-0.5 bg-transparent border ${badge.includes('형사전문') ? 'border-[#D4AF37]/50 text-[#D4AF37]' : badge.includes('전담') ? 'border-[#FF5A5A]/50 text-[#FF5A5A]' : 'border-white/20 text-white/80'} text-[10px] font-bold tracking-widest rounded-sm`}>
                      {badge}
                    </span>
                  ))
                ) : (
                  <>
                    <span className="px-2 py-0.5 bg-transparent border border-[#FF5A5A]/50 text-[#FF5A5A] text-[10px] font-bold tracking-widest rounded-sm">
                      영장실질심사 전담
                    </span>
                    <span className="px-2 py-0.5 bg-transparent border border-[#D4AF37]/50 text-[#D4AF37] text-[10px] font-bold tracking-widest rounded-sm">
                      대한변호사협회 형사전문변호사
                    </span>
                  </>
                )}
              </div>
              
              {/* Header */}
              <div className="mb-8 relative">
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2 flex items-baseline justify-center md:justify-start gap-3">
                  <span className="text-[#D4AF37]/80 text-[18px] font-medium tracking-widest">{selectedLawyer.title}</span> 
                  {selectedLawyer.name}
                </h2>
                <div className="h-[1px] w-12 bg-[#D4AF37]/60 mt-6 mx-auto md:mx-0" />
              </div>
              
              {/* History */}
              <div className="w-full text-left flex justify-start">
                <ul className="space-y-3.5 mt-2 inline-block text-left">
                  {selectedLawyer.history.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <span className="text-[#D4AF37]/70 text-[10px] mt-1.5 leading-none shrink-0 tracking-widest block">✦</span>
                      <span className="text-gray-300 text-[13px] md:text-[14px] leading-relaxed break-keep tracking-wide font-light">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Bottom detail for business card feel */}
              <div className="mt-12 pt-6 border-t border-white/5 flex items-center justify-between opacity-50">
                <span className="text-[9px] tracking-[0.2em] font-medium text-white/50">LEGAL REPRESENTATIVE</span>
                <span className="text-[14px] tracking-[0.2em] font-serif italic text-white/30 truncate max-w-[150px]">{selectedLawyer.name}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
