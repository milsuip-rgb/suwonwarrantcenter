import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#0B0F17] py-12 border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-bold text-xl tracking-tighter text-white">
                법률사무소 법진
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              수원지방법원 영장실질심사 전문센터<br />
              형사전문변호사가 직접 당신의 일상을 지켜드립니다.
            </p>
          </div>
          <div className="text-left md:text-right text-gray-500 text-sm space-y-2">
            <p>
              대표변호사: 정해원, 윤선영, 곽은정 <br className="md:hidden" />
              <span className="hidden md:inline"> | </span> 
              사업자등록번호: 587-12-02153
            </p>
            <p>상담문의: <a href="tel:031-214-5566" className="text-white font-bold text-base hover:text-[#2D7DFF] transition-colors">031-214-5566</a> <span className="hidden md:inline"> | </span> <br className="md:hidden" /> FAX: 031-213-6655</p>
            <p>주소: 경기도 수원시 영통구 광교중앙로 248번길 7-3, 503호<br className="md:hidden"/> (하동, 우연법전프라자)</p>
            <p className="mt-4 pt-4 border-t border-white/5"><Link to="/admin" className="cursor-default">&copy;</Link> {new Date().getFullYear()} 법률사무소 법진. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
