import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, X, FileText, ChevronRight, ShieldCheck } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";

interface CaseData {
  id: string;
  station: string;
  charge: string;
  fact: string;
  defense: string;
  result: string;
  image?: string;
  order?: number;
  createdAt: number;
}

const THEMES = [
  { border: "hover:border-[#2D7DFF]/40", glow: "bg-[#2D7DFF]/15", glowHover: "group-hover:bg-[#2D7DFF]/25", labelText: "text-[#8BE0FF]", labelBg: "bg-[#2D7DFF]/10", labelBorder: "border-[#2D7DFF]/20", iconWrap: "from-[#2D7DFF]/30 border-[#2D7DFF]/30", icon: "text-[#59C7FF]", grad: "to-[#8BE0FF]" },
  { border: "hover:border-indigo-500/40", glow: "bg-indigo-500/15", glowHover: "group-hover:bg-indigo-500/25", labelText: "text-indigo-300", labelBg: "bg-indigo-500/10", labelBorder: "border-indigo-500/20", iconWrap: "from-indigo-500/30 border-indigo-500/30", icon: "text-indigo-400", grad: "to-indigo-300" },
  { border: "hover:border-teal-500/40", glow: "bg-teal-500/15", glowHover: "group-hover:bg-teal-500/25", labelText: "text-teal-300", labelBg: "bg-teal-500/10", labelBorder: "border-teal-500/20", iconWrap: "from-teal-500/30 border-teal-500/30", icon: "text-teal-400", grad: "to-teal-300" },
  { border: "hover:border-cyan-500/40", glow: "bg-cyan-500/15", glowHover: "group-hover:bg-cyan-500/25", labelText: "text-cyan-300", labelBg: "bg-cyan-500/10", labelBorder: "border-cyan-500/20", iconWrap: "from-cyan-500/30 border-cyan-500/30", icon: "text-cyan-400", grad: "to-cyan-300" }
];

export default function Cases() {
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null);
  const [cases, setCases] = useState<CaseData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real-time cases
  useEffect(() => {
    // We filter by status='공개' to only show public cases
    const q = query(collection(db, "cases"), where("status", "==", "공개"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data: CaseData[] = [];
      snapshot.forEach(doc => {
        const d = doc.data();
        data.push({
          id: doc.id,
          station: d.station,
          charge: d.charge,
          fact: d.fact,
          defense: d.defense,
          result: d.result,
          image: d.image,
          order: d.order,
          createdAt: d.createdAt,
        });
      });
      // Order by order asc, then createdAt descending
      setCases(data.sort((a,b) => {
        const orderA = a.order || 0;
        const orderB = b.order || 0;
        if (orderA !== orderB) return orderA - orderB;
        return b.createdAt - a.createdAt;
      }));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "cases");
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (selectedCase) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedCase]);

  return (
    <div className="pt-24 pb-32">
      <Helmet>
        <title>성공사례 | 수원지방법원 영장실질심사 전담</title>
        <meta name="description" content="수원 영장실질심사, 구속적부심 성공사례 모음. 보이스피싱, 마약, 성범죄 등 다수의 무죄, 집행유예, 기각 사례를 확인하세요." />
        <link rel="canonical" href="https://suwonwarrantcenter.com/cases" />
      </Helmet>
      {/* Slogan Banner */}
      <div className="bg-[#2D7DFF] py-3 text-center mb-12">
        <p className="text-white font-bold text-sm md:text-base tracking-wide">
          수원지방법원 영장실질심사 1,000건 이상 수행
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">대표 성공사례</h1>
          <p className="text-gray-400 text-[15px] md:text-lg max-w-2xl mx-auto">
            압도적 성공사례를 직접 확인하세요.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center opacity-80 mb-10 md:mb-12">
          <span className="text-[14px] md:text-base text-[#59C7FF] font-medium mb-3 tracking-wide text-center break-keep px-4 leading-relaxed w-full max-w-sm sm:max-w-none">성공사례를 클릭하면 자세한 내용을 확인할 수 있습니다</span>
          <div className="w-7 h-7 rounded-full bg-[#2D7DFF]/20 flex items-center justify-center animate-bounce border border-[#2D7DFF]/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#59C7FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
          </div>
        </div>

        {/* Case List */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">로딩 중...</div>
        ) : cases.length === 0 ? (
           <div className="text-center py-12 text-gray-500 bg-[#0B0F17] rounded-xl border border-white/5">
              등록된 성공사례가 없습니다.
           </div>
        ) : (
          <div className="flex flex-col gap-3">
            {cases.map((item, idx) => {
              const theme = THEMES[idx % THEMES.length];
              return (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedCase(item)}
                  className={`group bg-[#070B13] hover:bg-[#0A0E17] p-3.5 sm:p-5 md:p-6 rounded-xl flex flex-col sm:flex-row sm:items-center border border-white/5 ${theme.border} transition-colors cursor-pointer relative overflow-hidden h-auto w-full`}
                >
                  {item.image ? (
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 md:w-[40%] transition-transform duration-700 group-hover:scale-105 pointer-events-none">
                      <div 
                        className="absolute inset-0 bg-cover bg-center md:bg-[center_top_30%] opacity-30 mix-blend-luminosity"
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                    </div>
                  ) : (
                    <div className="absolute -right-4 top-4 md:-top-4 text-white/[0.05] font-serif text-[60px] md:text-[80px] font-black leading-[0.85] whitespace-nowrap transform -rotate-12 pointer-events-none select-none transition-transform duration-700 group-hover:scale-105 overflow-hidden">
                      구속영장<br/>청구서
                    </div>
                  )}
                  {/* 텍스트 가독성을 위한 오버레이 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#070B13] w-full sm:w-[80%] via-[#070B13]/90 to-transparent pointer-events-none" />
                  
                  {/* 우측 상단 조명 (은은하게) */}
                  <div className={`absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 ${theme.glow} blur-[40px] md:blur-[60px] rounded-full ${theme.glowHover} transition-colors pointer-events-none`} />
                  
                  <div className="relative z-10 flex justify-between items-center w-full gap-3 sm:gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-6 flex-1 min-w-0 py-0.5 sm:py-0">
                      <div className={`text-[10px] sm:text-xs ${theme.labelText} font-medium tracking-widest ${theme.labelBg} px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border ${theme.labelBorder} shadow-[0_0_10px_rgba(45,125,255,0.1)] shrink-0 self-start sm:self-auto`}>{item.station}</div>
                      <div className="text-[15px] sm:text-lg md:text-xl font-bold text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] truncate max-w-full">
                        {item.charge} <span className="text-gray-400 font-light text-sm ml-2 hidden lg:inline-block truncate max-w-[200px] xl:max-w-[300px] align-middle">{item.fact}</span>
                      </div>
                    </div>
                    
                    <div className="inline-flex items-center justify-end shrink-0 gap-3 sm:gap-6">
                      <div className="hidden sm:flex items-center gap-2.5">
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-[0.5rem] bg-gradient-to-br ${theme.iconWrap} to-transparent flex items-center justify-center shrink-0 border shadow-[0_0_15px_rgba(45,125,255,0.2)]`}>
                          <ShieldCheck size={16} strokeWidth={1.5} className={`${theme.icon} md:w-5 md:h-5`} />
                        </div>
                        <div className={`text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white ${theme.grad} tracking-wider group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all truncate`}>
                          {item.result}
                        </div>
                      </div>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#2D7DFF]/20 flex items-center justify-center border border-[#2D7DFF]/40 group-hover:bg-[#2D7DFF]/40 transition-all shrink-0 shadow-[0_0_10px_rgba(45,125,255,0.2)] group-hover:shadow-[0_0_15px_rgba(45,125,255,0.4)] group-hover:scale-110">
                        <ArrowRight size={18} className="text-[#59C7FF] group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 더 많은 성공사례 안내 문구 */}
      <div className="max-w-4xl mx-auto px-4 mt-8 md:mt-12 mb-8 md:mb-16 text-center">
        <div className="bg-[#2D7DFF]/10 border border-[#2D7DFF]/20 rounded-xl p-6 flex flex-col items-center gap-4">
          <p className="text-gray-300 text-[15px] md:text-base break-keep leading-relaxed font-medium max-w-2xl mx-auto">
            게시된 성공사례는 일부에 불과합니다. <strong className="text-white font-bold tracking-tight">나와 유사한 사건의 더 많은 방어 사례와 구체적인 전략</strong>은 상담을 통해 직접 확인하실 수 있습니다.
          </p>
          <Link to="/contact" className="inline-flex items-center justify-center gap-2 bg-[#2D7DFF] hover:bg-[#1A63DC] text-white px-6 py-3.5 rounded-lg font-bold text-[15px] transition-colors mt-2 shadow-[0_4px_15px_rgba(45,125,255,0.25)]">
            상담 신청하고 유사사례 확인하기 <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pb-[90px] sm:p-6 sm:pb-6 bg-black/80 backdrop-blur-sm">
          {/* Backdrop for click outside */}
          <div className="absolute inset-0" onClick={() => setSelectedCase(null)} />
          
          <div className="bg-[#0B0F17] border border-white/10 rounded-2xl w-full max-w-2xl flex flex-col relative z-20 shadow-2xl animate-in fade-in zoom-in-95 duration-200" style={{ maxHeight: "calc(100vh - 120px)" }}>
            <div className="shrink-0 rounded-t-2xl bg-[#0B0F17] border-b border-white/5 px-6 py-4 flex items-center justify-between z-30">
              <span className="text-white font-bold text-lg hidden sm:block">성공사례 상세</span>
              <span className="text-white font-bold text-base sm:hidden">상세내용</span>
              <button 
                onClick={() => setSelectedCase(null)} 
                className="text-gray-400 hover:text-white p-2 hover:bg-white/5 rounded-full transition-colors ml-auto -mr-2"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 md:p-8 overflow-y-auto flex-1 pb-12">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-gray-300">
                  {selectedCase.station}
                </span>
                <span className="px-3 py-1 bg-[#2D7DFF]/15 border border-[#2D7DFF]/20 text-[#59C7FF] font-bold rounded-full text-xs">
                  {selectedCase.result}
                </span>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-black text-white mb-10 leading-tight">
                {selectedCase.charge}
              </h2>
              
              <div className="space-y-8">
                {/* Result Image Placeholder */}
                <div>
                  <h3 className="text-[13px] font-bold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <ChevronRight size={14} className="text-[#2D7DFF]" />
                    실제 증빙자료(가림처리 등)
                  </h3>
                  <div className="w-full bg-[#111827] border border-white/5 rounded-xl flex items-center justify-center relative overflow-hidden group min-h-[192px]">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] pointer-events-none" />
                    {selectedCase.image ? (
                        <img src={selectedCase.image} alt="증빙자료" className="w-full h-auto max-h-[500px] object-contain relative z-10 p-2" />
                    ) : (
                        <div className="text-gray-500 flex flex-col items-center gap-3 py-16">
                          <FileText size={40} className="opacity-40" />
                          <span className="text-sm font-medium tracking-wide">증빙자료 (이미지) 미등록</span>
                        </div>
                    )}
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 md:p-6">
                  <h3 className="text-[13px] font-bold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <ChevronRight size={14} className="text-[#2D7DFF]" />
                    범죄사실 요지
                  </h3>
                  <p className="text-gray-200 leading-[1.7] text-[15px] md:text-base break-keep whitespace-pre-line">
                    {selectedCase.fact}
                  </p>
                </div>
                
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 md:p-6">
                  <h3 className="text-[13px] font-bold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <ChevronRight size={14} className="text-[#2D7DFF]" />
                    사건의 핵심 및 방어논리
                  </h3>
                  <p className="text-gray-200 leading-[1.7] text-[15px] md:text-base break-keep whitespace-pre-line">
                    {selectedCase.defense}
                  </p>
                </div>
                
                <div className="pt-8 border-t border-white/5 flex flex-col items-center justify-center">
                  <div className="text-sm text-gray-400 mb-2">최종 결과</div>
                  <div className="text-2xl md:text-3xl font-black text-[#59C7FF] drop-shadow-[0_0_15px_rgba(45,125,255,0.3)] tracking-wider">
                    {selectedCase.result}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
