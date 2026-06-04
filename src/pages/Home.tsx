import { motion, useInView, useMotionValue, useTransform, animate } from "motion/react";
import { ArrowRight, ShieldCheck, Clock, MapPin, Scale, Search, PhoneCall, X, Check, Building2, Zap, Siren, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import ReviewSlider from "../components/ReviewSlider";
import Popup from "../components/Popup";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

interface CaseItem {
  id: string;
  station: string;
  charge: string;
  fact: string;
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

function Countdown() {
  const [timeLeft, setTimeLeft] = useState(48 * 3600); // 48 hours

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center justify-center gap-2 md:gap-3 mb-8 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
      <div className="font-mono text-5xl md:text-7xl font-bold tabular-nums">
        {String(hours).padStart(2, '0')}
      </div>
      <span className="text-4xl md:text-6xl font-black mb-1 md:mb-2 pb-1 bg-clip-text text-transparent bg-gradient-to-b from-red-400 to-red-600">:</span>
      <div className="font-mono text-5xl md:text-7xl font-bold tabular-nums">
        {String(minutes).padStart(2, '0')}
      </div>
      <span className="text-4xl md:text-6xl font-black mb-1 md:mb-2 pb-1 bg-clip-text text-transparent bg-gradient-to-b from-red-400 to-red-600">:</span>
      <div className="font-mono text-5xl md:text-7xl font-bold tabular-nums">
        {String(seconds).padStart(2, '0')}
      </div>
    </div>
  );
}

function Counter() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());

  useEffect(() => {
    if (isInView) {
      animate(count, 1000, {
        duration: 2.5,
        ease: "easeOut",
      });
    }
  }, [isInView, count]);

  return (
    <div ref={ref} className="text-[30vw] md:text-[22vw] lg:text-[280px] font-black leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#d1d5db] to-[#6b7280] tracking-tighter whitespace-nowrap flex items-center justify-center select-none">
      <motion.span>{rounded}</motion.span>
      <span>+</span>
    </div>
  );
}

export default function Home() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "cases"), where("status", "==", "공개"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data: CaseItem[] = [];
      snapshot.forEach(doc => {
        const d = doc.data();
        data.push({
          id: doc.id,
          station: d.station,
          charge: d.charge,
          fact: d.fact,
          result: d.result,
          image: d.image,
          order: d.order,
          createdAt: d.createdAt
        });
      });
      setCases(data.sort((a,b) => {
        const orderA = a.order || 0;
        const orderB = b.order || 0;
        if (orderA !== orderB) return orderA - orderB;
        return b.createdAt - a.createdAt;
      }).slice(0, 4));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "cases");
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <div className="flex flex-col w-full pb-[70px] md:pb-0">
      <Helmet>
        <title>AI가 추천하는 수원 형사전문 법률사무소 법진 | 체포·구속·영장실질심사 24시간 전담</title>
        <meta name="description" content="수원지방법원 형사전문변호사. 마약, 성범죄, 보이스피싱 구속 위기 24시간 철통 방어. 법률사무소 법진이 도와드립니다." />
        <link rel="canonical" href="https://suwonwarrantcenter.com/" />
      </Helmet>
      <Popup />
      {/* SECTION 1: HERO */}
      <section className="relative min-h-[min(100svh-64px,800px)] md:h-[min(100vh-64px,1100px)] flex flex-col justify-center overflow-hidden py-10 md:py-0">
        {/* Modern Circular Gradient Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Main glowing circle from reference */}
          <div className="absolute top-[10%] md:top-20 right-[-30%] md:right-[5%] w-[120vw] max-w-[600px] aspect-square rounded-full bg-gradient-to-br from-[#2D7DFF] via-[#59C7FF]/40 to-[#0B0F17] opacity-50 blur-[40px] md:blur-[80px]" />
          
          <div className="absolute bottom-0 left-0 w-full h-[50%] bg-gradient-to-t from-[#070B13] via-[#070B13]/80 to-transparent pointer-events-none" />
           {/* Subtle Grid overlay for texture */}
           <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50 [mask-image:linear-gradient(to_top,black,transparent)]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full lg:mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 lg:items-center">
            
            {/* Left Column: Text & CTA */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-start gap-3 md:gap-6 mt-4 md:mt-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="font-bold leading-[1.0] tracking-tighter text-white">
                  <span className="block text-[15vw] sm:text-[10vw] md:text-7xl mb-1 sm:mb-2 md:mb-4">수원지방법원</span>
                  <span className="block text-[15vw] sm:text-[10vw] md:text-7xl text-[#2D7DFF] drop-shadow-[0_0_20px_rgba(45,125,255,0.4)] mb-1 sm:mb-2 md:mb-4">영장실질심사</span>
                  <span className="block text-[15vw] sm:text-[10vw] md:text-7xl">전문센터</span>
                </h1>

                <ul className="text-[15px] md:text-xl text-gray-300 max-w-2xl mt-6 md:mt-10 space-y-2 md:space-y-4 font-medium">
                  <li className="flex items-center gap-2 md:gap-3">
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#2D7DFF]/20 flex items-center justify-center shrink-0">
                      <Check size={14} className="text-[#59C7FF] md:w-4 md:h-4" />
                    </div>
                    수원지방법원 영장실질심사 집중 수행
                  </li>
                  <li className="flex items-center gap-2 md:gap-3">
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#2D7DFF]/20 flex items-center justify-center shrink-0">
                      <Check size={14} className="text-[#59C7FF] md:w-4 md:h-4" />
                    </div>
                    긴급대응 형사전문변호사 직접 투입
                  </li>
                  <li className="flex items-center gap-2 md:gap-3">
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#2D7DFF]/20 flex items-center justify-center shrink-0">
                      <Check size={14} className="text-[#59C7FF] md:w-4 md:h-4" />
                    </div>
                    영장기각 압도적 성공사례 입증
                  </li>
                </ul>

                <div className="hidden sm:flex flex-row gap-3 mt-8 md:mt-10">
                  <a href="tel:031-214-5566" className="flex items-center justify-center gap-2 bg-[#2D7DFF] hover:bg-[#1A63DC] text-white px-8 py-4 rounded-sm font-bold text-lg transition-all shadow-[0_0_30px_rgba(45,125,255,0.4)]">
                    <PhoneCall size={20} />
                    즉시 전화상담
                  </a>
                  <Link to="/contact" className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white px-8 py-4 rounded-sm font-bold text-lg transition-all">
                    상담신청하기
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Status Card for PC */}
            <div className="hidden lg:block lg:col-span-5 xl:col-span-4 mt-8 md:mt-0 h-full">
              <motion.div
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 0.8, delay: 0.3 }}
                 className="bg-[#070B13]/60 backdrop-blur-md border border-white/10 p-7 rounded-2xl relative overflow-hidden group hover:border-[#2D7DFF]/40 transition-colors w-full shadow-[0_0_40px_rgba(45,125,255,0.05)] flex flex-col h-full"
              >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#2D7DFF]/10 rounded-full blur-[40px] group-hover:bg-[#2D7DFF]/20 transition-colors"></div>
                  
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-[#2D7DFF]/20 flex items-center justify-center">
                      <MapPin size={16} className="text-[#59C7FF]" />
                    </div>
                    <span className="text-white font-bold tracking-tight text-lg">오시는 길</span>
                  </div>
                  
                  <div className="w-full aspect-video rounded-xl bg-white/5 border border-white/10 mb-6 overflow-hidden relative">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3171.745129676991!2d127.06734327660232!3d37.291702443317075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357b5c1c045b38ed%3A0x6bba8dd776718d7!2z6rK96riw64-EIOyImOybkOyLnCDsmIHthrXqt6wg6rSR6rWQ7KSR7JWZ66GcMjQ467KI6ri4IDctMyA1MDPtmLg!5e0!3m2!1sko!2skr!4v1714442220000!5m2!1sko!2skr"
                      width="100%"
                      height="100%"
                      style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(80%)" }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="법률사무소 법진 위치"
                    ></iframe>
                  </div>

                  <div className="flex items-start gap-3 mb-6 flex-1">
                    <Building2 className="text-gray-400 shrink-0 mt-0.5" size={18} />
                    <div className="text-[14px] text-gray-300 leading-relaxed font-medium">
                      경기도 수원시 영통구 광교중앙로 248번길 7-3,<br />
                      503호 (하동, 우연법전프라자)
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between bg-[#2D7DFF]/10 border border-[#2D7DFF]/20 p-5 rounded-xl">
                    <div>
                      <div className="text-[11px] text-[#59C7FF] font-semibold mb-1 uppercase tracking-wider">법률사무소 법진 직통번호</div>
                      <div className="text-2xl font-bold text-white tracking-tight">031-214-5566</div>
                    </div>
                    <a href="tel:031-214-5566" className="w-12 h-12 rounded-full bg-[#2D7DFF]/20 hover:bg-[#2D7DFF]/30 transition-colors flex items-center justify-center shrink-0">
                      <PhoneCall className="text-[#2D7DFF]" size={22} />
                    </a>
                  </div>
              </motion.div>
            </div>
            
          </div>
        </div>

        <div className="w-full relative overflow-hidden bg-white/[0.02] border-y border-white/5 py-4 flex mt-10 md:mt-16">
          <div className="flex w-max animate-[marquee_20s_linear_infinite] md:animate-[marquee_25s_linear_infinite]">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex shrink-0 items-center gap-6 px-4 pr-6 text-gray-500 font-mono text-sm md:text-base">
                <span>경기남부경찰청</span><span className="w-1.5 h-1.5 rounded-full bg-white/10 shrink-0" />
                <span>수원영통경찰서</span><span className="w-1.5 h-1.5 rounded-full bg-white/10 shrink-0" />
                <span>수원권선경찰서</span><span className="w-1.5 h-1.5 rounded-full bg-white/10 shrink-0" />
                <span>수원장안경찰서</span><span className="w-1.5 h-1.5 rounded-full bg-white/10 shrink-0" />
                <span>수원팔달경찰서</span><span className="w-1.5 h-1.5 rounded-full bg-white/10 shrink-0" />
                <span>용인동부경찰서</span><span className="w-1.5 h-1.5 rounded-full bg-white/10 shrink-0" />
                <span>용인서부경찰서</span><span className="w-1.5 h-1.5 rounded-full bg-white/10 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: WHY SUWON */}
      <section className="pt-24 pb-16 md:pt-40 md:pb-32 relative bg-[#0B0F17] border-t border-white/5 overflow-hidden flex flex-col justify-center">
        {/* 중앙 블루 조명 */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] md:w-[60vw] md:h-[60vw] bg-[#2D7DFF]/10 blur-[100px] md:blur-[120px] pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
          
          <div className="mb-16 md:mb-24 w-full overflow-hidden flex justify-center">
            <Counter />
          </div>
          
          <div className="px-4">
            <h3 className="text-[1.35rem] sm:text-3xl md:text-[34px] text-gray-300 font-light tracking-tight break-keep leading-[1.8] md:leading-[1.8]">
              영장실질심사는<br />
              <strong className="text-white font-semibold">지역 법원의 실무와 재판부 특성을</strong> <br className="hidden md:block" />
              이해하는 것이 중요합니다.<br />
              <br />
              저희는 수원지방법원 영장실질심사만<br />
              <strong className="text-[#59C7FF] font-bold text-[1.7rem] sm:text-4xl md:text-5xl md:ml-2 align-middle drop-shadow-[0_0_15px_rgba(45,125,255,0.4)]">1,000건 이상</strong> 수행했습니다.
            </h3>
          </div>

        </div>
      </section>

      {/* SECTION 4: SUCCESS CASES */}
      <section className="py-16 md:py-24 bg-[#0B0F17] relative flex flex-col justify-center border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-black mb-3 tracking-tight text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">압도적 성공사례</h2>
          <p className="text-sm md:text-xl text-[#59C7FF] font-medium tracking-tight">결과로 실력을 증명합니다</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {loading ? (
             <div className="py-12 text-center text-gray-500">로딩 중...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {cases.map((caseItem, idx) => {
                const theme = THEMES[idx % THEMES.length];
                return (
                  <div key={idx} className={`group bg-[#070B13] p-6 md:p-8 rounded-2xl flex flex-col border border-white/5 ${theme.border} transition-colors relative overflow-hidden h-auto md:min-h-[250px]`}>
                    {caseItem.image ? (
                      <div className="absolute right-0 top-0 bottom-0 w-2/3 md:w-[60%] transition-transform duration-700 group-hover:scale-105 pointer-events-none">
                        <div 
                          className="absolute inset-0 bg-cover bg-center md:bg-[center_top_30%] opacity-40 mix-blend-luminosity"
                          style={{ backgroundImage: `url(${caseItem.image})` }}
                        />
                      </div>
                    ) : (
                      <div className="absolute -right-10 top-10 md:-top-4 md:-right-16 text-white/[0.07] font-serif text-[100px] md:text-[120px] font-black leading-[0.85] whitespace-nowrap transform -rotate-12 pointer-events-none select-none transition-transform duration-700 group-hover:scale-105">
                        구속영장<br/>청구서
                      </div>
                    )}
                    {/* 텍스트 가독성을 위한 딥다크 그라데이션 오버레이 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#070B13] via-[#070B13]/90 to-transparent pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070B13] via-transparent to-transparent pointer-events-none" />
                    
                    {/* 우측 상단 조명 (은은하게) */}
                    <div className={`absolute top-0 right-0 w-48 h-48 md:w-56 md:h-56 ${theme.glow} blur-[50px] md:blur-[70px] rounded-full ${theme.glowHover} transition-colors pointer-events-none`} />
                    
                    <div className="relative z-10 flex flex-col h-full items-start w-full">
                      <div className={`text-xs ${theme.labelText} mb-2 font-medium tracking-widest ${theme.labelBg} px-3 py-1 rounded-full border ${theme.labelBorder} shadow-[0_0_10px_rgba(45,125,255,0.1)]`}>{caseItem.station}</div>
                      <div className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] leading-[1.3] truncate max-w-full">{caseItem.charge}</div>
                      
                      <div className="text-gray-300 text-sm md:text-lg font-light mb-6 md:mb-8 leading-[1.6] break-keep max-w-[85%] line-clamp-2">
                        {caseItem.fact}
                      </div>
                      
                      <div className="mt-auto inline-flex items-center gap-3 w-full">
                        <div className={`w-10 h-10 md:w-14 md:h-14 rounded-[0.75rem] bg-gradient-to-br ${theme.iconWrap} to-transparent flex items-center justify-center shrink-0 border shadow-[0_0_20px_rgba(45,125,255,0.2)]`}>
                          <ShieldCheck size={20} strokeWidth={1.5} className={`${theme.icon} md:w-7 md:h-7`} />
                        </div>
                        <div className={`text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white ${theme.grad} tracking-wider group-hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all truncate`}>
                          {caseItem.result}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-8 md:mt-12 text-center pb-6 md:pb-0">
            <Link to="/cases" className="inline-flex items-center justify-center gap-2 bg-[#070B13] hover:bg-[#1A233A] border border-white/10 hover:border-white/20 text-white px-8 md:px-10 py-3.5 md:py-4 rounded-lg font-medium text-[15px] md:text-lg transition-all group">
              성공사례 더보기 <ArrowRight size={18} className="md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 3: WHAT REALLY MATTERS (EDUCATION) */}
      <section className="py-16 md:py-24 bg-[#070B13] relative overflow-hidden flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-white leading-[1.3] md:leading-tight break-keep tracking-tight">
              영장실질심사는<br />
              <span className="text-gray-400">유·무죄를 따지는 절차가 아닙니다</span>
            </h2>
          </div>

          <div className="flex flex-col items-center max-w-3xl mx-auto space-y-8 md:space-y-12">
            
            {/* 첫 번째 블록 */}
            <div className="w-full bg-[#0B0F17] p-6 md:p-8 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.15)] rounded-2xl relative overflow-hidden group">
              {/* 좌측 상단 붉은 조명 */}
              <div className="absolute top-0 left-0 w-48 h-48 bg-red-500/10 blur-[50px] rounded-br-[100px] pointer-events-none" />
              
              <div className="flex items-center gap-4 mb-6 md:mb-8 relative z-10">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                  <X size={24} strokeWidth={3} className="md:w-6 md:h-6" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">이것이 핵심이 아닙니다</h3>
              </div>
              
              <ul className="space-y-3 relative z-10">
                {[
                  "억울합니다",
                  "범행을 하지 않았습니다",
                  "재판에서 밝히겠습니다",
                  "피해자가 먼저 잘못했습니다"
                ].map((text, idx) => (
                  <li key={idx} className="text-gray-400 text-[16px] md:text-[18px] font-light px-4 md:px-5 py-1.5 border-l-2 border-red-500/40 tracking-tight">
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            {/* 중간 텍스트 */}
            <div className="text-center relative py-4 md:py-8">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px md:w-1 h-24 md:h-32 bg-gradient-to-b from-red-500/20 via-transparent to-[#2D7DFF]/20 -z-10" />
               <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-white leading-[1.3] md:leading-tight break-keep tracking-tight bg-[#070B13] px-6 py-4 rounded-xl">
                 영장실질심사는<br />
                 <span className="text-[#59C7FF] drop-shadow-[0_0_20px_rgba(45,125,255,0.4)]">구속 사유</span>를 해소하는 절차입니다
               </h3>
            </div>

            {/* 두 번째 블록 */}
            <div className="w-full bg-[#0B0F17] p-6 md:p-8 border border-[#2D7DFF]/40 shadow-[0_0_20px_rgba(45,125,255,0.2)] rounded-2xl relative overflow-hidden group">
              {/* 우측 하단 수원 블루 조명 */}
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#2D7DFF]/15 blur-[60px] rounded-tl-[100px] pointer-events-none" />
              
              <div className="flex items-center gap-4 mb-6 md:mb-8 relative z-10">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#2D7DFF]/20 flex items-center justify-center text-[#59C7FF] shrink-0 border border-[#2D7DFF]/30 shadow-[0_0_15px_rgba(45,125,255,0.4)]">
                  <Check size={24} strokeWidth={3} className="md:w-6 md:h-6" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">법원이 확인하는 것</h3>
              </div>
              
              <ul className="space-y-3 relative z-10">
                {[
                  "도주 우려는 없는가",
                  "증거를 인멸할 가능성은 없는가",
                  "피해자에게 영향을 줄 가능성은 없는가",
                  "재범 위험성은 없는가"
                ].map((text, idx) => (
                  <li key={idx} className="flex items-center gap-4 text-gray-200 text-base md:text-xl py-1 tracking-tight">
                    <div className="w-2 h-2 rounded-full bg-[#59C7FF] shadow-[0_0_10px_rgba(89,199,255,0.8)] shrink-0" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: PROCESS */}
      <section className="py-20 md:py-32 bg-[#070B13] relative flex flex-col justify-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-10 md:mb-24">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold mb-3 text-white tracking-tight">
              이렇게 대응합니다
            </h2>
            <p className="text-[#59C7FF] text-sm md:text-lg font-medium">단 1분의 지체도 없는 신속한 프로세스</p>
          </div>

          <div className="relative flex-col md:flex-row justify-between items-start md:items-center gap-12 md:gap-4 before:absolute before:top-1/2 before:left-0 before:w-full before:h-[1px] before:bg-white/10 hidden md:flex">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-[#2D7DFF]/0 via-[#2D7DFF] to-[#2D7DFF]/0 shadow-[0_0_10px_rgba(45,125,255,1)]" />
            
            {[
              { step: "01", title: "경찰서 접견", detail: "즉시 유치장 방문" },
              { step: "02", title: "증거 수집", detail: "유리한 자료 확보" },
              { step: "03", title: "의견서 작성", detail: "기각 논리 구성" },
              { step: "04", title: "심사 출석", detail: "법정 변론 진행" },
              { step: "05", title: "결과 확인", detail: "석방 및 귀가" }
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center group w-40">
                <div className="w-16 h-16 rounded-full bg-[#0B0F17] border-2 border-[#2D7DFF] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(45,125,255,0.3)] group-hover:bg-[#2D7DFF] transition-colors">
                  <span className="font-mono text-xl font-bold text-white">STEP<br/>{item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-white text-center whitespace-nowrap">{item.title}</h3>
                <p className="text-sm text-gray-400 mt-2 text-center">{item.detail}</p>
              </div>
            ))}
          </div>

          {/* Mobile Process View - Compressed spacing */}
          <div className="flex flex-col gap-6 md:hidden border-l-2 border-[#2D7DFF]/50 ml-4 pl-6 relative">
             {[
              { step: "01", title: "경찰서 유치장 접견" },
              { step: "02", title: "신속한 증거 수집" },
              { step: "03", title: "기각 의견서 작성" },
              { step: "04", title: "영장실질심사 출석" },
              { step: "05", title: "심사 결과 확인" }
            ].map((item, idx) => (
              <div key={idx} className="relative bg-white/[0.02] p-4 rounded-sm border border-white/5">
                <div className="absolute -left-[30px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#2D7DFF] shadow-[0_0_10px_rgba(45,125,255,1)]" />
                <div className="text-[#59C7FF] font-mono text-xs mb-0.5 tracking-wider">STEP {item.step}</div>
                <h3 className="text-[17px] font-bold text-white">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: CLIENT REVIEWS */}
      <section className="py-24 md:py-32 bg-[#0B0F17] relative flex flex-col justify-center border-t border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">실제 의뢰인 후기</h2>
          <p className="text-sm md:text-xl text-[#59C7FF] font-medium tracking-tight break-keep">결과로 실력을 증명합니다.</p>
        </div>

        <ReviewSlider />
      </section>

      {/* SECTION 7: FAQ */}
      <FAQSection />

      {/* SECTION 8: FINAL CTA */}
      <section className="py-32 md:py-48 relative bg-gradient-to-b from-[#070B13] to-[#0A1128] overflow-hidden border-t border-white/5 flex flex-col justify-center text-center px-4">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-[#2D7DFF]/20 blur-[120px] md:blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]" />
        </div>

        <div className="max-w-3xl mx-auto w-full relative z-10 text-center flex flex-col items-center">
          <Countdown />
          <h2 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 text-white leading-[1.3] break-keep">
            영장실질심사는<br />
            <span className="text-[#2D7DFF]">시간이 많지 않습니다.</span>
          </h2>
          <p className="text-gray-300 text-[16px] md:text-xl mb-10 md:mb-14 break-keep max-w-xl mx-auto leading-[1.8]">
            더이상 지체할 시간이 없습니다.<br />
            전문가와 함께 빠르게 대응하세요.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <a href="tel:031-214-5566" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#2D7DFF] hover:bg-[#1A63DC] text-white px-10 py-5 rounded-lg font-bold text-lg md:text-xl transition-all shadow-[0_0_20px_rgba(45,125,255,0.3)] hover:-translate-y-1">
              <PhoneCall size={24} />
              즉시 전화상담
            </a>
            <Link to="/contact" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-10 py-5 rounded-lg font-bold text-lg md:text-xl transition-all hover:-translate-y-1">
              빠른 온라인 접수
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

function AlertCircle() {
  return (
    <div className="mb-3 md:mb-6 bg-red-500/10 w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center text-red-500">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
    </div>
  )
}

function FAQSection() {
  const faqs = [
    {
      q: "영장실질심사를 받으면 무조건 구속되나요?",
      a: "아닙니다.\n법원은 도주 우려, 증거인멸 우려 등을 종합적으로 검토하여 구속 여부를 결정합니다."
    },
    {
      q: "체포된 이후 영장실질심사는 언제 진행되나요?",
      a: "일반적으로 체포된 후 48시간 이내에 구속영장 청구 여부가 결정되며, 영장이 청구되면 수 시간에서 1~2일 내 심사가 열리는 경우가 많아 신속한 대응이 중요합니다."
    },
    {
      q: "가족은 무엇을 준비해야 하나요?",
      a: "탄원서, 가족관계 자료, 직업 및 주거 관련 자료 등 구속 필요성이 낮다는 점을 보여줄 자료를 준비하는 것이 중요합니다."
    },
    {
      q: "변호사는 언제 선임해야 하나요?",
      a: "가능하면 영장청구 직후, 또는 영장실질심사 전에 선임하는 것이 좋습니다.\n준비 시간이 매우 짧기 때문입니다."
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-[#070B13] relative overflow-hidden flex flex-col justify-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight text-white leading-[1.3] break-keep">
            자주 묻는 질문
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const [isOpen, setIsOpen] = useState(false);
            return (
              <div 
                key={idx} 
                className={`bg-black cursor-pointer rounded-xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-[#2D7DFF]/50 shadow-[0_0_15px_rgba(45,125,255,0.15)]' : 'border-[#2D7DFF]/20 hover:border-[#2D7DFF]/40'}`}
                onClick={() => setIsOpen(!isOpen)}
              >
                <div className="px-6 py-5 md:px-8 md:py-6 flex items-center justify-between gap-4">
                  <h3 className={`text-lg md:text-xl font-bold tracking-tight transition-colors ${isOpen ? 'text-[#59C7FF]' : 'text-white'}`}>
                    <span className="mr-3 text-[#2D7DFF]">{isOpen ? '－' : '＋'}</span> 
                    <span className="leading-snug block md:inline">{faq.q}</span>
                  </h3>
                </div>
                
                {/* Expandable answer */}
                <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-6 pb-6 md:px-8 md:pb-8 pt-0">
                    <div className="w-full h-px bg-white/10 mb-4" />
                    <p className="text-gray-300 text-sm md:text-lg leading-relaxed whitespace-pre-wrap pl-8">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
