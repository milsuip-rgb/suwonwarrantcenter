import { Link } from "react-router-dom";
import { PhoneCall } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function Process() {
  const steps = [
    {
      step: "01",
      title: "유치장 접견",
      icon: "MapPin",
      desc: "관할 경찰서(수원, 용인, 화성 등) 즉시 방문",
      details: [
        "영장청구 사실 확인 즉시 변호사가 직접 유치장 접견",
        "수사기관의 혐의 요지 파악",
        "피의자의 건강 상태 및 심리적 안정 조치"
      ]
    },
    {
      step: "02",
      title: "증거 확보",
      icon: "Search",
      desc: "영장 기각을 위한 유리한 자료 신속 수집",
      details: [
        "가족 및 지인을 통한 탄원서 수집",
        "피해자와의 합의 가능성 타진 및 즉각적인 합의 시도",
        "주거 일정, 직업 유지 등 도주 우려가 없음을 입증할 객관적 자료 확보"
      ]
    },
    {
      step: "03",
      title: "의견서 작성",
      icon: "FileText",
      desc: "수원지법 재판부 성향에 맞춘 논리 구성",
      details: [
        "구속 사유(도주 우려, 증거 인멸 우려 등) 부존재 적극 소명",
        "수원지방법원 유사 사례 분석을 통한 맞춤형 의견서 작성",
        "방어권 보장의 필요성 강력 주장"
      ]
    },
    {
      step: "04",
      title: "법원 출석",
      icon: "Scale",
      desc: "수원지방법원 영장실질심사 출석 및 변론",
      details: [
        "지정된 심문기일에 피의자와 함께 출석",
        "판사 대면 변론을 통한 영장 청구의 부당성 주장",
        "검찰의 구속 필요성 주장에 대한 즉각적인 반박"
      ]
    },
    {
      step: "05",
      title: "결과 대응",
      icon: "CheckCircle",
      desc: "기각 후 석방 조치 및 향후 대응",
      details: [
        "영장 기각 결과 즉각 확인",
        "신속한 석방 절차 진행 및 가족 인계",
        "불구속 상태에서의 향후 재판 및 수사 대비 방안 안내"
      ]
    }
  ];

  return (
    <div className="pt-24 pb-32">
      <Helmet>
        <title>업무 프로세스 | 수원지방법원 체포·구속영장 실시간 대응</title>
        <meta name="description" content="체포부터 구속영장 실질심사까지. 수원지방법원 형사전문변호사의 체계적이고 신속한 24시간 방어 프로세스를 안내합니다." />
        <link rel="canonical" href="https://suwonwarrantcenter.com/process" />
      </Helmet>
      {/* Slogan Banner */}
      <div className="bg-[#2D7DFF] py-3 text-center mb-12">
        <p className="text-white font-bold text-sm md:text-base tracking-wide">
          수원지방법원 영장실질심사 1,000건 이상 수행
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">대응 프로세스</h1>
          <p className="text-gray-400 text-[15px] md:text-lg max-w-sm md:max-w-none mx-auto break-keep leading-relaxed px-4 md:px-0">
            영장청구부터 심사 결과까지.<br className="md:hidden" /> 1분도 허투루 쓰지 않는 빈틈없는 방어 시스템.
          </p>
        </div>

        <div className="space-y-12">
          {steps.map((item, idx) => (
            <div key={idx} className="flex flex-col md:flex-row gap-8 items-start bg-[#0B0F17] p-8 rounded-sm border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#2D7DFF]/5 blur-[40px] rounded-full group-hover:bg-[#2D7DFF]/10 transition-colors pointer-events-none" />
              
              <div className="w-full md:w-32 flex-shrink-0">
                <div className="text-[#59C7FF] font-mono font-bold text-lg mb-2">STEP {item.step}</div>
                <div className="w-16 h-1 bg-[#2D7DFF] rounded-r-full mb-4"></div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-[#8BE0FF] font-medium mb-6">{item.desc}</p>
                <ul className="space-y-3 text-gray-400">
                  {item.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2">
                       <span className="text-[#2D7DFF] mt-1">•</span>
                       <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
