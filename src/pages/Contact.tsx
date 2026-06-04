import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { PhoneCall, MapPin, Clock, Send } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function Contact() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#consultation-form') {
      const element = document.getElementById('consultation-form');
      if (element) {
        // Add a slight delay to ensure page rendering is complete before scrolling
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    policeStation: "",
    charge: "",
    situation: ""
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert("상담 신청이 완료되었습니다. 매우 긴급한 상황일 경우 아래 직통 전화로 연락 부탁드립니다.");
    // Submit logic here
  };

  return (
    <div className="pt-24 pb-32">
      <Helmet>
        <title>상담안내 | 24시간 긴급 법률상담</title>
        <meta name="description" content="수원 영장실질심사, 구속적부심 상담. 언제든 전문가와 빠르게 논의하세요. 24시간 연중무휴 변호사 직접 상담." />
        <link rel="canonical" href="https://suwonwarrantcenter.com/contact" />
      </Helmet>
      {/* Slogan Banner */}
      <div className="bg-[#2D7DFF] py-3 text-center mb-12">
        <p className="text-white font-bold text-sm md:text-base tracking-wide">
          수원지방법원 영장실질심사 1,000건 이상 수행
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">상담안내</h1>
          <p className="text-gray-400 text-[15px] md:text-lg max-w-2xl mx-auto break-keep leading-relaxed px-4 md:px-0">
            더이상 지체할 시간이 없습니다.<br className="md:hidden" /> 전문가와 함께 빠르게 대응하세요.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Info Side */}
          <div className="w-full lg:w-1/3">
             <div className="bg-[#0B0F17] p-8 rounded-sm border border-white/5 space-y-8">
               <div>
                 <h3 className="text-[#8BE0FF] font-bold mb-4 flex items-center gap-2 tracking-widest text-sm">
                   <PhoneCall size={16} /> 긴급 상담전화
                 </h3>
                 <a href="tel:031-214-5566" className="text-3xl font-black text-white hover:text-[#2D7DFF] transition-colors block">
                   031-214-5566
                 </a>
                 <p className="text-gray-500 text-sm flex gap-2 mt-2">
                   <Clock size={14} className="mt-0.5" /> 연중무휴 변호사 직접 상담
                 </p>
               </div>

               <div className="border-t border-white/5 pt-8">
                 <h3 className="text-[#8BE0FF] font-bold mb-4 flex items-center gap-2 tracking-widest text-sm">
                   <MapPin size={16} /> 오시는 길
                 </h3>
                 <p className="text-white font-bold mb-2">경기도 수원시 영통구 광교중앙로 248번길 7-3, 503호</p>
                 <p className="text-gray-400 text-sm leading-relaxed mb-4">하동, 우연법전프라자</p>
                 
                 <div className="w-full h-48 bg-white/5 border border-white/10 flex items-center justify-center rounded-sm">
                   <span className="text-gray-500 font-mono text-sm">[ 지도 API 영역 ]</span>
                 </div>
               </div>
             </div>
          </div>

          {/* Form Side */}
          <div className="w-full lg:w-2/3" id="consultation-form">
             <div className="bg-[#0B0F17] p-8 md:p-12 rounded-sm border border-white/5 h-full">
               <h2 className="text-2xl font-bold text-white mb-2">온라인 상담 신청</h2>
               <p className="text-gray-400 mb-8 text-sm">내용을 남겨주시면 확인 후 즉시 연락드리겠습니다.</p>
               
               <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label htmlFor="name" className="text-sm text-gray-300 font-medium">신청자 이름 <span className="text-[#2D7DFF] text-xs font-bold bg-[#2D7DFF]/10 px-1.5 py-0.5 rounded ml-1">(필수)</span></label>
                     <input
                       type="text"
                       id="name"
                       name="name"
                       value={formData.name}
                       onChange={handleChange}
                       className="w-full bg-[#070B13] border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#2D7DFF] focus:ring-1 focus:ring-[#2D7DFF] transition-colors"
                       placeholder="홍길동"
                       required
                     />
                   </div>
                   <div className="space-y-2">
                     <label htmlFor="phone" className="text-sm text-gray-300 font-medium">연락처 <span className="text-[#2D7DFF] text-xs font-bold bg-[#2D7DFF]/10 px-1.5 py-0.5 rounded ml-1">(필수)</span></label>
                     <input
                       type="tel"
                       id="phone"
                       name="phone"
                       value={formData.phone}
                       onChange={handleChange}
                       className="w-full bg-[#070B13] border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#2D7DFF] focus:ring-1 focus:ring-[#2D7DFF] transition-colors"
                       placeholder="010-0000-0000"
                       required
                     />
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label htmlFor="policeStation" className="text-sm text-gray-300 font-medium">현재 관할 경찰서</label>
                     <input
                       type="text"
                       id="policeStation"
                       name="policeStation"
                       value={formData.policeStation}
                       onChange={handleChange}
                       className="w-full bg-[#070B13] border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#2D7DFF] focus:ring-1 focus:ring-[#2D7DFF] transition-colors"
                       placeholder="ex. 수원남부경찰서"
                     />
                   </div>
                   <div className="space-y-2">
                     <label htmlFor="charge" className="text-sm text-gray-300 font-medium">혐의 내용</label>
                     <input
                       type="text"
                       id="charge"
                       name="charge"
                       value={formData.charge}
                       onChange={handleChange}
                       className="w-full bg-[#070B13] border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#2D7DFF] focus:ring-1 focus:ring-[#2D7DFF] transition-colors"
                       placeholder="ex. 사기, 마약, 성범죄 등"
                     />
                   </div>
                 </div>

                 <div className="space-y-2">
                   <label htmlFor="situation" className="text-sm text-gray-300 font-medium">현재 상황 상세</label>
                   <textarea
                     id="situation"
                     name="situation"
                     value={formData.situation}
                     onChange={handleChange}
                     rows={5}
                     className="w-full bg-[#070B13] border border-white/10 rounded-sm px-4 py-3 text-white focus:outline-none focus:border-[#2D7DFF] focus:ring-1 focus:ring-[#2D7DFF] transition-colors resize-none"
                     placeholder="언제 체포되었는지, 영장청구가 된 상태인지 등 현재의 구체적인 상황을 남겨주시면 더욱 빠른 상담이 가능합니다."
                     required
                   ></textarea>
                 </div>

                 <button
                   type="submit"
                   className="w-full bg-[#2D7DFF] hover:bg-[#1A63DC] text-white font-bold py-4 rounded-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(45,125,255,0.2)] hover:shadow-[0_0_30px_rgba(45,125,255,0.4)]"
                 >
                   상담 신청서 전송
                   <Send size={18} />
                 </button>
               </form>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
